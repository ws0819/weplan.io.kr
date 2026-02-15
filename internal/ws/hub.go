package ws

import "log"

type Hub struct {
	Manager    *HubManager // 대문자 M 로 Export 필요!
	register   chan *Client
	unregister chan *Client
	broadcast  chan []byte
	clients    map[*Client]bool
}

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan []byte),
	}
}

func (h *Hub) Run() {
	for {
		select {

		case client := <-h.register:
			h.clients[client] = true
			h.Manager.BroadcastPresence(client.MeetingID)
			log.Printf("[HUB] client joined. count=%d", len(h.clients))

		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.Send)
				h.Manager.BroadcastPresence(client.MeetingID)
				log.Printf("[HUB] client left. count=%d", len(h.clients))
			}

		case msg := <-h.broadcast:
			for client := range h.clients {
				select {
				case client.Send <- msg:
				default:
					close(client.Send)
					delete(h.clients, client)
				}
			}
		}
	}
}
