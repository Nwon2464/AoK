# Client / Server 개선점 점검 보고서

- 점검일: 2026-08-07 (Asia/Tokyo)
- 점검 범위: `client`, `server`의 소스 코드, 패키지 구성, 빌드·테스트·환경 검사
- 목적: 현재 동작을 유지하면서 배포 안정성, 보안, 유지보수성, 성능을 높이기 위한 개선 과제 식별

## 1. 결론 요약

현재 프로젝트는 클라이언트 프로덕션 빌드가 가능하고, 서버의 Twitch 영역은 `route → controller → service → client/mapper` 구조로 분리되기 시작했다. 서버 환경 검사 스크립트와 캐시도 추가되어 기본 방향은 좋다.

다만 지금 바로 운영 품질로 보기 어려운 핵심 이유는 다음과 같다.

1. ~~회원가입·로그인 응답에 Mongoose 사용자 문서를 그대로 담아 비밀번호 해시가 클라이언트에 전달된다.~~ **해결됨 (2026-08-07): 응답 DTO 적용 및 사용자 전체 로그 제거**
2. 상세 페이지가 URL 파라미터보다 React Router의 `location.state`에 의존해 새로고침과 직접 URL 접근이 깨진다.
3. 인증 상태는 만료·위조 여부를 검증하지 않은 JWT를 `localStorage`에서 디코딩해 결정하며, 로그아웃 후에도 reducer의 `jwtToken` 값이 `true`가 되는 상태 모델 오류가 있다.
4. `npm audit` 결과 직접·전이 의존성에 다수의 취약점이 잡히며, 특히 사용되지 않는 서버 직접 의존성 `update`가 큰 취약 의존성 트리를 만든다.
5. 클라이언트 테스트는 없고 서버도 인증 단위 테스트만 존재한다. 주요 API·페이지 이동까지 보호하는 회귀 테스트가 더 필요하다.

따라서 **P0 보안 문제와 의존성 정리 → P1 라우팅/인증/API 안정화 → 테스트 추가 → 성능 및 구조 개선** 순서가 적절하다.

## 2. 검증 결과

| 검사 | 결과 | 해석 |
|---|---|---|
| `client: npm run build` | 성공, ESLint 경고 다수 | 배포 번들은 생성되지만 Hook 의존성, 접근성, 중복 객체 키, 미사용 코드 등의 부채가 있음 |
| `client: CI=true npm test -- --watchAll=false` | 실패: 테스트 0개 | 테스트 파일이 없어 회귀 검증 불가 |
| `server: npm run check:env` | 성공 | 현재 실행 환경에서 MongoDB/JWT/Twitch/Google 설정이 존재함 |
| `server: node --check` 전체 JS | 성공 | 정적 구문 오류는 발견되지 않음 |
| `server: npm test` | 성공: 인증 테스트 파일 2개 | validation, 공개 사용자 DTO, unique/select 설정, JWT middleware를 검증하며 DB 통합 테스트는 아직 없음 |
| `client: npm audit --json` | 총 69건: critical 4, high 33, moderate 17, low 15 | 실제 사용 경로를 확인하며 직접 의존성부터 정리 필요 |
| `server: npm audit --json` | 총 79건: critical 39, high 18, moderate 16, low 6 | 불필요한 `update` 제거와 런타임 의존성 갱신이 시급 |

> `npm audit` 건수는 “현재 공격이 가능하다”는 의미가 아니라 패키지 의존성 그래프에 등록된 advisory 수다. `npm audit fix --force`를 바로 실행하기보다, 미사용 패키지 제거 → 직접 의존성 안전 버전 갱신 → 빌드/통합 테스트 순으로 처리해야 한다.

## 3. 우선순위 기준

| 등급 | 의미 |
|---|---|
| P0 | 배포 전 반드시 해결해야 하는 보안·데이터 노출 문제 |
| P1 | 사용자 기능 장애, 장애 대응, 주요 성능 문제 |
| P2 | 유지보수성, 접근성, 개발 생산성 개선 |
| P3 | 정리와 장기 현대화 과제 |

