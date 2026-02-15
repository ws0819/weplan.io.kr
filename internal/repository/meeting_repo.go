package repository

import (
	"context"
	"sync"
	"time"

	"WEPLAN/internal/model"

	"github.com/google/uuid"
)

// MeetingRepository
// - meetings CRUD
// - meeting_members membership/role lookup (WebSocket/Invite 권한 판단에 사용)
type MeetingRepository interface {
	Create(ctx context.Context, m model.Meeting) (*model.Meeting, error)
	GetByID(ctx context.Context, id string) (*model.Meeting, error)
	List(ctx context.Context, user_id string) ([]model.Meeting, error)
	TotalAmount(ctx context.Context, meetingID string, totalAmount int32) (*model.MeetingTotalAmount, error)

	// ✅ UD
	UpdatePartial(ctx context.Context, id string, patch MeetingPatch) (*model.Meeting, error)
	DeleteByID(ctx context.Context, id string) (bool, error)

	// meeting_members
	AddMember(ctx context.Context, meetingID string, userID uuid.UUID, role string) error
	GetMemberRole(ctx context.Context, meetingID string, userID uuid.UUID) (string, error)
	GetMeeting(ctx context.Context, meetingID string) ([]model.MeetingMember, error)
}

// ✅ 부분 업데이트용 Patch
type MeetingPatch struct {
	Title       *string
	Description *string
	Thumbnail   *string
	StartDate   *time.Time
	EndDate     *time.Time
	Images      *string // JSON string
}

// ===== InMemory =====

type InMemoryMeetingRepo struct {
	mu      sync.RWMutex
	data    map[string]model.Meeting
	members map[string]map[uuid.UUID]string // meetingID -> userID -> role
}

func NewInMemoryMeetingRepo() *InMemoryMeetingRepo {
	return &InMemoryMeetingRepo{
		data:    make(map[string]model.Meeting),
		members: make(map[string]map[uuid.UUID]string),
	}
}

func (r *InMemoryMeetingRepo) Create(ctx context.Context, m model.Meeting) (*model.Meeting, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if m.ID == "" {
		m.ID = uuid.New().String()
	}

	now := time.Now()
	if m.CreatedAt.IsZero() {
		m.CreatedAt = now
	}
	if m.UpdatedAt.IsZero() {
		m.UpdatedAt = now
	}

	r.data[m.ID] = m
	return &m, nil
}

func (r *InMemoryMeetingRepo) GetByID(ctx context.Context, id string) (*model.Meeting, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	m, ok := r.data[id]
	if !ok {
		return nil, nil
	}
	return &m, nil
}

func (r *InMemoryMeetingRepo) List(ctx context.Context, user_id string) ([]model.Meeting, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	res := make([]model.Meeting, 0, len(r.data))
	for _, m := range r.data {
		res = append(res, m)
	}
	return res, nil
}

func (r *InMemoryMeetingRepo) UpdatePartial(ctx context.Context, id string, patch MeetingPatch) (*model.Meeting, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	m, ok := r.data[id]
	if !ok {
		return nil, nil
	}

	if patch.Title != nil {
		m.Title = *patch.Title
	}
	if patch.Description != nil {
		m.Description = *patch.Description
	}
	if patch.Thumbnail != nil {
		m.Thumbnail = *patch.Thumbnail
	}
	if patch.StartDate != nil {
		m.StartDate = patch.StartDate
	}
	if patch.EndDate != nil {
		m.EndDate = patch.EndDate
	}
	if patch.Images != nil {
		m.Images = *patch.Images
	}

	m.UpdatedAt = time.Now()
	r.data[id] = m
	return &m, nil
}

func (r *InMemoryMeetingRepo) DeleteByID(ctx context.Context, id string) (bool, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, ok := r.data[id]; !ok {
		return false, nil
	}
	delete(r.data, id)
	return true, nil
}

func (r *InMemoryMeetingRepo) AddMember(ctx context.Context, meetingID string, userID uuid.UUID, role string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if role == "" {
		role = "member"
	}
	if _, ok := r.members[meetingID]; !ok {
		r.members[meetingID] = make(map[uuid.UUID]string)
	}
	r.members[meetingID][userID] = role
	return nil
}

func (r *InMemoryMeetingRepo) GetMemberRole(ctx context.Context, meetingID string, userID uuid.UUID) (string, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	mm, ok := r.members[meetingID]
	if !ok {
		return "", nil
	}
	role, ok := mm[userID]
	if !ok {
		return "", nil
	}
	return role, nil
}
