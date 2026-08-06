# Twitch API 재설계 제안

- 작성일: 2026-08-07
- 목적: 프런트가 필요한 데이터를 적은 Twitch API 호출로 안정적으로 전달하기
- 권장 방향: **화면 중심 백엔드 API + batch 조회 + 단순한 메모리 캐시**

## 구현 상태

- ✅ 백엔드 `/api/v2` 구현 완료 (2026-08-07)
- ✅ 실제 Twitch API로 홈·카테고리·채널·VOD smoke test 완료
- ✅ 프런트 홈 화면 `/api/v2` 전환 완료
- ⏳ 카테고리·채널·VOD 화면 전환 전
- ⏳ 기존 `/api/v1` 및 mock/static route 제거 전

기존 `/api/v1`은 아직 상세 화면에서 사용하므로 유지한다.

## 1. 현재 문제

현재 홈 데이터는 여러 API와 mock route에 나뉘어 있다.

```text
/api/v1/twitch/topgames
/api/v1/twitch/streams
/api/v1/twitch/channels
/api/v1/tstreams
```

`getTopStreamsPage()`는 게임마다 Streams와 Users를 반복 조회해, 홈 요청 한 번이 Twitch 요청 약 20회 이상으로 늘어날 수 있다.

트래픽이 적어도 다음 문제가 생긴다.

- 첫 화면이 느려진다.
- Twitch rate limit을 불필요하게 사용한다.
- 같은 사용자 프로필을 반복 조회한다.
- 일부 요청 실패가 전체 화면 실패로 이어질 수 있다.
- 프런트가 Twitch 원본 응답과 mock 응답 차이를 알아야 한다.

## 2. Twitch API에서 확인한 사실

| Twitch API | 용도 | 확인한 제약 |
|---|---|---|
| Get Streams | 라이브 방송 조회 | 사용자·게임 ID를 최대 100개까지 지정 가능, 페이지당 최대 100개 |
| Get Users | 프로필 이미지와 사용자 정보 | ID와 login 합계 최대 100명 batch 조회 |
| Get Top Games | 인기 게임과 박스 이미지 | 게임별 총 시청자 수는 제공하지 않음 |
| Get Games | 지정 게임 정보 | 최대 100개 batch 조회 |
| Get Channel Information | 채널 제목, 현재 또는 마지막 게임 | broadcaster ID 최대 100개 |
| Get Videos | 채널 VOD | user ID 기준 cursor pagination, 페이지당 최대 100개 |

참고 문서:

