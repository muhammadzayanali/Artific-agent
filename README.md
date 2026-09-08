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

### Backend (Railway / Render / Fly)

Deploy the `backend/` folder separately. Set:

- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG=0`
- `DJANGO_ALLOWED_HOSTS=...`
- `CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app`
- `FRONTEND_ORIGIN=https://your-frontend.vercel.app`

Then run migrate + `seed_demo` on that host.

### Netlify (optional)

`netlify.toml` already uses `base = "frontend"`.
