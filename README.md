# Veer Singh — Cloud Engineer Portfolio
**Live:** https://veer-singh4.github.io

---

## 🚀 Deploy NOW (3 commands)

```bash
npm install
npm start          # test at localhost:3000
npm run deploy     # → live at https://veer-singh4.github.io
```

> **Important:** Your GitHub repo must be named exactly `veer-singh4.github.io`

---

## 📥 Fix Resume Download

1. Export your resume as **`Veer_Singh_Resume.pdf`**
2. Add it to the **root of your `veer-singh4.github.io` repo**
3. Commit and push

The download button points to: `https://veer-singh4.github.io/Veer_Singh_Resume.pdf`

---

## 🔑 Update Cert Credential URLs

In `src/data/resumeData.js`, each cert has a `url` field.

**Get your real Microsoft Learn credential links:**
1. Go to → https://learn.microsoft.com/en-us/users/
2. Click your profile → Credentials
3. Click each cert → "Share" → copy the URL
4. Paste into `resumeData.js` `url` field

**HashiCorp Terraform cert:**
1. Go to → https://www.credly.com
2. Find your badge → copy the public badge URL

---

## ✅ What's in this build

| Feature | Status |
|---|---|
| 🌌 Galaxy background (dark mode) | Stars, nebulae, shooting stars, connections |
| 🌍 Earth background (light mode) | Sky, animated sun + rays, drifting clouds, hills |
| 🌙 / ☀️ Moon/Sun toggle | Pill toggle in navbar, persists in localStorage |
| 🪐 Orbital avatar | Photo + 9 planet-skills on 3 orbit rings |
| 🎙 Voice summary | Male voice forced on all devices (desktop + mobile) |
| 📥 Download Resume | Navbar + hero; emails you on every download |
| 🏅 Clickable cert cards | Open Microsoft Learn / Credly credential |
| 📝 Medium auto-feed | Live RSS, thumbnail, excerpt, tags, auto-updates |
| 💼 LinkedIn updates | Curated feed with direct links to your profile |
| 🤖 AI Chatbot | Floating chatbot — answers anything about your resume |
| 🔍 AI Search (Ctrl+K) | Smart resume search with natural language answers |
| 📱 Fully responsive | Mobile, tablet, desktop |

---

## 🛠 One-file content updates

Edit **`src/data/resumeData.js`** only — the whole portfolio updates automatically.

- Add new cert → `certifications` array
- Add new award → `awards` array
- Update job → `experience` array
- Medium posts → automatic (just publish on Medium)

