// src/App.jsx
import { useState, useEffect } from 'react';
import './styles/globals.css';

import ParticleBackground from './components/ParticleBackground';
import Navbar             from './components/Navbar';
import HireModal          from './components/HireModal';
import AISearch           from './components/AISearch';
import Chatbot            from './components/Chatbot';
import Hero               from './components/Hero';
import About              from './components/About';
import Skills             from './components/Skills';
import Experience         from './components/Experience';
import Certifications     from './components/Certifications';
import Awards             from './components/Awards';
import GitHubSection      from './components/GitHubSection';
import Blog               from './components/Blog';
import Contact            from './components/Contact';
import Footer             from './components/Footer';

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [hireOpen,   setHireOpen]   = useState(false);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('vs_theme') || 'dark'; } catch { return 'dark'; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('vs_theme', theme); } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  // Ctrl+K search
  useEffect(() => {
    const h = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(p => !p); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    const t = setTimeout(() => {
      document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => obs.observe(el));
    }, 150);
    return () => { clearTimeout(t); obs.disconnect(); };
  }, []);

  // Prevent scroll when modal/search open
  useEffect(() => {
    document.body.style.overflow = (searchOpen || hireOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [searchOpen, hireOpen]);

  return (
    <>
      {/* Galaxy / Earth animated background — full site */}
      <ParticleBackground theme={theme} />

      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onSearchOpen={() => setSearchOpen(true)}
        onHire={() => setHireOpen(true)}
      />

      {/* Modals */}
      <HireModal isOpen={hireOpen}   onClose={() => setHireOpen(false)} />
      <AISearch  isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main>
        <Hero        onSearchOpen={() => setSearchOpen(true)} />
        <About       />
        <Skills      />
        <Experience  />
        <Certifications />
        <Awards      />
        <GitHubSection />
        <Blog        />
        <Contact     />
      </main>

      <Footer />

      {/* Floating AI chatbot */}
      <Chatbot />
    </>
  );
}
