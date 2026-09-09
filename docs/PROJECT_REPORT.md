# ArtificAgent — Project Report

**Product:** ArtificAgent customer operations panel  
**Type:** Full-stack demo / MVP (production-ready shell with demo integrations)  
**Repository:** https://github.com/muhammadzayanali/Artific-agent (`devel` branch)  
**Demo organization:** Mecidiye Kuyumcu (Turkish jewelry / kuyumcu ops scenario)

---

## 1. Executive summary

ArtificAgent is a bilingual-ready (Turkish UI) customer panel for managing **AI voice agents**, **knowledge**, **staff**, **calls**, **campaigns**, **WhatsApp**, **competitors**, and **service requests**.

We built:

- A **Next.js 15** frontend (marketing landing + authenticated ops panel)
- A **Django 4.2 + DRF + JWT** backend API
- Multi-tenant **organization** data model with seeded demo content
- Auth via **httpOnly cookies** and a secure API proxy
- Deploy path: **Netlify** (frontend) + **Railway** (backend)

The product is framed as a real ops console. Telephony, ElevenLabs, WhatsApp send, and Maps/RAG are currently **demo adapters** with clear contracts for production replacements.

---

## 2. What we built

### 2.1 Frontend (customer panel)

| Area | What it does |
|------|----------------|
| Marketing landing (`/`) | Brand-first hero, ArtificAgent positioning, CTA into panel |
| Login (`/login`) | Cinematic login; posts to Next API → Django JWT |
| Dashboard | Org overview, minutes, live/call stats |
| Agents | Create/edit AI agents, voice sample upload (MediaRecorder), sync stub |
| Knowledge | Knowledge base entries (live / pending / draft) |
| Staff | Team directory with availability |
| Live calls | Active conversation monitoring |
| Call history | Searchable history + per-call detail / transcript |
| AI consultant | Analysis / consulting reports surface |
| Competitors | Competitor list + scan action (demo) |
| Campaigns | Outbound campaign list, start, contact status |
| WhatsApp | Message inbox/list (demo provider) |
| Requests | Service requests (price, reservation, complaint, etc.) |
| Settings | Profile, password change, minute package request |
| Theme | Light/dark (`aa-theme` CSS variables) + ThemeToggle |
| Branding | Official logo assets in `public/` |

**Auth pattern**

1. Browser → `POST /api/auth/login` (Next.js route)
2. Next.js server → Django `/api/auth/login/`
3. Access + refresh tokens stored in **httpOnly cookies**
4. Panel data via `/api/proxy/[...path]` → Django (server-side, cookie-aware)

### 2.2 Backend (API)

| Django app | Responsibility |
|------------|----------------|
| `accounts` | Organization, custom User, login / me / password, health + root |
| `agents` | AI agents, phone lines, voice upload, sync endpoint |
| `conversations` | Calls/conversations + transcript turns |
| `ops` | Dashboard, profile, knowledge, staff, requests, campaigns, WhatsApp, competitors, analysis, call stats |

**Core API surface (examples)**

- `GET /` — API landing (online status)
- `GET /api/health/` — health check
- `POST /api/auth/login/` — JWT login
- `GET/PATCH /api/profile/`
- `GET/POST /api/agents/`, voice upload, sync
- `GET/POST /api/knowledge/`, `staff/`, `requests/`, `competitors/`, `analysis/`
- `GET /api/campaigns/`, `POST .../start/`
- `GET /api/whatsapp/`
- `GET /api/calls/live/`, `/calls/history/`, `/calls/stats/`

**Seed command:** `python manage.py seed_demo`  
Creates Mecidiye Kuyumcu org, demo admin, agents, knowledge, staff, calls, campaigns, etc.

**Demo login**

- Email: `demo@artificagent.com`
- Password: `DemoPass123!`

### 2.3 Data domains modeled

