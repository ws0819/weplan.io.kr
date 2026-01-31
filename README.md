# WEPLAN
> 여행과 모임계획을 한번에 관리하는 협업형 플래너 서비스

---
## 목차
- 프로젝트 소개
- 주요 기능
- 기술 스택
- 프로젝트 구조
---
## 프로젝트 소개

### 기획 배경
> 모임이나 여행을 계획할 때마다 겪는 불편함을 해결하기 위해 시작했습니다:

1. 링크 관리의 어려움: 카톡/디스코드에 쏟아지는 숙소, 맛집 링크를 찾기 위해 스크롤을 수없이 올렸다 내렸다 반복
2. 동선 파악의 번거로움: 숙소 기준으로 A vs B 어디가 더 가까운지, 일일이 지도 앱을 켜서 확인
3. 예산 계산의 복잡함: 총 얼마가 필요하고, 각자 얼마씩 내야 하는지 매번 계산

### 프로젝트 기간
2024.12 ~ 2025.01 (약 2개월)
---
## 주요 기능

1. 링크 스크랩을 통한 일정관리
- 링크 스크랩시 해당 링크의 메타데이터를 복사하여, 링크의 이미지, 타이틀을 자동추출
- 메모 및 별점 추가기능
- 카테고리 필터링

2. 지도기반 동선관리
- 카카오 맵 API 연동
- 기준점 대비 직선거리 자동 계산 및 시각화
- 저장된 링크를 지도에 핀으로 표시

3. 예산 관리
- 항목별 예산 입력 (숙소, 식비, 교통비 등)
- 파이차트로 지출 비율 시각화
- 총액 / 인원수 = 1인당 금액 자동 계산
- 실시간 예산 업데이트

4. 실시간 협업
- WebSocket 기반 다중 사용자 동시 편집
- 링크 추가/수정/삭제 실시간 동기화
- 예산 변경사항 즉시 반영
- Tanstack Query와 통합한 낙관적 업데이트

5. 소셜 로그인
- Google OAuth 2.0
- Kakao OAuth 2.0
- ID Token 기반 인증 시스템
---
## 프론트엔드 기술 스택

#### Core
- **React 19.2** + **TypeScript**
- **Vite**: 빠른 개발 서버 및 HMR, 최적화된 프로덕션 빌드

#### Styling
- **TailwindCSS 4.0**: 유틸리티 우선 CSS 라이브러리

#### State Management
- **Zustand**: 전역 상태 관리 (사용자 인증 정보)
- **Tanstack Query (React Query)**: 서버 상태 관리 및 캐싱 최적화

#### Data Fetching & Real-time
- **Axios**: HTTP 클라이언트 (중앙화된 인스턴스, 자동 토큰 주입)
- **WebSocket API**: 실시간 협업 기능

#### Routing
- **React Router v6**: SPA 라우팅

#### External APIs & Libraries
- **Recharts**: 예산 비율 파이차트 시각화
- **Kakao Maps API**: 지도 표시 및 거리 계산
- **Google OAuth 2.0 / Kakao OAuth**: 소셜 로그인
- **Lottie**: 로딩 애니메이션
- **React Helmet Async**: SEO 메타 태그 관리
- **SweetAlert2**: 사용자 친화적 알림 모달

---
## 프로젝트 구조

```
src/
├── app/                     # 공통 레이아웃 및 라우팅             
│   ├── layout/              # Header, Footer, Sidebar 등
│   ├── Root.tsx             # 루트 레이아웃 (조건부 레이아웃 분기)
│   └── main.tsx             # 앱 진입점
│
├── feature/                 # 기능별 모듈 (Feature-Sliced Design)
│   ├── schedule/            # 일정 관리
│   │   ├── components/      # UI 컴포넌트 (CardItems, TabNavigate 등)
│   │   ├── api/             # API 호출 (Tanstack Query hooks)
│   │   ├── hooks/           # 커스텀 훅 (useWebSocket 등)
│   │   ├── utils/           # 유틸 함수
│   │   ├── constants/       # 상수 관리
│   │   └── types/           # 타입 정의
│   │
│   ├── budget/              #  예산 관리
│   ├── map/                 #  지도 기능
│   ├── login/               #  인증 (소셜 로그인)
│   ├── mygroup/             #  모임 목록
│   ├── mypage/              #  마이페이지
│   ├── settings/            #  모임 관리
│   ├── onboard/             #  온보딩 페이지
│   ├── callback/            #  OAuth 리다이렉트
│   └── invite/              #  초대 처리
│
├── shared/                  # 공용 모듈
│   ├── assets/              # 정적 파일 (이미지, 아이콘)
│   ├── components/          # 재사용 컴포넌트 (Button, Modal, SEO 등)
│   ├── hooks/               # 공용 훅 (useNumberFormat, useDebounce)
│   ├── utils/               # 유틸 함수 (날짜 포맷, 검증 등)
│   └── store/               # Zustand 스토어 (인증, 사용자)
│
└── types/                   # 전역 타입 정의
```
---
### 설계 원칙

- **Feature-Sliced Design**: 기능별로 독립적인 모듈 구성
- **Single Responsibility Principle**: 컴포넌트 단일 책임 원칙 준수
- **Custom Hooks 분리**: 비즈니스 로직과 UI 분리
---
