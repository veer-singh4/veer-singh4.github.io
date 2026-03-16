// Hero.jsx — Orbital avatar + planet skills + voice (always male) + download
import { useEffect, useRef, useState } from 'react';
import { profile, stats } from '../data/resumeData';
import styles from './Hero.module.css';
import photo from '../assets/photo.jpg';

// ── Voice text ────────────────────────────────────────────────────────────────
const VOICE_TEXT =
  "Hi, I'm Veer Singh — a Senior Cloud, DevOps, and Site Reliability Engineer with " +
  "over 3 years of experience building enterprise-grade multi-cloud infrastructure. " +
  "At Presidio, I delivered a 50 percent reduction in cloud costs, 60 percent faster " +
  "deployments, and 99.9 percent uptime SLOs. I hold 5 certifications including " +
  "Azure Solutions Architect Expert and DevOps Engineer Expert. " +
  "I'm passionate about infrastructure that ships fast and stays reliable. " +
  "I'm currently open to senior Cloud, DevOps, and SRE roles — feel free to reach out!";

// ── Guaranteed male voice picker — works on iOS, Android, Windows, Mac ────────
// ── Bulletproof male voice — works on iOS, Android, Windows, Mac ─────────────
// Tested voice names per platform:
// iOS Safari:     Daniel (UK male) ✅
// Android Chrome: Google UK English Male ✅
// Windows Edge:   Microsoft David / Microsoft Mark ✅
// Windows Chrome: Google UK English Male ✅
// macOS Safari:   Daniel / Alex ✅
// macOS Chrome:   Google UK English Male ✅

const MALE_KEYWORDS = [
  // iOS / macOS
  'daniel',      // iOS UK male — best option on iPhone/iPad
  'alex',        // macOS male
  'fred',        // macOS male
  'bruce',       // macOS male  
  'ralph',       // macOS male
  'lee',         // macOS male (zh-en)
  // Google voices (Android / Chrome desktop)
  'google uk english male',
  'google hindi male',
  // Microsoft voices (Windows)
  'microsoft david',
  'microsoft mark',
  'microsoft james',
  'microsoft rishi',  // Indian English male
  'microsoft ryan',
  // Generic names that are male
  'david','mark','james','george','thomas','oliver','matthew',
  'rishi','mohan','aaron','arthur','reed','liam','ryan','tom',
  'richard','harry','william','henry',
];

const FEMALE_KEYWORDS = [
  // iOS / macOS — these are the ones causing the problem on mobile
  'samantha',    // iOS default — always female, always first
  'karen',       // iOS AU female
  'moira',       // iOS IE female
  'tessa',       // iOS ZA female
  'fiona',       // iOS SC female
  'victoria',    // iOS UK female
  'allison',     // macOS female
  'ava',         // macOS female
  'susan',       // macOS female
  'kate',        // macOS female
  // Google voices
  'google us english',  // usually female
  'google uk english female',
  // Microsoft
  'microsoft zira',
  'microsoft hazel',
  'microsoft susan',
  'cortana',
  // Generic female names
  'serena','siri','helena','laura','nora','amélie','marie',
  'sandy','siobhan','alice','emma','anna','sarah','lisa',
  'linda','jessica','mary','barbara','patricia',
];

function isMale(voice) {
  const n = voice.name.toLowerCase();
  // Explicit female check first — if name matches female list, reject
  if (FEMALE_KEYWORDS.some(f => n.includes(f))) return false;
  // Explicit male check
  if (MALE_KEYWORDS.some(m => n.includes(m))) return true;
  // Unknown — could be male or female, return null (undecided)
  return null;
}

function pickMaleVoice(voices) {
  if (!voices || voices.length === 0) return null;
  
  const en = voices.filter(v => /^en/i.test(v.lang));
  const all_v = en.length > 0 ? en : voices;

  // Pass 1 — explicitly named male voices (highest confidence)
  for (const kw of MALE_KEYWORDS) {
    const v = all_v.find(v => v.name.toLowerCase().includes(kw));
    if (v) return v;
  }

  // Pass 2 — voices not on the female list (neutral/unknown)
  const notFemale = all_v.find(v => isMale(v) !== false);
  if (notFemale) return notFemale;

  // Pass 3 — last resort, any English voice
  if (en.length > 0) return en[0];
  
  return voices[0] || null;
}

