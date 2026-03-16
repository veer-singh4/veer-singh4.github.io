// src/components/About.jsx
import { profile, stats } from '../data/resumeData';
import styles from './About.module.css';

export default function About() {
  return (
    <section id="about" className="section" style={{ background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg1) 100%)', position: 'relative', zIndex: 1}}>
      <div className="section-inner">
        <div className="sec-eyebrow reveal">about me</div>
        <h2 className="sec-title reveal">Building infra that <em>never sleeps</em></h2>
        <div className={styles.grid}>
          <div className={`${styles.text} reveal-l`}>
            <p>I'm a <strong>Senior Cloud / DevOps / SRE Engineer</strong> with 3+ years designing, automating, and scaling enterprise-grade multi-cloud infrastructure. I thrive at the intersection of <strong>speed and reliability</strong> — shipping faster without breaking things.</p>
            <p>Currently at <strong>Presidio</strong>, I architect multi-cloud platforms on Azure & AWS for 10+ enterprise accounts, delivering: <strong>50% cost reduction</strong> through APIM consolidation, <strong>60% faster releases</strong> via end-to-end CI/CD automation, and <strong>99.9% uptime SLOs</strong> backed by rock-solid hybrid networking.</p>
            <p>Previously at <strong>Pratian Technologies (GE Healthcare)</strong>, I built SRE observability stacks, optimised Kubernetes clusters, and championed platform engineering — sustaining <strong>zero unplanned downtime</strong> over 8 months for critical healthcare production systems.</p>
            <div className={styles.chips}>
              {['📍 Bangalore, India','💼 Open to Opportunities','🌐 Remote-Friendly','🏆 Above & Beyond Award 2025'].map(c => (
                <span key={c} className={styles.chip}>{c}</span>
              ))}
            </div>
          </div>
          <div className={`${styles.cards} reveal-r`}>
            {[
              { icon:'☁', num:'50%', label:'CLOUD COST REDUCTION', sub:'via APIM consolidation' },
              { icon:'🚀', num:'60%', label:'FASTER RELEASES',      sub:'via CI/CD automation' },
              { icon:'📊', num:'30%', label:'LOWER MTTR',           sub:'full observability stack' },
              { icon:'⎈', num:'35%', label:'BETTER AKS UTILISATION',sub:'HPA + Helm tuning' },
            ].map((c, i) => (
              <div key={c.label} className={`${styles.card} d${i+1}`}>
                <div className={styles.cardIcon}>{c.icon}</div>
                <div className={styles.cardNum}>{c.num}</div>
                <div className={styles.cardLabel}>{c.label}</div>
                <div className={styles.cardSub}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
