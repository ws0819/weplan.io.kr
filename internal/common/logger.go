package common

import (
	"log"
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var Logger *zap.Logger

func InitLogger() {
	cfg := zap.NewProductionConfig()

	if os.Getenv("APP_ENV") == "local" {
		cfg = zap.NewDevelopmentConfig()
	}

	l, err := cfg.Build(zap.AddStacktrace(zapcore.ErrorLevel))
	if err != nil {
		log.Fatalf("failed to initialize zap logger: %v", err)
	}

	Logger = l
}

func L() *zap.Logger {
	if Logger == nil {
		InitLogger()
	}
	return Logger
}
