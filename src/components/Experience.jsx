// src/components/Experience.jsx
import { useState } from 'react';
import { experience } from '../data/resumeData';
import styles from './Experience.module.css';

export default function Experience() {
  const [active, setActive] = useState(0);
  const job = experience[active];

  return (
    <section id="experience" className="section" style={{ background: 'var(--bg)', position: 'relative', zIndex: 1}}>
      <div className="section-inner">
        <div className="sec-eyebrow reveal">work history</div>
        <h2 className="sec-title reveal">Where I've <em>shipped</em> it</h2>
        <div className={styles.layout}>
          {/* Tab nav */}
          <div className={styles.nav}>
            {experience.map((e, i) => (
              <button
                key={e.id}
                className={`${styles.navItem} ${active === i ? styles.navActive : ''}`}
                onClick={() => setActive(i)}
              >
                <div className={styles.niTitle}>{e.title.replace('Cloud Operations / ', '')}</div>
                <div className={styles.niCo}>{e.company.split(' · ')[0]}</div>
                <div className={styles.niDate}>{e.period}</div>
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className={styles.panel} key={job.id}>
            <div className={styles.panelHead}>
              <h3 className={styles.pTitle}>{job.title}</h3>
              <div className={styles.pMeta}>
                <span className={styles.pCo}>{job.company}</span>
                <span className={styles.pLoc}>📍 {job.location}</span>
                {job.type === 'current'
                  ? <span className={`${styles.pBadge} ${styles.pBadgeCurrent}`}>● Current</span>
                  : <span className={`${styles.pBadge} ${styles.pBadgePast}`}>Past</span>
                }
                <span className={styles.pDate}>{job.period}</span>
              </div>
            </div>
            <ul className={styles.bullets}>
              {job.bullets.map((b, i) => (
                <li key={i}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: b.text.replace(
                        b.highlight,
                        `<strong>${b.highlight}</strong>`
                      )
                    }}
                  />
                </li>
              ))}
            </ul>
            <div className={styles.tagRow}>
              {job.tags.map((t) => <span key={t} className="tag tag-dim">{t}</span>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
