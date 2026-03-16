// src/components/AISearch.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { searchIndex, profile, experience, skills, certifications, awards } from '../data/resumeData';
import styles from './AISearch.module.css';

// ── Smart local AI search engine ─────────────────────────────────────────────
function smartSearch(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/);
  const results = [];

  // Score each indexed item
  searchIndex.forEach((item) => {
    let score = 0;
    const content = item.content.toLowerCase();
    const keywords = item.keywords || [];

    terms.forEach((term) => {
      if (content.includes(term))          score += 3;
      if (keywords.some(k => k.includes(term) || term.includes(k))) score += 5;
      if (content.startsWith(term))        score += 2;
    });

    if (score > 0) results.push({ ...item, score });
  });

  // Sort by score
  results.sort((a, b) => b.score - a.score);

  // Generate natural-language answer
  const topResults = results.slice(0, 4);
  const answer = generateAnswer(q, topResults, terms);

  return { results: topResults, answer };
}

function generateAnswer(query, results, terms) {
  if (results.length === 0) {
    return `I couldn't find specific information about "${query}" in Veer's resume. Try searching for: skills, Azure, AWS, Terraform, Kubernetes, CI/CD, certifications, experience, awards, or contact.`;
  }

  const q = query.toLowerCase();

  // Intent detection
  if (q.match(/\b(cert|certified|certification)\b/)) {
    const certs = certifications.map(c => `${c.code} – ${c.name}`).join(', ');
    return `Veer holds 5 certifications: ${certs}. This includes two Expert-level Microsoft certs (AZ-305 and AZ-400), making him one of the most certified Azure engineers in his field.`;
  }

  if (q.match(/\b(award|recognition|achievement)\b/)) {
    return `Veer has received 3 notable awards: (1) Above & Beyond Award from Presidio in 2025 — the highest peer-nominated recognition; (2) Spot Award from Presidio for exceptional delivery; (3) Client Recognition from GE Healthcare for CI/CD automation excellence.`;
  }

  if (q.match(/\b(cost|saving|reduction|money)\b/)) {
    return `Veer reduced cloud costs by 50% at Presidio by consolidating Azure APIM instances across 200+ microservices — described as the highest single-initiative cost saving on the account. He also automated 50% of manual provisioning at GE Healthcare.`;
  }

  if (q.match(/\b(terraform|iac|infrastructure as code)\b/)) {
    return `Veer is a HashiCorp Certified Terraform Associate. He uses Terraform and Bicep to architect modular, reusable IaC platforms across 10+ enterprise Azure & AWS accounts, reducing provisioning time by 40% and eliminating configuration drift.`;
  }

  if (q.match(/\b(kubernetes|k8s|aks|eks|container)\b/)) {
    return `Veer has deep Kubernetes experience: he optimised AKS clusters at GE Healthcare (HPA tuning, Helm charts, ingress policies, liveness probes) improving utilisation by 35% with zero unplanned downtime over 8 months. Also manages EKS on AWS and containerises workloads with Docker.`;
  }

  if (q.match(/\b(azure|aws|cloud)\b/)) {
    return `Veer architects multi-cloud platforms on Azure and AWS. Key Azure skills: AKS, APIM, Virtual WAN, Front Door, App Gateway, Container Apps. Key AWS skills: EC2, S3, RDS, EKS, IAM. He holds AZ-305 (Architect Expert), AZ-400, AI-102, and AZ-104 certifications.`;
  }

  if (q.match(/\b(ci|cd|cicd|pipeline|devops|github actions)\b/)) {
    return `Veer built fully automated CI/CD pipelines at Presidio (GitHub Actions, Azure DevOps, GitLab) with SAST/DAST security gates and zero-downtime rollback, boosting release velocity by 60%. Previously built Jenkins/ADO pipelines at Pratian that cut deployment time by 40%.`;
  }

  if (q.match(/\b(sre|reliability|slo|sli|mttr|monitoring|observability)\b/)) {
    return `As an SRE, Veer built observability stacks using Prometheus, Grafana, Datadog, and Azure Monitor with SLI/SLO dashboards. Results: 30% lower MTTR at Presidio, 25% MTTR improvement at GE Healthcare, 99.9% uptime SLOs maintained. He also leads incident response and DR drills.`;
  }

  if (q.match(/\b(contact|email|phone|hire|reach)\b/)) {
    return `You can reach Veer at veeryadav6731@gmail.com. He's based in Bangalore, India and is open to Senior Cloud, DevOps & SRE roles — remote-friendly. LinkedIn: linkedin.com/in/veer-singh-18816b179 | GitHub: github.com/veer-singh4`;
  }

  if (q.match(/\b(experience|work|job|company|presidio|pratian|ge|healthcare)\b/)) {
    const exps = experience.map(e => `${e.title} at ${e.company} (${e.period})`).join('; ');
    return `Veer has 3+ years of experience: ${exps}. He has worked across enterprise cloud, SRE, and software engineering roles with measurable impact at every position.`;
  }

  if (q.match(/\b(python|bash|script|automat)\b/)) {
    return `Veer automates infrastructure and ops with Python, Bash, and PowerShell — cutting manual ops work by 50% at GE Healthcare. He also uses Java/Spring Boot for microservices development and has strong Linux skills.`;
  }

  if (q.match(/\b(ai|machine learning|openai|cognitive)\b/)) {
    return `Veer recently earned the Azure AI Engineer Associate (AI-102) certification, covering Azure AI Services, Cognitive APIs, and OpenAI on Azure. This makes him capable of integrating AI capabilities directly into cloud-native infrastructure.`;
  }

  // Default: summarise top results
  const sections = [...new Set(results.map(r => r.section))].join(', ');
  return `Found relevant information in: ${sections}. Veer's profile covers ${terms.join(', ')} across his experience at Presidio and Pratian Technologies. Scroll to the highlighted section for full details.`;
}

