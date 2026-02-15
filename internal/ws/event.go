package ws

import "encoding/json"

type EventType string

// 클라이언트 → 서버
const (
	EventLinkCreate      EventType = "LINK_CREATE"
	EventBudgetUpdate    EventType = "BUDGET_UPDATE"
	EventMapPinUpdate    EventType = "MAP_PIN_UPDATE"
	EventDashboardUpdate EventType = "DASHBOARD_UPDATE"
	EventPresenceRequest EventType = "PRESENCE_REQUEST"
)

// 서버 → 클라이언트
const (
	EventLinkAdded        EventType = "LINK_ADDED"
	EventMemberJoined     EventType = "MEMBER_JOINED"
	EventBudgetAdded      EventType = "BUDGET_ADDED"
	EventBudgetUpdated    EventType = "BUDGET_UPDATED"
	EventMapPinUpdated    EventType = "MAP_PIN_UPDATED"
	EventDashboardUpdated EventType = "DASHBOARD_UPDATED"
	EventPresenceUpdate   EventType = "PRESENCE_UPDATE"

	// ✅ 3번(UD 연계) 추가
	EventMeetingUpdated EventType = "MEETING_UPDATED"
	EventMeetingDeleted EventType = "MEETING_DELETED"

	EventLinkUpdated EventType = "LINK_UPDATED"
	EventLinkDeleted EventType = "LINK_DELETED"

	EventBudgetDeleted EventType = "BUDGET_DELETED"

	EventBasePointUpdated EventType = "BASE_POINT_UPDATED"
)

type Event struct {
	Type      EventType       `json:"type"`
	MeetingID string          `json:"meetingId"`
	SenderID  string          `json:"senderId,omitempty"`
	Payload   json.RawMessage `json:"payload,omitempty"`
}

func MustRaw(v interface{}) json.RawMessage {
	b, _ := json.Marshal(v)
	return b
}
