package ws

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Handler struct {
	manager    *HubManager
	dispatcher *EventDispatcher
}

func NewHandler(manager *HubManager, dispatcher *EventDispatcher) http.Handler {
	r := mux.NewRouter()

	h := &Handler{
		manager:    manager,
		dispatcher: dispatcher,
	}

	// ZIP 기준 기존 WS 엔드포인트
	r.HandleFunc("/ws/meetings/{meetingId}", h.handleMeetingWS)

	return r
}

func (h *Handler) handleMeetingWS(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	meetingID := vars["meetingId"]
	if meetingID == "" {
		http.Error(w, "meetingId required", http.StatusBadRequest)
		return
	}

	userID := r.URL.Query().Get("userId")
	if userID == "" {
		userID = "anonymous"
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	client := NewClient(
		conn,
		meetingID,
		userID,
		h.manager,
		h.dispatcher,
	)

	// ⭐ ZIP 기준: 반드시 이 순서
	h.manager.RegisterClient(meetingID, client)

	go client.ReadPump()
	go client.WritePump()
}
