package transport

import (
	"context"
	"log"
	"net/http"
	"strings"
	"sync"

	"WEPLAN/internal/auth"
	"WEPLAN/internal/config"
	"WEPLAN/internal/pb"
	"WEPLAN/internal/repository"
	"WEPLAN/internal/ws"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type WebSocketHandler struct {
	HubManager  *ws.HubManager
	Cfg         *config.Config
	Dispatcher  *ws.EventDispatcher
	MeetingRepo repository.MeetingRepository

	grpcDialer func(context.Context, string) (grpc.ClientConnInterface, error)

	linkOnce      sync.Once
	budgetOnce    sync.Once
	dashboardOnce sync.Once

	linkCli      pb.LinkServiceClient
	budgetCli    pb.BudgetServiceClient
	dashboardCli pb.DashboardServiceClient
}

func NewWebSocketHandler(hub *ws.HubManager, cfg *config.Config, meetingRepo repository.MeetingRepository) *WebSocketHandler {
	h := &WebSocketHandler{
		HubManager:  hub,
		Cfg:         cfg,
		Dispatcher:  ws.NewEventDispatcher(),
		MeetingRepo: meetingRepo,
	}

	// 기본 Dialer
	h.grpcDialer = func(ctx context.Context, addr string) (grpc.ClientConnInterface, error) {
		return grpc.DialContext(ctx, addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	}

	// 이벤트 등록
	ws.RegisterEventHandlers(h.Dispatcher, h)

	return h
}

// 테스트용 Dialer override
func (h *WebSocketHandler) OverrideGRPCDialer(
	dialer func(context.Context, string) (grpc.ClientConnInterface, error),
) {
	h.grpcDialer = dialer
}

func (h *WebSocketHandler) LinkSvc() pb.LinkServiceClient {
	h.linkOnce.Do(func() {
		connI, err := h.grpcDialer(context.Background(), h.Cfg.GRPCPort)
		if err != nil {
			log.Fatalf("[WS] LinkSvc Dial 실패: %v", err)
		}
		conn := connI.(*grpc.ClientConn)
		h.linkCli = pb.NewLinkServiceClient(conn)
	})
	return h.linkCli
}

func (h *WebSocketHandler) BudgetSvc() pb.BudgetServiceClient {
	h.budgetOnce.Do(func() {
		connI, err := h.grpcDialer(context.Background(), h.Cfg.GRPCPort)
		if err != nil {
			log.Fatalf("[WS] BudgetSvc Dial 실패: %v", err)
		}
		conn := connI.(*grpc.ClientConn)
		h.budgetCli = pb.NewBudgetServiceClient(conn)
	})
	return h.budgetCli
}

func (h *WebSocketHandler) DashboardSvc() pb.DashboardServiceClient {
	h.dashboardOnce.Do(func() {
		connI, err := h.grpcDialer(context.Background(), h.Cfg.GRPCPort)
		if err != nil {
			log.Fatalf("[WS] DashboardSvc Dial 실패: %v", err)
		}
		conn := connI.(*grpc.ClientConn)
		h.dashboardCli = pb.NewDashboardServiceClient(conn)
	})
	return h.dashboardCli
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func (h *WebSocketHandler) HandleMeetingWS(c echo.Context) error {
	meetingID := c.Param("meetingID")

	token := c.QueryParam("token")
	if token == "" {
		authHeader := c.Request().Header.Get("Authorization")
		if strings.HasPrefix(authHeader, "Bearer ") {
			token = strings.TrimSpace(authHeader[7:])
		}
	}

	if token == "" {
		return c.NoContent(http.StatusUnauthorized)
	}

	claims, err := auth.ParseToken(token, h.Cfg.JWTSecret)
	if err != nil {
		return c.NoContent(http.StatusUnauthorized)
	}

	// meeting_members 기반 권한 확인: 모임 멤버만 WebSocket 연결 가능
	uid, err := uuid.Parse(claims.UserID)
	if err != nil {
		return c.NoContent(http.StatusUnauthorized)
	}
	if h.MeetingRepo != nil {
		role, err := h.MeetingRepo.GetMemberRole(c.Request().Context(), meetingID, uid)
		if err != nil {
			return c.NoContent(http.StatusInternalServerError)
		}
		if role == "" {
			return c.NoContent(http.StatusForbidden)
		}
	}

	conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}

	client := &ws.Client{
		Conn:       conn,
		Send:       make(chan []byte, 256),
		MeetingID:  meetingID,
		UserID:     claims.UserID,
		Manager:    h.HubManager,
		Dispatcher: h.Dispatcher,
	}

	h.HubManager.RegisterClient(meetingID, client)

	go client.WritePump()
	go client.ReadPump()

	return nil
}
