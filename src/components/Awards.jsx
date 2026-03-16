// src/components/Awards.jsx
import { awards } from '../data/resumeData';
import styles from './Awards.module.css';

export default function Awards() {
  return (
    <section id="awards" className="section" style={{ background: 'var(--bg)', position: 'relative', zIndex: 1}}>
      <div className="section-inner">
        <div className="sec-eyebrow reveal">recognition</div>
        <h2 className="sec-title reveal">Impact <em>recognised</em></h2>
        <div className={styles.grid}>
          {awards.map((a, i) => (
            <div key={a.id} className={`${styles.card} reveal d${i + 1}`}>
              <div className={styles.iconWrap}>{a.icon}</div>
              <h3 className={styles.title}>{a.title}</h3>
              <div className={styles.org}>
                <span>{a.org}</span>
                {a.year && <><span className={styles.dot}/><span>{a.year}</span></>}
              </div>
              <p className={styles.desc}>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
