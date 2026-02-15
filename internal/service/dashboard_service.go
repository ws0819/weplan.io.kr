package service

import (
	"context"

	"WEPLAN/internal/pb"
	"WEPLAN/internal/repository"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type DashboardService struct {
	pb.UnimplementedDashboardServiceServer
	meetings repository.MeetingRepository
	links    repository.LinkRepository
	budgets  repository.BudgetRepository
}

func NewDashboardService(
	meetings repository.MeetingRepository,
	links repository.LinkRepository,
	budgets repository.BudgetRepository,
) *DashboardService {
	return &DashboardService{
		meetings: meetings,
		links:    links,
		budgets:  budgets,
	}
}

func (s *DashboardService) GetDashboard(
	ctx context.Context,
	req *pb.GetDashboardRequest,
) (*pb.GetDashboardResponse, error) {
	if req.GetMeetingId() == "" {
		return nil, status.Error(codes.InvalidArgument, "meeting_id is required")
	}

	// 1) Meeting 조회
	meeting, err := s.meetings.GetByID(ctx, req.GetMeetingId())
	if err != nil {
		// repo 동작 중 에러 (DB 에러 등)
		return nil, status.Error(codes.Internal, "failed to get meeting")
	}
	if meeting == nil {
		// repo 에서 찾지 못한 경우
		return nil, status.Error(codes.NotFound, "meeting not found")
	}

	// 2) 링크 목록
	links, err := s.links.FindByMeeting(ctx, req.GetMeetingId())
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to load links")
	}

	// 3) 예산 항목 목록 + 요약
	items, err := s.budgets.FindByMeeting(ctx, req.GetMeetingId())
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to load budget items")
	}

	summary, err := s.budgets.CalculateSummary(ctx, req.GetMeetingId(), req.GetMemberCount())
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to calculate budget summary")
	}

	// 4) 응답 매핑
	resp := &pb.GetDashboardResponse{
		Meeting: &pb.DashboardMeeting{
			Id:    meeting.ID,
			Title: meeting.Title,
			// Date:        meeting.Date.Format(time.RFC3339),
			Description: meeting.Description,
			Thumbnail:   meeting.Thumbnail,
		},
		BudgetSummary: &pb.DashboardBudgetSummary{
			TotalAmount: summary.TotalAmount,
			MemberCount: summary.MemberCount,
			PerPerson:   summary.PerPerson,
		},
	}

	for _, l := range links {
		resp.Links = append(resp.Links, &pb.DashboardLink{
			Id:     l.ID,
			Url:    l.URL,
			Title:  l.Title,
			Memo:   l.Memo,
			Rating: float32(l.Rating),
		})
	}

	for _, it := range items {
		resp.BudgetItems = append(resp.BudgetItems, &pb.DashboardBudgetItem{
			Id:     it.ID,
			Name:   it.Name,
			Amount: it.Amount,
		})
	}

	return resp, nil
}
