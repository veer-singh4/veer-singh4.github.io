/**
 * Cloudflare Worker — Gemini AI Proxy for Veer Singh's Portfolio
 * 
 * HOW IT WORKS:
 *   Portfolio chatbot → POST to this Worker URL
 *   Worker adds the Gemini API key (stored as CF Secret)
 *   Worker calls Gemini → returns response
 *   API key NEVER reaches the browser
 * 
 * DEPLOY STEPS (all free):
 *   1. Go to workers.cloudflare.com → sign up free
 *   2. Create new Worker → paste this code
 *   3. Settings → Variables → Add secret: GEMINI_KEY = your key
 *   4. Save → copy your Worker URL (e.g. https://veer-ai.your-name.workers.dev)
 *   5. Add to GitHub Secrets: REACT_APP_AI_PROXY = https://veer-ai.your-name.workers.dev
 */

export default {
  async fetch(request, env) {

    // ── CORS — allow your portfolio domain ───────────────────────────────────
    const ALLOWED = [
      'https://veer-singh4.github.io',
      'http://localhost:3000',           // local dev
    ];
    const origin  = request.headers.get('Origin') || '';
    const allowed = ALLOWED.includes(origin) || origin.endsWith('.github.io');

    const corsHeaders = {
      'Access-Control-Allow-Origin':  allowed ? origin : ALLOWED[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      // ── Parse incoming request from portfolio ─────────────────────────────
      const { history = [], message, system } = await request.json();

      if (!message) {
        return new Response(JSON.stringify({ error: 'missing message' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // ── Call Gemini — key stored as Cloudflare Secret, never in code ──────
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_KEY}`;

      const contents = [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ];

      const geminiRes = await fetch(geminiUrl, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          system_instruction: system ? { parts: [{ text: system }] } : undefined,
          contents,
          generationConfig: {
            temperature:     0.75,
            maxOutputTokens: 600,
            topP:            0.9,
          },
        })
      });

      if (!geminiRes.ok) {
        const err = await geminiRes.json().catch(() => ({}));
        return new Response(
          JSON.stringify({ error: err?.error?.message || `Gemini error ${geminiRes.status}` }),
          { status: geminiRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await geminiRes.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // ── Return just the text to the portfolio ────────────────────────────
      return new Response(
        JSON.stringify({ text: text.trim() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }
};
