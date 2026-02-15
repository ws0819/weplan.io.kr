package repository

import (
	"context"
	"database/sql"
	"github.com/google/uuid"
)

type User struct {
	ID      uuid.UUID
	UserID  string
	Name    string
	Email   string
	Picture string
}

type UserRepository interface {
	GetByUserID(ctx context.Context, userID string) (*User, error)
	Create(ctx context.Context, userID, name, email, picture string) (*User, error)
}

type PostgresUserRepo struct {
	db *sql.DB
}

func NewPostgresUserRepo(db *sql.DB) *PostgresUserRepo {
	return &PostgresUserRepo{db: db}
}

func (r *PostgresUserRepo) GetByUserID(ctx context.Context, userID string) (*User, error) {
	row := r.db.QueryRowContext(
		ctx,
		`SELECT id, user_id, name, email, picture FROM weplan.users WHERE user_id = $1`,
		userID,
	)
	var u User
	if err := row.Scan(&u.ID, &u.UserID, &u.Name, &u.Email, &u.Picture); err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *PostgresUserRepo) Create(ctx context.Context, userID string, name string, email string, picture string) (*User, error) {
	id := uuid.New()
	_, err := r.db.ExecContext(
		ctx,
		`INSERT INTO weplan.users (id, user_id, name, email, picture) VALUES ($1, $2, $3, $4, $5)`,
		id, userID, name, email, picture,
	)
	if err != nil {
		return nil, err
	}

	return &User{
		ID:     id,
		UserID: userID,
		Name:   name,
		Email:  email,
		Picture:picture,
	}, nil
}
