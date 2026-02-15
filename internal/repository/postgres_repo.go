package repository

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"strings"
	"time"

	"WEPLAN/internal/model"

	"github.com/google/uuid"
)

// ===== Meeting (Postgres) =====

type PostgresMeetingRepo struct {
	db *sql.DB
}

func NewPostgresMeetingRepo(db *sql.DB) MeetingRepository {
	return &PostgresMeetingRepo{db: db}
}

func (r *PostgresMeetingRepo) Create(ctx context.Context, m model.Meeting) (*model.Meeting, error) {
	if m.ID == "" {
		return nil, fmt.Errorf("meeting ID is empty")
	}

	// ⚠️ createTable.sql 에는 date TIMESTAMP NOT NULL 이 존재합니다.
	// UI에서 date를 쓰지 않더라도, DB NOT NULL을 만족시키기 위해
	// date = start_date (없으면 now) 로 넣습니다.
	// dateVal := time.Now()
	// if m.StartDate != nil {
	// 	dateVal = *m.StartDate
	// }

	query := `
		INSERT INTO weplan.meetings
			(id, user_id, title, start_date, end_date, description, thumbnail, images, created_at, updated_at)
		VALUES
			($1, $2, $3, $4, $5, $6, $7, COALESCE(NULLIF($8,''), '[]')::jsonb, $9, $10)
	`

	now := time.Now()
	if m.CreatedAt.IsZero() {
		m.CreatedAt = now
	}
	if m.UpdatedAt.IsZero() {
		m.UpdatedAt = now
	}
	if strings.TrimSpace(m.Images) == "" {
		m.Images = "[]"
	}

	_, err := r.db.ExecContext(ctx, query,
		m.ID,
		m.UserID,
		m.Title,
		// dateVal,
		sql.NullTime{Time: derefTime(m.StartDate), Valid: m.StartDate != nil},
		sql.NullTime{Time: derefTime(m.EndDate), Valid: m.EndDate != nil},
		m.Description,
		m.Thumbnail,
		m.Images,
		m.CreatedAt,
		m.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("insert meeting: %w", err)
	}

	return &m, nil
}

func (r *PostgresMeetingRepo) GetByID(ctx context.Context, id string) (*model.Meeting, error) {
	query := `
		SELECT id, title, start_date, end_date, description, thumbnail, images, created_at, updated_at, total_amount
		FROM weplan.meetings
		WHERE id = $1
	`

	var m model.Meeting
	var start sql.NullTime
	var end sql.NullTime
	var images string

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&m.ID,
		&m.Title,
		&start,
		&end,
		&m.Description,
		&m.Thumbnail,
		&images,
		&m.CreatedAt,
		&m.UpdatedAt,
		&m.TotalAmount,
	)
	if err != nil {
		log.Println("GET MEETING SQL ERROR:", err)
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	if start.Valid {
		m.StartDate = &start.Time
	}
	if end.Valid {
		m.EndDate = &end.Time
	}
	m.Images = images

	return &m, nil
}

func (r *PostgresMeetingRepo) List(ctx context.Context, user_id string) ([]model.Meeting, error) {
	query := `
		SELECT DISTINCT	m.id, m.user_id, m.title, m.start_date, m.end_date, m.description, m.thumbnail,	m.images, m.created_at,	m.updated_at
		FROM weplan.meeting_members mm
		JOIN weplan.meetings m ON m.id = mm.meeting_id
		JOIN weplan.users u ON u.id = mm.user_id
		WHERE u.user_id = $1
		ORDER BY m.created_at DESC
	`

	rows, err := r.db.QueryContext(ctx, query, user_id)
	if err != nil {
		return nil, fmt.Errorf("list meetings: %w", err)
	}
	defer rows.Close()

	var res []model.Meeting
	for rows.Next() {
		var m model.Meeting
		var start sql.NullTime
		var end sql.NullTime
		var images string

		if err := rows.Scan(
			&m.ID,
			&m.UserID,
			&m.Title,
			&start,
			&end,
			&m.Description,
			&m.Thumbnail,
			&images,
			&m.CreatedAt,
			&m.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan meeting: %w", err)
		}

		if start.Valid {
			m.StartDate = &start.Time
		}
		if end.Valid {
			m.EndDate = &end.Time
		}
		m.Images = images

		res = append(res, m)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("list meetings rows: %w", err)
	}

	return res, nil
}

