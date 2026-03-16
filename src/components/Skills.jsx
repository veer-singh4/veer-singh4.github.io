// src/components/Skills.jsx
import { useRef, useEffect } from 'react';
import { skills } from '../data/resumeData';
import styles from './Skills.module.css';

const colorMap = { blue:'b', green:'g', cyan:'c', purple:'p', amber:'a' };

export default function Skills() {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll(`.${styles.card}`).forEach((c, i) => {
          setTimeout(() => c.classList.add(styles.vis), i * 80);
        });
        obs.unobserve(e.target);
      }), { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="skills" className="section" style={{ background: 'var(--bg1)', position: 'relative', zIndex: 1}}>
      <div className="section-inner">
        <div className="sec-eyebrow reveal">technical skills</div>
        <h2 className="sec-title reveal">The full <em>stack</em></h2>
        <div className={styles.grid} ref={ref}>
          {skills.map((s) => (
            <div key={s.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={`${styles.iconWrap} ${styles[`ic-${colorMap[s.color]}`]}`}>{s.icon}</div>
                <div>
                  <div className={styles.cardTitle}>{s.title}</div>
                  <div className={styles.cardCount}>{s.tags.length} technologies</div>
                </div>
              </div>
              <div className={styles.tags}>
                {s.tags.map((t) => (
                  <span key={t} className={`tag tag-${colorMap[s.color]}`}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
