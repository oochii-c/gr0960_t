// Vercel 서버리스 함수
// 배포하면 이 파일이 그대로 "/api/chat" 주소가 됩니다.
// (server/index.js 는 예전 standalone Express 버전 — 참고용으로 남겨둠)
//
// Express의 app.post(...) 대신, Vercel은 (req, res) 하나짜리 함수를 export 하면 됩니다.
module.exports = async (req, res) => {
  // POST만 허용
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })

  // 서버만 아는 키 (금고) — Vercel 환경변수에서 읽음
  const key = process.env.GROQ_API_KEY
  // Vercel이 JSON 본문을 자동으로 req.body 로 풀어줌
  const prompt = req.body?.prompt

  // 키 없어도 멈추지 않게 가짜 답
  if (!key) return res.json({ reply: '(mock) ' + prompt })

  // 서버가 Groq에 대신 호출
  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    // 키는 여기 헤더에만
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
    body: JSON.stringify({
      // 쓸 AI 모델
      model: 'llama-3.1-8b-instant',
      // 답이 너무 애매하거나 지어내지 않도록 온도 낮춤
      temperature: 0.2,
      messages: [
        // 모르는 건 모른다고 짧게 말하도록 지시
        { role: 'system', content: '너는 실시간 정보(날씨, 뉴스, 주가 등)에 접근할 수 없다. 실시간 정보를 물어보면 장황하게 설명하지 말고, 모른다고 한두 문장으로 짧게 답하라.' },
        // 화면이 보낸 질문 그대로 전달
        { role: 'user', content: prompt }
      ]
    })
  })
  // Groq 응답 받기
  const data = await groqRes.json()
  // AI 답만 화면으로 돌려줌
  res.json({ reply: data.choices?.[0]?.message?.content || '(응답 없음)' })
}
