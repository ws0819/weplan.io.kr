# WEPLAN

Go 기반 통합 백엔드 서버 프로젝트

---

## 📌 프로젝트 개요

**WEPLAN**은 모임·일정·예산 관리 서비스를 목표로 한 백엔드 서버 프로젝트입니다.
REST API, gRPC, WebSocket을 함께 제공하는 멀티 프로토콜 구조로 설계되었으며,
인증·실시간 통신·운영 환경까지 고려한 서버 아키텍처를 직접 구현했습니다.

본 프로젝트는 **실 서비스 수준의 구조 설계와 기술 선택 근거를 명확히 보여주는 것을 목표**로 합니다.

---

## 🧩 기술 스택

* **Language**: Go
* **Framework**: Echo
* **API**: REST, gRPC, grpc-gateway
* **Real-time**: WebSocket (Gorilla)
* **Auth**: JWT
* **Database**: PostgreSQL
* **Web Server / Proxy**: Caddy
* **Infra**: Docker
* **OS**: Ubuntu (AWS EC2 기준)

---

## 🏗 아키텍처 개요

```
Client (Web / Mobile)
        |
        | HTTP / WebSocket
        v
+-------------------+
|      Caddy        |  ← HTTPS / Reverse Proxy
+-------------------+
        |
        v
+-------------------+
|   API Gateway     |  ← Echo (REST)
+-------------------+
        |
        | grpc-gateway
        v
+-------------------+
|   gRPC Services   |
+-------------------+
        |
        v
+-------------------+
|   Service Layer   |
+-------------------+
        |
        v
+-------------------+
| Repository (DB)   |  ← PostgreSQL
+-------------------+
```

---

## 🔑 주요 기능

### 1. REST + gRPC 통합 API

* Protobuf 기반으로 gRPC API 정의
* grpc-gateway를 사용하여 REST API 자동 노출
* 단일 비즈니스 로직을 다중 프로토콜에서 재사용

### 2. WebSocket 실시간 통신

* Gorilla WebSocket 사용
* 모임 단위 메시지 브로드캐스트 구조 구현
* 세션 관리 및 연결 수명 주기 제어

### 3. 인증 시스템

* JWT 기반 인증/인가 처리
* Echo Middleware로 인증 공통화
* API 및 WebSocket 인증 분리 처리

### 4. 운영 및 배포 환경

* Caddy 기반 HTTPS 및 Reverse Proxy 구성
* Docker / Docker Compose로 로컬·배포 환경 통일
* 서비스 단위 컨테이너 실행 구조

---

## 🧠 설계 의도

* **프로토콜 분리**: REST / gRPC / WebSocket을 명확히 분리하여 확장성 확보
* **계층 분리**: Transport → Service → Repository 구조로 테스트 및 유지보수 용이
* **운영 고려**: 인증, 프록시, 컨테이너 환경을 초기 설계 단계부터 포함

---

## 📎 프로젝트 목적

* Go 기반 서버 아키텍처 설계 역량 증명
* gRPC + REST + 실시간 통신 통합 경험 정리
* 운영·배포까지 고려한 백엔드 시스템 설계 능력 표현

---
