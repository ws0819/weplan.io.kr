package service

import (
	"context"
	"log"
	"strings"
	"time"

	"WEPLAN/internal/auth"
	"WEPLAN/internal/config"
	"WEPLAN/internal/model"
	"WEPLAN/internal/pb"
	"WEPLAN/internal/repository"
	"WEPLAN/internal/ws"

	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

// =====================================
// Service
// =====================================
type MeetingService struct {
	pb.UnimplementedMeetingServiceServer
	repo repository.MeetingRepository
	cfg  *config.Config
	hub  *ws.HubManager
	bus  ws.EventBus
}

func NewMeetingService(
	repo repository.MeetingRepository,
	cfg *config.Config,
	hub *ws.HubManager,
	bus ws.EventBus,
) *MeetingService {
	if bus == nil {
		bus = ws.NoopEventBus{}
	}
	return &MeetingService{
		repo: repo,
		cfg:  cfg,
		hub:  hub,
		bus:  bus,
	}
}

// =====================================
// CreateMeeting
// =====================================
func (s *MeetingService) CreateMeeting(
	ctx context.Context,
	req *pb.CreateMeetingRequest,
) (*pb.CreateMeetingResponse, error) {

	log.Println("CreateMeeting req:", req)

	userID, err := extractUserIDFromGRPCContext(ctx, s.cfg.JWTSecret)
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "invalid token")
	}
	uid, err := uuid.Parse(userID)
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "invalid userId")
	}

	if strings.TrimSpace(req.Title) == "" {
		return nil, status.Error(codes.InvalidArgument, "title is required")
	}
	if strings.TrimSpace(req.StartDate) == "" || strings.TrimSpace(req.EndDate) == "" {
		return nil, status.Error(codes.InvalidArgument, "start_date and end_date are required")
	}

	start, err := parseYYYYMMDD(req.StartDate)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, "invalid start_date")
	}
	end, err := parseYYYYMMDD(req.EndDate)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, "invalid end_date")
	}

	meeting := model.Meeting{
		ID:          uuid.New().String(),
		UserID:      req.UserId,
		Title:       req.Title,
		StartDate:   &start,
		EndDate:     &end,
		Description: req.Description,
		Thumbnail:   req.Thumbnail,
		Images:      "",
	}

	created, err := s.repo.Create(ctx, meeting)
	if err != nil {
		log.Println("CREATE MEETING ERROR:", err)
		return nil, status.Error(codes.Internal, "failed to create meeting")
	}

	// 생성자는 owner
	if err := s.repo.AddMember(ctx, created.ID, uid, "owner"); err != nil {
		return nil, status.Error(codes.Internal, "failed to add owner")
	}

	return &pb.CreateMeetingResponse{
		MeetingId: created.ID,
	}, nil
}

// =====================================
// ListMeetings (카드)
// =====================================
func (s *MeetingService) ListMeetings(
	ctx context.Context,
	req *pb.ListMeetingsRequest,
) (*pb.ListMeetingsResponse, error) {

	meetings, err := s.repo.List(ctx, req.UserId)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to list meetings")
	}

	res := make([]*pb.MeetingCard, 0, len(meetings))
	for _, m := range meetings {
		card := &pb.MeetingCard{
			MeetingId: m.ID,
			Title:     m.Title,
			Thumbnail: m.Thumbnail,
		}
		if m.StartDate != nil {
			card.StartDate = m.StartDate.Format("2006-01-02")
		}
		if m.EndDate != nil {
			card.EndDate = m.EndDate.Format("2006-01-02")
		}
		res = append(res, card)
	}

	return &pb.ListMeetingsResponse{Meetings: res}, nil
}

// =====================================
// GetMeeting (상세)
// =====================================
func (s *MeetingService) GetMeeting(
	ctx context.Context,
	req *pb.GetMeetingRequest,
) (*pb.GetMeetingResponse, error) {

	m, err := s.repo.GetByID(ctx, req.MeetingId)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to get meeting")
	}
	if m == nil {
		return nil, status.Error(codes.NotFound, "meeting not found")
	}

	var startStr, endStr string
	if m.StartDate != nil {
		startStr = m.StartDate.Format("2006-01-02")
	}
	if m.EndDate != nil {
		endStr = m.EndDate.Format("2006-01-02")
	}

	return &pb.GetMeetingResponse{
		MeetingId:   m.ID,
		Title:       m.Title,
		StartDate:   startStr,
		EndDate:     endStr,
		Description: m.Description,
		Thumbnail:   m.Thumbnail,
		Images:      m.Images,
		TotalAmount: m.TotalAmount,
	}, nil
}