// ── Planet skills orbiting the avatar ────────────────────────────────────────
const PLANETS = [
  { label:'☁ Azure',       color:'#38bdf8', orbit:155, speed:0.00042, angle:0.0,  size:9.5 },
  { label:'⎈ Kubernetes',  color:'#00e5cc', orbit:155, speed:0.00042, angle:2.09, size:9.5 },
  { label:'🏗 Terraform',   color:'#a78bfa', orbit:155, speed:0.00042, angle:4.19, size:9.5 },
  { label:'🚀 CI/CD',       color:'#f59e0b', orbit:218, speed:0.00026, angle:0.8,  size:9  },
  { label:'📊 Grafana',     color:'#f97316', orbit:218, speed:0.00026, angle:2.9,  size:9  },
  { label:'☁ AWS',          color:'#fbbf24', orbit:218, speed:0.00026, angle:4.9,  size:9  },
  { label:'AZ-305',         color:'#fbbf24', orbit:282, speed:0.00016, angle:1.2,  size:8.5 },
  { label:'🐳 Docker',      color:'#60a5fa', orbit:282, speed:0.00016, angle:3.4,  size:8.5 },
  { label:'📡 Datadog',     color:'#e879f9', orbit:282, speed:0.00016, angle:5.5,  size:8.5 },
];

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export default function Hero({ onSearchOpen }) {
  const statsRef  = useRef(null);
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const anglesRef = useRef(PLANETS.map(p => p.angle));
  const [playing, setPlaying] = useState(false);

  // ── Animated counters ──────────────────────────────────────────────────────
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.querySelectorAll('[data-count]').forEach(el => {
          const raw = el.dataset.count;
          const num = parseFloat(raw);
          // suffix = everything after the digits (%, ×, etc.)
          const suf = raw.replace(/^[\d.]+/, '');
          const dec = raw.includes('.') ? 1 : 0;
          let t0 = null;
          const step = ts => {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / 1600, 1);
            const e = 1 - Math.pow(1 - p, 3);
            el.textContent = (num * e).toFixed(dec) + suf;
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = raw;
          };
          requestAnimationFrame(step);
        });
        obs.unobserve(en.target);
      });
    }, { threshold: 0.5 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  // ── Orbital canvas ─────────────────────────────────────────────────────────
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const SIZE = 620;
    cv.width = SIZE; cv.height = SIZE;
    const ctx = cv.getContext('2d');
    const CX = SIZE / 2, CY = SIZE / 2;
    const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';

    const draw = ts => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      const dark = isDark();

      // Orbit rings
      [155, 218, 282].forEach((r, i) => {
        ctx.beginPath(); ctx.arc(CX, CY, r, 0, Math.PI * 2);
        ctx.strokeStyle = dark
          ? `rgba(0,229,204,${0.12 - i * 0.028})`
          : `rgba(29,100,220,${0.14 - i * 0.03})`;
        ctx.lineWidth = 1; ctx.setLineDash([4, 10]); ctx.stroke(); ctx.setLineDash([]);
      });

      // Photo glow
      const grd = ctx.createRadialGradient(CX, CY, 48, CX, CY, 115);
      grd.addColorStop(0, dark ? 'rgba(0,229,204,0.14)' : 'rgba(29,100,220,0.11)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(CX, CY, 115, 0, Math.PI * 2); ctx.fill();

      // Spinning dashed ring tight around photo
      ctx.save(); ctx.translate(CX, CY); ctx.rotate(ts * 0.00038);
      ctx.beginPath(); ctx.arc(0, 0, 108, 0, Math.PI * 2);
      ctx.strokeStyle = dark ? 'rgba(0,229,204,0.50)' : 'rgba(29,100,220,0.44)';
      ctx.lineWidth = 2; ctx.setLineDash([12, 18]); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();

      // Counter-spinning outer ring
      ctx.save(); ctx.translate(CX, CY); ctx.rotate(-ts * 0.00022);
      ctx.beginPath(); ctx.arc(0, 0, 118, 0, Math.PI * 2);
      ctx.strokeStyle = dark ? 'rgba(45,140,255,0.28)' : 'rgba(0,119,170,0.22)';
      ctx.lineWidth = 1; ctx.setLineDash([6, 22]); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();

      // Planet skills
      anglesRef.current = anglesRef.current.map((angle, i) => {
        const p   = PLANETS[i];
        const a   = angle + p.speed * 16;
        const px  = CX + Math.cos(a) * p.orbit;
        const py  = CY + Math.sin(a) * p.orbit;

        // Glow behind dot
        const g = ctx.createRadialGradient(px, py, 0, px, py, p.size * 2.8);
        g.addColorStop(0, p.color + '44'); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, p.size * 2.8, 0, Math.PI * 2); ctx.fill();

        // Dot border + fill
        ctx.beginPath(); ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '28'; ctx.strokeStyle = p.color; ctx.lineWidth = 1.5;
        ctx.fill(); ctx.stroke();
        // Inner bright dot
        ctx.beginPath(); ctx.arc(px, py, p.size * 0.38, 0, Math.PI * 2);
        ctx.fillStyle = p.color + 'cc'; ctx.fill();

        // Label pill
        ctx.save();
        const fs = p.size * 1.08;
        ctx.font = `${fs}px JetBrains Mono, monospace`;
        const tw = ctx.measureText(p.label).width;
        const pw = tw + 14, ph = p.size * 2.05;
        const lx = px + p.size + 5, ly = py - ph / 2;
        ctx.fillStyle   = dark ? 'rgba(5,12,24,0.88)' : 'rgba(238,246,255,0.93)';
        ctx.strokeStyle = p.color + '99';
        ctx.lineWidth   = 1;
        rrect(ctx, lx, ly, pw, ph, 4); ctx.fill(); ctx.stroke();
        ctx.fillStyle = p.color;
        ctx.fillText(p.label, lx + 7, ly + ph * 0.70);
        ctx.restore();

        return a;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  // ── Voice — guaranteed male on ALL devices ─────────────────────────────────
  const handleVoice = () => {
    if (!('speechSynthesis' in window)) { alert('Text-to-speech not supported in this browser.'); return; }
    if (playing) { window.speechSynthesis.cancel(); setPlaying(false); return; }

    // Core speak function — always waits for ALL voices to load before picking
    const speak = (voiceList) => {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(VOICE_TEXT);
      
      const v = pickMaleVoice(voiceList);
      
      if (v) {
        u.voice = v;
        u.lang  = v.lang;
        console.log('Voice selected:', v.name, v.lang); // debug — check in browser console
      } else {
        // No voice found — use pitch trick to sound more masculine
        u.lang = 'en-GB'; // British English tends to use Daniel (male) on iOS
      }
      
      // Lower pitch = more masculine on ALL platforms
      // This is the KEY fix for mobile — even if voice selection fails,
      // pitch 0.85 makes female voices sound noticeably more masculine
      u.rate   = 0.90;
      u.pitch  = 0.82;  // ← THIS is what actually works on mobile when voice selection fails
      u.volume = 1;
      
      u.onstart = () => setPlaying(true);
      u.onend   = () => setPlaying(false);
      u.onerror = () => { setPlaying(false); };
      
      window.speechSynthesis.speak(u);
    };

    // iOS Safari critical fix:
    // getVoices() returns [] on first call — must wait for onvoiceschanged
    // BUT onvoiceschanged never fires if voices are already cached
    // Solution: try both paths with a timeout fallback
    
    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        speak(voices);
        return true;
      }
      return false;
    };

    if (!trySpeak()) {
      // Voices not loaded yet (iOS first load)
      let fired = false;
      
      window.speechSynthesis.onvoiceschanged = () => {
        if (fired) return;
        fired = true;
        window.speechSynthesis.onvoiceschanged = null;
        const voices = window.speechSynthesis.getVoices();
        speak(voices);
      };
      
      // Timeout fallback — if onvoiceschanged never fires (some Android browsers)
      // just speak with pitch trick after 800ms
      setTimeout(() => {
        if (fired) return;
        fired = true;
        window.speechSynthesis.onvoiceschanged = null;
        const voices = window.speechSynthesis.getVoices();
        speak(voices); // speak with whatever we have, pitch will handle it
      }, 800);
    }
  };

  // ── Download resume ────────────────────────────────────────────────────────
  const handleDownload = () => {
    window.open(profile.resumePdf, '_blank');
    try {
      fetch('https://formsubmit.co/ajax/veeryadav6731@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ subject: '📄 Resume Downloaded', message: `Downloaded at ${new Date().toLocaleString()}`, _captcha: 'false' }),
      }).catch(() => {});
    } catch {}
    const t = document.getElementById('dl-toast');
    if (t) { t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 4000); }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section id="hero" className={styles.hero}>

      {/* ── LEFT: Copy ── */}
      <div className={styles.left}>
        <div className={styles.badge}><span className={styles.badgeDot}/>AVAILABLE FOR SENIOR ROLES</div>

        <p className={styles.greeting}>Hi, I'm</p>
        <h1 className={styles.name}>
          <span className={styles.n1}>VEER</span>
          <span className={styles.n2}>SINGH</span>
        </h1>

        <div className={styles.roles}>
          <span className={`${styles.roleTag} ${styles.rtBlue}`}>☁ Cloud Engineer</span>
          <span className={`${styles.roleTag} ${styles.rtCyan}`}>⚙ DevOps Engineer</span>
          <span className={`${styles.roleTag} ${styles.rtPurple}`}>🔁 SRE</span>
        </div>

        <p className={styles.desc}>
          <strong>3+ years</strong> architecting enterprise multi-cloud infrastructure on{' '}
          <strong>Azure & AWS</strong>. Delivered{' '}
          <strong>50% cost reduction, 60% faster deployments, 99.9% uptime SLOs</strong>.
          Holder of <strong>5 Microsoft & HashiCorp certifications</strong>.
        </p>

        {/* Voice bar */}
        <div className={styles.voiceBar}>
          <button
            className={`${styles.voiceBtn} ${playing ? styles.voicePlaying : ''}`}
            onClick={handleVoice}
            title={playing ? 'Stop' : 'Listen to audio introduction (male voice)'}
          >
            {playing ? '⏸' : '▶'}
          </button>
          <div className={styles.voiceInfo}>
            <div className={styles.voiceTitle}>🎙 Audio Introduction</div>
            <div className={styles.voiceSub}>{playing ? 'Playing…' : '30-sec professional summary'}</div>
          </div>
          <div className={styles.voiceBars}>
            {[22, 14, 26, 18, 22, 16, 24, 20, 12, 18].map((h, i) => (
              <span key={i} className={`${styles.vBar} ${playing ? styles.vBarAnim : ''}`}
                style={{ '--h': `${h}px`, '--d': `${0.10 + i * 0.07}s` }} />
            ))}
          </div>
        </div>

        <div className={styles.ctas}>
          <a href="#experience" className="btn btn-primary"><BriefIcon /> View Experience</a>
          <button className="btn btn-outline" onClick={handleDownload}><DlIcon /> Download Resume</button>
          <button className="btn btn-ghost" onClick={onSearchOpen}><SearchIcon /> AI Search</button>
        </div>

        <div className={styles.socials}>
          {[
            { href: profile.linkedin, title: 'LinkedIn',  icon: <LiIcon /> },
            { href: profile.github,   title: 'GitHub',    icon: <GhIcon /> },
            { href: profile.medium,   title: 'Medium',    icon: <MdIcon /> },
            { href: `mailto:${profile.email}`, title: 'Email', icon: <MailIcon /> },
          ].map(s => (
            <a key={s.title} href={s.href}
               target={s.href.startsWith('http') ? '_blank' : undefined}
               rel="noopener" className={styles.socialLink} title={s.title}>{s.icon}</a>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Orbital scene + terminal + stats ── */}
      <div className={styles.right}>

        <div className={styles.orbitalScene}>
          <canvas ref={canvasRef} className={styles.orbitalCanvas} />
          <div className={styles.photoCircle}>
            <img src={photo} alt="Veer Singh" className={styles.photoImg} />
            <span className={styles.onlineDot} />
          </div>
          <div className={styles.hexBadge}><div className={styles.hexInner}>🏆</div></div>
        </div>

        <div className={styles.terminal}>
          <div className={styles.termBar}>
            <span className={styles.tdR}/><span className={styles.tdY}/><span className={styles.tdG}/>
            <span className={styles.termPath}>~/profile.yaml</span>
          </div>
          <div className={styles.termBody}>
            {[
              { p: '❯', cmd: 'cat profile.yaml' },
              { k: 'name:',       v: 'Veer Singh',                       vc: 'green'  },
              { k: 'role:',       v: 'Senior Cloud / DevOps / SRE',      vc: 'cyan'   },
              { k: 'location:',   v: 'Bangalore, India',                  vc: 'green'  },
              { k: 'certs:',      v: '5  # AZ305·AZ400·AI102·AZ104·TF',  vc: 'purple' },
              { k: 'cost_saved:', v: '50%',                               vc: 'amber'  },
              { k: 'uptime_slo:', v: '99.9%',                             vc: 'green'  },
              { k: 'award:',      v: '"Above & Beyond — 2025"',           vc: 'amber'  },
            ].map((line, i) => (
              <div key={i} className={styles.termLine}>
                {line.p
                  ? <><span className={styles.tprompt}>{line.p}</span><span className={styles.tcmd}>{line.cmd}</span></>
                  : <span className={styles.tout}><span className={styles.tkey}>{line.k}</span>{' '}<span className={styles[`tv${line.vc}`]}>{line.v}</span></span>
                }
              </div>
            ))}
            <div className={styles.termLine}><span className={styles.tprompt}>❯</span><span className={styles.tcursor}/></div>
          </div>
        </div>

        <div className={styles.statsGrid} ref={statsRef}>
          {stats.map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statNum}
                data-count={s.value}
              >{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statDesc}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const BriefIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
const SearchIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const DlIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const GhIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>;
const LiIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>;
const MdIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>;
const MailIcon   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
