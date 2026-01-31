package repository

import (
	"context"
	"sync"
	"time"
)

// =======================
// Domain Model
// =======================
type BasePoint struct {
	ID        string
	MeetingID string
	LinkID    string
	Latitude  float64
	Longitude float64
	Category  string
	Title     string
	UpdatedAt time.Time
}

// =======================
// Repository Interface
// =======================
type BasePointRepository interface {
	GetByMeeting(ctx context.Context, meetingID string) (*BasePoint, error)
	GetByMeetingAndCategory(ctx context.Context, meetingID string, category string) (*BasePoint, error)
	Upsert(ctx context.Context, bp *BasePoint) error
	ClearLinkRef(ctx context.Context, meetingID string, linkID string) error
}

// =======================
// InMemory Implementation
// (ZIP 기준 패턴 유지)
// =======================
type InMemoryBasePointRepo struct {
	mu   sync.RWMutex
	data map[string]BasePoint // key = meetingID
}

func NewInMemoryBasePointRepo() *InMemoryBasePointRepo {
	return &InMemoryBasePointRepo{
		data: make(map[string]BasePoint),
	}
}

// =======================
// GetByMeeting
// =======================
func (r *InMemoryBasePointRepo) GetByMeeting(
	ctx context.Context,
	meetingID string,
) (*BasePoint, error) {

	r.mu.RLock()
	defer r.mu.RUnlock()

	bp, ok := r.data[meetingID]
	if !ok {
		return nil, nil
	}
	return &bp, nil
}

// =======================
// Upsert
// =======================
func (r *InMemoryBasePointRepo) Upsert(
	ctx context.Context,
	bp BasePoint,
) error {

	r.mu.Lock()
	defer r.mu.Unlock()

	bp.UpdatedAt = time.Now()
	r.data[bp.MeetingID] = bp
	return nil
}

// =======================
// ClearLinkRef
// =======================
func (r *InMemoryBasePointRepo) ClearLinkRef(
	ctx context.Context,
	meetingID string,
	linkID string,
) error {

	r.mu.Lock()
	defer r.mu.Unlock()

	bp, ok := r.data[meetingID]
	if !ok {
		return nil
	}

	if bp.LinkID != "" && bp.LinkID == linkID {
		bp.LinkID = ""
		bp.UpdatedAt = time.Now()
		r.data[meetingID] = bp
	}

	return nil
}