## 4. Client 개선점

### C-01. 상세 페이지를 URL만으로 복원 가능하게 만들기 — P1

근거:

- `src/components/Route/SlashId.js`는 영상 조회에 `props.location.state.data.user_id`를 사용한다.
- `src/components/Route/SlashIdVideosAll.js`는 렌더링과 iframe 생성에서 `props.location.state.data`를 즉시 참조한다.
- `src/components/Route/SlashCategoryGamesId.js`도 API 조회를 `location.state.data.game_id`에 의존한다.

문제:

- 새로고침, 북마크, 외부 링크, 새 탭 직접 접근 시 `location.state`가 없으므로 NotFound가 표시되거나 런타임 오류가 발생할 수 있다.
- 현재 URL의 `:id`는 표시 이름을 담지만 실제 Twitch API 조회에 필요한 `user_id`/`game_id`를 보장하지 않는다.

개선:

- 경로를 `/channels/:userLogin`, `/channels/:userLogin/videos`, `/categories/:gameId`처럼 안정적인 식별자로 설계한다.
- 페이지 진입 시 URL 파라미터로 서버에서 필요한 데이터를 조회한다.
- `location.state`는 이전 화면 데이터를 잠깐 보여 주는 최적화 용도로만 사용하고 필수 데이터로 사용하지 않는다.
- 정의되지 않은 경로를 처리하는 마지막 `Route`를 추가한다.

완료 조건:

- 모든 상세 URL이 새로고침·직접 입력·공유 링크로 동일하게 열린다.
- 라우팅 통합 테스트에서 state 유무 두 경우를 검증한다.

### C-02. 인증 상태와 토큰 저장 방식을 재설계하기 — P0/P1

근거:

- `src/actions/index.js`의 `fetchAuth`는 `localStorage.token`을 `jwtDecode`만 하고 서명·만료를 확인하지 않는다.
- 손상된 토큰의 decode 예외를 처리하지 않아 앱 초기화가 중단될 수 있다.
- 로그인/회원가입 오류 처리에서 `error.response.data.message`를 가정해 네트워크 오류 시 다시 예외가 날 수 있다.
- `src/reducers/authReducer.js`는 `JWT_AUTH` payload가 `false`여도 `jwtToken: true`를 설정한다.
- 인위적인 1.5~2초 `setTimeout`이 성공·실패 피드백과 테스트를 느리게 만든다.

개선:

- 가장 안전한 선택은 서버가 `HttpOnly`, `Secure`, 적절한 `SameSite` 속성의 세션/토큰 쿠키를 발급하고 클라이언트가 `/auth/me`로 상태를 확인하는 방식이다.
- Bearer JWT를 유지한다면 만료 확인, 401 공통 처리, 메모리 중심 저장, 새로고침 토큰 전략을 함께 설계한다.
- 인증 상태를 `status: "unknown" | "authenticated" | "anonymous"`, `user`, `error`처럼 명시적으로 모델링한다.
- `setTimeout`을 제거하고 요청 완료 즉시 상태를 변경한다.
- Axios 공통 인스턴스/interceptor에서 네트워크 오류와 401을 일관되게 처리한다.

### C-03. API 주소와 외부 embed 설정을 환경 변수로 통합하기 — P1

근거:

- `src/api/config.js`에 운영 서버 URL이 하드코딩되어 있다.
- 여러 Route 컴포넌트가 동일 운영 URL로 Axios를 직접 호출한다.
- Twitch iframe의 `parent`가 특정 Vercel 호스트로 여러 파일에 하드코딩되어 있다.
- 개발 프록시가 존재하지만 하드코딩된 절대 URL 호출은 프록시를 우회한다.

개선:

- `REACT_APP_API_BASE_URL`, `REACT_APP_TWITCH_PARENT` 같은 환경 설정을 한 곳에서 읽는다.
- 공통 Axios 인스턴스에 `baseURL`, timeout, 오류 변환을 설정한다.
- 컴포넌트의 직접 Axios 호출을 `api → service → action/hook` 계층으로 이동한다.
- 개발은 상대 경로와 프록시, 운영은 배포 환경 변수로 구분한다.

