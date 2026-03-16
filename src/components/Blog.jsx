// Blog.jsx – Medium RSS auto-feed + LinkedIn live updates
// Fixed: cards always visible (no reveal class), fallback posts always show
import { useState, useEffect } from 'react';
import { profile, mediumFallbackPosts } from '../data/resumeData';
import styles from './Blog.module.css';

const MEDIUM_USER = 'veeryadav6731';

const stripHtml = s =>
  (s || '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 150) + '…';

const extractImg = c => {
  if (!c) return null;
  const m = c.match(/src="([^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i);
  return m ? m[1] : null;
};

const CDATA = s =>
  (s || '')
    .replace(/^<!\[CDATA\[/, '')
    .replace(/\]\]>$/, '')
    .trim();

async function fetchMediumPosts() {
  const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(
    'https://medium.com/feed/@' + MEDIUM_USER
  )}`;
  const res  = await fetch(proxy, { signal: AbortSignal.timeout(8000) });
  const json = await res.json();
  const doc  = new DOMParser().parseFromString(json.contents, 'text/xml');
  const items = [...doc.querySelectorAll('item')].slice(0, 5);
  if (!items.length) throw new Error('empty');
  return items.map(it => {
    const raw     = it.querySelector('encoded')?.textContent || it.querySelector('description')?.textContent || '';
    const content = CDATA(raw);
    return {
      title:    CDATA(it.querySelector('title')?.textContent)   || 'Untitled',
      url:      it.querySelector('link')?.textContent           || `https://medium.com/@${MEDIUM_USER}`,
      date:     it.querySelector('pubDate')?.textContent
                  ? new Date(it.querySelector('pubDate').textContent)
                      .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                  : '',
      tags:     [...it.querySelectorAll('category')]
                  .map(c => CDATA(c.textContent))
                  .filter(Boolean)
                  .slice(0, 3),
      excerpt:  stripHtml(content),
      thumb:    extractImg(content),
      readTime: '5 min read',
    };
  });
}

// LinkedIn curated activity
const LI_ACTIVITY = [
  { icon: '🏅', type: 'Certification', text: 'Earned Microsoft Certified: Azure AI Engineer Associate (AI-102)', time: 'Feb 2025', url: 'https://www.linkedin.com/in/veer-singh-18816b179/details/certifications/' },
  { icon: '🏆', type: 'Award',         text: 'Received Above & Beyond Award at Presidio for enterprise cloud delivery excellence', time: 'Jan 2025', url: 'https://www.linkedin.com/in/veer-singh-18816b179/' },
  { icon: '✍',  type: 'Post',          text: 'Shared insights on Azure APIM consolidation patterns that delivered 50% cost savings', time: 'Dec 2024', url: 'https://www.linkedin.com/in/veer-singh-18816b179/recent-activity/all/' },
  { icon: '🏅', type: 'Certification', text: 'Completed AZ-305 Azure Solutions Architect Expert certification', time: 'Oct 2024', url: 'https://www.linkedin.com/in/veer-singh-18816b179/details/certifications/' },
  { icon: '✍',  type: 'Post',          text: 'Published on Kubernetes HPA tuning patterns for AKS production clusters at scale', time: 'Sep 2024', url: 'https://www.linkedin.com/in/veer-singh-18816b179/recent-activity/all/' },
  { icon: '💼', type: 'Role',          text: 'Joined Presidio as Senior Cloud/DevOps Engineer — building multi-cloud IaC platforms', time: 'May 2024', url: 'https://www.linkedin.com/in/veer-singh-18816b179/' },
];

