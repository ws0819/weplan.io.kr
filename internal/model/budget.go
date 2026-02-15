package model

import "time"

// BudgetItem: 모임 내 개별 비용 항목
type BudgetItem struct {
	ID        string    `json:"id"`
	MeetingID string    `json:"meetingId"`
	Name      string    `json:"name"`   // 항목명: 숙소, 식비 등
	Amount    int32     `json:"amount"` // 금액
	Category  string    `json:"category"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// BudgetSummary: 전체 예산 합계
type BudgetSummary struct {
	MeetingID   string `json:"meetingId"`
	TotalAmount int32  `json:"totalAmount"`
	MemberCount int32  `json:"memberCount"`
	PerPerson   int32  `json:"perPerson"`
}

// BudgetLeader : 총무
type BudgetLeader struct {
	MeetingID string    `json:"meetingId"`
	UserID    string    `json:"userId"`
	Bank      string    `json:"bank"`
	Acount    string    `json:"acount"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