### C-04. 비동기 상태와 무한 스크롤을 안정화하기 — P1

근거:

- 상세/카테고리 페이지의 effect에 `fetchAllVideos` 또는 `fetchPosts` 의존성이 빠졌다는 빌드 경고가 있다.
- `loading`, `error`, `hasMore`를 만들고도 일부 화면에서는 사용하지 않는다.
- 오류나 정상적인 빈 응답도 `streams.length === 0`만 보고 계속 skeleton으로 표시한다.
- `document.querySelector(".app-overflow-y")`로 전역 DOM을 찾아 스크롤 이벤트를 연결한다.
- 요청 취소와 동일 cursor 중복 요청 방지가 없다.

개선:

- 전용 데이터 훅을 만들어 `idle/loading/success/empty/error` 상태를 분리한다.
- 스크롤 컨테이너는 `ref`로 참조하고 가능하면 `IntersectionObserver` sentinel을 사용한다.
- 요청 중복 방지, cursor 소진 판정, AbortController 또는 Axios signal 기반 취소를 추가한다.
- 오류 화면에 재시도 동작을 제공한다.
- 홈의 독립적인 Top Games/Grouped Streams 요청은 `Promise.all`로 병렬화한다.

### C-05. API 데이터 계약과 표시 데이터의 정확성 확보 — P1

근거:

- Twitch Top Games 응답에는 현재 UI가 기대하는 `gameViewers`가 없는데 `GameCard`가 이를 표시하려 한다.
- 카테고리 헤더는 값이 없을 때 `genRand`로 시청자·팔로워 수를 생성한다.
- 서버 응답은 배열, Twitch 원본 envelope, `{ streams }` 등 형태가 엔드포인트마다 다르다.

개선:

- 화면별 DTO를 정의하고 서버 mapper에서 `data`, `pagination`, 필요한 표시 필드를 일정하게 만든다.
- 실제로 제공할 수 없는 수치는 숨기거나 “정보 없음”으로 표시한다. 임의 숫자는 mock 모드에서만 명확히 표시한다.
- 런타임 스키마 검증 또는 TypeScript 타입을 점진적으로 도입한다.

### C-06. 접근성과 반응형 UI 보완 — P2

빌드에서 확인된 항목:

- 여러 `<img>`에 `alt`가 없다.
- iframe `title` 누락이 있다.
- `href` 없는 `<a>`를 버튼처럼 사용한다.
- 클릭 가능한 `<span>`/`div`가 있어 키보드 조작과 의미 구조가 부족하다.
- 화면 폭 1025px 미만에서는 반응형 화면 대신 `NotSupport`를 노출한다.
- 목록의 React `key`로 배열 index를 많이 사용한다.

개선:

- 상호작용 요소를 `<button>`/`<Link>`로 바꾸고 focus 스타일, aria-label, 이미지 대체 텍스트를 추가한다.
- `user_id`, `game_id`, `video.id`를 안정적인 key로 사용한다.
- 모바일/태블릿에서는 사이드바 축소, 카드 열 수 조정, carousel 크기 조정 방식으로 대응한다.
- 접근성 경고를 CI 실패 조건으로 단계적으로 강화한다.

### C-07. 프런트엔드 도구와 코드 구조 현대화 — P2/P3

근거:

- React 18을 사용하지만 `ReactDOM.render` 구 API를 사용한다.
- Create React App 빌드에서 유지보수 중단 관련 경고가 발생한다.
- Material UI v4, Semantic UI, 자체 CSS가 혼재하며 `index.css`가 900줄 이상이다.
- action type과 reducer에 주석 처리되거나 사용되지 않는 코드가 많다.
- 클라이언트 직접 취약 의존성으로 `axios`, `swiper`, `react-scripts`, `lodash`, `joi`, `ajv`, `http-proxy-middleware` 등이 audit에 잡힌다.

