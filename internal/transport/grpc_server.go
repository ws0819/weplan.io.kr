package transport

import (
	"log"
	"net"

	"WEPLAN/internal/config"
	"WEPLAN/internal/pb"
	"WEPLAN/internal/repository"
	"WEPLAN/internal/service"
	"WEPLAN/internal/ws"

	"google.golang.org/grpc"
)

func StartGRPCServer(
	hub *ws.HubManager,
	cfg *config.Config,
	meetingRepo repository.MeetingRepository,
	linkRepo repository.LinkRepository,
	budgetRepo repository.BudgetRepository,
	userRepo repository.UserRepository,
	basepointRepo repository.BasePointRepository,
	bus ws.EventBus,
) {
	grpcServer := grpc.NewServer()

	// 서비스 생성
	meetingSvc := service.NewMeetingService(meetingRepo, cfg, hub, bus)

	// ✅ cfg 주입하도록 수정
	linkSvc := service.NewLinkService(linkRepo, basepointRepo, cfg, hub, bus)

	budgetSvc := service.NewBudgetService(budgetRepo, hub, bus)
	authSvc := service.NewAuthService(cfg, userRepo)
	dashboardSvc := service.NewDashboardService(meetingRepo, linkRepo, budgetRepo)
	basepointSvc := service.NewBasePointService(basepointRepo, linkRepo, hub)

	// gRPC 서비스 등록
	pb.RegisterMeetingServiceServer(grpcServer, meetingSvc)
	pb.RegisterLinkServiceServer(grpcServer, linkSvc)
	pb.RegisterBudgetServiceServer(grpcServer, budgetSvc)
	pb.RegisterAuthServiceServer(grpcServer, authSvc)
	pb.RegisterDashboardServiceServer(grpcServer, dashboardSvc)
	pb.RegisterBasePointServiceServer(grpcServer, basepointSvc)

	lis, err := net.Listen("tcp", cfg.GRPCPort)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	log.Println("[gRPC] listening on", cfg.GRPCPort)
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("gRPC server error: %v", err)
	}
}