// ✅ 안전한 동적 UPDATE (화이트리스트 + 바인딩)
func (r *PostgresMeetingRepo) UpdatePartial(ctx context.Context, id string, patch MeetingPatch) (*model.Meeting, error) {
	if strings.TrimSpace(id) == "" {
		return nil, fmt.Errorf("id is empty")
	}

	sets := make([]string, 0, 8)
	args := make([]interface{}, 0, 10)
	n := 1

	// string 계열: nil이면 미변경, 값이 ""이면 서비스에서 걸러서 nil로 들어오는 것을 전제
	if patch.Title != nil {
		sets = append(sets, fmt.Sprintf("title = $%d", n))
		args = append(args, *patch.Title)
		n++
	}
	if patch.Description != nil {
		sets = append(sets, fmt.Sprintf("description = $%d", n))
		args = append(args, *patch.Description)
		n++
	}
	if patch.Thumbnail != nil {
		sets = append(sets, fmt.Sprintf("thumbnail = $%d", n))
		args = append(args, *patch.Thumbnail)
		n++
	}

	// date 계열
	if patch.StartDate != nil {
		sets = append(sets, fmt.Sprintf("start_date = $%d", n))
		args = append(args, *patch.StartDate)
		n++

		// date 컬럼(legacy)도 함께 갱신해 NOT NULL 의미를 유지
		// sets = append(sets, fmt.Sprintf("date = $%d", n))
		// args = append(args, *patch.StartDate)
		// n++
	}
	if patch.EndDate != nil {
		sets = append(sets, fmt.Sprintf("end_date = $%d", n))
		args = append(args, *patch.EndDate)
		n++
	}

	// images jsonb
	if patch.Images != nil {
		sets = append(sets, fmt.Sprintf("images = NULLIF($%d,'')::jsonb", n))
		args = append(args, *patch.Images)
		n++
	}

	if len(sets) == 0 {
		return nil, fmt.Errorf("no fields to update")
	}

	sets = append(sets, "updated_at = NOW()")

	query := fmt.Sprintf(`
		UPDATE weplan.meetings
		SET %s
		WHERE id = $%d
	`, strings.Join(sets, ", "), n)

	args = append(args, id)

	res, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("update meeting: %w", err)
	}

	aff, _ := res.RowsAffected()
	if aff == 0 {
		return nil, nil
	}

	return r.GetByID(ctx, id)
}

func (r *PostgresMeetingRepo) DeleteByID(ctx context.Context, id string) (bool, error) {
	res, err := r.db.ExecContext(ctx, `DELETE FROM weplan.meetings WHERE id = $1`, id)
	if err != nil {
		return false, fmt.Errorf("delete meeting: %w", err)
	}
	aff, _ := res.RowsAffected()
	return aff > 0, nil
}

// ================================
// meeting_members (Postgres)
// ================================

func (r *PostgresMeetingRepo) AddMember(ctx context.Context, meetingID string, userID uuid.UUID, role string) error {
	if role == "" {
		role = "member"
	}

	query := `
		INSERT INTO weplan.meeting_members (id, meeting_id, user_id, role, images, created_at)
		VALUES ($1, $2, $3, $4, '[]'::jsonb, NOW())
		ON CONFLICT (meeting_id, user_id)
		DO UPDATE SET role = EXCLUDED.role
	`

	_, err := r.db.ExecContext(ctx, query, uuid.New(), meetingID, userID, role)
	if err != nil {
		return fmt.Errorf("add member: %w", err)
	}
	return nil
}

