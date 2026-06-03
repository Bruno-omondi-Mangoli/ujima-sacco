import Groq from 'groq-sdk'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3'
const GROQ_MODEL = 'llama3-8b-8192'

// Extract JSON from any AI response
const extractJSON = (text) => {
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON found in AI response')
  return JSON.parse(jsonMatch[0])
}

// Call Groq (production)
const askGroq = async (prompt) => {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const completion = await client.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: GROQ_MODEL,
    temperature: 0.3,
    max_tokens: 1500,
  })
  const text = completion.choices[0]?.message?.content || ''
  return extractJSON(text)
}

// Call Ollama (local)
const askOllama = async (prompt) => {
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      options: { temperature: 0.3, top_p: 0.9 }
    })
  })
  if (!response.ok) throw new Error(`Ollama error: ${response.status}`)
  const data = await response.json()
  return extractJSON(data.response)
}

// Smart router — uses Groq in production, Ollama locally
export const askAI = async (prompt) => {
  if (IS_PRODUCTION) {
    console.log('[AI] Using Groq (production)')
    return await askGroq(prompt)
  } else {
    console.log('[AI] Using Ollama (local)')
    return await askOllama(prompt)
  }
}