// ── Component ─────────────────────────────────────────────────────────────────
const SUGGESTIONS = [
  'What certifications does Veer have?',
  'How much did Veer reduce cloud costs?',
  'What is Veer\'s Kubernetes experience?',
  'Tell me about CI/CD pipelines',
  'What awards has Veer received?',
  'Azure and AWS skills',
  'How to contact Veer?',
  'SRE and observability skills',
];

export default function AISearch({ isOpen, onClose }) {
  const [query,   setQuery]   = useState('');
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); onClose(); }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Auto-focus
  useEffect(() => {
    if (isOpen) { setTimeout(() => inputRef.current?.focus(), 100); }
    else        { setQuery(''); setResult(null); }
  }, [isOpen]);

  const handleSearch = useCallback((q) => {
    const searchQ = q || query;
    if (!searchQ.trim()) return;
    setLoading(true);
    setQuery(searchQ);

    // Simulate slight delay for UX
    setTimeout(() => {
      const res = smartSearch(searchQ);
      setResult(res);
      setHistory(prev => [searchQ, ...prev.filter(h => h !== searchQ)].slice(0, 6));
      setLoading(false);
    }, 350);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const scrollToSection = (section) => {
    const map = {
      'Profile': 'about', 'Skills': 'skills', 'Experience': 'experience',
      'Certifications': 'certs', 'Awards': 'awards', 'Education': 'contact',
    };
    const id = map[section];
    if (id) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.aiChip}>
              <span className={styles.aiDot} />AI
            </span>
            <span className={styles.headerTitle}>Resume Search</span>
          </div>
          <div className={styles.shortcuts}>
            <kbd>↵</kbd> search &nbsp; <kbd>Esc</kbd> close &nbsp; <kbd>Ctrl+K</kbd> toggle
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Search Input */}
        <div className={styles.inputWrap}>
          <SearchIcon />
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Ask anything — certifications, skills, experience, contact..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => { setQuery(''); setResult(null); }}>✕</button>
          )}
          <button className={styles.searchBtn} onClick={() => handleSearch()}>
            {loading ? <span className={styles.spinner} /> : 'Search'}
          </button>
        </div>

        {/* Suggestions */}
        {!result && (
          <div className={styles.suggestions}>
            <div className={styles.sugLabel}>Try asking:</div>
            <div className={styles.sugGrid}>
              {SUGGESTIONS.map((s) => (
                <button key={s} className={styles.sug} onClick={() => handleSearch(s)}>
                  <SparkIcon />{s}
                </button>
              ))}
            </div>
            {history.length > 0 && (
              <>
                <div className={styles.sugLabel} style={{ marginTop: '1rem' }}>Recent:</div>
                <div className={styles.histList}>
                  {history.map((h) => (
                    <button key={h} className={styles.histItem} onClick={() => handleSearch(h)}>
                      <ClockIcon />{h}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className={styles.results}>
            {/* AI Answer */}
            <div className={styles.answer}>
              <div className={styles.answerHeader}>
                <span className={styles.aiChip}><span className={styles.aiDot} />AI</span>
                <span>Answer</span>
              </div>
              <p className={styles.answerText}>{result.answer}</p>
            </div>

            {/* Source matches */}
            {result.results.length > 0 && (
              <div className={styles.sourceWrap}>
                <div className={styles.sourceLabel}>Sources ({result.results.length})</div>
                <div className={styles.sources}>
                  {result.results.map((r, i) => (
                    <button
                      key={i}
                      className={styles.source}
                      onClick={() => scrollToSection(r.section)}
                    >
                      <div className={styles.sourceSection}>{r.section}</div>
                      <div className={styles.sourceSnippet}>
                        {r.content.slice(0, 120)}…
                      </div>
                      <div className={styles.sourceGo}>View section →</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* New search */}
            <button className={styles.newSearch} onClick={() => { setResult(null); setQuery(''); inputRef.current?.focus(); }}>
              ← New search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--text3)', flexShrink: 0 }}>
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const SparkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--cyan)', flexShrink: 0 }}>
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text3)', flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
