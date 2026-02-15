package repository

import (
	"context"
	"sync"
	"time"

	"WEPLAN/internal/model"

	"github.com/google/uuid"
)

type BudgetRepository interface {
	CreateItem(ctx context.Context, item model.BudgetItem) (*model.BudgetItem, error)
	FindByMeeting(ctx context.Context, meetingID string) ([]model.BudgetItem, error)
	CalculateSummary(ctx context.Context, meetingID string, memberCount int32) (*model.BudgetSummary, error)

	// 총무 생성 및 조회
	UpsertLeader(ctx context.Context, item model.BudgetLeader) (*model.BudgetLeader, error)
	FindLeader(ctx context.Context, meetingID string) ([]model.BudgetLeader, error)

	// ✅ UD + 단건 조회
	GetItemByID(ctx context.Context, id string) (*model.BudgetItem, error)
	UpdateItemPartial(ctx context.Context, id string, patch BudgetItemPatch) (*model.BudgetItem, error)
	DeleteItemByID(ctx context.Context, id string) (bool, error)
}

type BudgetItemPatch struct {
	Name     *string
	Amount   *int32
	Category *string
}

type InMemoryBudgetRepo struct {
	mu   sync.RWMutex
	data map[string]model.BudgetItem
}

func NewInMemoryBudgetRepo() *InMemoryBudgetRepo {
	return &InMemoryBudgetRepo{
		data: make(map[string]model.BudgetItem),
	}
}

func (r *InMemoryBudgetRepo) CreateItem(ctx context.Context, item model.BudgetItem) (*model.BudgetItem, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	item.ID = uuid.New().String()
	now := time.Now()
	item.CreatedAt = now
	item.UpdatedAt = now
	r.data[item.ID] = item
	return &item, nil
}

func (r *InMemoryBudgetRepo) FindByMeeting(ctx context.Context, meetingID string) ([]model.BudgetItem, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	res := []model.BudgetItem{}
	for _, it := range r.data {
		if it.MeetingID == meetingID {
			res = append(res, it)
		}
	}
	return res, nil
}

func (r *InMemoryBudgetRepo) CalculateSummary(ctx context.Context, meetingID string, memberCount int32) (*model.BudgetSummary, error) {
	items, _ := r.FindByMeeting(ctx, meetingID)

	var total int32
	for _, it := range items {
		total += it.Amount
	}

	summary := &model.BudgetSummary{
		MeetingID:   meetingID,
		TotalAmount: total,
		MemberCount: memberCount,
	}
	if memberCount > 0 {
		summary.PerPerson = total / memberCount
	}

	return summary, nil
}

func (r *InMemoryBudgetRepo) GetItemByID(ctx context.Context, id string) (*model.BudgetItem, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	it, ok := r.data[id]
	if !ok {
		return nil, nil
	}
	return &it, nil
}

func (r *InMemoryBudgetRepo) UpdateItemPartial(ctx context.Context, id string, patch BudgetItemPatch) (*model.BudgetItem, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	it, ok := r.data[id]
	if !ok {
		return nil, nil
	}

	if patch.Name != nil {
		it.Name = *patch.Name
	}
	if patch.Amount != nil {
		it.Amount = *patch.Amount
	}
	if patch.Category != nil {
		it.Category = *patch.Category
	}

	it.UpdatedAt = time.Now()
	r.data[id] = it
	return &it, nil
}

func (r *InMemoryBudgetRepo) DeleteItemByID(ctx context.Context, id string) (bool, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, ok := r.data[id]; !ok {
		return false, nil
	}
	delete(r.data, id)
	return true, nil
}
