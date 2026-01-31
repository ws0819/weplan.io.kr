package service

import (
	"context"
	"encoding/json"

	// "errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"log"
	"WEPLAN/internal/auth"
	"WEPLAN/internal/common"
	"WEPLAN/internal/config"
	"WEPLAN/internal/pb"
	"WEPLAN/internal/repository"

	"go.uber.org/zap"
	"google.golang.org/api/idtoken"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type AuthService struct {
	pb.UnimplementedAuthServiceServer
	cfg      *config.Config
	userRepo repository.UserRepository
}

func NewAuthService(
	cfg *config.Config,
	userRepo repository.UserRepository,
) *AuthService {
	return &AuthService{
		cfg:      cfg,
		userRepo: userRepo,
	}
}

func (s *AuthService) GetUser(
	ctx context.Context,
	req *pb.GetUserRequest,
) (*pb.GetUserResponse, error) {
	user, err := s.userRepo.GetByUserID(ctx, req.UserId)
	if err != nil {
		common.L().Error("[AUTH] user lookup failed", zap.Error(err))
		return nil, status.Error(codes.Internal, "user lookup failed")
	}
	return &pb.GetUserResponse{
		Id:      user.ID.String(),
		UserId:  user.UserID,
		Name:    user.Name,
		Email:   user.Email,
		Picture: user.Picture,
	}, nil
}

func (s *AuthService) GoogleLogin(
	ctx context.Context,
	req *pb.GoogleLoginRequest,
) (*pb.LoginResponse, error) {

	common.L().Info("[AUTH] GoogleLogin called",
		zap.Int("id_token_len", len(req.IdToken)),
		zap.Bool("has_google_client_id", s.cfg.GoogleClientID != ""),
	)

	if s.cfg.GoogleClientID == "" {
		common.L().Error("[AUTH] GOOGLE_CLIENT_ID is empty - cannot validate id_token")
		return nil, status.Error(codes.Internal, "server misconfigured: GOOGLE_CLIENT_ID is empty")
	}

	if req.IdToken == "" {
		return nil, status.Error(codes.InvalidArgument, "id_token required")
	}

	// ✅ Google ID Token 검증 (aud = GOOGLE_CLIENT_ID)
	payload, err := idtoken.Validate(ctx, req.IdToken, s.cfg.GoogleClientID)
	// log.Printf("[auth_serivce][GoogleLogin] payload=%s", payload)
	if err != nil {
		// 토큰 원문은 로그에 찍지 않음 (보안)
		common.L().Warn("[AUTH] google id_token validate failed",
			zap.Error(err),
			zap.String("aud_expected", s.cfg.GoogleClientID),
		)
		return nil, status.Error(codes.Unauthenticated, "invalid google token")
	}

	sub, ok := payload.Claims["sub"].(string)
	if !ok || sub == "" {
		common.L().Warn("[AUTH] sub not found in token claims")
		return nil, status.Error(codes.Unauthenticated, "sub not found")
	}

	email, _ := payload.Claims["email"].(string)
	name, _ := payload.Claims["name"].(string)
	picture, _ := payload.Claims["picture"].(string)

	// ✅ users(user_id=sub) 조회 후 없으면 생성
	user, err := s.userRepo.GetByUserID(ctx, sub)
	if err != nil {
		common.L().Error("[AUTH] google user lookup failed", zap.Error(err))
		// return nil, status.Error(codes.Internal, "user lookup failed")
	}

	if user == nil {
		user, err = s.userRepo.Create(ctx, sub, name, email, picture)
		if err != nil {
			common.L().Error("[AUTH] user creation failed", zap.Error(err))
			return nil, status.Error(codes.Internal, "user creation failed")
		}
		common.L().Info("[AUTH] user created", zap.String("google_sub", sub), zap.String("email", email))
	} else {
		common.L().Info("[AUTH] user found", zap.String("google_sub", sub))
	}

	// ✅ 내부 UUID를 JWT subject로 사용
	token, err := auth.GenerateToken(
		user.ID.String(),
		s.cfg.JWTSecret,
		24*time.Hour,
	)
	if err != nil {
		common.L().Error("[AUTH] token generation failed", zap.Error(err))
		return nil, status.Error(codes.Internal, "token generation failed")
	}

	return &pb.LoginResponse{
		Token:  token,
		UserId: user.UserID,
	}, nil
}

/*
카카오
*/

type KakaoTokenResponse struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int    `json:"expires_in"`
	Scope        string `json:"scope"`
}

