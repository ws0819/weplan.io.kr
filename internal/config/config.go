package config

import (
	"log"
	"os"
)

type Config struct {
	AppEnv    string
	HTTPPort  string
	GRPCPort  string
	JWTSecret string

	GoogleClientID string

	RedisAddr string

	KakaoRestKey     string
	KakaoRedirectURI string
	KakaoClientId    string
}

func Load() *Config {
	cfg := &Config{
		AppEnv:    getEnv("APP_ENV", ""),
		HTTPPort:  getEnv("HTTP_PORT", ""),
		GRPCPort:  getEnv("GRPC_PORT", ""),
		JWTSecret: getEnv("JWT_SECRET", ""),

		GoogleClientID: getEnv("GOOGLE_CLIENT_ID", ""),

		RedisAddr: getEnv("REDIS_ADDR", ""),

		KakaoRestKey:     getEnv("KAKAO_REST_KEY", ""),
		KakaoRedirectURI: getEnv("KAKAO_REDIRECT_URL", ""),
		KakaoClientId:    getEnv("KAKAO_CLIENT_ID", ""),
	}

	if cfg.JWTSecret == "change-me" && cfg.AppEnv == "production" {
		log.Println("[WARN] JWT_SECRET is default in production")
	}
	return cfg
}

func getEnv(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}