- Organizations & users (JWT auth)
- Organization profile (AI line, remaining minutes, language, gold price source)
- Agents & phone lines
- Conversations & transcript turns
- Knowledge entries
- Staff members
- Service requests (category / priority / status)
- Campaigns & campaign contacts
- WhatsApp messages
- Competitors
- Analysis reports

### 2.4 Demo vs production integrations

Documented in `docs/INTEGRATIONS.md`. Today uses demo services; same contracts are intended for:

| Concern | Demo now | Later |
|---------|----------|--------|
| Auth | Email/password JWT | SSO / tenant identity |
| Calls | Demo telephony | SIP/PSTN provider |
| Voice | Demo / ElevenLabs-labeled mode | Live ElevenLabs |
| Knowledge | Demo knowledge service | Vector RAG |
| WhatsApp | Demo list | Meta Cloud API |
| Campaigns | Deterministic progress | Live dialer + DNC |
| Competitors | Static / demo scan | Google Maps Places |
| Market data | Harem Altın-style demo feed | Licensed gold/forex API |

UI should keep **DEMO MODE** vs **CONNECTED** badges until real adapters are verified.

---

## 3. Technical stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend | Django 4.2, Django REST Framework, SimpleJWT |
| Auth | JWT + httpOnly cookies via Next route handlers |
| CORS / static | django-cors-headers, WhiteNoise |
| Process | Gunicorn (`start.sh`: migrate → seed → collectstatic → gunicorn) |
| DB | SQLite locally; Postgres via `DATABASE_URL` on Railway (recommended) |
| Frontend host | Netlify (`netlify.toml` → `base = "frontend"`) |
| Backend host | Railway (`backend/` root, public URL) |

---

## 4. Repository layout

```
Artific-agent/
├── frontend/          # Next.js panel (Netlify)
├── backend/           # Django API (Railway)
├── docs/              # Project & integration docs
├── netlify.toml       # Monorepo Netlify config
└── README.md          # Local run + deploy guide
```

---

## 5. Deployment status

| Service | URL / note |
|---------|------------|
| Frontend | https://artificagent.netlify.app |
| Backend | https://artific-agent-production.up.railway.app |
| Health | `GET /api/health/` → `{ "ok": true, ... }` |

**Required env (summary)**

- **Netlify:** `DJANGO_API_URL=https://artific-agent-production.up.railway.app`
- **Railway:** `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=0`, `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `FRONTEND_ORIGIN` (must include Netlify origin), optional `DATABASE_URL` + `DATABASE_SSL=1`

---

## 6. How to run locally

```bash
# API
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo
python manage.py runserver 8000

# Panel
cd frontend
npm install
npm run dev   # http://localhost:3001
```

---

## 7. Outcomes delivered

1. **End-to-end product shell** — landing, login, full Turkish ops panel modules  
2. **Working JWT auth** — cookie-based panel sessions proxied to Django  
3. **Rich demo dataset** — Mecidiye Kuyumcu scenario for demos and QA  
4. **CRUD / actions wired** — knowledge, staff, requests, competitors, settings, campaigns, voice upload  
5. **Cloud deploy path** — Netlify + Railway with health checks and CORS  
6. **Integration roadmap** — clear demo → production adapter map  

---

## 8. Known limits / next steps

| Item | Notes |
|------|--------|
| Real telephony | Still demo-layer |
| ElevenLabs / WhatsApp send | Demo contracts; not live production |
| Netlify env | Must set `DJANGO_API_URL` or login returns 500 |
| Database on Railway | Prefer Postgres; SQLite on container can reset on redeploy |
| SSO / multi-tenant hardening | Future production work |

---

## 9. Conclusion

ArtificAgent is a **complete MVP customer panel + API** for AI agent operations in a jewelry/kuyumcu business context. The UI and backend are deployed and demo-ready; remaining work is swapping demo providers for live telephony, voice, messaging, and market/RAG services without redesigning the panel.

---

*Report generated for the ArtificAgent build on branch `devel`.*
