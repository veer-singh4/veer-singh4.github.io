// Footer.jsx
import { profile } from '../data/resumeData';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        {/* Brand + status */}
        <div className={styles.brand}>
          <span className={styles.dot} />
          <span className={styles.name}>Veer Singh</span>
          <span className={styles.status}>
            <span className={styles.statusDot} />
            All systems operational
          </span>
        </div>

        {/* Tagline */}
        <p className={styles.tagline}>
          Senior Cloud · DevOps · SRE Engineer · Bangalore, India
        </p>

        {/* Links */}
        <div className={styles.links}>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <span className={styles.sep}>·</span>
          <a href={profile.github} target="_blank" rel="noopener">github.com/veer-singh4</a>
          <span className={styles.sep}>·</span>
          <a href={profile.linkedin} target="_blank" rel="noopener">LinkedIn</a>
          <span className={styles.sep}>·</span>
          <a href={profile.medium} target="_blank" rel="noopener">Medium</a>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Copyright */}
        <p className={styles.copy}>
          © 2025 Veer Singh &nbsp;·&nbsp; Built with React &nbsp;·&nbsp; Hosted on GitHub Pages
          &nbsp;·&nbsp;{' '}
          <a href="https://veer-singh4.github.io" style={{ color: 'var(--cyan)' }}>
            veer-singh4.github.io
          </a>
        </p>
      </div>
    </footer>
  );
}
