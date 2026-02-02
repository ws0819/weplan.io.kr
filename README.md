# WEPLAN ✈️
> 여행과 모임의 링크, 일정, 예산을 한곳에서 관리하는 협업형 플래너 서비스

---
## 🔗Links
- **배포 URL** : https://weplan.io.kr
--- 


## 프로젝트 소개
### 프로젝트 명
WEPLAN

### 기간
2025.12 ~ 2026.01

### 기획 배경
모임이나 여행을 계획할때마다 카톡, 디스코드 등에서 계획 얘기를 하다보면,
늘 쏟아지는 링크들 중 한 가지를 정하기 위해 스크롤을 위 아래로 올렸다 내렸다하기 수차례였습니다.
또한, 숙소를 기준으로 어느 여행지는 멀고 어느 여행지는 가깝고 까지 일일히 구글 맵을 켜서 찾아야했죠,
이 서비스는 이러한 불편함을 해소하고 한 눈에 여행, 모임 일정을 관리하기 위해 만들어졌습니다. 

### 주요기능
- 🔗 **링크 스크랩** : URL 메타태그 기반 자도 썸네일, 타이틀 추출, 메모 및 별점도 추가할 수 있는 기능입니다.
- 🗺️ **지도 기반 동선관리** : 카카오 맵 연동, 기준점 대비 직선거리를 시각화 할 수 있습니다.
- 💵 **예산 관리** : 항목별 예산 입력, 파이차트시각화, 총 예산대비 남은 예산 계산
- 🔃 **실시간 협업** : WebSocket 기반 다중 사용자 동시 편집기능

---
## 🛠️ 기술 스택

### Frontend

#### Core
- **React 19.2** + **TypeScript** : 컴포넌트 기반 UI, 타입안정성
- **Vite** : 빠른 개발 서버 및 HMR

#### Styling
- **TailwindCSS 4.0** : 빠른 개발 및 유틸리티 우선 스타일링

#### State Management
- **Tanstack Query** : 서버 상태 관리 및 캐싱 최적화
- **Zustand** : 전역 상태관리 (사용자 정보)

#### Data Fetching & Real-time
- **axios** : HTTP 클라이언트
- **WebSocket** : 실시간 협업 기능

#### Routing
- **React Router** : SPA 라우팅

#### External APIs & Libraries
- **rechart** : 예산 비율 파이차트 시각화
- **KaKao Maps API** : 지도 표시 및 거리계산
- **Google OAuth** : 소셜로그인

#### UI / UX
- **lottie** : 로딩 애니메이션
- **react-helmet** : SEO 메타 태그관리
- **sweetalert2** : 사용자 친화적 알림모달

---

## 프로젝트 구조

```
src/
├── app                  # 공통 레이아웃 및 라우팅             
├── feature/             # 기능별 모듈 (Feature-Sliced Design)
│   ├── schedule/        # 일정 관리
│   │   ├── components/  # UI 컴포넌트
│   │   ├── api/         # API 호출 (Tanstack Query)
│   │   ├── hooks/       # 커스텀 훅
│   │   ├── utill/       # 유틸함수
│   │   ├── constants/   # 상수 관리
│   │   └── types/       # 타입 정의
│   ├── budget/          # 예산 관리
│   ├── callback/        # 로그인 리다이렉트
│   ├── invite/          # 초대받은 유저 리다이렉트
│   ├── mypage/          # 마이페이지
│   ├── settings/        # 모임 관리
│   ├── onboard/         # 온보딩 페이지
│   ├── map/             # 지도 기능
│   ├── login/           # 인증 (로그인)
│   └── mygroup/         # 모임 목록
├── shared/              # 공용 모듈
│   ├── assets/          # 정적 파일
│   ├── components/      # 재사용 컴포넌트
│   ├── hooks/           # 공용 훅 (useNumberFormat 등)
│   ├── utils/           # 유틸 함수
│   └── store/           # Zustand store (인증, 사용자)
└── types                # 전역 타입
```
---

## 회고

### 잘한점
- **동적 스크리핑** : 동적 스크리핑을 통한 최적화로 전역에서 150KB의 용량 절감
- **WebSocket 실시간 협업** : 웹 소켓을 통한 실시간 협업 및 UI를 통한 실시간 작업 알림
- **컴포넌트 분리** : 단일 책임원칙에 따른 컴포넌트 분리
 
### 아쉬운점
- **한정적인 링크 데이터**: 링크 데이터 복사시 다른 플랫폼이 아닌 오로지 카카오 맵에서 복사한 링크만 latitude,longitude가 받아와졌기 때문에 서비스의 설계를 더욱 확장시키지 못한점
- **일관되지 않은 UI** : UI디자인가 일관되지 못하여 작업중에 컴포넌트를 만들고 사용한 점


### 개선계획
