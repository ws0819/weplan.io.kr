package service

import (
	"WEPLAN/internal/pb"
	"WEPLAN/internal/repository"
	"WEPLAN/internal/ws"
	"context"
	"log"
	"strings"

	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type BasePointService struct {
	pb.UnimplementedBasePointServiceServer
	baseRepo repository.BasePointRepository
	linkRepo repository.LinkRepository
	hub      *ws.HubManager
}

func NewBasePointService(
	baseRepo repository.BasePointRepository,
	linkRepo repository.LinkRepository,
	hub *ws.HubManager,
) *BasePointService {
	return &BasePointService{
		baseRepo: baseRepo,
		linkRepo: linkRepo,
		hub:      hub,
	}
}

func (s *BasePointService) GetBasePoint(
	ctx context.Context,
	req *pb.GetBasePointRequest,
) (*pb.GetBasePointResponse, error) {
	log.Printf("[basepoint][GetBasePoint] req=%s", req)

	category := strings.TrimSpace(req.Category)
	var bp *repository.BasePoint
	var err error
	if category == "" {
		// 전체 조회
		bp, err = s.baseRepo.GetByMeeting(ctx, req.MeetingId)
		if err != nil {
			log.Printf("[basepoint][GetBasePoint] err=%s", err)
			return nil, status.Error(codes.Internal, "failed to load base point")
		}
		if bp == nil {
			return nil, status.Error(codes.NotFound, "base point not set")
		}
	} else {
		// 카테고리 필터 조회
		bp, err = s.baseRepo.GetByMeetingAndCategory(ctx, req.MeetingId, category)
		if err != nil {
			log.Printf("[basepoint][GetBasePoint] err=%s", err)
			return nil, status.Error(codes.Internal, "failed to load base point")
		}
		if bp == nil {
			return nil, status.Error(codes.NotFound, "base point not set")
		}
	}

	return &pb.GetBasePointResponse{
		Id:        bp.ID,
		MeetingId: bp.MeetingID,
		LinkId:    bp.LinkID,
		Latitude:  bp.Latitude,
		Longitude: bp.Longitude,
		Category:  bp.Category,
		Title:     bp.Title,
	}, nil
}

func (s *BasePointService) SetBasePoint(
	ctx context.Context,
	req *pb.SetBasePointRequest,
) (*pb.SetBasePointResponse, error) {

	log.Printf("[basepoint][SetBasePoint] req=%s", req)

	link, err := s.linkRepo.GetByID(ctx, req.LinkId)
	if err != nil || link == nil {
		return nil, status.Error(codes.NotFound, "link not found")
	}
	if link.Latitude == nil || link.Longitude == nil {
		return nil, status.Error(codes.InvalidArgument, "link has no coordinates")
	}

	bp := &repository.BasePoint{
		ID:        uuid.New().String(),
		MeetingID: req.MeetingId,
		LinkID:    req.LinkId,
		Latitude:  *link.Latitude,
		Longitude: *link.Longitude,
		Category:  link.Category,
		Title:     link.Title,
	}
	log.Printf("[basepoint][SetBasePoint] bp=%s", bp)
	if err := s.baseRepo.Upsert(ctx, bp); err != nil {
		log.Printf("[basepoint][SetBasePoint] err=%s", err)
		return nil, status.Error(codes.Internal, "failed to save base point")
	}
	if s.hub != nil {
		_ = s.hub.BroadcastEvent(ws.Event{
			Type:      ws.EventBasePointUpdated,
			MeetingID: req.MeetingId,
			Payload:   ws.MustRaw(bp),
		})
	}

	return &pb.SetBasePointResponse{
		MeetingId: req.MeetingId,
	}, nil
}
