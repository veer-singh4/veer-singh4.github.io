// HireModal.jsx — Contact modal triggered by "Hire Me" button
// Collects visitor details, sends email FROM their address TO Veer
import { useState, useEffect, useRef } from 'react';
import { profile } from '../data/resumeData';
import styles from './HireModal.module.css';

export default function HireModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', role: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const firstRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => firstRef.current?.focus(), 150);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);

    const subject = `[Portfolio] ${form.role ? form.role + ' — ' : ''}${form.name}${form.company ? ' @ ' + form.company : ''}`;
    const body =
      `Hi Veer,\n\n${form.message}\n\n` +
      `---\nName: ${form.name}\n` +
      (form.company ? `Company: ${form.company}\n` : '') +
      (form.role ? `Role/Purpose: ${form.role}\n` : '') +
      `Email: ${form.email}\n` +
      `Sent from: veer-singh4.github.io portfolio`;

    // Also try FormSubmit (background, no-backend notification to Veer)
    try {
      await fetch('https://formsubmit.co/ajax/veeryadav6731@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          subject,
          message: body,
          name:    form.name,
          email:   form.email,
          _captcha: 'false',
          _replyto: form.email,
        }),
      });
    } catch {}

    // Open mailto FROM visitor's email — so the message comes from them
    const mailtoUrl =
      `mailto:${profile.email}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;

    setLoading(false);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: '', email: '', company: '', role: '', message: '' });
      onClose();
    }, 2500);
  };

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Contact Veer Singh">

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.hLeft}>
            <div className={styles.hAvatar}>👋</div>
            <div>
              <div className={styles.hTitle}>Get in Touch with Veer</div>
              <div className={styles.hSub}>Your message will be sent from your email address</div>
            </div>
          </div>
          <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {sent ? (
          <div className={styles.successBox}>
            <div className={styles.successIcon}>✅</div>
            <div className={styles.successTitle}>Message ready!</div>
            <p className={styles.successText}>Your email client has opened with the message pre-filled. Just hit Send — Veer will reply soon!</p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>YOUR NAME *</label>
                <input
                  ref={firstRef}
                  required
                  className={styles.input}
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>YOUR EMAIL *</label>
                <input
                  required
                  type="email"
                  className={styles.input}
                  placeholder="jane@company.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>COMPANY (optional)</label>
                <input
                  className={styles.input}
                  placeholder="Acme Corp"
                  value={form.company}
                  onChange={e => set('company', e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>PURPOSE (optional)</label>
                <input
                  className={styles.input}
                  placeholder="Senior Cloud Engineer Role"
                  value={form.role}
                  onChange={e => set('role', e.target.value)}
                />
              </div>
            </div>

            {/* Message */}
            <div className={styles.field}>
              <label className={styles.label}>MESSAGE *</label>
              <textarea
                required
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Hi Veer, I'm reaching out about a Senior Cloud Engineer opportunity at..."
                value={form.message}
                onChange={e => set('message', e.target.value)}
                rows={4}
              />
            </div>

            {/* Info note */}
            <div className={styles.infoNote}>
              <InfoIcon />
              This will open your email client with a pre-filled message — your reply goes directly from <strong>{form.email || 'your email'}</strong> to Veer.
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={styles.submit}
              disabled={loading || !form.name || !form.email || !form.message}
            >
              {loading ? <><SpinIcon /> Preparing…</> : <><SendIcon /> Open Email & Send</>}
            </button>
          </form>
        )}

        {/* Quick links */}
        <div className={styles.quickLinks}>
          <a href={`mailto:${profile.email}`} className={styles.qLink}><MailIcon /> Direct email</a>
          <a href={profile.linkedin} target="_blank" rel="noopener" className={styles.qLink}><LiIcon /> LinkedIn</a>
          <a href={profile.github}   target="_blank" rel="noopener" className={styles.qLink}><GhIcon /> GitHub</a>
        </div>
      </div>
    </div>
  );
}

const SendIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const SpinIcon = () => <span style={{width:13,height:13,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',animation:'spin .7s linear infinite',display:'inline-block'}}/>;
const InfoIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const MailIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const LiIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>;
const GhIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>;
