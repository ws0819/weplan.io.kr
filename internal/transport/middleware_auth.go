package transport

import (
	"net/http"
	"strings"

	"WEPLAN/internal/auth"
	"WEPLAN/internal/config"

	"github.com/labstack/echo/v4"
)

func JWTMiddleware(cfg *config.Config) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {

			// ✅ auth 관련 엔드포인트는 JWT 검사 제외 (ZIP 기준 /api/v1/auth/google 사용)
			reqPath := c.Request().URL.Path
			if strings.HasPrefix(reqPath, "/api/v1/auth/") {
				return next(c)
			}

			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return c.JSON(http.StatusUnauthorized, ErrorResponse{
					Message: "missing Authorization header",
				})
			}

			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
				return c.JSON(http.StatusUnauthorized, ErrorResponse{
					Message: "invalid Authorization header format",
				})
			}

			claims, err := auth.ParseToken(parts[1], cfg.JWTSecret)
			if err != nil {
				return c.JSON(http.StatusUnauthorized, ErrorResponse{
					Message: "invalid or expired token",
				})
			}

			// 컨텍스트에 userId 저장
			c.Set("userId", claims.UserID)

			return next(c)
		}
	}
}
