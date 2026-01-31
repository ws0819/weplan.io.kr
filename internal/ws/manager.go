package ws

import (
	"encoding/json"
	"sync"

	"WEPLAN/internal/common"

	"go.uber.org/zap"
)

type HubManager struct {
	mu   sync.RWMutex
	hubs map[string]*Hub
}

func NewHubManager() *HubManager {
	return &HubManager{
		hubs: make(map[string]*Hub),
	}
}

// 모임 ID 기준 Hub 생성/획득
func (m *HubManager) getOrCreate(meetingID string) *Hub {
	m.mu.Lock()
	defer m.mu.Unlock()

	if h, ok := m.hubs[meetingID]; ok {
		return h
	}

	h := NewHub()
	h.Manager = m // ⭐⭐⭐ 핵심 수정: Hub에 HubManager 주입
	m.hubs[meetingID] = h

	go h.Run()
	return h
}

// 클라이언트 등록
func (m *HubManager) RegisterClient(meetingID string, c *Client) {
	h := m.getOrCreate(meetingID)
	c.Hub = h
	h.register <- c

	common.L().Info("WS client joined",
		zap.String("meetingId", meetingID),
	)
}

// 클라이언트 해제
func (m *HubManager) UnregisterClient(meetingID string, c *Client) {
	m.mu.RLock()
	h, ok := m.hubs[meetingID]
	m.mu.RUnlock()
	if !ok {
		return
	}

	h.unregister <- c

	common.L().Info("WS client left",
		zap.String("meetingId", meetingID),
	)
}

// 이벤트 브로드캐스트
func (m *HubManager) BroadcastEvent(ev Event) error {
	b, err := json.Marshal(ev)
	if err != nil {
		common.L().Error("WS event marshal failed",
			zap.String("meetingId", ev.MeetingID),
			zap.String("type", string(ev.Type)),
			zap.Error(err),
		)
		return err
	}

	m.mu.RLock()
	h, ok := m.hubs[ev.MeetingID]
	m.mu.RUnlock()

	if !ok {
		common.L().Warn("WS hub not found",
			zap.String("meetingId", ev.MeetingID),
			zap.String("type", string(ev.Type)),
		)
		return nil
	}

	select {
	case h.broadcast <- b:
		return nil
	default:
		common.L().Error("WS broadcast channel full",
			zap.String("meetingId", ev.MeetingID),
			zap.String("type", string(ev.Type)),
		)
		return nil
	}
}

func (m *HubManager) GetPresence(meetingID string) []PresenceMember {
	m.mu.RLock()
	defer m.mu.RUnlock()

	h, ok := m.hubs[meetingID]
	if !ok {
		return []PresenceMember{}
	}

	members := make([]PresenceMember, 0, len(h.clients))
	for c := range h.clients {
		members = append(members, PresenceMember{UserID: c.UserID})
	}

	return members
}

func (m *HubManager) BroadcastPresence(meetingID string) {
	members := m.GetPresence(meetingID)

	payload := PresencePayload{
		Members: members,
		Count:   len(members),
	}

	ev := Event{
		Type:      EventPresenceUpdate,
		MeetingID: meetingID,
		Payload:   MustRaw(payload),
	}

	_ = m.BroadcastEvent(ev)
}
