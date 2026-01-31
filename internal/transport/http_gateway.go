package transport

import (
	"context"
	"log"
	"net/http"

	"WEPLAN/internal/common"
	"WEPLAN/internal/config"
	"WEPLAN/internal/pb"
	"WEPLAN/internal/repository"
	"WEPLAN/internal/ws"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/status"
)

func StartHTTPServer(hub *ws.HubManager, cfg *config.Config, meetingRepo repository.MeetingRepository) {
	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	// gRPC-Gateway가 Authorization 헤더를 gRPC metadata로 전달하도록 허용
	mux := runtime.NewServeMux(
		runtime.WithIncomingHeaderMatcher(func(key string) (string, bool) {
			k := http.CanonicalHeaderKey(key)
			switch k {
			case "Authorization", "Cookie":
				return k, true
			default:
				return runtime.DefaultHeaderMatcher(key)
			}
		}),
	)

	opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}
	grpcAddr := "localhost" + cfg.GRPCPort

	if err := pb.RegisterLinkServiceHandlerFromEndpoint(ctx, mux, grpcAddr, opts); err != nil {
		log.Fatalf("cannot register LinkService handler: %v", err)
	}
	if err := pb.RegisterMeetingServiceHandlerFromEndpoint(ctx, mux, grpcAddr, opts); err != nil {
		log.Fatalf("cannot register MeetingService handler: %v", err)
	}
	if err := pb.RegisterBudgetServiceHandlerFromEndpoint(ctx, mux, grpcAddr, opts); err != nil {
		log.Fatalf("cannot register BudgetService handler: %v", err)
	}
	if err := pb.RegisterAuthServiceHandlerFromEndpoint(ctx, mux, grpcAddr, opts); err != nil {
		log.Fatal(err)
	}
	if err := pb.RegisterDashboardServiceHandlerFromEndpoint(ctx, mux, grpcAddr, opts); err != nil {
		log.Fatalf("failed to register dashboard gateway: %v", err)
	}

	if err := pb.RegisterBasePointServiceHandlerFromEndpoint(ctx, mux, grpcAddr, opts); err != nil {
		log.Fatalf("failed to register basepointbservice gateway: %v", err)
	}

	e := echo.New()
	e.HideBanner = true
	e.HTTPErrorHandler = JSONErrorHandler

	e.Use(middleware.Recover())
	e.Use(middleware.Logger())

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{
			"https://weplan.io.kr",
			"http://localhost:3000",
			"http://localhost:5173",
		},
		AllowMethods: []string{
			http.MethodGet,
			http.MethodPost,
			http.MethodPut,
			http.MethodDelete,
			http.MethodOptions,
		},
		AllowHeaders: []string{
			echo.HeaderOrigin,
			echo.HeaderContentType,
			echo.HeaderAccept,
			echo.HeaderAuthorization,
		},
		AllowCredentials: true,
	}))

	// 1) 공개 라우트 (JWT 없이 접근 가능)
	e.Any("/api/v1/auth/*", echo.WrapHandler(mux))
	// JoinByInvite 는 member 등록이 필요하므로 JWT 필요 (보호 라우트로 처리)

	// 2) 보호 라우트
	authGroup := e.Group("")
	authGroup.Use(JWTMiddleware(cfg))
	authGroup.Any("/api/*", echo.WrapHandler(mux)) // /api/v1/... 보호됨

	// WebSocket
	wsHandler := NewWebSocketHandler(hub, cfg, meetingRepo)
	e.GET("/ws/meetings/:meetingID", wsHandler.HandleMeetingWS)

	// Health
	e.GET("/health", func(c echo.Context) error {
		return c.String(http.StatusOK, "OK")
	})

	log.Println("[HTTP] listening on", cfg.HTTPPort)
	e.Start(cfg.HTTPPort)
}

func grpcPanicRecovery(
	ctx context.Context,
	req interface{},
	info *grpc.UnaryServerInfo,
	handler grpc.UnaryHandler,
) (resp interface{}, err error) {

	defer func() {
		if r := recover(); r != nil {
			common.L().Error("gRPC panic recovered",
				zap.String("method", info.FullMethod),
				zap.Any("recover", r),
				zap.Stack("stack"),
			)
			err = status.Errorf(codes.Internal, "panic: %v", r)
		}
	}()

	return handler(ctx, req)
}
