# ArtificAgent — Full Demo Panel

Next.js customer panel + Django API, modeled after the Mecidiye Kuyumcu business panel.

## Run

```bash
# terminal 1
cd backend
source .venv/bin/activate
python manage.py runserver 8000

# terminal 2
cd frontend
npm run dev
```

- Frontend: http://localhost:3001
- Backend: http://127.0.0.1:8000

## Login

- Email: `demo@artificagent.com`
- Password: `DemoPass123!`

## Modules

- Ana Sayfa (dashboard KPIs, weekly chart, assistant status, recent calls/transfers)
- Ajan Ayarı
- Bilgi Bankası
- Personel Durumu
- Canlı Çağrılar
- Çağrı Geçmişi + detail/transcript
- AI Danışman
- Rakip Analizi
- Kampanya Araması
- WhatsApp Bot
- Talep Merkezi
- Ayarlar + dakika bakiyesi

All list data comes from Django (`seed_demo`), not a frontend mock store.
