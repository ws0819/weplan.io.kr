package db

import (
    "database/sql"
    "fmt"
    "os"

    _ "github.com/lib/pq"
)

type PostgresConfig struct {
    Host     string
    Port     string
    User     string
    Password string
    DBName   string
    SSLMode  string
}

func LoadPostgresConfig() PostgresConfig {
    return PostgresConfig{
        Host:     os.Getenv("DB_HOST"),
        Port:     os.Getenv("DB_PORT"),
        User:     os.Getenv("DB_USER"),
        Password: os.Getenv("DB_PASSWORD"),
        DBName:   os.Getenv("DB_NAME"),
        SSLMode:  "disable",
    }
}

func (c PostgresConfig) ConnString() string {
    return fmt.Sprintf(
        "host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
        c.Host, c.Port, c.User, c.Password, c.DBName, c.SSLMode,
    )
}

func NewPostgres() (*sql.DB, error) {
    cfg := LoadPostgresConfig()

    db, err := sql.Open("postgres", cfg.ConnString())
    if err != nil {
        return nil, err
    }

    if err := db.Ping(); err != nil {
        return nil, err
    }

    return db, nil
}