- [Get Streams](https://dev.twitch.tv/docs/api/reference#get-streams)
- [Get Users](https://dev.twitch.tv/docs/api/reference#get-users)
- [Get Top Games](https://dev.twitch.tv/docs/api/reference#get-top-games)
- [Get Channel Information](https://dev.twitch.tv/docs/api/reference#get-channel-information)
- [Get Videos](https://dev.twitch.tv/docs/api/reference#get-videos)
- [Twitch rate limits](https://dev.twitch.tv/docs/api/guide#twitch-rate-limits)

## 3. 추천 데이터 흐름

프런트는 Twitch API를 직접 알 필요가 없다. 백엔드가 화면에 필요한 형태로 조립한다.

```text
React Home
    ↓ GET /api/v2/home
Home Controller
    ↓
Home Service
    ├─ Get Streams(first=8)
    ├─ Get Top Games(first=15)
    ├─ 상위 게임 4개의 Streams 병렬 조회
    └─ Get Users(user IDs, batch 1회)
    ↓
Mapper가 화면용 DTO 생성
    ↓
React는 받은 데이터를 섹션별로 렌더링
```

홈 캐시가 없을 때 Twitch 호출은 기본 7회이며, 같은 홈 요청은 30초 동안 캐시한다.

## 4. 새로운 백엔드 API

### 홈

```http
GET /api/v2/home
```

제공 데이터:

- Carousel용 라이브 채널
- 인기 게임
- 라이브 방송을 게임별로 묶은 추천 카테고리

### 카테고리 목록

```http
GET /api/v2/categories?cursor=...&limit=20
```

### 전체 라이브 방송

```http
GET /api/v2/streams?cursor=...&limit=8
```

중앙 Live Channel과 왼쪽 Recommended Channels가 같은 데이터와 cursor를 공유한다.

### 카테고리 라이브 방송

```http
GET /api/v2/categories/:gameId/streams?cursor=...&limit=20
```

내부에서 Streams를 조회한 다음 모든 `user_id`를 모아 Users를 한 번만 조회한다.

### 채널 상세

```http
GET /api/v2/channels/:userLogin
```

제공 데이터:

- 사용자 프로필
- 채널 제목과 게임
- 현재 라이브 방송 또는 `null`

이 API를 사용하면 프런트가 `location.state` 없이 URL만으로 채널 페이지를 열 수 있다.

### 채널 VOD

```http
GET /api/v2/channels/:userLogin/videos?cursor=...&limit=12
```

VOD는 채널 상세 화면과 분리해 필요한 시점에만 불러온다.

## 5. 홈 데이터 구성 방식

추천 방식은 전체 상위 Streams를 게임별로 묶는 동적 방식이다.

```text
상위 라이브 방송 100개 조회
    ↓
game_id별로 그룹화
    ↓
각 게임에서 상위 방송 4~5개 선택
    ↓
추천 카테고리 생성
```

장점:

- Streams 호출이 1회다.
- 실제 현재 인기 방송을 반영한다.
- Minecraft, Fortnite 같은 고정 카테고리에 종속되지 않는다.

특정 게임을 반드시 보여줘야 한다면 게임별 Streams 요청이 필요하다. 이 경우에도 요청은 병렬로 실행하고 Users 조회는 마지막에 한 번만 한다.

## 6. 응답 형태

Twitch의 snake_case 원본을 그대로 전달하지 않고 프로젝트가 관리하는 DTO를 사용한다.

```json
{
  "data": {
    "liveChannels": [],
    "liveChannelsPagination": {
      "nextCursor": null
    },
    "topGames": [],
    "topGamesPagination": {
      "nextCursor": null
    },
    "popularCategories": [
      {
        "game": {},
        "streams": [],
        "pagination": {
          "nextCursor": null
        }
      }
    ]
  },
  "meta": {
    "generatedAt": "2026-08-07T12:00:00Z",
    "cached": false,
    "partial": false
  }
}
```

목록 API의 pagination도 같은 형태로 통일한다.

```json
{
  "data": [],
  "pagination": {
    "nextCursor": null
  }
}
```

## 7. 표시하면 안 되는 가짜 데이터

### 게임별 총 시청자 수

Get Top Games에는 게임별 총 시청자 수가 없다. 따라서 현재의 `gameViewers` 임의 값은 제거한다.

필요하면 다음처럼 명확히 구분한다.

- 숫자를 표시하지 않는다.
- 현재 불러온 방송들의 시청자 합계만 표시한다.

### Follower 수

Get Channel Followers는 user access token과 권한이 필요하다. 현재 app access token 구조에서는 임의 채널의 follower 수를 안정적으로 제공할 수 없으므로 `genRand()`로 만든 follower 수는 제거한다.

[Get Channel Followers 문서](https://dev.twitch.tv/docs/api/reference#get-channel-followers)

## 8. 간단한 캐시 기준

개인 프로젝트에서는 Redis 없이 현재 메모리 캐시로 시작해도 충분하다.

| 데이터 | 권장 TTL |
|---|---:|
| Users와 Games 정보 | 30~60분 |
| Top Games | 5분 |
| Streams와 Home 응답 | 20~30초 |
| Videos 첫 페이지 | 2~5분 |

동일한 cache key 요청이 동시에 들어오면 첫 번째 요청의 Promise를 공유하도록 보완한다.

## 9. 프런트 요청 흐름

```text
앱 최초 진입
    → GET /api/v2/home

홈 추천 카테고리의 Show more 클릭
    → GET /api/v2/categories/:gameId/streams?cursor=...&limit=4
    → stream.id 기준으로 기존 목록에 중복 없이 추가
    → nextCursor가 없으면 Show more 버튼 제거

Live Channel 또는 왼쪽 Recommended Channels의 Show more 클릭
    → 공용 liveChannels에 이미 받은 데이터가 있으면 표시 개수만 증가
    → 데이터가 부족하면 GET /api/v2/streams?cursor=...&limit=8
    → 중앙 목록은 4개씩, 왼쪽 목록은 5개씩 독립적으로 표시
    → 캐러셀은 공용 목록의 최초 5개로 고정

Categories 가로 스크롤이 오른쪽 끝에 접근
    → GET /api/v2/categories?cursor=...&limit=15
    → game.id 기준으로 중복 없이 추가
    → 박스 이미지는 브라우저 lazy loading 적용

카테고리 상세 진입
    → GET /api/v2/categories/:gameId/streams

채널 상세 진입
    → GET /api/v2/channels/:userLogin

VOD 영역 표시 또는 추가 스크롤
    → GET /api/v2/channels/:userLogin/videos
```

각 섹션은 `loading`, `success`, `empty`, `error` 상태를 별도로 관리한다.

## 10. 전환 순서

1. `/api/v2/home`과 화면용 DTO를 추가한다.
2. 프런트 홈을 `/api/v2/home`으로 전환한다.
3. login 기반 채널 상세와 VOD API를 추가한다.
4. game ID 기반 카테고리 API를 정리한다.
5. 프런트의 `location.state` 필수 의존성을 제거한다.
6. 새 API가 안정되면 기존 `/api/v1/twitch/*`와 mock/static route를 제거한다.
7. 마지막으로 기존 `getTopStreamsPage()`를 폐기한다.

## 최종 결정 제안

현재 프로젝트에는 다음 구성이 가장 단순하고 적합하다.

```text
동적 홈 화면
+ Get Streams 1회
+ Get Top Games 1회
+ Get Users batch 1회
+ 화면 전용 DTO
+ 20~30초 메모리 캐시
```

대규모 시스템을 만들지 않으면서도 호출 중복, 느린 응답, 직접 URL 접근 문제를 함께 줄일 수 있다.
