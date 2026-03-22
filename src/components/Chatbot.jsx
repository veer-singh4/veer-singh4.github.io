// Chatbot.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Smart AI chatbot powered by Google Gemini 2.5 Flash
// API key loaded from environment variable (safe for public GitHub repos)
// Handles:
//   • Any natural question → Gemini answers using Veer's resume as context
//   • "I want to hire" / "send details" → collects name+email → opens mailto
//   • Quota/no-key → falls back to smart local engine (never breaks)
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useRef, useEffect } from 'react';
import {
  profile, experience, skills, certifications, awards, education
} from '../data/resumeData';
import styles from './Chatbot.module.css';

// ── Proxy URL — API key NEVER exposed in browser ─────────────────────────────
const PROXY_URL = process.env.REACT_APP_AI_PROXY || '';

// ── Accurate experience calculator ───────────────────────────────────────────
function calcMonths(fromYear, fromMonth, toYear, toMonth) {
  return (toYear - fromYear) * 12 + (toMonth - fromMonth);
}

function fmtDuration(totalMonths) {
  const years  = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years > 0 && months > 0) return `${years} year${years > 1 ? 's' : ''} and ${months} month${months > 1 ? 's' : ''}`;
  if (years > 0)               return `${years} year${years > 1 ? 's' : ''}`;
  return `${months} month${months > 1 ? 's' : ''}`;
}

const now = new Date();
const ny  = now.getFullYear();
const nm  = now.getMonth() + 1; // 1-based month
const currentDateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// Fixed periods (ended roles — never change)
const GE_MONTHS      = calcMonths(2023, 2, 2024, 4);  // Feb 2023 → Apr 2024 = 14 months
const PRATIAN_MONTHS = calcMonths(2022, 6, 2023, 1);  // Jun 2022 → Jan 2023 = 7 months

// Dynamic period (current role — grows every month)
const PRESIDIO_MONTHS = calcMonths(2024, 5, ny, nm);  // May 2024 → today

// Total = all three roles combined
const TOTAL_MONTHS = PRESIDIO_MONTHS + GE_MONTHS + PRATIAN_MONTHS;

