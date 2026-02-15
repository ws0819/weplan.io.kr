package ws

import (
	"context"
	"encoding/json"
	"log"

	"WEPLAN/internal/pb"
)

// WebSocketHandler 가 반드시 구현해야 하는 인터페이스
type GRPCGateway interface {
	LinkSvc() pb.LinkServiceClient
	BudgetSvc() pb.BudgetServiceClient
	DashboardSvc() pb.DashboardServiceClient
}

func RegisterEventHandlers(d *EventDispatcher, gw GRPCGateway) {

	// =========================
	// LINK_CREATE
	// =========================
	d.Register(EventLinkCreate, func(ctx *EventContext) error {

		var payload struct {
			URL    string `json:"url"`
			Title  string `json:"title"`
			Memo   string `json:"memo"`
			Rating int32  `json:"rating"`
		}

		if err := json.Unmarshal(ctx.Event.Payload, &payload); err != nil {
			log.Println("LINK_CREATE payload 오류:", err)
			return nil
		}

		resp, err := gw.LinkSvc().CreateLink(
			context.Background(),
			&pb.CreateLinkRequest{
				MeetingId: ctx.Event.MeetingID,
				Url:       payload.URL,
				Title:     payload.Title,
				Memo:      payload.Memo,
				Rating:    payload.Rating,
			},
		)
		if err != nil {
			log.Println("CreateLink 오류:", err)
			return nil
		}

		log.Println("링크 생성됨:", resp.LinkId)
		return nil
	})

	// =========================
	// PRESENCE_REQUEST
	// =========================
	d.Register(EventPresenceRequest, func(ctx *EventContext) error {

		members := ctx.HubManager.GetPresence(ctx.Event.MeetingID)

		payload := PresencePayload{
			Members: members,
			Count:   len(members),
		}

		ev := Event{
			Type:      EventPresenceUpdate,
			MeetingID: ctx.Event.MeetingID,
			Payload:   MustRaw(payload),
		}

		_ = ctx.HubManager.BroadcastEvent(ev)
		return nil
	})

	// =========================
	// DASHBOARD_UPDATE
	// =========================
	//
	// 클라이언트 → 서버:
	// {
	//   "type": "DASHBOARD_UPDATE",
	//   "meetingId": "MEETING123",
	//   "payload": {
	//     "memberCount": 4
	//   }
	// }
	//
	// 서버:
	//  1) DashboardService.GetDashboard 호출
	//  2) 결과를 DASHBOARD_UPDATED 이벤트로 같은 room 에 브로드캐스트
	d.Register(EventDashboardUpdate, func(ctx *EventContext) error {

		var payload struct {
			MemberCount int32 `json:"memberCount"`
		}

		if err := json.Unmarshal(ctx.Event.Payload, &payload); err != nil {
			log.Println("DASHBOARD_UPDATE payload 오류:", err)
			return nil
		}

		resp, err := gw.DashboardSvc().GetDashboard(
			context.Background(),
			&pb.GetDashboardRequest{
				MeetingId:   ctx.Event.MeetingID,
				MemberCount: payload.MemberCount,
			},
		)
		if err != nil {
			log.Println("대시보드 조회 오류:", err)
			return nil
		}

		ev := Event{
			Type:      EventDashboardUpdated,
			MeetingID: ctx.Event.MeetingID,
			Payload:   MustRaw(resp),
		}

		if ctx.HubManager != nil {
			if err := ctx.HubManager.BroadcastEvent(ev); err != nil {
				log.Println("DASHBOARD_UPDATED 브로드캐스트 오류:", err)
			}
		}

		return nil
	})
}
