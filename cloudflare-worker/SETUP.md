# Cloudflare Worker Setup — 5 minutes, completely free

## Why this is needed
If you put the Gemini API key directly in your React code, it appears in the compiled
JavaScript and anyone can find it in browser DevTools. This Worker keeps the key
server-side — only the Worker URL is public.

## Step 1 — Create free Cloudflare account
Go to: https://workers.cloudflare.com
Sign up free (no credit card needed)

## Step 2 — Create the Worker
1. Dashboard → Workers & Pages → Create application → Create Worker
2. Name it: veer-ai-proxy
3. Click Edit code
4. Delete all existing code
5. Paste the contents of worker.js
6. Click Save and Deploy

## Step 3 — Add your Gemini key as a secret (NEVER visible in code)
1. Worker dashboard → Settings → Variables
2. Under "Environment Variables" → click "Edit variables"  
3. Add: Variable name = GEMINI_KEY, Value = your Gemini key
4. Click "Encrypt" (makes it a secret)
5. Save

## Step 4 — Get your Worker URL
It looks like: https://veer-ai-proxy.YOUR-NAME.workers.dev
Copy it.

## Step 5 — Add to GitHub Secrets
Repo → Settings → Secrets and variables → Actions → New secret
  Name:  REACT_APP_AI_PROXY
  Value: https://veer-ai-proxy.YOUR-NAME.workers.dev

## Step 6 — Push to deploy
git add .
git commit -m "Add secure AI proxy"
git push origin main

Done! The chatbot now uses real Gemini AI with the key completely hidden.

## Free tier limits (more than enough)
- 100,000 Worker requests per day
- 10ms CPU time per request
- No credit card ever needed
