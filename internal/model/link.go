package model

import "time"

// Link: 저장된 링크 / 장소 / 숙소 등의 정보
type Link struct {
	ID        string    `json:"id"`
	MeetingID string    `json:"meetingId"`
	URL       string    `json:"url"`
	Title     string    `json:"title"`
	Memo      string    `json:"memo"`
	Rating    int32     `json:"rating"`
	Category  string    `json:"category"`
	Latitude  *float64  `json:"latitude"`
	Longitude *float64  `json:"longitude"`
	Images    string    `json:"images"` // JSON string (DB: JSONB)
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
