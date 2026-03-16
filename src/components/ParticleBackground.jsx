// ParticleBackground.jsx
// Dark mode  → Galaxy: deep space, 280 stars, 5 nebulae, shooting stars, star connections
// Light mode → Earth: animated sky gradient, glowing sun + rays, 8 drifting clouds, green hills
import { useEffect, useRef } from 'react';

export default function ParticleBackground({ theme }) {
  const cvRef = useRef(null);

  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    let W, H, raf;
    let shootTimer = 0, shootX = 0, shootY = 0, shootLen = 0;
    let mx = null, my = null;

    // ── Data ─────────────────────────────────────────────────────────
    const STAR_COLS = ['#ffffff','#c8e8ff','#ffe8a0','#ffc8ff','#a0d8ff','#d0ffee'];
    const NEBULA_COLS = [
      'rgba(45,140,255,0.032)', 'rgba(0,229,204,0.024)', 'rgba(139,92,246,0.028)',
      'rgba(255,80,200,0.018)', 'rgba(0,180,255,0.026)',
    ];

    const stars = Array.from({ length: 280 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.7 + 0.25,
      a: Math.random() * 0.85 + 0.15,
      vx: (Math.random() - 0.5) * 0.000095,
      vy: (Math.random() - 0.5) * 0.000075,
      t:  Math.random() * Math.PI * 2,
      ts: Math.random() * 0.020 + 0.006,
      col: STAR_COLS[Math.floor(Math.random() * STAR_COLS.length)],
    }));

    const nebulae = NEBULA_COLS.map((c, i) => ({
      c, r: 190 + Math.random() * 260,
      x: 0, y: 0, // set in resize
    }));

    const clouds = Array.from({ length: 8 }, () => ({
      x: Math.random(), y: 0.04 + Math.random() * 0.42,
      spd: 0.00006 + Math.random() * 0.00012,
      s: 0.55 + Math.random() * 1.0,
      a: 0.28 + Math.random() * 0.52,
    }));

    // ── Resize ───────────────────────────────────────────────────────
    const resize = () => {
      W = cv.width  = window.innerWidth;
      H = cv.height = window.innerHeight;
      nebulae.forEach((n, i) => {
        n.x = W * [0.15, 0.75, 0.5, 0.9, 0.3][i];
        n.y = H * [0.25, 0.6,  0.85,0.2, 0.5][i];
      });
    };
    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';

    // ── Cloud helper ─────────────────────────────────────────────────
    const drawCloud = (cx, cy, s, a) => {
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle   = 'rgba(255,255,255,0.88)';
      [[-60,0,56],[-28,-26,42],[8,0,62],[52,-18,46],[94,4,50]].forEach(([ox, oy, r]) => {
        ctx.beginPath();
        ctx.arc(cx + ox * s, cy + oy * s, r * s, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    };

    // ── Render ────────────────────────────────────────────────────────
    const frame = (ts) => {
      ctx.clearRect(0, 0, W, H);
      const dark = isDark();

      if (dark) {
        // ════ GALAXY ════════════════════════════════════════════════

        // Deep space background
        const bg = ctx.createRadialGradient(W * 0.5, H * 0.3, 0, W * 0.5, H * 0.55, Math.max(W, H) * 0.95);
        bg.addColorStop(0, '#0c1830');
        bg.addColorStop(0.45, '#050c18');
        bg.addColorStop(1, '#020810');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Milky-way band
        const mw = ctx.createLinearGradient(0, H * 0.15, W, H * 0.85);
        mw.addColorStop(0, 'transparent');
        mw.addColorStop(0.5, 'rgba(80,120,200,0.045)');
        mw.addColorStop(1, 'transparent');
        ctx.fillStyle = mw;
        ctx.fillRect(0, 0, W, H);

        // Nebulae
        nebulae.forEach(n => {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
          g.addColorStop(0, n.c);
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
        });

        // Stars + connections
        const visibleStars = [];
        stars.forEach(s => {
          s.t += s.ts;
          const tw = 0.5 + 0.5 * Math.sin(s.t);
          s.x += s.vx; s.y += s.vy;
          if (s.x < 0) s.x = 1; if (s.x > 1) s.x = 0;
          if (s.y < 0) s.y = 1; if (s.y > 1) s.y = 0;
          const sx = s.x * W, sy = s.y * H;
          // Mouse repulsion
          if (mx !== null) {
            const dx = sx - mx, dy = sy - my, d = Math.sqrt(dx * dx + dy * dy);
            if (d < 90) { s.x += (dx / d) * 0.0008; s.y += (dy / d) * 0.0008; }
          }
          // Draw star
          const finalR = s.r * (0.5 + 0.5 * tw);
          ctx.globalAlpha = s.a * tw;
          ctx.fillStyle   = s.col;
          ctx.beginPath(); ctx.arc(sx, sy, finalR, 0, Math.PI * 2); ctx.fill();
          // Glow on big stars
          if (s.r > 1.25 && tw > 0.75) {
            const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.r * 5.5);
            g.addColorStop(0, 'rgba(160,210,255,0.13)');
            g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(sx, sy, s.r * 5.5, 0, Math.PI * 2); ctx.fill();
          }
          ctx.globalAlpha = 1;
          if (s.r > 0.7) visibleStars.push({ sx, sy });
        });

        // Star connections
        for (let i = 0; i < visibleStars.length; i++) {
          for (let j = i + 1; j < visibleStars.length; j++) {
            const dx = visibleStars[i].sx - visibleStars[j].sx;
            const dy = visibleStars[i].sy - visibleStars[j].sy;
            const d  = Math.sqrt(dx * dx + dy * dy);
            if (d < 115) {
              ctx.beginPath();
              ctx.moveTo(visibleStars[i].sx, visibleStars[i].sy);
              ctx.lineTo(visibleStars[j].sx, visibleStars[j].sy);
              ctx.strokeStyle = `rgba(45,140,255,${0.050 * (1 - d / 115)})`;
              ctx.lineWidth   = 0.4;
              ctx.stroke();
            }
          }
        }

        // Shooting star
        shootTimer++;
        if (shootTimer > 170 && Math.random() < 0.012) {
          shootX = Math.random() * W * 0.6;
          shootY = Math.random() * H * 0.38;
          shootLen = 100 + Math.random() * 70;
          shootTimer = 0;
        }
        if (shootLen > 0) {
          const progress = (170 - shootLen) / 170;
          const ex = shootX + progress * 320, ey = shootY + progress * 120;
          const g = ctx.createLinearGradient(ex - 55, ey - 20, ex, ey);
          g.addColorStop(0, 'transparent');
          g.addColorStop(1, 'rgba(220,245,255,0.96)');
          ctx.beginPath(); ctx.moveTo(ex - 55, ey - 20); ctx.lineTo(ex, ey);
          ctx.strokeStyle = g; ctx.lineWidth = 1.8; ctx.stroke();
          shootLen -= 3.5;
        }

      } else {
        // ════ EARTH / SKY ═══════════════════════════════════════════

        // Sky gradient
        const sky = ctx.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0,    '#85c1f5');
        sky.addColorStop(0.22, '#aad4ff');
        sky.addColorStop(0.55, '#d0e9ff');
        sky.addColorStop(0.85, '#e8f4ff');
        sky.addColorStop(1,    '#deeeff');
        ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

        // Atmosphere haze near horizon
        const haze = ctx.createLinearGradient(0, H * 0.6, 0, H);
        haze.addColorStop(0, 'transparent');
        haze.addColorStop(1, 'rgba(180,220,255,0.40)');
        ctx.fillStyle = haze; ctx.fillRect(0, 0, W, H);

        // Sun — corona + core + animated rays
        const sunX = W * 0.83, sunY = H * 0.11;
        const corona = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 200);
        corona.addColorStop(0,    'rgba(255,235,80,0.65)');
        corona.addColorStop(0.25, 'rgba(255,210,50,0.25)');
        corona.addColorStop(0.6,  'rgba(255,180,40,0.08)');
        corona.addColorStop(1,    'transparent');
        ctx.fillStyle = corona;
        ctx.beginPath(); ctx.arc(sunX, sunY, 200, 0, Math.PI * 2); ctx.fill();

        // Sun rays (rotate slowly)
        ctx.save(); ctx.translate(sunX, sunY);
        const rayRot = ts * 0.00012;
        ctx.rotate(rayRot);
        for (let i = 0; i < 16; i++) {
          ctx.rotate(Math.PI / 8);
          const len = 62 + Math.sin(ts * 0.001 + i) * 8;
          ctx.beginPath(); ctx.moveTo(46, 0); ctx.lineTo(len, 0);
          ctx.strokeStyle = `rgba(255,215,50,${0.15 + Math.sin(ts * 0.0008 + i) * 0.05})`;
          ctx.lineWidth   = 2.8; ctx.stroke();
        }
        ctx.restore();

        // Sun core
        const sc = ctx.createRadialGradient(sunX - 10, sunY - 10, 2, sunX, sunY, 42);
        sc.addColorStop(0,   '#fffae0');
        sc.addColorStop(0.4, '#ffe040');
        sc.addColorStop(1,   '#f59e0b');
        ctx.fillStyle = sc;
        ctx.beginPath(); ctx.arc(sunX, sunY, 42, 0, Math.PI * 2); ctx.fill();

        // Clouds — drift left to right
        clouds.forEach(c => {
          c.x += c.spd;
          if (c.x > 1.22) c.x = -0.22;
          drawCloud(c.x * W, c.y * H, c.s, c.a);
        });

        // Distant green hills (horizon)
        ctx.save(); ctx.globalAlpha = 0.14;
        ctx.fillStyle = 'rgba(80,160,100,0.7)';
        ctx.beginPath();
        ctx.moveTo(0, H);
        ctx.bezierCurveTo(W * 0.18, H * 0.77, W * 0.42, H * 0.83, W * 0.6, H * 0.80);
        ctx.bezierCurveTo(W * 0.78, H * 0.77, W * 0.9,  H * 0.73, W, H * 0.78);
        ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [theme]);

  return (
    <canvas
      ref={cvRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 0,
        pointerEvents: 'none', opacity: 0.92,
        transition: 'opacity 0.5s',
      }}
    />
  );
}
