package ws

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

const (
	writeWait  = 10 * time.Second
	pongWait   = 60 * time.Second
	pingPeriod = (pongWait * 9) / 10
)

type Client struct {
	ID        string
	UserID    string
	MeetingID string

	Conn *websocket.Conn
	Send chan []byte

	Hub        *Hub
	Dispatcher *EventDispatcher
	Manager    *HubManager
}

func NewClient(conn *websocket.Conn, meetingID, userID string, m *HubManager, d *EventDispatcher) *Client {
	return &Client{
		ID:         uuid.New().String(),
		UserID:     userID,
		MeetingID:  meetingID,
		Conn:       conn,
		Send:       make(chan []byte, 256),
		Manager:    m,
		Dispatcher: d,
	}
}

func (c *Client) ReadPump() {
	defer func() {
		c.Manager.UnregisterClient(c.MeetingID, c)
		c.Conn.Close()
	}()

	c.Conn.SetReadLimit(5120)
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, msg, err := c.Conn.ReadMessage()
		if err != nil {
			log.Printf("[WS] read error: %v", err)
			break
		}

		var ev Event
		if err := json.Unmarshal(msg, &ev); err != nil {
			log.Printf("[WS] invalid json event: %v", err)
			continue
		}

		ev.MeetingID = c.MeetingID
		ev.SenderID = c.UserID

		ctx := &EventContext{
			Ctx:        context.Background(),
			Event:      &ev,
			Client:     c,
			HubManager: c.Manager,
		}

		if err := c.Dispatcher.Dispatch(ctx); err != nil {
			log.Printf("[WS] dispatch error: %v", err)
		}
	}
}

func (c *Client) WritePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()

	for {
		select {
		case msg, ok := <-c.Send:
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.Conn.WriteMessage(websocket.TextMessage, msg); err != nil {
				return
			}

		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