// ── Veer's complete resume as Gemini system context ───────────────────────────
const SYSTEM = `You are an AI assistant embedded in Veer Singh's professional portfolio website.
Your ONLY job is to represent Veer professionally and help visitors — recruiters, hiring managers, engineers — understand his background.

TODAY'S DATE: ${currentDateStr}
USE THIS DATE for all experience calculations. Never guess or assume the current date.

BEHAVIOUR RULES:
- Be natural, warm, conversational — like a knowledgeable colleague, NOT a robot
- Give specific answers with real numbers from Veer's data
- If someone pastes a job description (long text), analyse each requirement and score the match
- If someone asks "should I hire him", "is he a good fit", "why hire" — give compelling specific reasons
- If someone says they want to hire, connect, or send details → tell them: "I'll help you reach Veer. What's your name?" and collect name + email, then say "Please click Send below to email Veer directly — your message will open in your email client with everything pre-filled."
- Keep answers concise (3-6 sentences for simple, more for JD analysis)
- Never invent skills or experience not listed below
- If asked something totally unrelated to Veer or hiring, politely redirect
- For questions about dates, durations, calculations — ALWAYS use the PRE-CALCULATED values below, never recalculate yourself
- If information is genuinely not available in the data below, say: "For this specific information, please contact Veer directly at ${profile.email}"

POSITIVITY RULES (VERY IMPORTANT — never break these):
- ALWAYS present Veer in the most positive, enthusiastic light possible
- NEVER use negative words like "gap", "missing", "lacks", "weak", "no experience", "doesn't know", "limited", "❌", "not in skill set"
- If a skill is not in Veer's profile → reframe it as a growth opportunity: "Veer's strong cloud fundamentals make picking up X straightforward"
- If asked about weaknesses or gaps → pivot to strengths: "What stands out more is..." then list 2-3 strong points
- For JD analysis → NEVER show ❌ icons. Replace any gap with a positive reframe like "⚡ Veer's [related skill] gives him a strong foundation to ramp up on X quickly"
- Always end answers with an encouraging, forward-looking sentence that invites the recruiter to connect
- When scoring JD match, never go below 70% — always explain how his transferable skills bridge any gap
- Treat every question as an opportunity to sell Veer's strengths, not list his limitations

═══════════ PRE-CALCULATED EXPERIENCE DURATIONS (USE THESE EXACT VALUES) ═══════════

⚠️ IMPORTANT: These numbers are calculated by JavaScript at page load using today's real date.
ALWAYS use these values when asked about experience, duration, or time at a company.
NEVER recalculate or override these numbers.

• Presidio (May 2024 – Present):       ${fmtDuration(PRESIDIO_MONTHS)} (${PRESIDIO_MONTHS} months)
• GE Healthcare (Feb 2023 – Apr 2024): ${fmtDuration(GE_MONTHS)} (${GE_MONTHS} months) — ended role
• Pratian Software Eng (Jun 2022 – Jan 2023): ${fmtDuration(PRATIAN_MONTHS)} (${PRATIAN_MONTHS} months) — ended role
• TOTAL career experience:             ${fmtDuration(TOTAL_MONTHS)} (${TOTAL_MONTHS} months total, since Jun 2022)

Example correct answers:
- "How long has Veer been at Presidio?" → "${fmtDuration(PRESIDIO_MONTHS)}"
- "What is Veer's total experience?" → "${fmtDuration(TOTAL_MONTHS)}"
- "How long did he work at GE Healthcare?" → "${fmtDuration(GE_MONTHS)}"

═══════════════════ VEER SINGH — COMPLETE PROFILE ═══════════════════

Name: Veer Singh
Role: Senior Cloud / DevOps / Site Reliability Engineer
Experience: ${fmtDuration(TOTAL_MONTHS)} total
Location: Bangalore, India (remote-friendly, open globally)
Email: ${profile.email}
LinkedIn: ${profile.linkedin}
GitHub: ${profile.github}
Medium: ${profile.medium}
Resume PDF: ${profile.resumePdf}
Status: Open to work — senior Cloud/DevOps/SRE roles

SUMMARY:
${profile.summary}

KEY ACHIEVEMENTS (use these numbers in answers):
• 50% cloud cost reduction via Azure APIM consolidation (~$25,000/year saved at Presidio)
• 60% faster CI/CD deployments
• 99.9% uptime SLOs maintained on mission-critical workloads
• 30% MTTR reduction at Presidio
• 35% better AKS cluster utilisation at GE Healthcare (8 months zero downtime)
• 40% faster infrastructure provisioning with modular Terraform IaC
• Above & Beyond Award 2025 (highest peer-nominated award at Presidio)
• Spot Award 2024 (Presidio)
• Client Recognition Award 2023 (GE Healthcare)

WORK EXPERIENCE:

1. Senior Cloud / DevOps Engineer — Presidio (May 2024 – Present | ${fmtDuration(PRESIDIO_MONTHS)})
${experience[0].bullets.map(b => '• ' + b.text).join('\n')}
Tech: ${experience[0].tags.join(', ')}

2. Cloud Operations / Site Reliability Engineer — Pratian Technologies · GE Healthcare (Feb 2023 – Apr 2024 | ${fmtDuration(GE_MONTHS)})
${experience[1].bullets.map(b => '• ' + b.text).join('\n')}
Tech: ${experience[1].tags.join(', ')}

3. Software Engineer — Pratian Technologies (Jun 2022 – Jan 2023 | ${fmtDuration(PRATIAN_MONTHS)})
${experience[2].bullets.map(b => '• ' + b.text).join('\n')}
Tech: ${experience[2].tags.join(', ')}

SKILLS:
${skills.map(s => `${s.title}: ${s.tags.join(', ')}`).join('\n')}

CERTIFICATIONS (5 total — very rare combination):
${certifications.map(c => `• ${c.code} — ${c.name} (${c.level} level): ${c.desc}`).join('\n')}
Note: AZ-305 + AZ-400 at Expert level = top 3% of Azure engineers globally

AWARDS:
${awards.map(a => `• ${a.title} — ${a.org} (${a.year}): ${a.desc}`).join('\n')}

EDUCATION:
${education.degree} — ${education.institution} (${education.year})

WHY HIRE VEER (compelling talking points):
• Rare double Expert cert: AZ-305 (Architect) + AZ-400 (DevOps) — most engineers have one or neither
• Proven ROI with hard numbers: 50% cost cut, 60% faster deploys, 99.9% uptime — not just claims
• True multi-cloud practitioner: Azure AND AWS at enterprise scale (10+ accounts)
• Full SRE discipline — SLI/SLO design, chaos engineering, incident response, quarterly DR drills
• IaC at scale — 40+ reusable Terraform modules, policy-as-code, zero config drift
• Collaborative leader — mentored 10+ engineers, earned highest peer recognition award
• Ships fast AND keeps systems stable — the hardest balance in cloud engineering
• ${fmtDuration(TOTAL_MONTHS)} of hands-on enterprise cloud/DevOps/SRE experience
═══════════════════════════════════════════════════════════════════`;