func (r *PostgresMeetingRepo) GetMemberRole(ctx context.Context, meetingID string, userID uuid.UUID) (string, error) {
	query := `
		SELECT role
		FROM weplan.meeting_members
		WHERE meeting_id = $1 AND user_id = $2
	`

	var role string
	err := r.db.QueryRowContext(ctx, query, meetingID, userID).Scan(&role)
	if err == sql.ErrNoRows {
		return "", nil
	}
	if err != nil {
		return "", fmt.Errorf("get member role: %w", err)
	}
	return role, nil
}

func (r *PostgresMeetingRepo) GetMeeting(ctx context.Context, meetingID string) ([]model.MeetingMember, error) {
	const q = `
		SELECT mm.meeting_id, u.user_id, mm.role, mm.images
		FROM weplan.meeting_members mm
		JOIN weplan.users u on mm.user_id = u.id
		WHERE mm.meeting_id = $1 
	`

	rows, err := r.db.QueryContext(ctx, q, meetingID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var res []model.MeetingMember
	for rows.Next() {
		var l model.MeetingMember

		if err := rows.Scan(
			&l.MeetingId,
			&l.UserId,
			&l.Role,
			&l.Images,
		); err != nil {
			return nil, err
		}
		res = append(res, l)
	}

	return res, nil

}

func (r *PostgresMeetingRepo) TotalAmount(ctx context.Context, meetingID string, totalAmount int32) (*model.MeetingTotalAmount, error) {
	if meetingID == "" {
		return nil, fmt.Errorf("meeting ID is empty")
	}

	query1 := `
		UPDATE weplan.meetings
		SET total_amount = $1, updated_at = $2
		WHERE id = $3
	`

	now := time.Now()
	res1, err := r.db.ExecContext(ctx, query1, totalAmount, now, meetingID)
	if err != nil {
		return nil, fmt.Errorf("update meetingTotal: %w", err)
	}
	aff, _ := res1.RowsAffected()
	if aff == 0 {
		return nil, nil
	}

	const query2 = `
	SELECT m.id AS meetingId, m.total_amount AS totalAmount, count(mm.id) AS memberCount, m.total_amount / NULLIF(COUNT(mm.id), 0) AS perPerson
	FROM weplan.meetings m
	JOIN weplan.meeting_members mm on m.id = mm.meeting_id
	WHERE m.id = $1
	GROUP BY m.id, m.total_amount;
	`
	var m model.MeetingTotalAmount
	err = r.db.QueryRowContext(ctx, query2, meetingID).Scan(
		&m.MeetingId,
		&m.TotalAmount,
		&m.MemberCount,
		&m.PerPerson,
	)

	if err != nil {
		log.Println("SET MEETINGTOTAL SQL ERROR:", err)
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &m, nil
}

// ===== Link (Postgres) =====

type PostgresLinkRepo struct {
	db *sql.DB
}

func NewPostgresLinkRepo(db *sql.DB) LinkRepository {
	return &PostgresLinkRepo{db: db}
}

func (r *PostgresLinkRepo) Create(ctx context.Context, l model.Link) (*model.Link, error) {
	if l.ID == "" {
		return nil, fmt.Errorf("link ID is empty")
	}

	if strings.TrimSpace(l.Images) == "" {
		l.Images = "[]"
	}

	query := `
		INSERT INTO weplan.links
			(id, meeting_id, url, title, memo, rating, category, latitude, longitude, images, created_at, updated_at)
		VALUES
			($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
			 $11, $12)
	`
	now := time.Now()
	if l.CreatedAt.IsZero() {
		l.CreatedAt = now
	}
	if l.UpdatedAt.IsZero() {
		l.UpdatedAt = now
	}

	_, err := r.db.ExecContext(ctx, query,
		l.ID,
		l.MeetingID,
		l.URL,
		l.Title,
		l.Memo,
		l.Rating,
		l.Category,
		derefFloat(l.Latitude),
		derefFloat(l.Longitude),
		l.Images,
		l.CreatedAt,
		l.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("insert link: %w", err)
	}

	return &l, nil
}
func (r *PostgresLinkRepo) FindByMeetingAndCategory(
	ctx context.Context,
	meetingID string,
	category string,
) ([]model.Link, error) {

	const q = `
		SELECT id, meeting_id, url, title, memo, rating, category, latitude, longitude, images,	created_at, updated_at
		FROM weplan.links
		WHERE meeting_id = $1
		AND category = $2
		ORDER BY created_at DESC
	`

	rows, err := r.db.QueryContext(ctx, q, meetingID, category)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var res []model.Link
	for rows.Next() {
		var l model.Link
		var lat, lng sql.NullFloat64

		if err := rows.Scan(
			&l.ID,
			&l.MeetingID,
			&l.URL,
			&l.Title,
			&l.Memo,
			&l.Rating,
			&l.Category,
			&lat,
			&lng,
			&l.Images,
			&l.CreatedAt,
			&l.UpdatedAt,
		); err != nil {
			return nil, err
		}

		if lat.Valid {
			l.Latitude = &lat.Float64
		}
		if lng.Valid {
			l.Longitude = &lng.Float64
		}

		res = append(res, l)
	}

	return res, nil
}

func (r *PostgresLinkRepo) FindByMeeting(ctx context.Context, meetingID string) ([]model.Link, error) {
	query := `
		SELECT id, meeting_id, url, title, memo, rating, category, latitude, longitude, images, created_at, updated_at
		FROM weplan.links
		WHERE meeting_id = $1
		ORDER BY created_at DESC
	`

	rows, err := r.db.QueryContext(ctx, query, meetingID)
	if err != nil {
		return nil, fmt.Errorf("find links by meeting: %w", err)
	}
	defer rows.Close()

	var res []model.Link
	for rows.Next() {
		var l model.Link
		var lat sql.NullFloat64
		var lng sql.NullFloat64
		var images string

		if err := rows.Scan(
			&l.ID,
			&l.MeetingID,
			&l.URL,
			&l.Title,
			&l.Memo,
			&l.Rating,
			&l.Category,
			&lat,
			&lng,
			&images,
			&l.CreatedAt,
			&l.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan link: %w", err)
		}

		if lat.Valid {
			l.Latitude = &lat.Float64
		}
		if lng.Valid {
			l.Longitude = &lng.Float64
		}
		l.Images = images

		res = append(res, l)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("find links rows: %w", err)
	}

	return res, nil
}

func (r *PostgresLinkRepo) GetByID(ctx context.Context, id string) (*model.Link, error) {
	query := `
		SELECT id, meeting_id, url, title, memo, rating, category, latitude, longitude, images, created_at, updated_at
		FROM weplan.links
		WHERE id = $1
	`

	var l model.Link
	var lat sql.NullFloat64
	var lng sql.NullFloat64
	var images string

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&l.ID,
		&l.MeetingID,
		&l.URL,
		&l.Title,
		&l.Memo,
		&l.Rating,
		&l.Category,
		&lat,
		&lng,
		&images,
		&l.CreatedAt,
		&l.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get link: %w", err)
	}

	if lat.Valid {
		l.Latitude = &lat.Float64
	}
	if lng.Valid {
		l.Longitude = &lng.Float64
	}
	l.Images = images

	return &l, nil
}

func (r *PostgresLinkRepo) UpdatePartial(ctx context.Context, id string, patch LinkPatch) (*model.Link, error) {
	if strings.TrimSpace(id) == "" {
		return nil, fmt.Errorf("id is empty")
	}

	sets := make([]string, 0, 10)
	args := make([]interface{}, 0, 12)
	n := 1

	if patch.URL != nil {
		sets = append(sets, fmt.Sprintf("url = $%d", n))
		args = append(args, *patch.URL)
		n++
	}
	if patch.Title != nil {
		sets = append(sets, fmt.Sprintf("title = $%d", n))
		args = append(args, *patch.Title)
		n++
	}
	if patch.Memo != nil {
		sets = append(sets, fmt.Sprintf("memo = $%d", n))
		args = append(args, *patch.Memo)
		n++
	}
	if patch.Rating != nil {
		sets = append(sets, fmt.Sprintf("rating = $%d", n))
		args = append(args, *patch.Rating)
		n++
	}
	if patch.Category != nil {
		sets = append(sets, fmt.Sprintf("category = $%d", n))
		args = append(args, *patch.Category)
		n++
	}
	if patch.Latitude != nil {
		sets = append(sets, fmt.Sprintf("latitude = $%d", n))
		args = append(args, *patch.Latitude)
		n++
	}
	if patch.Longitude != nil {
		sets = append(sets, fmt.Sprintf("longitude = $%d", n))
		args = append(args, *patch.Longitude)
		n++
	}
	if patch.Images != nil {
		sets = append(sets, fmt.Sprintf("images = NULLIF($%d,'')::jsonb", n))
		args = append(args, *patch.Images)
		n++
	}

	if len(sets) == 0 {
		return nil, fmt.Errorf("no fields to update")
	}

	sets = append(sets, "updated_at = NOW()")

	query := fmt.Sprintf(`
		UPDATE weplan.links
		SET %s
		WHERE id = $%d
	`, strings.Join(sets, ", "), n)

	args = append(args, id)

	res, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("update link: %w", err)
	}

	aff, _ := res.RowsAffected()
	if aff == 0 {
		return nil, nil
	}

	return r.GetByID(ctx, id)
}

