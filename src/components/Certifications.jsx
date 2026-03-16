// src/components/Certifications.jsx
import { useRef, useEffect } from 'react';
import { certifications } from '../data/resumeData';
import styles from './Certifications.module.css';

export default function Certifications() {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll(`.${styles.card}`).forEach((c, i) => {
        setTimeout(() => c.classList.add(styles.vis), i * 100);
      });
      obs.unobserve(e.target);
    }), { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="certs" className="section" style={{ background: 'var(--bg1)', position: 'relative', zIndex: 1}}>
      <div className="section-inner">
        <div className="sec-eyebrow reveal">qualifications</div>
        <h2 className="sec-title reveal">Certified to <em>architect</em></h2>
        <div className={styles.grid} ref={ref}>
          {certifications.map((c) => (
            <a
              key={c.id}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
              title={`View ${c.name} credential`}
            >
              <div className={styles.badge} style={{ '--bc': c.badgeColor }}>
                <CertBadgeSVG cert={c} />
              </div>
              <div className={styles.body}>
                <div className={styles.issuer}>{c.issuer}</div>
                <div className={styles.name}>{c.name}</div>
                <div className={styles.code}>{c.code}</div>
                <div className={styles.desc}>{c.desc}</div>
                <div className={styles.footer}>
                  <span className={`${styles.level} ${styles[`lv-${c.levelColor}`]}`}>{c.level} Level</span>
                  <span className={styles.viewLink}>View ↗</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        <p className={styles.hint}>Click any card to view official credential</p>
      </div>
    </section>
  );
}

function CertBadgeSVG({ cert }) {
  const [g1, g2] = cert.badgeGrad;
  const id = cert.id;
  if (cert.id === 'terraform') return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
      <defs><radialGradient id={`bg-${id}`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1a1f3a"/><stop offset="100%" stopColor="#0a1628"/></radialGradient></defs>
      <circle cx="60" cy="60" r="58" fill={`url(#bg-${id})`} stroke="#7b42bc" strokeWidth="2"/>
      <polygon points="44,28 60,38 60,58 44,48" fill="#7b42bc"/>
      <polygon points="62,38 78,28 78,48 62,58" fill="#5c30a0"/>
      <polygon points="44,62 60,72 60,92 44,82" fill="#7b42bc" opacity="0.8"/>
      <polygon points="62,72 78,62 78,82 62,92" fill="#5c30a0" opacity="0.8"/>
      <text x="60" y="109" textAnchor="middle" fontFamily="Outfit,sans-serif" fontWeight="800" fontSize="7.5" fill="#a78bfa">TERRAFORM</text>
    </svg>
  );
  if (cert.id === 'ai102') return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
      <defs>
        <radialGradient id={`bg-${id}`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1a2040"/><stop offset="100%" stopColor="#0a1628"/></radialGradient>
        <linearGradient id={`gr-${id}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={g1}/><stop offset="100%" stopColor={g2}/></linearGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill={`url(#bg-${id})`} stroke={cert.badgeColor} strokeWidth="2"/>
      <circle cx="60" cy="55" r="20" fill="none" stroke={`url(#gr-${id})`} strokeWidth="2.5"/>
      <circle cx="52" cy="48" r="4" fill={g1}/><circle cx="68" cy="48" r="4" fill={g1}/>
      <circle cx="46" cy="60" r="3.5" fill={g1}/><circle cx="74" cy="60" r="3.5" fill={g1}/>
      <circle cx="52" cy="70" r="4" fill={g1}/><circle cx="68" cy="70" r="4" fill={g1}/>
      <line x1="52" y1="48" x2="68" y2="48" stroke={g2} strokeWidth="1.5"/>
      <line x1="52" y1="48" x2="52" y2="70" stroke={g2} strokeWidth="1.5"/>
      <line x1="68" y1="48" x2="68" y2="70" stroke={g2} strokeWidth="1.5"/>
      <line x1="52" y1="70" x2="68" y2="70" stroke={g2} strokeWidth="1.5"/>
      <text x="60" y="96" textAnchor="middle" fontFamily="Outfit,sans-serif" fontWeight="800" fontSize="7.5" fill={g2}>AI ENGINEER</text>
    </svg>
  );
  if (cert.level === 'Expert') return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
      <defs>
        <radialGradient id={`bg-${id}`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1e3a5f"/><stop offset="100%" stopColor="#0a1628"/></radialGradient>
        <linearGradient id={`gl-${id}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#fbbf24"/></linearGradient>
        <linearGradient id={`gr-${id}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={g1}/><stop offset="100%" stopColor={g2}/></linearGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill={`url(#bg-${id})`} stroke="#f59e0b" strokeWidth="2"/>
      <polygon points="60,15 70,45 100,45 76,63 85,93 60,75 35,93 44,63 20,45 50,45" fill={`url(#gl-${id})`} opacity="0.9"/>
      <circle cx="60" cy="60" r="22" fill={`url(#gr-${id})`} opacity="0.95"/>
      <text x="60" y="56" textAnchor="middle" fontFamily="Outfit,sans-serif" fontWeight="900" fontSize="8.5" fill="white">{cert.id === 'az305' ? 'AZURE' : 'DEVOPS'}</text>
      <text x="60" y="67" textAnchor="middle" fontFamily="Outfit,sans-serif" fontWeight="900" fontSize="7" fill="white">{cert.id === 'az305' ? 'ARCHITECT' : 'ENGINEER'}</text>
      <text x="60" y="77" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontWeight="700" fontSize="6.5" fill="#f59e0b">EXPERT</text>
    </svg>
  );
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
      <defs>
        <radialGradient id={`bg-${id}`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#1a3050"/><stop offset="100%" stopColor="#0a1628"/></radialGradient>
        <linearGradient id={`gr-${id}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={g1}/><stop offset="100%" stopColor={g2}/></linearGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill={`url(#bg-${id})`} stroke={cert.badgeColor} strokeWidth="2"/>
      <polygon points="40,30 80,30 96,60 80,90 40,90 24,60" fill={`url(#gr-${id})`} opacity="0.15"/>
      <polygon points="45,40 75,40 88,62 75,84 45,84 32,62" fill="none" stroke={`url(#gr-${id})`} strokeWidth="1.5"/>
      <text x="60" y="57" textAnchor="middle" fontFamily="Outfit,sans-serif" fontWeight="900" fontSize="8.5" fill="white">AZURE</text>
      <text x="60" y="68" textAnchor="middle" fontFamily="Outfit,sans-serif" fontWeight="900" fontSize="7" fill="white">ADMINISTRATOR</text>
      <text x="60" y="80" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontWeight="700" fontSize="6" fill={g2}>ASSOCIATE</text>
    </svg>
  );
}
