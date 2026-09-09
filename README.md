# ArtificAgent

Next.js customer panel + Django API (demo).

## Project layout

```
frontend/   ← Next.js app (deploy this on Vercel / Netlify)
backend/    ← Django API (deploy on Railway / Render / Fly — not Vercel)
docs/
```

Ignore anything outside these folders for the live product. Older root `src/` / symlink hacks were removed.

## Run locally

```bash
# terminal 1 — API
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo
python manage.py runserver 8000

# terminal 2 — panel
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:3001  
- Backend: http://127.0.0.1:8000  

### Demo login

- Email: `demo@artificagent.com`
- Password: `DemoPass123!`

## Deploy

### Frontend (Vercel)

1. Import `muhammadzayanali/Artific-agent` (branch `devel`).
2. **Root Directory:** set to `frontend` (important — do not use repo root).
3. Framework: Next.js.
4. Env var: `DJANGO_API_URL` = your live Django URL (e.g. `https://your-api.up.railway.app`).

### Backend (Railway)

1. Create a project on [Railway](https://railway.com) from GitHub repo `Artific-agent`.
2. **Root Directory (recommended):** `backend`  
   If Root Directory is left empty, the repo-root `Dockerfile` + `railway.toml` build `backend/` automatically.  
   Do **not** let Railpack analyze the monorepo root without a Dockerfile — it will fail.
3. Add a **Postgres** plugin (recommended) — Railway sets `DATABASE_URL`.
4. Set variables:

| Variable | Example |
|----------|---------|
| `DJANGO_SECRET_KEY` | long random string |
| `DJANGO_DEBUG` | `0` |
| `DJANGO_ALLOWED_HOSTS` | `.railway.app` |
| `CORS_ALLOWED_ORIGINS` | `https://YOUR-SITE.netlify.app` |
| `FRONTEND_ORIGIN` | `https://YOUR-SITE.netlify.app` |
| `DATABASE_SSL` | `1` (with Postgres) |

5. Deploy. Start command is `bash start.sh` (migrate + seed demo + gunicorn).
6. Copy the public Railway URL (e.g. `https://xxx.up.railway.app`).
7. In **Netlify** env vars set `DJANGO_API_URL` to that URL (no trailing slash), then redeploy frontend.

Health check: `GET /api/health/`

Demo login after seed: `demo@artificagent.com` / `DemoPass123!`

### Netlify (optional)

`netlify.toml` already uses `base = "frontend"`.
