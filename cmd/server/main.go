package main

import (
	"log"

	"WEPLAN/internal/config"
	"WEPLAN/internal/db"
	"WEPLAN/internal/repository"
	"WEPLAN/internal/transport"
	"WEPLAN/internal/ws"

	"github.com/joho/godotenv"
)

func main() {
	// .env 로드
	if err := godotenv.Load(); err != nil {
		log.Println("[WARN] .env 파일이 없습니다. 시스템 환경변수로 실행 중.")
	}

	cfg := config.Load()
	log.Printf(
		"[BOOT] env=%s http=%s grpc=%s\n",
		cfg.AppEnv,
		cfg.HTTPPort,
		cfg.GRPCPort,
	)

	// ===== WS HubManager =====
	hub := ws.NewHubManager()

	// ===== DB =====
	pg, err := db.NewPostgres()
	if err != nil {
		log.Fatalf("[BOOT] postgres 연결 실패: %v", err)
	}
	defer pg.Close()

	// ===== Repositories =====
	meetingRepo := repository.NewPostgresMeetingRepo(pg)
	linkRepo := repository.NewPostgresLinkRepo(pg)
	budgetRepo := repository.NewPostgresBudgetRepo(pg)
	userRepo := repository.NewPostgresUserRepo(pg)
	basepointRepo := repository.NewPostgresBasePointRepo(pg)

	// ===== EventBus =====
	bus := ws.NoopEventBus{}

	// ===== gRPC Server =====
	go transport.StartGRPCServer(
		hub,
		cfg,
		meetingRepo,
		linkRepo,
		budgetRepo,
		userRepo,
		basepointRepo,
		bus,
	)

	// ===== HTTP + WebSocket Server =====
	transport.StartHTTPServer(hub, cfg, meetingRepo)
}