개선:

- 우선 미사용 `browserify-zlib`, `joi`, `lodash`, `react-infinite-scroll-component` 등의 실제 사용 여부를 확정하고 제거한다.
- `createRoot`로 전환한다.
- 단기에는 CRA 의존성을 안전 버전으로 정리하고, 중기에는 Vite 등 유지 가능한 빌드 도구로 마이그레이션한다.
- UI 라이브러리를 하나로 줄이고 페이지/컴포넌트 단위 스타일로 분리한다.

## 5. Server 개선점

### ~~S-01. 인증 응답에서 비밀번호 해시 제거 — P0~~ ✅ 완료 (2026-08-07)

처리 결과:

- 회원가입·로그인 공통 응답을 `id`, `username`, `email`만 포함하는 allowlist DTO로 변경했다.
- 중복 username 처리에서 Mongoose 사용자 문서 전체를 출력하던 로그를 제거했다.
- 공개 사용자 DTO에 `password`가 포함되지 않는 Node 내장 테스트를 추가했다. 실제 DB를 사용하는 API 통합 테스트는 후속 과제로 남아 있다.

수정 전 근거:

- `src/auth/index.js`의 `createTokenSendResponse`가 `res.json({ token, user })`로 Mongoose 문서를 그대로 반환한다.
- 로컬 계정 모델의 `user` 문서에는 `password` 필드가 포함되어 있다.

적용한 개선:

- ~~응답 DTO를 `{ id, username, email }`처럼 allowlist 방식으로 만든다.~~
- ~~로그에도 전체 사용자 문서를 남기지 않는다.~~
- ~~Mongoose schema의 password에 `select: false`를 적용하고, 로그인 조회에서만 명시적으로 선택한다.~~
- 이미 운영 사용자에게 응답한 이력이 있다면 로그/모니터링 저장소에 해시가 남았는지 확인하고 필요 시 비밀번호 재설정을 검토한다.

완료 조건:

- ~~공개 사용자 DTO 테스트가 응답용 객체 어디에도 `password`가 없음을 검증한다.~~
- 실제 MongoDB를 연결한 회원가입·로그인 API 통합 테스트는 추가가 필요하다.

### ~~S-02. 인증 모듈을 controller/service로 분리하고 오류를 모두 처리 — P1~~ ✅ 로컬 JWT 범위 완료 (2026-08-07)

처리 결과:

- `auth route → authController → authService → model`로 역할을 분리했다.
- Joi validation을 별도 모듈로 이동하고 저장 필드 검증과 알 수 없는 필드 제거를 적용했다.
- controller의 모든 비동기 오류를 `next(error)`로 전달하도록 통일했다.
- username/email unique index와 MongoDB duplicate key의 409 응답 변환을 추가했다.
- password를 기본 조회에서 제외하고 로그인 조회에서만 명시적으로 선택한다.
- JWT 필수 middleware와 `/auth/me`를 추가하고 인증 오류를 401로 통일했다.
- Node 내장 인증 테스트 파일 2개와 `npm test` script를 추가했다.

남은 범위:

- ~~Google OAuth를 별도 session 사용자로 두지 않고 로컬 인증과 동일한 MongoDB 사용자/JWT 흐름으로 통합한다.~~ ✅ 완료 (2026-08-07)
- 기존 DB에 중복 username/email이 있다면 배포 전에 정리해야 unique index를 정상 생성할 수 있다.

수정 전 근거:

- `src/auth/index.js` 한 파일이 validation, DB 조회, hash, JWT 발급, 응답까지 모두 담당한다.
- 여러 Promise chain에 `.catch(next)`가 없어 DB/bcrypt/JWT 오류가 Express 4 오류 middleware에 안정적으로 전달되지 않는다.
- 중복 username이 명시적 409가 아닌 기본 500으로 응답될 수 있다.
- username/email에 DB unique index가 없어 동시 가입 시 중복 저장 race condition이 가능하다.
- 회원가입 Joi 검증에는 생년월일 필드가 실제로 전달되지 않으며 client/server 허용 연도도 다르다.
- JWT 검증 middleware는 어느 보호 route에도 연결되어 있지 않다.

