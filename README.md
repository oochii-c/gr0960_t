# gr0960_t — Groq 챗봇

간단한 AI 챗봇 예제입니다. 브라우저 화면(client)에서 질문을 보내면, Express 서버(server)가 **API 키를 숨긴 채** Groq API에 대신 요청하고 답을 돌려줍니다.

> 🔑 API 키를 프론트엔드에 노출하지 않기 위해, 서버가 프록시(중계) 역할을 합니다.

## 구조

```
03/
├─ api/
│  └─ chat.js         # ✅ 배포용 백엔드 (Vercel 서버리스 함수 → /api/chat)
├─ client/            # 프론트엔드 (정적 파일)
│  ├─ index.html      # 입력창 + 응답 표시
│  └─ app.js          # 서버로 질문 전송 (fetch '/api/chat')
├─ server/            # (참고용) 예전 standalone Express 버전
│  ├─ index.js
│  ├─ package.json
│  └─ .env.example    # 키 템플릿 (.env는 커밋 안 됨)
└─ vercel.json        # client/를 루트(/)로 서빙, /api/*는 함수로
```

> 핵심: 프론트와 백엔드가 **같은 주소**에 배포되므로 `app.js`는 `/api/chat`(상대경로)만 호출합니다. 그래서 CORS 설정이 필요 없습니다.

## 필요 환경

- Node.js **18 이상** (내장 `fetch` 사용)
- [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`)

## 로컬 실행 (`vercel dev`)

```bash
# 1) 키를 환경변수로 등록 (배포 프로젝트에도 동일하게 필요)
vercel env add GROQ_API_KEY
# 2) 등록한 키를 로컬로 내려받기
vercel env pull
# 3) 프론트 + /api 함수를 한 번에 로컬 서빙
vercel dev
# http://localhost:3000 에서 대기
```

브라우저로 `http://localhost:3000` 을 열고, 입력창에 질문을 적어 **보내기**(또는 Enter).

> 💡 키가 없어도 서버는 죽지 않고 `(mock) ...` 형태의 가짜 답을 돌려줍니다.

## 배포 (Vercel)

```bash
# 03 폴더(루트)에서 실행
vercel                       # 프로젝트 링크/설정 (최초 1회)
vercel env add GROQ_API_KEY  # Production 환경에 키 등록
vercel --prod                # 프로덕션 배포
```

배포 후 나오는 URL에서 바로 챗봇이 동작합니다.

## API

`POST /api/chat`

요청:

```json
{ "prompt": "안녕?" }
```

응답:

```json
{ "reply": "안녕하세요! 무엇을 도와드릴까요?" }
```

- 모델: `llama-3.1-8b-instant`
- `temperature: 0.2` (환각 최소화)
- 실시간 정보(날씨/뉴스/주가 등) 질문에는 "모른다"고 짧게 답하도록 시스템 프롬프트 설정

## 보안 주의

- `.env`(실제 API 키)는 `.gitignore`로 제외되어 **커밋되지 않습니다.**
- 이 레포는 **Public**이니, 키·비밀번호가 커밋되지 않도록 항상 주의하세요.
