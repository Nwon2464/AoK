# 로컬 백엔드 실행 환경

이 프로젝트는 **실제 Twitch API**, **5분 메모리 캐시**, **로컬 Mock 데이터**를 함께 사용할 수 있습니다.

## 1. 환경변수 준비

```bash
cp .env.example .env
npm install
npm run check:env
```

`.env`에는 실제 비밀값을 입력하고 Git에 올리지 않습니다.

### 필수 설정

- `MONGO_URI`: MongoDB 연결 주소
- `COOKIE_KEY`: 세션 쿠키 암호화 키
- `JWT_SECRET`: JWT 서명 키

### 선택 설정

- `CLIENT_ID`, `CLIENT_SECRET`: 실제 Twitch API를 사용할 때 필요
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: Google 로그인을 사용할 때 필요
- `GOOGLE_CALLBACK`: 로컬에서는 `http://localhost:5000/auth/google/redirect`
- `CLIENT_URL`: Google 인증 완료 후 돌아올 클라이언트 주소. 로컬에서는 `http://localhost:3000`

Twitch와 Google 설정은 각각 두 값을 모두 입력하거나 모두 비워야 합니다. Mock API만 사용할 때 Twitch 설정은 비워도 됩니다.

### Google Cloud Console 설정

OAuth 클라이언트의 **승인된 리디렉션 URI**에 다음 값을 정확히 추가합니다.

```text
http://localhost:5000/auth/google/redirect
```

프로토콜, 호스트, 포트, 경로와 마지막 슬래시 유무까지 `GOOGLE_CALLBACK` 값과 같아야 합니다. 운영 환경에서는 실제 HTTPS 서버 callback과 실제 클라이언트 주소를 각각 `GOOGLE_CALLBACK`, `CLIENT_URL`에 설정합니다.

## 2. 서버 실행

```bash
npm run dev
```

기본 주소는 `http://localhost:5000`입니다.

## 3. 실제 Twitch API 사용

`.env`에 `CLIENT_ID`와 `CLIENT_SECRET`을 설정한 후 아래 주소를 호출합니다.

```text
GET /api/v1/twitch/topgames
GET /api/v1/twitch/channels
GET /api/v1/twitch/streams/:gameId
GET /api/v1/twitch/streams/user/:userId
GET /api/v1/categories/all
GET /api/v1/videos/:userId
GET /api/v1/tstreams
```

Twitch 앱 토큰은 만료 전까지 재사용합니다. 인기 게임, 카테고리, 사용자 영상 결과는 서버 메모리에 5분간 캐시됩니다. 서버를 재시작하면 캐시는 초기화됩니다.

## 4. Mock 데이터 사용

Mock API는 Twitch 자격증명이나 인터넷 연결 없이 사용할 수 있습니다.

```text
GET /api/v1/twitch
GET /api/v1/twitch/streams
GET /api/v1/twitch/minecraft
GET /api/v1/twitch/fortnite
GET /api/v1/twitch/chat
GET /api/v1/twitch/fallguys
```

화면을 빠르게 개발할 때는 Mock API를 사용하고, 실제 연동과 응답 형태를 확인할 때는 Live API를 사용합니다.

## 5. 권장 개발 순서

```text
화면 개발       → Mock API
실제 연동 확인  → Twitch Live API
반복 조회 감소  → 현재 메모리 캐시
운영 규모 확장  → 추후 Redis 검토
```
