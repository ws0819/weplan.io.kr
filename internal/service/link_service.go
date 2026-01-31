package service

import (
	"context"
	"log"
	"strings"
	"time"

	"WEPLAN/internal/config"
	"WEPLAN/internal/model"
	"WEPLAN/internal/pb"
	"WEPLAN/internal/repository"
	"WEPLAN/internal/ws"

	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type LinkService struct {
	pb.UnimplementedLinkServiceServer
	repo          repository.LinkRepository
	basePointRepo repository.BasePointRepository // ✅ 추가
	cfg           *config.Config
	hub           *ws.HubManager
	bus           ws.EventBus
}

func NewLinkService(
	repo repository.LinkRepository,
	basePointRepo repository.BasePointRepository,
	cfg *config.Config,
	hub *ws.HubManager,
	bus ws.EventBus,
) *LinkService {
	if bus == nil {
		bus = ws.NoopEventBus{}
	}
	return &LinkService{repo: repo, basePointRepo: basePointRepo, cfg: cfg, hub: hub, bus: bus}
}

// =====================================
// CreateLink (Enrich 자동 내장)
// - 요구사항: /api/v1/meetings/{meeting_id}/links 호출 시 enrich를 기본 탑재
// - 우선순위: 요청값 > enrich값
// =====================================
func (s *LinkService) CreateLink(
	ctx context.Context,
	req *pb.CreateLinkRequest,
) (*pb.CreateLinkResponse, error) {

	meetingID := strings.TrimSpace(req.MeetingId)
	rawURL := strings.TrimSpace(req.Url)

	if meetingID == "" {
		return nil, status.Error(codes.InvalidArgument, "meeting_id is required")
	}
	if rawURL == "" {
		return nil, status.Error(codes.InvalidArgument, "url is required")
	}
	if s.cfg == nil {
		// cfg nil이면 enrich는 불가능하지만, Create는 가능하게 둘 수도 있음.
		// 지금은 디버깅 목적이므로 명확히 에러 처리(원하면 warn으로 변경 가능)
		return nil, status.Error(codes.Internal, "server config is nil")
	}

	// --- 요청 로그(디버깅) ---
	log.Printf("[LINK][CREATE] meetingId=%s url=%s title=%q lat=%v lng=%v category=%q imagesLen=%d",
		meetingID, rawURL, req.Title, req.Latitude, req.Longitude, req.Category, len(req.Images),
	)

	// ---------------------------------
	// 1) Enrich (필요할 때만)
	// - 이미 요청에 lat/lng가 있으면 굳이 enrich로 좌표를 다시 뽑을 필요가 없음
	// - title이 비어있거나 lat/lng가 없을 때 enrich 수행
	// ---------------------------------
	needEnrich := false
	if strings.TrimSpace(req.Title) == "" {
		needEnrich = true
	}
	if req.Latitude == 0 || req.Longitude == 0 {
		needEnrich = true
	}

	var enriched *EnrichedLink
	var enrichErr error
	if needEnrich {
		enriched, enrichErr = EnrichLink(ctx, rawURL, s.cfg)
		if enrichErr != nil {
			log.Printf("[LINK][ENRICH][WARN] url=%s err=%v", rawURL, enrichErr)
		} else if enriched != nil {
			log.Printf("[LINK][ENRICH] url=%s title=%q thumb=%q latNil=%v lngNil=%v",
				rawURL,
				enriched.Title,
				enriched.Thumbnail,
				enriched.Latitude == nil,
				enriched.Longitude == nil,
			)
		}
	}

	// ---------------------------------
	// 2) link 객체 구성 (요청값 우선)
	// ---------------------------------
	finalTitle := pickTitle(req.Title, enriched)
	finalImages := pickImages(req.Images, enriched)
	// finalImages := strings.TrimSpace(req.Images)

	// thumbnail은 proto CreateLinkRequest에 없고 Link 모델에도 없을 수 있음.
	// 만약 model.Link에 Thumbnail 필드가 존재한다면 여기서 주입해야 합니다.
	// 현재는 "DB에 저장하는 위경도" 목적이므로 title/lat/lng 중심으로 처리합니다.

	link := model.Link{
		ID:        uuid.New().String(),
		MeetingID: meetingID,
		URL:       rawURL,
		Title:     finalTitle,
		Memo:      req.Memo,
		Rating:    req.Rating,
		Category:  strings.TrimSpace(req.Category),
		Images:    finalImages,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// 위경도 우선순위: 요청값 > enrich
	if req.Latitude != 0 {
		lat := req.Latitude
		link.Latitude = &lat
	} else if enriched != nil && enriched.Latitude != nil {
		link.Latitude = enriched.Latitude
	}

	if req.Longitude != 0 {
		lng := req.Longitude
		link.Longitude = &lng
	} else if enriched != nil && enriched.Longitude != nil {
		link.Longitude = enriched.Longitude
	}

	// --- 최종 저장 직전 값 로그(핵심) ---
	var latVal, lngVal float64
	if link.Latitude != nil {
		latVal = *link.Latitude
	}
	if link.Longitude != nil {
		lngVal = *link.Longitude
	}
	log.Printf("[LINK][CREATE][FINAL] id=%s meetingId=%s title=%q lat=%v lng=%v",
		link.ID, meetingID, link.Title, latVal, lngVal,
	)

	// ---------------------------------
	// 3) DB 저장
	// ---------------------------------
	created, err := s.repo.Create(ctx, link)
	if err != nil {
		log.Printf("[LINK][CREATE][DB][ERR] meetingId=%s url=%s err=%v", meetingID, rawURL, err)
		return nil, status.Error(codes.Internal, "failed to create link")
	}

	// 저장된 결과를 다시 로그(Repo가 값을 덮어쓰는지 확인용)
	var cLat, cLng float64
	if created.Latitude != nil {
		cLat = *created.Latitude
	}
	if created.Longitude != nil {
		cLng = *created.Longitude
	}
	log.Printf("[LINK][CREATE][DB][OK] id=%s meetingId=%s lat=%v lng=%v", created.ID, created.MeetingID, cLat, cLng)

	// WS
	ev := ws.Event{
		Type:      ws.EventLinkAdded,
		MeetingID: meetingID,
		Payload:   ws.MustRaw(created),
	}
	if s.hub != nil {
		_ = s.hub.BroadcastEvent(ev)
	}
	_ = s.bus.Publish(ctx, ev)

	return &pb.CreateLinkResponse{LinkId: created.ID}, nil
}

// =====================================
// ListLinks (기존 유지)
// =====================================
func (s *LinkService) ListLinks(
	ctx context.Context,
	req *pb.ListLinksRequest,
) (*pb.ListLinksResponse, error) {

	meetingID := strings.TrimSpace(req.MeetingId)
	if meetingID == "" {
		return nil, status.Error(codes.InvalidArgument, "meeting_id is required")
	}

	category := strings.TrimSpace(req.Category)

	var links []model.Link
	var err error

	if category == "" {
		// 전체 조회
		links, err = s.repo.FindByMeeting(ctx, req.MeetingId)
		if err != nil {
			return nil, status.Error(codes.Internal, "failed to list links")
		}
	} else {
		// 카테고리 필터 조회
		links, err = s.repo.FindByMeetingAndCategory(ctx, req.MeetingId, category)
		if err != nil {
			return nil, status.Error(codes.Internal, "failed to list links and category")
		}
	}

	res := make([]*pb.Link, 0, len(links))
	for _, l := range links {
		var lat, lng float64
		if l.Latitude != nil {
			lat = *l.Latitude
		}
		if l.Longitude != nil {
			lng = *l.Longitude
		}

		res = append(res, &pb.Link{
			Id:        l.ID,
			MeetingId: l.MeetingID,
			Url:       l.URL,
			Title:     l.Title,
			Memo:      l.Memo,
			Rating:    l.Rating,
			Category:  l.Category,
			Latitude:  lat,
			Longitude: lng,
			Images:    l.Images,
		})
	}

	return &pb.ListLinksResponse{Links: res}, nil
}

// =====================================
// EnrichLink (RPC 그대로 유지)
// =====================================
func (s *LinkService) EnrichLink(
	ctx context.Context,
	req *pb.EnrichLinkRequest,
) (*pb.EnrichLinkResponse, error) {

	if s.cfg == nil {
		return nil, status.Error(codes.Internal, "server config is nil")
	}

	out, err := EnrichLink(ctx, req.Url, s.cfg)
	if err != nil {
		return nil, status.Error(codes.Internal, "failed to enrich link")
	}

	var lat, lng float64
	if out.Latitude != nil {
		lat = *out.Latitude
	}
	if out.Longitude != nil {
		lng = *out.Longitude
	}

	thumb := normalizeThumbnail(out.Thumbnail)

	return &pb.EnrichLinkResponse{
		Title:     out.Title,
		Thumbnail: thumb,
		Latitude:  lat,
		Longitude: lng,
	}, nil
}

// =====================================
// UDLink (Update / Delete) + WS 연계
// =====================================
func (s *LinkService) UDLink(
	ctx context.Context,
	req *pb.UDLinkRequest,
) (*pb.UDLinkResponse, error) {

	meetingID := strings.TrimSpace(req.MeetingId)
	id := strings.TrimSpace(req.Id)
	op := strings.ToLower(strings.TrimSpace(req.Op))

	// 요청 로그
	log.Printf("[LINK][UD] meetingId=%s id=%s op=%s hasFields=%v", meetingID, id, op, req.Fields != nil)

	if meetingID == "" {
		return nil, status.Error(codes.InvalidArgument, "meeting_id is required")
	}
	if id == "" {
		return nil, status.Error(codes.InvalidArgument, "id is required")
	}
	if op != "u" && op != "d" {
		return nil, status.Error(codes.InvalidArgument, "op must be 'u' or 'd'")
	}

	// ---------- DELETE ----------
	if op == "d" {
		ok, err := s.repo.DeleteByID(ctx, id)
		if err != nil {
			log.Printf("[LINK][UD][DEL][ERR] meetingId=%s id=%s err=%v", meetingID, id, err)
			return nil, status.Error(codes.Internal, "failed to delete link")
		}
		if !ok {
			log.Printf("[LINK][UD][DEL][NOTFOUND] meetingId=%s id=%s", meetingID, id)
			return nil, status.Error(codes.NotFound, "link not found")
		}

		ev := ws.Event{
			Type:      ws.EventLinkDeleted,
			MeetingID: meetingID,
			Payload: ws.MustRaw(map[string]string{
				"id": id,
			}),
		}
		if s.hub != nil {
			_ = s.hub.BroadcastEvent(ev)
		}
		_ = s.bus.Publish(ctx, ev)

		// 링크 삭제 후 기준점 link 참조 제거
		_ = s.basePointRepo.ClearLinkRef(ctx, meetingID, id)

		log.Printf("[LINK][UD][DEL][OK] meetingId=%s id=%s", meetingID, id)

		return &pb.UDLinkResponse{
			MeetingId: meetingID,
			Id:        id,
			Op:        "d",
		}, nil
	}

	// ---------- UPDATE ----------
	if req.Fields == nil {
		return nil, status.Error(codes.InvalidArgument, "fields is required when op is 'u'")
	}

	patch := repository.LinkPatch{}

	if v := strings.TrimSpace(req.Fields.Url); v != "" {
		patch.URL = &v
	}
	if v := strings.TrimSpace(req.Fields.Title); v != "" {
		patch.Title = &v
	}
	if v := strings.TrimSpace(req.Fields.Memo); v != "" {
		patch.Memo = &v
	}
	if req.Fields.Rating != 0 {
		r := req.Fields.Rating
		patch.Rating = &r
	}
	if v := strings.TrimSpace(req.Fields.Category); v != "" {
		patch.Category = &v
	}
	if req.Fields.Latitude != 0 {
		lat := req.Fields.Latitude
		patch.Latitude = &lat
	}
	if req.Fields.Longitude != 0 {
		lng := req.Fields.Longitude
		patch.Longitude = &lng
	}
	if v := strings.TrimSpace(req.Fields.Images); v != "" {
		patch.Images = &v
	}

	updated, err := s.repo.UpdatePartial(ctx, id, patch)
	if err != nil {
		log.Printf("[LINK][UD][UPD][ERR] meetingId=%s id=%s err=%v", meetingID, id, err)
		return nil, status.Error(codes.Internal, "failed to update link")
	}
	if updated == nil {
		log.Printf("[LINK][UD][UPD][NOTFOUND] meetingId=%s id=%s", meetingID, id)
		return nil, status.Error(codes.NotFound, "link not found")
	}

	ev := ws.Event{
		Type:      ws.EventLinkUpdated,
		MeetingID: meetingID,
		Payload:   ws.MustRaw(updated),
	}
	if s.hub != nil {
		_ = s.hub.BroadcastEvent(ev)
	}
	_ = s.bus.Publish(ctx, ev)

	var lat, lng float64
	if updated.Latitude != nil {
		lat = *updated.Latitude
	}
	if updated.Longitude != nil {
		lng = *updated.Longitude
	}

	log.Printf("[LINK][UD][UPD][OK] meetingId=%s id=%s lat=%v lng=%v", meetingID, updated.ID, lat, lng)

	return &pb.UDLinkResponse{
		MeetingId: meetingID,
		Id:        updated.ID,
		Op:        "u",
		Link: &pb.Link{
			Id:        updated.ID,
			MeetingId: updated.MeetingID,
			Url:       updated.URL,
			Title:     updated.Title,
			Memo:      updated.Memo,
			Rating:    updated.Rating,
			Category:  updated.Category,
			Latitude:  lat,
			Longitude: lng,
			Images:    updated.Images,
		},
	}, nil
}

// =====================================
// helpers
// =====================================

func pickTitle(title string, e *EnrichedLink) string {
	if strings.TrimSpace(title) != "" {
		return strings.TrimSpace(title)
	}
	if e != nil && strings.TrimSpace(e.Title) != "" {
		return strings.TrimSpace(e.Title)
	}
	return ""
}

func pickImages(images string, e *EnrichedLink) string {
	if strings.TrimSpace(images) != "" {
		return strings.TrimSpace(images)
	}
	if e != nil && strings.TrimSpace(e.Thumbnail) != "" {
		return strings.TrimSpace(e.Thumbnail)
	}
	return ""
}

// og:image가 "//t1.daumcdn.net/..."처럼 오는 케이스 정규화
func normalizeThumbnail(s string) string {
	ss := strings.TrimSpace(s)
	if ss == "" {
		return ""
	}
	if strings.HasPrefix(ss, "//") {
		return "https:" + ss
	}
	return ss
}
