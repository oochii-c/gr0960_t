# gr0960_t — Groq 챗봇

간단한 AI 챗봇 예제입니다. 브라우저 화면(client)에서 질문을 보내면, Express 서버(server)가 **API 키를 숨긴 채** Groq API에 대신 요청하고 답을 돌려줍니다.

> 🔑 API 키를 프론트엔드에 노출하지 않기 위해, 서버가 프록시(중계) 역할을 합니다.

## 구조

```
03/
├─ client/            # 프론트엔드 (정적 파일)
│  ├─ index.html      # 입력창 + 응답 표시
│  └─ app.js          # 서버로 질문 전송 (fetch)
└─ server/            # 백엔드 (Express 프록시)
   ├─ index.js        # /api/chat 엔드포인트
   ├─ package.json
   └─ .env.example    # 키 템플릿 (.env는 커밋 안 됨)
```

## 필요 환경

- Node.js **18 이상** (내장 `fetch` 사용)

## 실행 방법

### 1. 서버 실행

```bash
cd server
npm install

# .env 파일 생성 후 실제 키 입력
cp .env.example .env
# .env 안의 GROQ_API_KEY 값을 본인 키로 교체
```

`.env` 예시:

```
GROQ_API_KEY=gsk_본인_키
```

서버 시작:

```bash
npm start
# http://localhost:3000 에서 대기
```

> 💡 키가 없어도 서버는 죽지 않고 `(mock) ...` 형태의 가짜 답을 돌려줍니다.

### 2. 화면 열기

`client/index.html`을 브라우저로 열면 됩니다. (또는 Live Server 등으로 서빙)

입력창에 질문을 적고 **보내기** 버튼(또는 Enter)을 누르면 응답이 표시됩니다.

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
