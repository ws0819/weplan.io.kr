package model

import "time"

type Meeting struct {
	ID          string     `json:"id"`
	UserID      string     `json:"userId`
	Title       string     `json:"title"`
	StartDate   *time.Time `json:"startDate,omitempty"`
	EndDate     *time.Time `json:"endDate,omitempty"`
	Description string     `json:"description,omitempty"`
	Thumbnail   string     `json:"thumbnail"`
	Images      string     `json:"images"` // JSON string (DB: JSONB)
	TotalAmount int32      `json:"totalAmount"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}

type MeetingMember struct {
	MeetingId string `json:"meetigId`
	UserId    string `json:"userId`
	Role      string `json:"role`
	Images    string `json:"images`
}

type MeetingTotalAmount struct {
	MeetingId   string `json:"meetigId`
	TotalAmount int32  `json:"totalAnmount`
	MemberCount int32  `json:"memberCount`
	PerPerson   int32  `json:"perPerson`
}