적용한 개선:

- ~~`authRoutes → authController → authService → userRepository/model`로 분리한다.~~
- ~~async handler를 통일하고 모든 reject를 `next`로 전달한다.~~
- ~~username/email에 unique index를 추가하고 Mongo duplicate key를 409로 매핑한다.~~
- ~~validation schema와 실제 저장 필드를 일치시키고 알 수 없는 필드는 제거한다.~~
- ~~`/auth/me`에 JWT 필수 인증 middleware를 적용한다.~~
- ~~Google OAuth와 로컬 JWT 중 사용할 인증 방식을 명확히 정하고, 미완성 흐름은 노출하지 않는다.~~

### S-03. CORS·쿠키·rate limit 정책 강화 — P0/P1

근거:

- `src/app.js`가 `cors({ origin: "*" })`를 사용한다.
- cookie session에 환경별 `secure`, `sameSite`, `httpOnly` 정책이 명시되지 않았다.
- 로그인/회원가입 및 Twitch proxy API에 rate limit이 없다.

개선:

- 허용 origin allowlist를 환경 변수로 관리한다.
- 쿠키 기반 인증을 사용할 경우 정확한 origin, `credentials: true`, CSRF 방어, proxy trust, cookie 속성을 함께 설정한다.
- 로그인·회원가입에는 IP/계정 기준 제한을, Twitch proxy에는 endpoint 기준 제한을 적용한다.
- JSON body limit을 명시하고 보안 이벤트 로그를 추가한다.

### S-04. 외부 Twitch 호출의 장애 내성 확보 — P1

근거:

- `src/clients/twitchClient.js`의 Axios 호출에 timeout이 없다.
- 동시에 토큰이 만료되면 여러 요청이 각각 새 app token을 발급받을 수 있다.
- Twitch 401, 429, 5xx를 구분한 재시도·오류 변환이 없다.

개선:

- Twitch 전용 Axios 인스턴스에 연결/응답 timeout을 설정한다.
- token refresh promise를 공유해 동시 갱신을 하나로 합친다.
- 401은 토큰 1회 갱신, 429는 `Retry-After` 준수, 5xx는 제한된 backoff를 적용한다.
- 외부 오류를 내부 표준 오류 코드로 변환하고 client secret/토큰이 로그에 남지 않게 한다.

### S-05. Top Streams 집계 호출 병렬화와 캐시 적용 — P1 🟡 v2 백엔드 완료

진행 상태:

- `/api/v2/home`에서 Top Games와 전체 Live Streams를 병렬로 조회한다.
- 인기 게임 4개의 Streams를 병렬 조회한 뒤 모든 user ID를 모아 Users를 한 번만 batch 조회한다.
- 홈 결과에 30초 캐시와 동일 요청 Promise 공유를 적용했다.
- 프런트 전환 전이므로 기존 `getTopStreamsPage()`는 아직 유지한다. 프런트가 v2로 전환되면 S-05를 최종 완료 처리한다.

근거:

- `getTopStreamsPage`는 상위 게임 8개를 `for...of + await`로 순차 처리한 뒤 고정 카테고리 4개도 순차 처리한다.
- 상위 게임마다 streams 조회 후 users 조회가 추가되어 한 요청이 다수의 외부 호출을 직렬로 수행한다.
- 해당 집계 결과에는 캐시가 없다.

개선:

- `Promise.all` 또는 동시성 제한 queue로 게임별 처리를 병렬화한다.
- user ID를 전체 결과에서 모아 `/users` 요청 수를 줄인다.
- 집계 endpoint 자체에 짧은 TTL과 stale-while-revalidate를 적용한다.
- 호출 수, Twitch 응답 시간, cache hit ratio를 측정한다.

### S-06. 캐시의 메모리·서버리스 한계 보완 — P1/P2

근거:

