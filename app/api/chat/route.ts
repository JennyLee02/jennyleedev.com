import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory store for rate limiting
const ipRequestCounts = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15 // Max 15 requests per IP per minute (slightly increased from 10)

export async function POST(req: NextRequest) {
  // IP-based Rate Limiting
  // Get IP from x-forwarded-for header (common for proxies/load balancers) or fallback
  const forwardedFor = req.headers.get('x-forwarded-for')
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown' 
  // If no x-forwarded-for, you might try to get it from other headers if your deployment setup is different,
  // or rely on a more robust library for IP detection if needed.
  // For now, this is a reasonable approach for Vercel/Next.js deployments.

  const now = Date.now()

  const currentEntry = ipRequestCounts.get(ip)

  if (currentEntry && now - currentEntry.timestamp < RATE_LIMIT_WINDOW_MS) {
    if (currentEntry.count >= MAX_REQUESTS_PER_WINDOW) {
      console.warn(`Rate limit exceeded for IP: ${ip}`)
      return NextResponse.json({ error: 'You have exceeded the limit. Please try again later.' }, { status: 429 })
    }
    ipRequestCounts.set(ip, { count: currentEntry.count + 1, timestamp: currentEntry.timestamp })
  } else {
    // Reset window or new IP
    ipRequestCounts.set(ip, { count: 1, timestamp: now })
  }

  // Clean up old entries periodically (optional, for long-running servers)
  // This is a simple cleanup, for very high traffic, consider more sophisticated cleanup or a TTL store.
  if (Math.random() < 0.01) { // 1% chance to run cleanup
    for (const [keyIp, entry] of ipRequestCounts.entries()) {
      if (now - entry.timestamp > RATE_LIMIT_WINDOW_MS * 5) { // Clean entries older than 5 windows
        ipRequestCounts.delete(keyIp)
      }
    }
  }

  try {
    const { message, context } = await req.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    const systemPrompt = `You are a helpful coding tutor and study assistant for LeetCode problems. 

Current problem context:
- Title: ${context?.title || 'Unknown'}
- Difficulty: ${context?.difficulty || 'Unknown'}
- Category: ${context?.category || 'Unknown'}

Guidelines:
- Provide helpful hints and guidance without giving away the complete solution
- Explain concepts clearly (algorithms, data structures, complexity)
- Help debug code and suggest improvements
- Ask clarifying questions to understand what the user needs help with
- Be encouraging and supportive
- If asked for the solution directly, offer to provide hints or explain concepts instead

Keep responses concise but helpful. Use code examples when appropriate.`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: `User: ${message}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text(); // Or response.json() if you expect JSON error details
      console.error('Gemini API Error Status:', response.status);
      console.error('Gemini API Error Body:', errorBody);
      throw new Error(`Failed to get response from Gemini. Status: ${response.status}, Body: ${errorBody}`)
    }

    const data = await response.json()
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Failed to process chat message' }, { status: 500 })
  }
} 