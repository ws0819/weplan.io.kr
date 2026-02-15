package service

import (
	"context"
	"strings"
	"time"

	"WEPLAN/internal/model"
	"WEPLAN/internal/pb"
	"WEPLAN/internal/repository"
	"WEPLAN/internal/ws"

	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type BudgetService struct {
	pb.UnimplementedBudgetServiceServer
	repo repository.BudgetRepository
	hub  *ws.HubManager
	bus  ws.EventBus
}

func NewBudgetService(repo repository.BudgetRepository, hub *ws.HubManager, bus ws.EventBus) *BudgetService {
	if bus == nil {
		bus = ws.NoopEventBus{}
	}
	return &BudgetService{repo: repo, hub: hub, bus: bus}
}

// -----------------------
// CreateItem
// -----------------------
func (s *BudgetService) CreateItem(ctx context.Context, req *pb.CreateBudgetItemRequest) (*pb.CreateBudgetItemResponse, error) {
	if strings.TrimSpace(req.MeetingId) == "" {
		return nil, status.Error(codes.InvalidArgument, "meeting_id is required")
	}
	if strings.TrimSpace(req.Name) == "" {
		return nil, status.Error(codes.InvalidArgument, "name is required")
	}

	item := model.BudgetItem{
		ID:        uuid.New().String(),
		MeetingID: req.MeetingId,
		Name:      req.Name,
		Amount:    req.Amount,
		Category:  req.Category,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	created, err := s.repo.CreateItem(ctx, item)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to create budget item")
	}

	ev := ws.Event{
		Type:      ws.EventBudgetAdded,
		MeetingID: req.MeetingId,
		Payload:   ws.MustRaw(created),
	}
	if s.hub != nil {
		_ = s.hub.BroadcastEvent(ev)
	}
	_ = s.bus.Publish(ctx, ev)

	return &pb.CreateBudgetItemResponse{ItemId: created.ID}, nil
}

// -----------------------
// ListItems
// -----------------------
func (s *BudgetService) ListItems(ctx context.Context, req *pb.ListBudgetItemsRequest) (*pb.ListBudgetItemsResponse, error) {
	if strings.TrimSpace(req.MeetingId) == "" {
		return nil, status.Error(codes.InvalidArgument, "meeting_id is required")
	}

	items, err := s.repo.FindByMeeting(ctx, req.MeetingId)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to list budget items")
	}

	res := make([]*pb.BudgetItem, 0, len(items))
	for _, it := range items {
		res = append(res, &pb.BudgetItem{
			Id:        it.ID,
			MeetingId: it.MeetingID,
			Name:      it.Name,
			Amount:    it.Amount,
			Category:  it.Category,
		})
	}

	return &pb.ListBudgetItemsResponse{Items: res}, nil
}

// -----------------------
// CreateLeader
// -----------------------
func (s *BudgetService) CreateLeader(ctx context.Context, req *pb.CreateBudgetLeaderRequest) (*pb.CreateBudgetLeaderResponse, error) {
	if strings.TrimSpace(req.MeetingId) == "" {
		return nil, status.Error(codes.InvalidArgument, "meeting_id is required")
	}
	if strings.TrimSpace(req.UserId) == "" {
		return nil, status.Error(codes.InvalidArgument, "name is required")
	}
	item := model.BudgetLeader{
		MeetingID: req.MeetingId,
		UserID:    req.UserId,
		Bank:      req.Bank,
		Acount:    req.Acount,

		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	created, err := s.repo.UpsertLeader(ctx, item)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to create budget leader")
	}

	ev := ws.Event{
		Type:      ws.EventBudgetAdded,
		MeetingID: req.MeetingId,
		Payload:   ws.MustRaw(created),
	}
	if s.hub != nil {
		_ = s.hub.BroadcastEvent(ev)
	}
	_ = s.bus.Publish(ctx, ev)

	return &pb.CreateBudgetLeaderResponse{MeetingId: req.MeetingId}, nil
}