type KakaoUserResponse struct {
	ID           int64 `json:"id"`
	KakaoAccount struct {
		Email   string `json:"email"`
		Profile struct {
			Nickname        string `json:"nickname"`
			ProfileImageURL string `json:"profile_image_url"`
		} `json:"profile"`
	} `json:"kakao_account"`
}

func (s *AuthService) KakaoLogin(
	ctx context.Context,
	req *pb.KakaoLoginRequest,
) (*pb.LoginResponse, error) {

	common.L().Info("[AUTH] KakaoLogin called",
		zap.Bool("has_code", req.IdToken != ""),
	)

	if req.IdToken == "" {
		return nil, status.Error(codes.InvalidArgument, "authorization code required")
	}

	// 1️⃣ code → access_token 교환
	tokenResp, err := s.exchangeKakaoCode(ctx, req.IdToken)
	if err != nil {
		common.L().Warn("[AUTH] kakao token exchange failed", zap.Error(err))
		return nil, err
	}

	// 2️⃣ access_token으로 사용자 정보 조회
	kakaoUser, err := s.getKakaoUser(ctx, tokenResp.AccessToken)
	if err != nil {
		common.L().Warn("[AUTH] kakao user info failed", zap.Error(err))
		return nil, err
	}
	// 3️⃣ 내부 user_id (provider prefix 권장)
	providerUserID := fmt.Sprintf("%d", kakaoUser.ID)
	email := kakaoUser.KakaoAccount.Email
	name := fmt.Sprintf("%s", kakaoUser.KakaoAccount.Profile.Nickname)
	picture := kakaoUser.KakaoAccount.Profile.ProfileImageURL


	// 4️⃣ 사용자 조회 / 생성
	user, err := s.userRepo.GetByUserID(ctx, providerUserID)
	if err != nil {
		log.Println(providerUserID)
		log.Println(err)
		// common.L().Error("[AUTH] kakao user lookup failed", zap.Error(err))
	}
	if user == nil {
		user, err = s.userRepo.Create(ctx, providerUserID, name, email, picture)
		if err != nil {
			common.L().Error("[AUTH] kakao user create failed", zap.Error(err))
			return nil, status.Error(codes.Internal, "user creation failed")
		}
	}

	// 5️⃣ 내부 JWT 발급
	token, err := auth.GenerateToken(
		user.ID.String(),
		s.cfg.JWTSecret,
		24*time.Hour,
	)
	if err != nil {
		return nil, status.Error(codes.Internal, "token generation failed")
	}

	return &pb.LoginResponse{
		Token:  token,
		UserId: user.UserID,
	}, nil
}

func (s *AuthService) exchangeKakaoCode(
	ctx context.Context,
	code string,
) (*KakaoTokenResponse, error) {

	form := url.Values{}
	form.Set("grant_type", "authorization_code")
	form.Set("client_id", s.cfg.KakaoClientId)
	form.Set("redirect_uri", s.cfg.KakaoRedirectURI)
	form.Set("code", code)

	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodPost,
		"https://kauth.kakao.com/oauth/token",
		strings.NewReader(form.Encode()),
	)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, status.Error(codes.Unavailable, "kakao token api unreachable")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		common.L().Warn("[AUTH] kakao token exchange failed",
			zap.Int("status", resp.StatusCode),
			zap.String("body", string(body)),
		)

		if resp.StatusCode == http.StatusBadRequest {
			return nil, status.Error(codes.Unauthenticated, "invalid authorization code")
		}

		return nil, status.Error(codes.Unauthenticated, "kakao token exchange failed")
	}

	var tokenResp KakaoTokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return nil, status.Error(codes.Internal, "invalid kakao token response")
	}

	if tokenResp.AccessToken == "" {
		return nil, status.Error(codes.Unauthenticated, "kakao access_token missing")
	}

	return &tokenResp, nil
}

func (s *AuthService) getKakaoUser(
	ctx context.Context,
	accessToken string,
) (*KakaoUserResponse, error) {

	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodGet,
		"https://kapi.kakao.com/v2/user/me",
		nil,
	)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+accessToken)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, status.Error(codes.Unavailable, "kakao api unreachable")
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusUnauthorized {
		return nil, status.Error(codes.Unauthenticated, "kakao token expired or invalid")
	}

	if resp.StatusCode == http.StatusForbidden {
		return nil, status.Error(codes.PermissionDenied, "kakao permission denied")
	}

	if resp.StatusCode != http.StatusOK {
		return nil, status.Error(codes.Unavailable, "kakao api error")
	}

	var user KakaoUserResponse
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return nil, status.Error(codes.Internal, "invalid kakao user response")
	}

	return &user, nil
}