// =====================================
// GetMeeting (상세)
// =====================================
func (s *MeetingService) GetMeetingMember(
	ctx context.Context,
	req *pb.GetMeetingMemberRequest,
) (*pb.GetMeetingMemberResponse, error) {

	var mm []model.MeetingMember
	var err error

	mm, err = s.repo.GetMeeting(ctx, req.MeetingId)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to get meeting_member")
	}
	if mm == nil {
		return nil, status.Error(codes.NotFound, "meeting_member not found")
	}

	res := make([]*pb.MeetingMember, 0, len(mm))
	for _, l := range mm {
		res = append(res, &pb.MeetingMember{
			MeetingId: l.MeetingId,
			UserId:    l.UserId,
			Role:      l.Role,
			Images:    l.Images,
		})
	}

	return &pb.GetMeetingMemberResponse{Meetingmembers: res}, nil
}

// =====================================
// CreateInvite (owner only)
// =====================================
func (s *MeetingService) CreateInvite(
	ctx context.Context,
	req *pb.CreateInviteRequest,
) (*pb.CreateInviteResponse, error) {

	userID, err := extractUserIDFromGRPCContext(ctx, s.cfg.JWTSecret)
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "invalid token")
	}
	uid, err := uuid.Parse(userID)
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "invalid userId")
	}

	role, err := s.repo.GetMemberRole(ctx, req.MeetingId, uid)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to check role")
	}
	if role != "owner" {
		return nil, status.Error(codes.PermissionDenied, "only owner can create invite")
	}

	token, err := auth.GenerateInviteToken(
		req.MeetingId,
		s.cfg.JWTSecret,
		7*24*time.Hour,
	)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to create invite")
	}

	return &pb.CreateInviteResponse{
		InviteUrl: token,
	}, nil
}

// =====================================
// JoinByInvite
// =====================================
func (s *MeetingService) JoinByInvite(
	ctx context.Context,
	req *pb.JoinByInviteRequest,
) (*pb.JoinByInviteResponse, error) {

	userID, err := extractUserIDFromGRPCContext(ctx, s.cfg.JWTSecret)
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "invalid token")
	}
	uid, err := uuid.Parse(userID)
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "invalid userId")
	}

	inv, err := auth.ParseInviteToken(req.Token, s.cfg.JWTSecret)
	if err != nil || inv.MeetingID == "" {
		return nil, status.Error(codes.Unauthenticated, "invalid invite token")
	}

	// owner라도 invite로 들어오면 member로 upsert (기존 정책 유지)
	if err := s.repo.AddMember(ctx, inv.MeetingID, uid, "member"); err != nil {
		return nil, status.Error(codes.Internal, "failed to join meeting")
	}

	ev := ws.Event{
		Type:      ws.EventMemberJoined,
		MeetingID: inv.MeetingID,
		Payload: ws.MustRaw(map[string]string{
			"userId": uid.String(),
		}),
	}
	if s.hub != nil {
		_ = s.hub.BroadcastEvent(ev)
	}
	_ = s.bus.Publish(ctx, ev)

	return &pb.JoinByInviteResponse{
		MeetingId: inv.MeetingID,
	}, nil
}

