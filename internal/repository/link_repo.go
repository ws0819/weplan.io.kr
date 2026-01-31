package repository

import (
	"context"
	"sync"
	"time"

	"WEPLAN/internal/model"

	"github.com/google/uuid"
)

type LinkRepository interface {
	Create(ctx context.Context, l model.Link) (*model.Link, error)
	FindByMeeting(ctx context.Context, meetingID string) ([]model.Link, error)
	FindByMeetingAndCategory(
		ctx context.Context,
		meetingID string,
		category string,
	) ([]model.Link, error)
	// ✅ UD + 단건 조회
	GetByID(ctx context.Context, id string) (*model.Link, error)
	UpdatePartial(ctx context.Context, id string, patch LinkPatch) (*model.Link, error)
	DeleteByID(ctx context.Context, id string) (bool, error)
}

type LinkPatch struct {
	URL       *string
	Title     *string
	Memo      *string
	Rating    *int32
	Category  *string
	Latitude  *float64
	Longitude *float64
	Images    *string // JSON string
}

type InMemoryLinkRepo struct {
	mu   sync.RWMutex
	data map[string]model.Link
}

func NewInMemoryLinkRepo() *InMemoryLinkRepo {
	return &InMemoryLinkRepo{
		data: make(map[string]model.Link),
	}
}

func (r *InMemoryLinkRepo) Create(ctx context.Context, l model.Link) (*model.Link, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	l.ID = uuid.New().String()
	now := time.Now()
	l.CreatedAt = now
	l.UpdatedAt = now
	r.data[l.ID] = l
	return &l, nil
}

func (r *InMemoryLinkRepo) FindByMeeting(ctx context.Context, meetingID string) ([]model.Link, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	res := []model.Link{}
	for _, l := range r.data {
		if l.MeetingID == meetingID {
			res = append(res, l)
		}
	}
	return res, nil
}

func (r *InMemoryLinkRepo) GetByID(ctx context.Context, id string) (*model.Link, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	l, ok := r.data[id]
	if !ok {
		return nil, nil
	}
	return &l, nil
}

func (r *InMemoryLinkRepo) UpdatePartial(ctx context.Context, id string, patch LinkPatch) (*model.Link, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	l, ok := r.data[id]
	if !ok {
		return nil, nil
	}

	if patch.URL != nil {
		l.URL = *patch.URL
	}
	if patch.Title != nil {
		l.Title = *patch.Title
	}
	if patch.Memo != nil {
		l.Memo = *patch.Memo
	}
	if patch.Rating != nil {
		l.Rating = *patch.Rating
	}
	if patch.Category != nil {
		l.Category = *patch.Category
	}
	if patch.Latitude != nil {
		l.Latitude = patch.Latitude
	}
	if patch.Longitude != nil {
		l.Longitude = patch.Longitude
	}
	if patch.Images != nil {
		l.Images = *patch.Images
	}

	l.UpdatedAt = time.Now()
	r.data[id] = l
	return &l, nil
}

func (r *InMemoryLinkRepo) DeleteByID(ctx context.Context, id string) (bool, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, ok := r.data[id]; !ok {
		return false, nil
	}
	delete(r.data, id)
	return true, nil
}