func (r *PostgresLinkRepo) DeleteByID(ctx context.Context, id string) (bool, error) {
	res, err := r.db.ExecContext(ctx, `DELETE FROM weplan.links WHERE id = $1`, id)
	if err != nil {
		return false, fmt.Errorf("delete link: %w", err)
	}
	aff, _ := res.RowsAffected()
	return aff > 0, nil
}

// ===== Budget (Postgres) =====

type PostgresBudgetRepo struct {
	db *sql.DB
}

func NewPostgresBudgetRepo(db *sql.DB) BudgetRepository {
	return &PostgresBudgetRepo{db: db}
}

func (r *PostgresBudgetRepo) CreateItem(ctx context.Context, item model.BudgetItem) (*model.BudgetItem, error) {
	if item.ID == "" {
		return nil, fmt.Errorf("budget item ID is empty")
	}

	query := `
		INSERT INTO weplan.budget_items
			(id, meeting_id, name, amount, category, created_at, updated_at)
		VALUES
			($1, $2, $3, $4, $5, $6, $7)
	`
	now := time.Now()
	if item.CreatedAt.IsZero() {
		item.CreatedAt = now
	}
	if item.UpdatedAt.IsZero() {
		item.UpdatedAt = now
	}

	_, err := r.db.ExecContext(ctx, query,
		item.ID,
		item.MeetingID,
		item.Name,
		item.Amount,
		item.Category,
		item.CreatedAt,
		item.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("insert budget item: %w", err)
	}

	return &item, nil
}