func (s *BudgetService) GetLeader(ctx context.Context, req *pb.GetBudgetLeaderRequest) (*pb.GetBudgetLeaderResponse, error) {
	if strings.TrimSpace(req.MeetingId) == "" {
		return nil, status.Error(codes.InvalidArgument, "meeting_id is required")
	}

	items, err := s.repo.FindLeader(ctx, req.MeetingId)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to list budget items")
	}

	res := make([]*pb.BudgetLeader, 0, len(items))
	for _, it := range items {
		res = append(res, &pb.BudgetLeader{
			MeetingId: it.MeetingID,
			UserId:    it.UserID,
			Bank:      it.Bank,
			Acount:    it.Acount,
		})
	}

	return &pb.GetBudgetLeaderResponse{Items: res}, nil
}

// -----------------------
// UDBudgetItem + WS 연계
// -----------------------
func (s *BudgetService) UDBudgetItem(ctx context.Context, req *pb.UDBudgetItemRequest) (*pb.UDBudgetItemResponse, error) {
	meetingID := strings.TrimSpace(req.MeetingId) // meeting_id -> Go: MeetingId
	id := strings.TrimSpace(req.Id)
	op := strings.ToLower(strings.TrimSpace(req.Op))

	if meetingID == "" {
		return nil, status.Error(codes.InvalidArgument, "meeting_id is required")
	}
	if id == "" {
		return nil, status.Error(codes.InvalidArgument, "id is required")
	}
	if op != "u" && op != "d" {
		return nil, status.Error(codes.InvalidArgument, "op must be 'u' or 'd'")
	}

	// DELETE
	if op == "d" {
		if req.Fields != nil {
			return nil, status.Error(codes.InvalidArgument, "fields must be empty when op is 'd'")
		}

		ok, err := s.repo.DeleteItemByID(ctx, id)
		if err != nil {
			return nil, status.Error(codes.Internal, "failed to delete budget item")
		}
		if !ok {
			return nil, status.Error(codes.NotFound, "budget item not found")
		}

		ev := ws.Event{
			Type:      ws.EventBudgetDeleted,
			MeetingID: meetingID,
			Payload: ws.MustRaw(map[string]string{
				"op": "d",
				"id": id,
			}),
		}
		if s.hub != nil {
			_ = s.hub.BroadcastEvent(ev)
		}
		_ = s.bus.Publish(ctx, ev)

		return &pb.UDBudgetItemResponse{MeetingId: meetingID, Id: id, Op: "d"}, nil
	}

	// UPDATE
	if req.Fields == nil {
		return nil, status.Error(codes.InvalidArgument, "fields is required when op is 'u'")
	}

	patch := repository.BudgetItemPatch{}

	if v := strings.TrimSpace(req.Fields.Name); v != "" {
		patch.Name = &v
	}
	if req.Fields.Amount != 0 {
		a := req.Fields.Amount
		patch.Amount = &a
	}
	if v := strings.TrimSpace(req.Fields.Category); v != "" {
		patch.Category = &v
	}

	updated, err := s.repo.UpdateItemPartial(ctx, id, patch)
	if err != nil {
		if strings.Contains(err.Error(), "no fields to update") {
			return nil, status.Error(codes.InvalidArgument, "no fields to update")
		}
		return nil, status.Error(codes.Internal, "failed to update budget item")
	}
	if updated == nil {
		return nil, status.Error(codes.NotFound, "budget item not found")
	}

	// 기존 EventBudgetUpdated 재사용 + payload 통일
	ev := ws.Event{
		Type:      ws.EventBudgetUpdated,
		MeetingID: meetingID,
		Payload: ws.MustRaw(map[string]interface{}{
			"op":   "u",
			"id":   updated.ID,
			"data": updated,
		}),
	}
	if s.hub != nil {
		_ = s.hub.BroadcastEvent(ev)
	}
	_ = s.bus.Publish(ctx, ev)

	return &pb.UDBudgetItemResponse{
		MeetingId: meetingID,
		Id:        updated.ID,
		Op:        "u",
		Item: &pb.BudgetItem{
			Id:        updated.ID,
			MeetingId: updated.MeetingID,
			Name:      updated.Name,
			Amount:    updated.Amount,
			Category:  updated.Category,
		},
	}, nil
}