export default function Blog() {
  const [posts,     setPosts]     = useState(mediumFallbackPosts); // start with fallback — never blank
  const [loading,   setLoading]   = useState(true);
  const [fromCache, setFromCache] = useState(true);
  const [tab,       setTab]       = useState('medium');

  useEffect(() => {
    fetchMediumPosts()
      .then(p  => { setPosts(p);                setLoading(false); setFromCache(false); })
      .catch(() => { setPosts(mediumFallbackPosts); setLoading(false); setFromCache(true);  });
  }, []);

  return (
    <section id="blog" className="section" style={{ background: 'var(--bg1)', position: 'relative', zIndex: 1}}>
      <div className="section-inner">
        <div className="sec-eyebrow reveal">blog &amp; updates</div>
        <h2 className="sec-title reveal">Latest <em>Insights</em></h2>

        {/* Tab row */}
        <div className={styles.tabRow}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === 'medium' ? styles.tabOn : ''}`}
              onClick={() => setTab('medium')}
            >
              <MediumIcon size={13} /> Medium Articles
              {fromCache && !loading && <span className={styles.cached}>cached</span>}
              {loading && <span className={styles.cached}>loading…</span>}
            </button>
            <button
              className={`${styles.tab} ${tab === 'linkedin' ? styles.tabOn : ''}`}
              onClick={() => setTab('linkedin')}
            >
              <LinkedInIcon size={13} /> LinkedIn Activity
            </button>
          </div>
          <a
            href={tab === 'medium' ? `https://medium.com/@${MEDIUM_USER}` : profile.linkedin}
            target="_blank" rel="noopener" className={styles.followBtn}
          >
            {tab === 'medium' ? `Follow @${MEDIUM_USER}` : 'Connect on LinkedIn'} →
          </a>
        </div>

        {/* ── MEDIUM ── */}
        {tab === 'medium' && (
          <div className={styles.grid}>
            {posts.map((p, i) => <PostCard key={i} post={p} idx={i} />)}
          </div>
        )}

        {/* ── LINKEDIN ── */}
        {tab === 'linkedin' && (
          <div className={styles.liWrap}>
            <div className={styles.liNote}>
              <InfoIcon />
              LinkedIn blocks third-party RSS — this feed is curated and links directly to your profile.
              <a href={profile.linkedin} target="_blank" rel="noopener">View live profile →</a>
            </div>
            <div className={styles.liList}>
              {LI_ACTIVITY.map((a, i) => (
                <a key={i} href={a.url} target="_blank" rel="noopener"
                   className={styles.liCard}
                   style={{ animationDelay: `${i * 0.06}s` }}>
                  <span className={styles.liIcon}>{a.icon}</span>
                  <div className={styles.liBody}>
                    <span className={styles.liType}>{a.type}</span>
                    <div className={styles.liText}>{a.text}</div>
                    <div className={styles.liTime}>{a.time}</div>
                  </div>
                  <span className={styles.liArrow}>↗</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className={styles.autoNote}>
          <span className={styles.pulse} /> Medium posts refresh automatically on every visit — just publish and it appears here
        </div>
      </div>
    </section>
  );
}

function PostCard({ post, idx }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={post.url} target="_blank" rel="noopener noreferrer"
      className={styles.card}
      style={{ animationDelay: `${idx * 0.08}s` }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Thumbnail */}
      <div className={styles.thumb}>
        {post.thumb
          ? <img src={post.thumb} alt="" className={styles.thumbImg}
                 onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
          : null
        }
        <div className={styles.thumbFb} style={{ display: post.thumb ? 'none' : 'flex' }}>
          <MediumIcon size={36} />
        </div>
        <div className={`${styles.thumbOv} ${hov ? styles.thumbOvOn : ''}`}>Read Article →</div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {post.tags?.length > 0 && (
          <div className={styles.tags}>
            {post.tags.map((t, i) => <span key={i} className={styles.tag}>#{t}</span>)}
          </div>
        )}
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.excerpt}>{post.excerpt || 'Click to read this article on Medium →'}</p>
        <div className={styles.cardFooter}>
          <div className={styles.meta}>
            {post.date && <span className={styles.date}><CalIcon /> {post.date}</span>}
            <span className={styles.rt}><ClockIcon /> {post.readTime || '5 min read'}</span>
          </div>
          <span className={`${styles.readBtn} ${hov ? styles.readBtnOn : ''}`}>
            Read <ArrIcon />
          </span>
        </div>
      </div>
    </a>
  );
}

/* ── Icons ── */
const MediumIcon   = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" /></svg>;
const LinkedInIcon = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ color: '#2d8cff' }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>;
const CalIcon      = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const ClockIcon    = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const ArrIcon      = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const InfoIcon     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