- `src/utils/cache.js`는 process-local `Map`이고 만료된 key를 조회할 때만 제거한다.
- cursor와 user ID가 cache key에 포함되어 key 수 제한이 없다.
- Vercel serverless로 배포할 경우 인스턴스별 캐시라 적중률과 일관성이 보장되지 않는다.

개선:

- 최대 entry 수와 주기적 만료 정리, key 입력 길이 제한을 둔다.
- 단일 프로세스 배포가 아니라면 Redis/KV 같은 공유 TTL cache를 검토한다.
- 캐시 불가 시에도 정상 동작하도록 캐시는 최적화 계층으로 유지한다.

### S-07. 입력 검증과 API 오류 계약 통일 — P1

근거:

- `gameId`, `userId`, `cursor`를 검증 없이 Twitch API와 cache key에 전달한다.
- 공통 error handler는 대부분의 예외를 500으로 만들고 upstream 메시지를 그대로 응답한다.
- endpoint마다 응답 구조가 다르다.

개선:

- params/query에 길이·형식·허용 범위 validation을 적용한다.
- `{ data, pagination, error: { code, message } }` 같은 공통 계약을 정의한다.
- 400/401/404/409/422/429/502/503을 원인에 맞게 매핑한다.
- production에서는 내부 라이브러리/외부 API 오류 메시지를 그대로 노출하지 않는다.

### S-08. DB 시작·종료와 운영 관측성 개선 — P1/P2

근거:

- `server/index.js`는 `mongoose.connect` 완료를 기다리지 않고 바로 listen한다.
- 최초 연결 실패, 런타임 DB 오류, SIGTERM 종료 처리가 없다.
- `console.log`와 `morgan("dev")` 중심이고 request ID/구조화 로그/health check가 없다.

개선:

- 필수 환경 검증과 DB 연결 성공 후 서버를 listen한다.
- 연결 실패 시 명확히 종료하고 SIGTERM에서 HTTP server와 DB를 순서대로 닫는다.
- `/health/live`, `/health/ready`를 분리한다.
- 운영에서는 request ID, status, latency, error code를 구조화해 기록한다.
- cache hit, Twitch API latency/error, DB latency, auth failure 지표를 추가한다.

### S-09. 라우트와 의존성 정리 — P1/P2

근거:

- `/api/v1/twitch` 아래 mock/static/live route가 함께 섞여 API 의미가 불명확하다.
- 사용되지 않는 것으로 보이는 `update`, `concurrently`, `cookie-parser`, `lodash`가 서버 runtime dependency에 있다.
- `update`는 이름과 달리 애플리케이션 업데이트에 필요한 표준 도구가 아니며, 현재 audit critical 의존성 다수를 유입한다.
- `gameBoxUrl.js`와 일부 mock 데이터는 현재 import되지 않는다.

개선:

- mock은 `/api/v1/mock/twitch` 또는 개발 전용 adapter로 분리한다.
- live API와 mock API의 DTO를 같게 만들어 환경에 따라 service 구현만 교체한다.
- 미사용 dependency와 dead file을 참조 검색·테스트 후 제거한다.
- `concurrently`, `nodemon` 같은 개발 도구는 실제 필요하면 `devDependencies`로 이동한다.

## 6. 테스트 및 품질 게이트 제안

### Client

- 서비스 단위 테스트: 이미지 URL 변환, 응답 mapping, 오류 변환
- reducer 테스트: unknown/authenticated/anonymous 전이
- 컴포넌트 테스트: loading/empty/error/success, 로그인 실패, 직접 URL 접근
- 라우팅 통합 테스트: 새로고침을 가정해 `location.state` 없이 상세 페이지 렌더링
- 접근성 검사: 주요 페이지에 `jest-axe` 또는 동등 도구 적용

### Server

- 단위 테스트: mapper, cache TTL, auth validation, 응답 DTO
- API 통합 테스트: signup/login/me, duplicate user, invalid params, 404/error contract
- Twitch client mock 테스트: timeout, 401 token refresh, 429, pagination
- DB 테스트: unique index와 연결 실패 처리