func (r *PostgresBudgetRepo) FindByMeeting(ctx context.Context, meetingID string) ([]model.BudgetItem, error) {
	query := `
		SELECT id, meeting_id, name, amount, category, created_at, updated_at
		FROM weplan.budget_items
		WHERE meeting_id = $1
		ORDER BY created_at DESC
	`

	rows, err := r.db.QueryContext(ctx, query, meetingID)
	if err != nil {
		return nil, fmt.Errorf("find budget by meeting: %w", err)
	}
	defer rows.Close()

	var res []model.BudgetItem
	for rows.Next() {
		var it model.BudgetItem
		if err := rows.Scan(
			&it.ID,
			&it.MeetingID,
			&it.Name,
			&it.Amount,
			&it.Category,
			&it.CreatedAt,
			&it.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan budget item: %w", err)
		}
		res = append(res, it)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("find budget rows: %w", err)
	}

	return res, nil
}

func (r *PostgresBudgetRepo) UpsertLeader( // 있으면 update 아님 insert
	ctx context.Context,
	item model.BudgetLeader,
) (*model.BudgetLeader, error) {

	if item.MeetingID == "" {
		return nil, fmt.Errorf("budget leader meeting_id is empty")
	}

	now := time.Now()
	if item.CreatedAt.IsZero() {
		item.CreatedAt = now
	}
	item.UpdatedAt = now

	query := `
		INSERT INTO weplan.budget_leader
			(meeting_id, user_id, bank, acount, created_at, updated_at)
		VALUES
			($1, $2, $3, $4, $5, $6)
		ON CONFLICT (meeting_id)
		DO UPDATE SET
			user_id    = EXCLUDED.user_id,
			bank       = EXCLUDED.bank,
			acount     = EXCLUDED.acount,
			updated_at = EXCLUDED.updated_at
	`

	_, err := r.db.ExecContext(ctx, query,
		item.MeetingID,
		item.UserID,
		item.Bank,
		item.Acount,
		item.CreatedAt,
		item.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("upsert budget leader: %w", err)
	}

	return &item, nil
}

