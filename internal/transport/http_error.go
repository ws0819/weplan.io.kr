package transport

import (
	"WEPLAN/internal/common"
	"net/http"

	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

type ErrorResponse struct {
	Message string `json:"message"`
	Detail  string `json:"detail,omitempty"`
}

func JSONErrorHandler(err error, c echo.Context) {
	report := ErrorResponse{
		Message: "internal server error",
		Detail:  err.Error(),
	}

	common.L().Error("http request failed",
		zap.String("path", c.Path()),
		zap.String("method", c.Request().Method),
		zap.Error(err),
	)

	_ = c.JSON(http.StatusInternalServerError, report)
}
