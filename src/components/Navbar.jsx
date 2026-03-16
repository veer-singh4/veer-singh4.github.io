// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { profile } from '../data/resumeData';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label:'about',      href:'#about'      },
  { label:'skills',     href:'#skills'     },
  { label:'experience', href:'#experience' },
  { label:'certs',      href:'#certs'      },
  { label:'awards',     href:'#awards'     },
  { label:'github',     href:'#github'     },
  { label:'blog',       href:'#blog'       },
  { label:'contact',    href:'#contact'    },
];

export default function Navbar({ theme, toggleTheme, onSearchOpen, onHire }) {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [active,    setActive]    = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = document.querySelectorAll('section[id]');
      let cur = '';
      sections.forEach(s => { if(window.scrollY >= s.offsetTop-200) cur=s.id; });
      setActive(cur);
    };
    window.addEventListener('scroll', onScroll, { passive:true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleDownload = () => {
    window.open(profile.resumePdf, '_blank');
    try {
      fetch('https://formsubmit.co/ajax/veeryadav6731@gmail.com',{
        method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({subject:'📄 Resume Downloaded',message:`Downloaded at ${new Date().toLocaleString()}`,_captcha:'false'}),
      }).catch(()=>{});
    } catch {}
    const t = document.getElementById('dl-toast');
    if(t){ t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),4000); }
  };

  const isDark = theme === 'dark';

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <span className={styles.brandDot}/>
          <span className={styles.brandText}>
            <span className={styles.brandAccent}>veer</span>@cloud<span className={styles.brandAccent}>:~</span>
          </span>
        </div>

        {/* Desktop links */}
        <ul className={`${styles.menu} ${menuOpen ? styles.open : ''}`}>
          {NAV_LINKS.map(l => (
            <li key={l.href}>
              <a href={l.href}
                 className={`${styles.link} ${active===l.href.slice(1)?styles.active:''}`}
                 onClick={closeMenu}>{l.label}</a>
            </li>
          ))}
          <li className={styles.mobileOnly}>
            <button className={styles.searchBtn} onClick={()=>{onSearchOpen();closeMenu();}}>
              <SearchIcon/> AI Search
            </button>
          </li>
          <li className={styles.mobileOnly}>
            <button className={styles.searchBtn} onClick={()=>{handleDownload();closeMenu();}}>
              <DownloadIcon/> Download Resume
            </button>
          </li>
        </ul>

        {/* Right */}
        <div className={styles.right}>
          {/* Galaxy / Sky theme toggle */}
          <button
            className={`${styles.themeToggle} ${isDark ? styles.themeDark : styles.themeLight}`}
            onClick={toggleTheme}
            title={isDark ? 'Switch to Sky (Light Mode)' : 'Switch to Galaxy (Dark Mode)'}
            aria-label="Toggle theme"
          >
            <span className={styles.themeTrack}>
              <span className={styles.themeThumb}>
                {isDark ? <MoonIcon/> : <SunIcon/>}
              </span>
            </span>
          </button>

          <button className={styles.searchIcon} onClick={onSearchOpen} title="AI Search (Ctrl+K)">
            <SearchIcon/>
          </button>

          <button className={styles.downloadBtn} onClick={handleDownload}>
            <DownloadIcon/> Resume
          </button>

          <button className={styles.hire} onClick={onHire}>
            <MailIcon/> Hire Me
          </button>

          <button
            className={`${styles.toggle} ${menuOpen ? styles.toggleOpen : ''}`}
            onClick={()=>setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* Download toast */}
      <div id="dl-toast" className={styles.dlToast}>
        ✅ &nbsp;Download started! Veer has been notified 🔔
      </div>
    </>
  );
}

/* Theme icons */
const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const SearchIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const MailIcon     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const DownloadIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