### CI 최소 기준

1. install은 lockfile 기반 `npm ci`
2. client lint/test/build
3. server lint/test 및 JS 구문 검사
4. dependency audit 결과를 기록하고 critical 신규 유입 차단
5. `.env`/secret이 커밋되지 않았는지 검사

## 7. 권장 실행 순서

### 1단계 — 배포 차단 이슈 제거

1. ~~인증 응답 DTO를 만들어 password/hash를 완전히 제거한다.~~ 완료 (2026-08-07)
2. 미사용 서버 `update`를 제거하고 lockfile을 재생성한 뒤 audit를 다시 측정한다.
3. client/server의 직접 취약 의존성을 안전 버전으로 올리고 회귀 검증한다.
4. CORS allowlist, rate limit, cookie/JWT 정책을 확정한다.

### 2단계 — 사용자 기능 안정화

1. URL 기반 상세 조회로 라우팅을 변경한다.
2. 공통 Axios client와 환경 설정을 도입하고 컴포넌트 직접 호출을 제거한다.
3. 인증 상태 모델과 오류 처리를 수정한다.
4. loading/empty/error 및 무한 스크롤 요청 중복을 정리한다.

### 3단계 — 회귀 방지

1. auth/API/라우팅 핵심 테스트부터 추가한다.
2. CI에 test/build/audit를 연결한다.
3. 서버 health check와 구조화 로그를 추가한다.

### 4단계 — 성능·유지보수 개선

1. Twitch 집계 호출 병렬화, users batch, cache 전략을 적용한다.
2. mock/live route와 DTO를 통합한다.
3. 접근성·반응형을 개선한다.
4. CRA와 오래된 UI stack을 단계적으로 교체한다.

## 8. 우선 작업 백로그

| 순서 | 작업 | 우선순위 | 예상 규모 |
|---:|---|---|---|
| 1 | ~~로그인/회원가입 응답에서 password 제거~~ · 회귀 테스트 추가 필요 | P0 핵심 수정 완료 | 작음 |
| 2 | 미사용 `update` 등 dependency 제거 및 audit 재검증 | P0 | 작음~중간 |
| 3 | CORS/rate limit/인증 쿠키 또는 JWT 정책 확정 | P0/P1 | 중간 |
| 4 | URL 기반 채널·카테고리 상세 조회 | P1 | 중간~큼 |
| 5 | 공통 API client와 환경 변수화 | P1 | 중간 |
| 6 | auth reducer/token/error 처리 수정 | P1 | 중간 |
| 7 | ~~서버 auth controller/service 분리 + unique index~~ | P1 완료 | 중간 |
| 8 | 비동기 화면 상태와 무한 스크롤 안정화 | P1 | 중간 |
| 9 | Twitch timeout/retry/token refresh/집계 최적화 | P1 | 중간 |
| 10 | 핵심 client/server 테스트와 CI 구축 | P1 | 중간~큼 |
| 11 | 접근성·반응형·안정적인 list key 개선 | P2 | 중간 |
| 12 | CRA/UI 라이브러리 현대화 | P2/P3 | 큼 |

## 9. 긍정적인 현재 기반

- Twitch live 영역이 route/controller/service/client/mapper로 분리되어 다음 리팩터링의 경계가 이미 있다.
- 외부 Twitch credential이 client가 아니라 server에만 위치한다.
- Twitch app token을 메모리에서 재사용하고 일부 읽기 API에 TTL cache가 있다.
- Helmet, Joi, bcrypt, JWT 만료 시간이 기본 적용되어 있다.
- 환경 예시와 검사 스크립트가 있어 로컬 설정 누락을 진단할 수 있다.
- 클라이언트 carousel의 timeout cleanup처럼 일부 effect 정리가 올바르게 구현되어 있다.

이 기반을 유지하면서 P0/P1부터 작은 변경과 테스트를 묶어 진행하는 것이 전체 재작성보다 안전하다.