func (r *PostgresBudgetRepo) FindLeader(ctx context.Context, meetingID string) ([]model.BudgetLeader, error) {
	query := `
		SELECT meeting_id, user_id, bank, acount, created_at, updated_at
		FROM weplan.budget_leader
		WHERE meeting_id = $1
	`

	rows, err := r.db.QueryContext(ctx, query, meetingID)
	if err != nil {
		return nil, fmt.Errorf("find budget by meeting: %w", err)
	}
	defer rows.Close()

	var res []model.BudgetLeader
	for rows.Next() {
		var it model.BudgetLeader
		if err := rows.Scan(
			&it.MeetingID,
			&it.UserID,
			&it.Bank,
			&it.Acount,
			&it.CreatedAt,
			&it.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan budget leader: %w", err)
		}
		res = append(res, it)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("find budget leader rows: %w", err)
	}

	return res, nil
}

func (r *PostgresBudgetRepo) CalculateSummary(ctx context.Context, meetingID string, memberCount int32) (*model.BudgetSummary, error) {
	query := `
		SELECT COALESCE(SUM(amount), 0)
		FROM weplan.budget_items
		WHERE meeting_id = $1
	`

	var total int32
	if err := r.db.QueryRowContext(ctx, query, meetingID).Scan(&total); err != nil {
		return nil, fmt.Errorf("calc budget summary: %w", err)
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

func (r *PostgresBudgetRepo) GetItemByID(ctx context.Context, id string) (*model.BudgetItem, error) {
	query := `
		SELECT id, meeting_id, name, amount, category, created_at, updated_at
		FROM weplan.budget_items
		WHERE id = $1
	`

	var it model.BudgetItem
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&it.ID,
		&it.MeetingID,
		&it.Name,
		&it.Amount,
		&it.Category,
		&it.CreatedAt,
		&it.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get budget item: %w", err)
	}
	return &it, nil
}

func (r *PostgresBudgetRepo) UpdateItemPartial(ctx context.Context, id string, patch BudgetItemPatch) (*model.BudgetItem, error) {
	if strings.TrimSpace(id) == "" {
		return nil, fmt.Errorf("id is empty")
	}

	sets := make([]string, 0, 6)
	args := make([]interface{}, 0, 8)
	n := 1

	if patch.Name != nil {
		sets = append(sets, fmt.Sprintf("name = $%d", n))
		args = append(args, *patch.Name)
		n++
	}
	if patch.Amount != nil {
		sets = append(sets, fmt.Sprintf("amount = $%d", n))
		args = append(args, *patch.Amount)
		n++
	}
	if patch.Category != nil {
		sets = append(sets, fmt.Sprintf("category = $%d", n))
		args = append(args, *patch.Category)
		n++
	}

	if len(sets) == 0 {
		return nil, fmt.Errorf("no fields to update")
	}

	sets = append(sets, "updated_at = NOW()")

	query := fmt.Sprintf(`
		UPDATE weplan.budget_items
		SET %s
		WHERE id = $%d
	`, strings.Join(sets, ", "), n)

	args = append(args, id)

	res, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("update budget item: %w", err)
	}

	aff, _ := res.RowsAffected()
	if aff == 0 {
		return nil, nil
	}

	return r.GetItemByID(ctx, id)
}

