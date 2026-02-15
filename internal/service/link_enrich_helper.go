package service

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"WEPLAN/internal/config"

	"golang.org/x/net/html"
)

// =======================
// 결과 구조체
// =======================
type EnrichedLink struct {
	Title     string
	Thumbnail string
	Latitude  *float64
	Longitude *float64
}

// =======================
// 엔트리 함수 (LinkService가 호출)
// =======================
func EnrichLink(
	ctx context.Context,
	targetURL string,
	cfg *config.Config,
) (*EnrichedLink, error) {

	targetURL = strings.TrimSpace(targetURL)
	if targetURL == "" {
		return nil, errors.New("empty url")
	}

	log.Printf("[ENRICH] start url = %s", targetURL)

	// 1) HTML fetch
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, targetURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", "Mozilla/5.0")

	client := &http.Client{Timeout: 7 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	log.Printf("[ENRICH] http status = %d", resp.StatusCode)

	// 2) HTML meta parsing
	title, thumbnail, address, err := parseHTMLMeta(resp.Body)
	if err != nil {
		return nil, err
	}

	log.Printf(
		"[ENRICH] parsed meta title = %s thumbnail = %s address = %s",
		title,
		thumbnail,
		address,
	)

	// 3) Kakao Local API (address → title fallback)
	var latPtr, lngPtr *float64

	if strings.TrimSpace(cfg.KakaoRestKey) == "" {
		log.Printf("[ENRICH] KakaoRestKey is EMPTY (skip kakao api)")
	} else {
		query := strings.TrimSpace(address)

		if query == "" {
			query = strings.TrimSpace(title)
			log.Printf("[ENRICH] address empty → fallback to title query = %s", query)
		}

		if query != "" {
			lat, lng := callKakaoLocal(query, cfg.KakaoRestKey)
			if lat != 0 && lng != 0 {
				latPtr = &lat
				lngPtr = &lng
				log.Printf("[ENRICH] kakao result lat=%f lng=%f", lat, lng)
			} else {
				log.Printf("[ENRICH] kakao result EMPTY")
			}
		} else {
			log.Printf("[ENRICH] no query available for kakao search")
		}
	}

	log.Printf(
		"[ENRICH] final result latPtr nil? %v lngPtr nil? %v",
		latPtr == nil,
		lngPtr == nil,
	)

	return &EnrichedLink{
		Title:     title,
		Thumbnail: thumbnail,
		Latitude:  latPtr,
		Longitude: lngPtr,
	}, nil
}

// =======================
// HTML META 파싱
// =======================
func parseHTMLMeta(r io.Reader) (title string, thumbnail string, address string, err error) {
	z := html.NewTokenizer(r)

	var docTitle string
	for {
		tt := z.Next()
		switch tt {
		case html.ErrorToken:
			if title == "" {
				title = strings.TrimSpace(docTitle)
			}
			return strings.TrimSpace(title), strings.TrimSpace(thumbnail), strings.TrimSpace(address), nil

		case html.StartTagToken, html.SelfClosingTagToken:
			t := z.Token()
			tag := strings.ToLower(t.Data)

			// <title>
			if tag == "title" && tt == html.StartTagToken {
				if z.Next() == html.TextToken {
					docTitle = strings.TrimSpace(string(z.Text()))
				}
				continue
			}

			if tag != "meta" {
				continue
			}

			var prop, name, content string
			for _, a := range t.Attr {
				switch strings.ToLower(a.Key) {
				case "property":
					prop = strings.ToLower(a.Val)
				case "name":
					name = strings.ToLower(a.Val)
				case "content":
					content = strings.TrimSpace(a.Val)
				}
			}

			if title == "" && prop == "og:title" && content != "" {
				title = content
				log.Printf("[ENRICH][META] og:title = %s", title)
			}
			if thumbnail == "" && prop == "og:image" && content != "" {
				thumbnail = content
				log.Printf("[ENRICH][META] og:image = %s", thumbnail)
			}
			if address == "" && (prop == "place:location:address" || name == "place:location:address") {
				address = content
				log.Printf("[ENRICH][META] address = %s", address)
			}
		}
	}
}

// =======================
// Kakao Local API
// =======================
func callKakaoLocal(query string, kakaoRestKey string) (float64, float64) {
	q := strings.TrimSpace(query)
	if q == "" || strings.TrimSpace(kakaoRestKey) == "" {
		return 0, 0
	}

	endpoint := "https://dapi.kakao.com/v2/local/search/keyword.json?query=" + url.QueryEscape(q)

	req, err := http.NewRequest(http.MethodGet, endpoint, nil)
	if err != nil {
		return 0, 0
	}
	req.Header.Set("Authorization", "KakaoAK "+strings.TrimSpace(kakaoRestKey))

	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return 0, 0
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		log.Printf("[ENRICH][KAKAO] http error status=%d", resp.StatusCode)
		return 0, 0
	}

	var out struct {
		Documents []struct {
			X string `json:"x"` // longitude
			Y string `json:"y"` // latitude
		} `json:"documents"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return 0, 0
	}
	if len(out.Documents) == 0 {
		return 0, 0
	}

	lat, _ := strconv.ParseFloat(out.Documents[0].Y, 64)
	lng, _ := strconv.ParseFloat(out.Documents[0].X, 64)
	return lat, lng
}