// =====================================
// UDMeeting (Update / Delete)
// =====================================
func (s *MeetingService) UDMeeting(
	ctx context.Context,
	req *pb.UDMeetingRequest,
) (*pb.UDMeetingResponse, error) {

	meetingID := strings.TrimSpace(req.Id)
	op := strings.ToLower(strings.TrimSpace(req.Op))

	if meetingID == "" {
		return nil, status.Error(codes.InvalidArgument, "id is required")
	}
	if op != "u" && op != "d" {
		return nil, status.Error(codes.InvalidArgument, "op must be 'u' or 'd'")
	}

	// ---------- DELETE ----------
	if op == "d" {
		ok, err := s.repo.DeleteByID(ctx, meetingID)
		if err != nil {
			return nil, status.Error(codes.Internal, "failed to delete meeting")
		}
		if !ok {
			return nil, status.Error(codes.NotFound, "meeting not found")
		}

		if s.hub != nil {
			_ = s.hub.BroadcastEvent(ws.Event{
				Type:      ws.EventMeetingDeleted,
				MeetingID: meetingID,
				Payload:   ws.MustRaw(map[string]string{"id": meetingID}),
			})
		}

		return &pb.UDMeetingResponse{
			Id: meetingID,
			Op: "d",
		}, nil
	}

	// ---------- UPDATE ----------
	if req.Fields == nil {
		return nil, status.Error(codes.InvalidArgument, "fields is required when op is 'u'")
	}

	patch := repository.MeetingPatch{}

	if v := strings.TrimSpace(req.Fields.Title); v != "" {
		patch.Title = &v
	}
	if v := strings.TrimSpace(req.Fields.Description); v != "" {
		patch.Description = &v
	}
	if v := strings.TrimSpace(req.Fields.Thumbnail); v != "" {
		patch.Thumbnail = &v
	}
	if v := strings.TrimSpace(req.Fields.Images); v != "" {
		patch.Images = &v
	}
	if v := strings.TrimSpace(req.Fields.StartDate); v != "" {
		t, err := parseYYYYMMDD(v)
		if err != nil {
			return nil, status.Error(codes.InvalidArgument, "invalid start_date")
		}
		patch.StartDate = &t
	}
	if v := strings.TrimSpace(req.Fields.EndDate); v != "" {
		t, err := parseYYYYMMDD(v)
		if err != nil {
			return nil, status.Error(codes.InvalidArgument, "invalid end_date")
		}
		patch.EndDate = &t
	}

	updated, err := s.repo.UpdatePartial(ctx, meetingID, patch)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to update meeting")
	}
	if updated == nil {
		return nil, status.Error(codes.NotFound, "meeting not found")
	}

	var startStr, endStr string
	if updated.StartDate != nil {
		startStr = updated.StartDate.Format("2006-01-02")
	}
	if updated.EndDate != nil {
		endStr = updated.EndDate.Format("2006-01-02")
	}

	respMeeting := &pb.GetMeetingResponse{
		MeetingId:   updated.ID,
		Title:       updated.Title,
		StartDate:   startStr,
		EndDate:     endStr,
		Description: updated.Description,
		Thumbnail:   updated.Thumbnail,
		Images:      updated.Images,
	}

	if s.hub != nil {
		_ = s.hub.BroadcastEvent(ws.Event{
			Type:      ws.EventMeetingUpdated,
			MeetingID: meetingID,
			Payload:   ws.MustRaw(respMeeting),
		})
	}

	return &pb.UDMeetingResponse{
		Id:      meetingID,
		Op:      "u",
		Meeting: respMeeting,
	}, nil
}

func (s *MeetingService) SetTotalAmount(
	ctx context.Context,
	req *pb.SetTotalAmountRequest,
) (*pb.SetTotalAmountResponse, error) {

	log.Println("SetTotalAmount req:", req)
	m, err := s.repo.TotalAmount(ctx, req.MeetingId, req.TotalAmount)

	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "SetTotalAmount error")
	}

	return &pb.SetTotalAmountResponse{
		MeetingId:   m.MeetingId,
		TotalAmount: m.TotalAmount,
		MemberCount: m.MemberCount,
		PerPerson:   m.PerPerson,
	}, nil
}

// =====================================
// helpers
// =====================================
func parseYYYYMMDD(s string) (time.Time, error) {
	return time.ParseInLocation("2006-01-02", strings.TrimSpace(s), time.Local)
}

func extractUserIDFromGRPCContext(ctx context.Context, jwtSecret string) (string, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return "", status.Error(codes.Unauthenticated, "missing metadata")
	}

	vals := md.Get("authorization")
	if len(vals) == 0 {
		vals = md.Get("Authorization")
	}
	if len(vals) == 0 {
		return "", status.Error(codes.Unauthenticated, "missing authorization")
	}

	token := strings.TrimSpace(vals[0])
	if strings.HasPrefix(strings.ToLower(token), "bearer ") {
		token = strings.TrimSpace(token[7:])
	}

	claims, err := auth.ParseToken(token, jwtSecret)
	if err != nil || claims.UserID == "" {
		return "", status.Error(codes.Unauthenticated, "invalid token")
	}
	return claims.UserID, nil
}
