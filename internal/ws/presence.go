package ws

type PresenceMember struct {
	UserID string `json:"userId"`
}

type PresencePayload struct {
	Members []PresenceMember `json:"members"`
	Count   int              `json:"count"`
}
