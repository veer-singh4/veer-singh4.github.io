// Contact.jsx — Smart form that sends from visitor's email to Veer
import { useState } from 'react';
import { profile, education } from '../data/resumeData';
import styles from './Contact.module.css';

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', company:'', subject:'', message:'' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');

    const subject = form.subject || `[Portfolio] ${form.name}${form.company?' @ '+form.company:''} wants to connect`;
    const body =
      `Hi Veer,\n\n${form.message}\n\n` +
      `---\nName: ${form.name}\n` +
      (form.company ? `Company: ${form.company}\n` : '') +
      `Email: ${form.email}\n` +
      `Sent from: veer-singh4.github.io/contact`;

    // Background notification via FormSubmit (Veer gets an email immediately)
    try {
      const res = await fetch('https://formsubmit.co/ajax/veeryadav6731@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'Accept':'application/json' },
        body: JSON.stringify({
          subject,
          message:  body,
          name:     form.name,
          email:    form.email,
          _captcha: 'false',
          _replyto: form.email,
        }),
      });
      if (res.ok) setStatus('sent');
      else throw new Error('failed');
    } catch {
      // FormSubmit failed — fall back to mailto so message still gets through
      setStatus('sent');
    }

    // Also open visitor's mail client so they send from their own email
    const mailtoUrl =
      `mailto:${profile.email}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    setTimeout(() => {
      setStatus('idle');
      setForm({ name:'', email:'', company:'', subject:'', message:'' });
    }, 4000);
  };

  const links = [
    { href:`mailto:${profile.email}`,  icon:'📧', label:'EMAIL',    value: profile.email },
    { href:profile.linkedin, target:true, icon:'💼', label:'LINKEDIN', value:'linkedin.com/in/veer-singh-18816b179' },
    { href:profile.github,   target:true, icon:'⌨', label:'GITHUB',   value:'github.com/veer-singh4' },
    { href:profile.medium,   target:true, icon:'✍', label:'MEDIUM',   value:'medium.com/@veeryadav6731' },
  ];

  return (
    <section id="contact" className="section" style={{ background:'var(--bg)', position:'relative', zIndex:1 }}>
      <div className="section-inner">
        <div className="sec-eyebrow reveal">get in touch</div>
        <h2 className="sec-title reveal">Let's build something <em>great</em></h2>

        <div className={styles.grid}>
          {/* ── Form ── */}
          <form className={`${styles.form} reveal-l`} onSubmit={handleSubmit}>
            <div className={styles.formHead}>
              <h3 className={styles.formTitle}>Send a Message</h3>
              <p className={styles.formSub}>
                Open to Senior Cloud, DevOps &amp; SRE roles. Also available for consulting and contract work.
              </p>
            </div>

            <div className={styles.row}>
              <Field label="YOUR NAME *"  placeholder="Jane Doe"           value={form.name}    onChange={v=>set('name',v)} required />
              <Field label="YOUR EMAIL *" placeholder="jane@company.com"   value={form.email}   onChange={v=>set('email',v)} type="email" required />
            </div>
            <div className={styles.row}>
              <Field label="COMPANY"      placeholder="Acme Corp (optional)" value={form.company} onChange={v=>set('company',v)} />
              <Field label="SUBJECT"      placeholder="Senior Cloud Engineer Role" value={form.subject}  onChange={v=>set('subject',v)} />
            </div>
            <Field
              label="MESSAGE *"
              placeholder="Hi Veer, I'm reaching out about a Senior Cloud Engineer opportunity..."
              value={form.message}
              onChange={v=>set('message',v)}
              textarea required
            />

            <div className={styles.infoNote}>
              <InfoIcon/>
              Your message goes directly from <strong>{form.email||'your email'}</strong> to Veer — so he can reply to you instantly.
            </div>

            <button
              type="submit"
              disabled={status==='sending'||!form.name||!form.email||!form.message}
              className={`btn btn-primary ${styles.submitBtn} ${status==='sent'?styles.sent:''}`}
            >
              {status==='sending' ? <><SpinIcon/> Sending…</>
              :status==='sent'    ? <><CheckIcon/> Sent! Check your email client</>
              :                     <><SendIcon/>  Send Message</>}
            </button>
          </form>

          {/* ── Links ── */}
          <div className="reveal-r">
            <div className={styles.links}>
              {links.map(l=>(
                <a key={l.label} href={l.href}
                   target={l.target?'_blank':undefined} rel="noopener"
                   className={styles.linkItem}>
                  <div className={styles.linkIcon}>{l.icon}</div>
                  <div>
                    <div className={styles.linkLabel}>{l.label}</div>
                    <div className={styles.linkValue}>{l.value}</div>
                  </div>
                  <div className={styles.arrow}>→</div>
                </a>
              ))}
            </div>

            {/* Response time */}
            <div className={styles.responseCard}>
              <div className={styles.rcIcon}>⚡</div>
              <div>
                <div className={styles.rcTitle}>Typically responds within 24 hours</div>
                <div className={styles.rcSub}>Available for remote, hybrid, or on-site roles globally</div>
              </div>
            </div>

            {/* Education */}
            <div className={styles.eduCard}>
              <div className={styles.eduIcon}>🎓</div>
              <div>
                <div className={styles.eduDeg}>{education.degree}</div>
                <div className={styles.eduInst}>{education.institution}</div>
                <div className={styles.eduYear}>{education.year}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, placeholder, value, onChange, type='text', textarea=false, required=false }) {
  const [focus, setFocus] = useState(false);
  const base = {
    width:'100%', background:'var(--bg)', color:'var(--text)',
    border:`1px solid ${focus?'var(--cyan)':'var(--b1)'}`,
    boxShadow: focus?'0 0 0 3px rgba(0,229,204,.1)':'none',
    borderRadius:8, padding:'.62rem .85rem',
    fontFamily:'var(--font)', fontSize:'.85rem', outline:'none',
    transition:'border-color .2s, box-shadow .2s',
    ...(textarea?{resize:'vertical',minHeight:96}:{}),
  };
  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label}</label>
      {textarea
        ? <textarea style={base} placeholder={placeholder} value={value}
            onChange={e=>onChange(e.target.value)}
            onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} required={required}/>
        : <input type={type} style={base} placeholder={placeholder} value={value}
            onChange={e=>onChange(e.target.value)}
            onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} required={required}/>
      }
    </div>
  );
}

const SendIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
const SpinIcon  = () => <span style={{width:13,height:13,borderRadius:'50%',border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',animation:'spin .7s linear infinite',display:'inline-block'}}/>;
const InfoIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0,marginTop:1}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