func (r *PostgresBudgetRepo) DeleteItemByID(ctx context.Context, id string) (bool, error) {
	res, err := r.db.ExecContext(ctx, `DELETE FROM weplan.budget_items WHERE id = $1`, id)
	if err != nil {
		return false, fmt.Errorf("delete budget item: %w", err)
	}
	aff, _ := res.RowsAffected()
	return aff > 0, nil
}

// ---- helpers ----

func derefTime(t *time.Time) time.Time {
	if t == nil {
		return time.Time{}
	}
	return *t
}

func derefFloat(f *float64) float64 {
	if f == nil {
		return 0
	}
	return *f
}

type PostgresBasePointRepo struct {
	db *sql.DB
}

func NewPostgresBasePointRepo(db *sql.DB) BasePointRepository {
	return &PostgresBasePointRepo{db: db}
}

func (r *PostgresBasePointRepo) GetByMeeting(
	ctx context.Context,
	meetingID string,
) (*BasePoint, error) {

	row := r.db.QueryRowContext(ctx, `
		SELECT
			id,
			meeting_id,
			link_id,
			latitude,
			longitude,
			category,
			title,
			updated_at
		FROM weplan.meeting_base_points
		WHERE meeting_id = $1
	`, meetingID)

	var bp BasePoint
	err := row.Scan(
		&bp.ID,
		&bp.MeetingID,
		&bp.LinkID,
		&bp.Latitude,
		&bp.Longitude,
		&bp.Category,
		&bp.Title,
		&bp.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &bp, nil
}

func (r *PostgresBasePointRepo) GetByMeetingAndCategory(
	ctx context.Context,
	meetingID string,
	category string,
) (*BasePoint, error) {

	row := r.db.QueryRowContext(ctx, `
		SELECT
			id,
			meeting_id,
			link_id,
			latitude,
			longitude,
			category,
			title,
			updated_at
		FROM weplan.meeting_base_points
		WHERE meeting_id = $1 AND category = $2
	`, meetingID, category)

	var bp BasePoint
	err := row.Scan(
		&bp.ID,
		&bp.MeetingID,
		&bp.LinkID,
		&bp.Latitude,
		&bp.Longitude,
		&bp.Category,
		&bp.Title,
		&bp.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &bp, nil
}

func (r *PostgresBasePointRepo) Upsert(
	ctx context.Context,
	bp *BasePoint,
) error {
	log.Printf("[postgres_repo][Upsert] bp=%s", bp)
	_, err := r.db.ExecContext(ctx, `
		INSERT INTO weplan.meeting_base_points
			(id, meeting_id, link_id, latitude, longitude, category, title, updated_at)
		VALUES
			($1, $2, $3, $4, $5, $6, $7, NOW())
		ON CONFLICT (meeting_id)
		DO UPDATE SET
			link_id   = EXCLUDED.link_id,
			latitude  = EXCLUDED.latitude,
			longitude = EXCLUDED.longitude,
			category  = EXCLUDED.category,
			title     = EXCLUDED.title,
			updated_at = NOW()
	`,
		bp.ID,
		bp.MeetingID,
		bp.LinkID,
		bp.Latitude,
		bp.Longitude,
		bp.Category,
		bp.Title,
	)

	return err
}

func (r *PostgresBasePointRepo) ClearLinkRef(
	ctx context.Context,
	meetingID string,
	linkID string,
) error {

	_, err := r.db.ExecContext(ctx, `
		UPDATE weplan.meeting_base_points
		SET link_id = NULL
		WHERE meeting_id = $1
		  AND link_id = $2
	`, meetingID, linkID)

	return err
}
