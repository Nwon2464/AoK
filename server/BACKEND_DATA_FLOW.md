# 백엔드 데이터 흐름

## 한 줄 요약

프론트엔드의 요청을 **Route가 받고**, **Controller와 Service가 처리한 뒤**, 필요한 데이터를 Twitch 또는 MongoDB에서 가져와 JSON으로 돌려줍니다.

## Twitch 데이터 조회

```text
프론트엔드
  → Route (요청 주소 확인)
  → Controller (요청값 전달)
  → Service (필요한 작업 결정)
  → Client (Twitch API 호출)
  → Mapper (화면에서 쓰기 편하게 데이터 정리)
  → Controller
  → 프론트엔드에 JSON 응답
```

각 부분을 음식점에 비유하면 다음과 같습니다.

- **Route**: 주문을 받을 창구
- **Controller**: 주문 내용을 확인하는 직원
- **Service**: 어떤 재료와 작업이 필요한지 결정하는 주방
- **Client**: Twitch에서 원본 데이터를 가져오는 배달원
- **Mapper**: 원본 데이터를 화면에 맞게 다듬는 과정

일부 조회 결과는 서버 메모리의 **캐시**에 5분간 보관합니다. 같은 요청이 다시 오면 Twitch에 재요청하지 않고 저장한 결과를 바로 반환합니다.

## 회원가입과 로그인

```text
프론트엔드
  → /auth Route
  → 입력값 검사
  → MongoDB에서 사용자 조회 또는 저장
  → 로그인용 JWT 발급
  → 프론트엔드에 JSON 응답
```

Google 로그인은 Passport가 `state`를 검증하고 Google 인증을 처리합니다. 확인된 이메일을 기준으로 기존 `signupUsers` 계정에 연결하거나 새 사용자를 저장한 뒤, 로컬 로그인과 동일한 JWT를 발급합니다.

## 예외 흐름

- 목업·정적 Twitch API는 외부 Twitch API를 호출하지 않고 `src/mocks`의 로컬 데이터를 반환합니다.
- 없는 주소는 404로, 처리 중 발생한 오류는 공통 오류 처리기를 거쳐 JSON으로 응답합니다.

## 핵심 파일 위치

```text
index.js                 서버 시작 및 MongoDB 연결
src/app.js               공통 설정과 최상위 주소 연결
src/routes               요청 주소 구분
src/controllers          요청과 응답 처리
src/services             실제 업무 로직
src/clients              Twitch API 통신
src/mappers              응답 데이터 모양 정리
src/models               MongoDB 데이터 구조
```
