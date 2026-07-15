// 질문 보내기 동작 (버튼 클릭과 엔터 키 둘 다 여기로 모음)
function sendPrompt() {
  // id="q" 입력칸에 적은 질문 꺼내기
  const prompt = document.getElementById('q').value

  // 내 서버(프록시) 창구로 요청 (키 없음)
  // fetch(...).then(...).then(...).catch(...) 처럼 점(.)으로 쭉 이어붙이는 걸 "메서드 체이닝"이라 함
  // "요청 보내고(fetch) → 성공하면(then) → 또 처리하고(then) → 실패하면(catch)" 순서로 연결됨
  // [이전 버전 — 히스토리용] 로컬 Express 서버(:3000)를 직접 호출하던 코드
  // 배포하면 서버 주소가 달라져서 동작 안 하고, 다른 주소라 CORS 설정도 필요했음
  // fetch('http://localhost:3000/api/chat', {

  // [현재 버전] 같은 주소의 서버리스 함수(/api/chat)를 상대경로로 호출
  // → 배포/로컬(vercel dev) 어디서든 동작하고 CORS도 필요 없음
  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // 입력칸 값을 문자열로 바꿔 보내기
    body: JSON.stringify({ prompt })
  })
    // 응답을 객체로 변환
    .then(res => res.json())
    // 받은 답(reply)을 id="ans" 자리에 표시
    .then(data => { document.getElementById('ans').textContent = data.reply || data.error })
    // 서버가 안 켜져 있으면 안내 메시지
    // [이전] .catch(() => { document.getElementById('ans').textContent = '❌ 서버 안 켜짐? (server서 node index.js 먼저)' })
    .catch(() => { document.getElementById('ans').textContent = '❌ 서버 안 켜짐? (로컬은 vercel dev 먼저 실행)' })
}

// '보내기' 버튼에 클릭 동작 연결
document.getElementById('btn').addEventListener('click', sendPrompt)

// 입력칸에서 엔터 키를 누르면 클릭한 것과 동일하게 동작
document.getElementById('q').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendPrompt()
})