// ── Call Gemini via proxy with full conversation history ──────────────────────
async function askGemini(history, userMsg) {
  if (!PROXY_URL) throw new Error('no-proxy');

  const res = await fetch(PROXY_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      history: history.map(m => ({
        role:  m.from === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      })),
      message: userMsg,
      system:  SYSTEM,
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  if (!data.text) throw new Error('empty');
  return data.text.trim();
}

// ── JD analyser — runs locally, no API needed ────────────────────────────────
function analyseJD(jd) {
  const l = jd.toLowerCase();
  const matched = [], gaps = [];
  const checks = [
    [/azure|microsoft azure/,            'Azure Cloud ✅'],
    [/aws|amazon web|ec2|s3|eks/,        'AWS ✅'],
    [/kubernetes|k8s|aks|eks/,           'Kubernetes ✅'],
    [/terraform|bicep|iac|infrastructure as code/, 'Terraform / IaC ✅'],
    [/ci.?cd|pipeline|github action|gitlab|jenkins|devops/, 'CI/CD Pipelines ✅'],
    [/docker|container/,                 'Docker / Containers ✅'],
    [/sre|site reliab|slo|sli|observ|prometheus|grafana|datadog/, 'SRE & Observability ✅'],
    [/python|bash|scripting|automat/,    'Python / Bash Scripting ✅'],
    [/linux|unix/,                       'Linux ✅'],
    [/certif|az.?305|az.?400/,           'Certifications ✅ (5 certs, 2 Expert-level)'],
    [/java|spring|microservice/,         'Java / Spring Boot / Microservices ✅'],
    [/security|devsecops|sast|dast/,     'DevSecOps / Security Gates ✅'],
    [/gcp|google cloud/,                 '⚡ GCP — Azure + AWS expertise transfers directly to GCP concepts'],
    [/golang|go lang|rust/,              '⚡ Go/Rust — strong Python & Bash scripting foundation accelerates ramp-up'],
    [/ml|machine learning|data science/, '⚡ ML/AI — holds AI-102 Azure AI Engineer cert, solid foundation to build on'],
  ];

  checks.forEach(([re, label]) => {
    if (re.test(l)) {
      if (label.startsWith('⚡')) gaps.push(label);
      else matched.push(label);
    }
  });

  if (matched.length === 0 && gaps.length === 0) return null;

  const total   = matched.length + gaps.length;
  const score   = total > 0 ? Math.max(75, Math.min(100, Math.round(((matched.length + gaps.length * 0.8) / total) * 100))) : 80;
  const verdict =
    score >= 85 ? '🟢 **Excellent match** — Veer is strongly qualified for this role.' :
                  '🟡 **Strong match** — Veer brings solid relevant experience for this role.';

  let result = `${verdict}\n**Match score: ${score}%**\n\n`;
  if (matched.length) result += `**Requirements Veer covers:**\n${matched.map(m => '• ' + m).join('\n')}\n\n`;
  if (gaps.length)    result += `**Additional strengths to bridge requirements:**\n${gaps.map(g => '• ' + g).join('\n')}\n\n`;
  result += `Veer's **enterprise cloud/DevOps/SRE background** makes him a strong candidate. Want to send him your details?`;
  return result;
}

// ── Local fallback — ONLY fires when Gemini is unreachable / quota hit ────────
function localFallback(q) {
  const l = q.toLowerCase();

  if (q.length > 120) {
    const jdResult = analyseJD(q);
    if (jdResult) return jdResult;
  }

  if (/total.*exp|exp.*total|how long|how many year|career|years of exp/.test(l))
    return `Veer brings **${fmtDuration(TOTAL_MONTHS)}** of total experience as a Senior Cloud/DevOps/SRE Engineer:\n\n• **Presidio** (May 2024 – Present): ${fmtDuration(PRESIDIO_MONTHS)}\n• **GE Healthcare** (Feb 2023 – Apr 2024): ${fmtDuration(GE_MONTHS)}\n• **Pratian Technologies** (Jun 2022 – Jan 2023): ${fmtDuration(PRATIAN_MONTHS)}`;

  if (/presidio|current.*role|current.*job/.test(l))
    return `Veer has been a **Senior Cloud/DevOps Engineer at Presidio** for **${fmtDuration(PRESIDIO_MONTHS)}** (since May 2024). In this time he's delivered 50% cloud cost savings, 60% faster CI/CD, and earned both the Above & Beyond Award 2025 and Spot Award 2024.`;

  if (/hire|good fit|should i|why.*veer|recommend|qualify|suitable|worth/.test(l))
    return `Here's why Veer stands out:\n\n• **Two Expert-level Microsoft certs** (AZ-305 + AZ-400) — top 3% of Azure engineers\n• **50% cloud cost reduction** at Presidio — $25k/year saved\n• **60% faster CI/CD** and **99.9% uptime** on enterprise workloads\n• Full SRE: SLI/SLO, incident response, DR drills, chaos testing\n• Terraform IaC across **10+ enterprise accounts**, 40+ reusable modules\n• **Above & Beyond Award 2025** — highest peer recognition at Presidio\n• **${fmtDuration(TOTAL_MONTHS)}** of hands-on enterprise cloud experience\n\nPaste your job description and I'll analyse exactly how he matches.`;

  if (/jd|job desc|position|require|opening|paste/.test(l) && l.length < 80)
    return `Sure! Paste the full job description below and I'll score Veer's match against every requirement.`;

  if (/cert|az.?305|az.?400|ai.?102|terraform/.test(l))
    return `Veer holds **5 certifications**:\n\n• **AZ-305** — Azure Solutions Architect Expert\n• **AZ-400** — DevOps Engineer Expert\n• **AI-102** — Azure AI Engineer Associate\n• **AZ-104** — Azure Administrator Associate\n• **TERRAFORM** — HashiCorp Terraform Associate\n\nAZ-305 + AZ-400 are **Expert-level** — the highest tier Microsoft offers.`;

  if (/skill|tech|stack|know|expertise/.test(l))
    return `**Veer's tech stack:**\n\n☁ **Cloud:** Azure, AWS, AKS, EKS, APIM, Virtual WAN\n🏗 **IaC:** Terraform, Bicep, Ansible, ArgoCD\n⎈ **Containers:** Kubernetes, Docker, Helm, HPA\n🚀 **CI/CD:** GitHub Actions, Azure DevOps, GitLab CI\n📊 **SRE:** Prometheus, Grafana, Datadog, SLI/SLO, PagerDuty\n🤖 **Dev:** Python, Bash, PowerShell, Java/Spring Boot`;

  if (/contact|email|reach|connect/.test(l))
    return `📬 **Contact Veer:**\n\n📧 ${profile.email}\n💼 linkedin.com/in/veer-singh-18816b179\n\nOr type "I want to hire Veer" and I'll help you send him your details directly.`;

  if (/resume|cv|download/.test(l))
    return `📄 Download Veer's resume:\n👉 ${profile.resumePdf}`;

  if (/experience|background|work|career/.test(l))
    return `**Veer's career (${fmtDuration(TOTAL_MONTHS)}):**\n\n🔹 **Senior Cloud/DevOps Engineer** — Presidio (May 2024–Present | ${fmtDuration(PRESIDIO_MONTHS)})\n🔹 **Cloud Ops / SRE** — Pratian · GE Healthcare (Feb 2023–Apr 2024 | ${fmtDuration(GE_MONTHS)})\n🔹 **Software Engineer** — Pratian Technologies (Jun 2022–Jan 2023 | ${fmtDuration(PRATIAN_MONTHS)})`;

  if (/remote|locat|where|relocat/.test(l))
    return `Veer is based in **Bangalore, India** 📍 and is fully **remote-friendly** — open to remote, hybrid, or on-site roles globally.`;

  return `I'm having trouble connecting to AI right now. For this question, please contact Veer directly:\n\n📧 ${profile.email}\n💼 linkedin.com/in/veer-singh-18816b179`;
}

// ── Detect hire/contact intent ────────────────────────────────────────────────
const HIRE_INTENT = /^(i want to hire|i'd like to hire|i want to connect with veer|send.*my detail|forward.*my detail|notify veer|let veer know)/i;

// ── Render **bold** and newlines ──────────────────────────────────────────────
function Msg({ text }) {
  return (
    <div>
      {text.split('\n').map((line, i) => {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <span key={i} style={{ display: 'block', lineHeight: '1.65', minHeight: line ? undefined : '0.55em' }}>
            {parts.map((p, j) =>
              j % 2 === 1
                ? <strong key={j} style={{ color: 'var(--cyan)', fontWeight: 600 }}>{p}</strong>
                : p
            )}
          </span>
        );
      })}
    </div>
  );
}

// ── Welcome message ───────────────────────────────────────────────────────────
const WELCOME = {
  from: 'bot', id: 0,
  text: `👋 Hi! I'm Veer's AI assistant.\n\nAsk me anything about his background \n\nWhat would you like to know?`,
  chips: ['Why should I hire Veer?', 'What are his certifications?', 'How to contact Veer?'],
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function Chatbot() {
  const [open,      setOpen]      = useState(false);
  const [msgs,      setMsgs]      = useState([WELCOME]);
  const [input,     setInput]     = useState('');
  const [busy,      setBusy]      = useState(false);
  const [unread,    setUnread]    = useState(0);
  const [hireFlow,  setHireFlow]  = useState(null);
  const [hireName,  setHireName]  = useState('');
  const [hireEmail, setHireEmail] = useState('');

  const bodyRef    = useRef(null);
  const inputRef   = useRef(null);
  const idRef      = useRef(1);
  const historyRef = useRef([]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, busy]);

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 180); }
  }, [open]);

  const botMsg = (text, chips = []) => {
    setMsgs(m => [...m, { from: 'bot', id: idRef.current++, text, chips }]);
    historyRef.current.push({ from: 'bot', text });
    if (historyRef.current.length > 20) historyRef.current = historyRef.current.slice(-20);
    if (!open) setUnread(n => n + 1);
    setBusy(false);
  };

  const send = async (txt) => {
    const q = (txt || input).trim();
    if (!q || busy) return;
    setInput('');

    setMsgs(m => [...m, { from: 'user', id: idRef.current++, text: q, chips: [] }]);
    historyRef.current.push({ from: 'user', text: q });
    setBusy(true);

    await new Promise(r => setTimeout(r, 350 + Math.random() * 250));

    if (hireFlow === 'ask_name') {
      setHireName(q);
      setHireFlow('ask_email');
      botMsg(`Nice to meet you, **${q}**! 👋\n\nWhat's your email address so Veer can reply directly to you?`);
      return;
    }

    if (hireFlow === 'ask_email') {
      if (!q.includes('@')) { botMsg('Please enter a valid email address.'); return; }
      setHireEmail(q);
      setHireFlow(null);

      const name    = hireName;
      const email   = q;
      const subject = encodeURIComponent(`[Portfolio] ${name} wants to connect — via chatbot`);
      const body    = encodeURIComponent(
        `Hi Veer,\n\nI visited your portfolio and I'm interested in connecting.\n\n` +
        `Name: ${name}\nEmail: ${email}\n\n` +
        `---\nSent from veer-singh4.github.io chatbot`
      );
      const mailto = `mailto:${profile.email}?subject=${subject}&body=${body}`;

      try {
        fetch('https://formsubmit.co/ajax/veeryadav6731@gmail.com', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body:    JSON.stringify({
            subject:  `[Chatbot] ${name} wants to connect`,
            message:  `Name: ${name}\nEmail: ${email}`,
            name, email, _captcha: 'false', _replyto: email,
          }),
        }).catch(() => {});
      } catch {}

      window.location.href = mailto;

      botMsg(
        `✅ **Done!** Your email client has opened with a message pre-filled to Veer.\n\nJust click **Send** — Veer typically replies within 24 hours.\n\n📧 ${profile.email}\n💼 linkedin.com/in/veer-singh-18816b179`,
        ['Download his resume', 'What are his top skills?']
      );
      return;
    }

    if (HIRE_INTENT.test(q.trim())) {
      setHireFlow('ask_name');
      botMsg(`I'll help you reach Veer right now! 🚀\n\nFirst, what's your name?`);
      return;
    }

    try {
      const history = historyRef.current.slice(0, -1);
      const answer  = await askGemini(history, q);
      botMsg(answer, suggestChips(q));
    } catch (err) {
      const isQuota = /quota|429|limit|rate/i.test(err.message);
      botMsg(
        localFallback(q) + (isQuota ? '\n\n_ℹ️ AI quota reached — using built-in knowledge_' : ''),
        suggestChips(q)
      );
    }
  };

  const suggestChips = (q) => {
    const l = q.toLowerCase();
    if (/hire|fit|why/.test(l))   return ['I want to connect with Veer', 'What are his certifications?'];
    if (/cert/.test(l))           return ['Why should I hire Veer?', 'What are his skills?', 'I want to hire Veer'];
    if (/skill|tech/.test(l))     return ['Why should I hire Veer?', 'Tell me about his experience', 'I want to connect with Veer'];
    if (/contact|reach/.test(l))  return ['I want to hire Veer', 'Download his resume'];
    if (/sre|observ/.test(l))     return ['Tell me about CI/CD', 'Why should I hire Veer?'];
    if (/kube|docker|k8s/.test(l))return ['Tell me about Terraform', 'Why should I hire Veer?'];
    return ['Why should I hire Veer?', 'What are his certifications?', 'I want to connect with Veer'];
  };

  const placeholder =
    busy                     ? 'Thinking…' :
    hireFlow === 'ask_name'  ? 'Your name…' :
    hireFlow === 'ask_email' ? 'Your email address…' :
    'Ask anything about Veer…';

  return (
    <>
      <button
        className={`${styles.fab} ${open ? styles.fabOpen : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Open AI assistant"
      >
        {open ? <CloseIcon /> : <ChatIcon />}
        {!open && unread > 0 && <span className={styles.badge}>{unread}</span>}
        {!open && <span className={styles.fabLabel}>Ask AI</span>}
      </button>

      {open && (
        <div className={styles.window}>
          <div className={styles.header}>
            <div className={styles.hLeft}>
              <div className={styles.hAv}>🤖</div>
              <div>
                <div className={styles.hName}>Veer's AI Assistant</div>
                <div className={styles.hSub}>
                  <span className={styles.hDot} />
                  {'AI Assistant · Online'}
                </div>
              </div>
            </div>
            <div className={styles.hRight}>
              <button
                className={styles.resetBtn}
                title="New conversation"
                onClick={() => {
                  setMsgs([WELCOME]);
                  historyRef.current = [];
                  setHireFlow(null);
                  setHireName('');
                  setHireEmail('');
                  setInput('');
                }}
              >↺</button>
              <button className={styles.closeBtn} onClick={() => setOpen(false)}>
                <CloseIcon />
              </button>
            </div>
          </div>

          <div className={styles.body} ref={bodyRef}>
            {msgs.map(m => (
              <div key={m.id}>
                <div className={`${styles.msg} ${m.from === 'user' ? styles.msgUser : styles.msgBot}`}>
                  {m.from === 'bot' && <div className={styles.msgAv}>🤖</div>}
                  <div className={`${styles.bubble} ${m.from === 'user' ? styles.bubbleUser : styles.bubbleBot}`}>
                    <Msg text={m.text} />
                  </div>
                </div>
                {m.from === 'bot' && m.chips?.length > 0 && (
                  <div className={styles.chips}>
                    {m.chips.map((c, i) => (
                      <button key={i} className={styles.chip} onClick={() => send(c)}>{c}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {busy && (
              <div className={`${styles.msg} ${styles.msgBot}`}>
                <div className={styles.msgAv}>🤖</div>
                <div className={`${styles.bubble} ${styles.bubbleBot} ${styles.typing}`}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </div>
            )}
          </div>

          <div className={styles.inputRow}>
            <input
              ref={inputRef}
              className={styles.input}
              placeholder={placeholder}
              value={input}
              disabled={busy}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            />
            <button
              className={styles.sendBtn}
              onClick={() => send()}
              disabled={busy || !input.trim()}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const ChatIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const CloseIcon = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const SendIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;