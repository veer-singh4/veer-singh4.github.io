// src/components/GitHubSection.jsx
import { profile } from '../data/resumeData';
import styles from './GitHubSection.module.css';

export default function GitHubSection() {
  return (
    <section id="github" className="section" style={{ background: 'var(--bg1)', borderTop: '1px solid var(--b0)', borderBottom: '1px solid var(--b0)', position: 'relative', zIndex: 1}}>
      <div className="section-inner">
        <div className="sec-eyebrow reveal">open source</div>
        <h2 className="sec-title reveal">See the <em>code</em></h2>
        <div className={styles.grid}>
          <div className={`${styles.left} reveal-l`}>
            <p>My GitHub hosts <strong>Terraform modules</strong>, Kubernetes configs, CI/CD pipeline templates, and cloud automation scripts — all built for reuse at enterprise scale.</p>
            <p>Every project follows <strong>modular IaC principles</strong>, GitOps workflows, and security-first design. The same patterns that powered 50% cost reduction and 99.9% uptime in production.</p>
            <p>Whether you're reviewing my engineering style, forking a Terraform module, or just seeing how I think about infrastructure — the code is all there.</p>
            <div className={styles.chips}>
              {['Terraform Modules','Kubernetes Configs','CI/CD Templates','Cloud Automation','IaC Patterns'].map(c => (
                <span key={c} className={`tag tag-g ${styles.chip}`}>{c}</span>
              ))}
            </div>
          </div>

          <div className={`${styles.card} reveal-r`}>
            <div className={styles.cardTop}>
              <div className={styles.avatar}>👨‍💻</div>
              <div>
                <div className={styles.cardName}>Veer Singh</div>
                <div className={styles.cardHandle}>@veer-singh4</div>
              </div>
              <div className={styles.topRight}>
                <span className={styles.openBadge}>
                  <span className={styles.openDot} />Open to work
                </span>
              </div>
            </div>

            <p className={styles.cardBio}>
              Senior Cloud · DevOps · SRE Engineer. Building enterprise-grade multi-cloud infrastructure. Azure · AWS · Kubernetes · Terraform.
            </p>

            <div className={styles.statsRow}>
              {[['3+','Yrs Exp'],['5','Certs'],['10+','Clients'],['3','Awards']].map(([n,l]) => (
                <div key={l} className={styles.stat}>
                  <div className={styles.statN}>{n}</div>
                  <div className={styles.statL}>{l}</div>
                </div>
              ))}
            </div>

            <div className={styles.techRow}>
              {['Terraform','Kubernetes','Azure','AWS','GitHub Actions'].map(t => (
                <span key={t} className="tag tag-b">{t}</span>
              ))}
            </div>

            <a href={profile.github} target="_blank" rel="noopener" className={styles.ghBtn}>
              <GithubIcon />
              Visit github.com/veer-singh4 →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);
