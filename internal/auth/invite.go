package auth

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// InviteClaims is used for meeting invite tokens.
// It is intentionally separate from access-token Claims.
type InviteClaims struct {
	MeetingID string `json:"meetingId"`
	jwt.RegisteredClaims
}

func GenerateInviteToken(meetingID, secret string, ttl time.Duration) (string, error) {
	claims := &InviteClaims{
		MeetingID: meetingID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(ttl)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

func ParseInviteToken(tokenStr, secret string) (*InviteClaims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &InviteClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := token.Claims.(*InviteClaims); ok && token.Valid {
		return claims, nil
	}
	return nil, jwt.ErrTokenInvalidClaims
}
