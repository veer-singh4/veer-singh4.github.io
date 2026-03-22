/**
 * Cloudflare Worker — Gemini AI Proxy for Veer Singh's Portfolio
 */

export default {
    async fetch(request, env) {

        // ── CORS — allow all origins (safe since key is server-side) ─────────────
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        // GET request — health check so Cloudflare preview doesn't show error
        if (request.method === 'GET') {
            return new Response(JSON.stringify({ status: 'ok', message: 'Veer AI Proxy is running' }), {
                status: 200,
                headers: {...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                status: 405,
                headers: {...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        try {
            // ── Check API key exists ──────────────────────────────────────────────
            if (!env.GEMINI_KEY) {
                return new Response(JSON.stringify({ error: 'GEMINI_KEY secret not set in Cloudflare Worker' }), {
                    status: 500,
                    headers: {...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            // ── Parse incoming request ────────────────────────────────────────────
            let body;
            try {
                body = await request.json();
            } catch {
                return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
                    status: 400,
                    headers: {...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            const { history = [], message, system } = body;

            if (!message) {
                return new Response(JSON.stringify({ error: 'missing message field' }), {
                    status: 400,
                    headers: {...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            // ── Build Gemini request ──────────────────────────────────────────────
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_KEY}`;

            // Filter history to only valid user/model turns
            const validHistory = history.filter(
                m => m ? .role && m ? .parts ? .[0] ? .text &&
                (m.role === 'user' || m.role === 'model')
            );

            const contents = [
                ...validHistory,
                { role: 'user', parts: [{ text: message }] }
            ];

            const geminiBody = {
                contents,
                generationConfig: {
                    temperature: 0.75,
                    maxOutputTokens: 600,
                    topP: 0.9,
                },
            };

            // Only add system_instruction if system prompt exists
            if (system) {
                geminiBody.system_instruction = { parts: [{ text: system }] };
            }

            // ── Call Gemini API ───────────────────────────────────────────────────
            const geminiRes = await fetch(geminiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(geminiBody),
            });

            const data = await geminiRes.json();

            if (!geminiRes.ok) {
                return new Response(
                    JSON.stringify({ error: data ? .error ? .message || `Gemini error ${geminiRes.status}` }), { status: geminiRes.status, headers: {...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            const text = data ? .candidates ? .[0] ? .content ? .parts ? .[0] ? .text || '';

            if (!text) {
                return new Response(
                    JSON.stringify({ error: 'Empty response from Gemini', raw: data }), { status: 500, headers: {...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            // ── Return text to portfolio ──────────────────────────────────────────
            return new Response(
                JSON.stringify({ text: text.trim() }), { status: 200, headers: {...corsHeaders, 'Content-Type': 'application/json' } }
            );

        } catch (err) {
            return new Response(
                JSON.stringify({ error: err.message || 'Unknown error' }), { status: 500, headers: {...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }
    }
};