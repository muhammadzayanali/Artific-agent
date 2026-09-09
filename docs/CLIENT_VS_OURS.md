# ArtificAgent vs Client Product — Comparison & Roadmap

**Purpose:** Clear difference between the client’s current PHP panel and our ArtificAgent rebuild, plus what we can add next.  
**Audience:** Product / client / internal handoff  
**Date:** September 2026

---

## 1. Short verdict

| | **Client product (legacy)** | **Our product (ArtificAgent)** |
|---|---|---|
| Stack | PHP + HTML (multi-page) | Next.js 15 + Django REST API |
| Navigation | Full page reload every click | App-style navigation (no full reload) |
| State | Lost on every page load | Kept while moving between modules |
| API usage | Same APIs re-hit on refresh / every page | Cached / shared fetches; less duplicate work |
| UI | Classic server-rendered screens | Modern ops panel (light/dark, sidebar UX) |
| Architecture | Coupled pages + backend | Separated **frontend panel** + **API backend** |

We matched the **same product modules** the client screenshots show (dashboard, agents, knowledge, staff, live/history calls, AI consultant, competitors, campaigns, WhatsApp, requests, settings).  
On top of that, we fixed the **architecture pain**: state loss and repeated API calls on refresh/navigation.

---

## 2. Difference you already explained (core technical win)

### 2.1 Full page load → state loss (client)

In the PHP + HTML product:

1. User opens a page → browser loads a full HTML document.
2. User clicks another menu item → **new page load**.
3. Any in-memory UI state (open forms, filters, scroll, selected tabs, temporary inputs, open dropdowns) is **wiped**.
4. Session may survive via cookies, but **UX state does not**.

### 2.2 What we fixed (our product)

In Next.js panel:

1. Login once → JWT in **httpOnly cookies**.
2. Moving Ana Sayfa → Ajan Ayarı → Çağrı Geçmişi is **client navigation** (no full document reload).
3. Shell (sidebar, theme, profile menu, balance) **stays mounted**.
4. Module UI feels like one continuous app, not 12 separate websites.

**Business meaning:** faster feel, fewer mistakes, less “I filled the form and it vanished when I clicked elsewhere.”

---

## 3. Same API called again and again on refresh (client)

### 3.1 Client pattern (typical PHP panel)

On every page open / F5:

- Re-render HTML
- Re-run server queries / re-call upstream APIs for that page
- Often **re-fetch shared data** (profile, minutes, agent status) on *each* page even if nothing changed

Result:

- Extra load on server and third-party APIs
- Slower clicks
- Higher cost if paid APIs (voice, maps, WhatsApp, gold feed) are involved later

### 3.2 What we fixed (our product)

- Panel shell loads lean shared data once (profile / minutes) via layout.
- Dashboard uses its own heavier fetch only on Ana Sayfa.
- Next.js `cache()` / request dedupe patterns reduce **duplicate identical calls** in the same render pass.
- Auth proxy keeps tokens server-side; pages don’t keep re-doing “who am I?” in the browser the PHP way.

**Business meaning:** less waste, snappier panel, ready for real paid integrations without burning quota on every menu click.

---

## 4. Side-by-side product comparison

### 4.1 Technology

| Topic | Client (PHP + HTML) | Ours (ArtificAgent) |
|---|---|---|
| Frontend | Server HTML pages | Next.js App Router + React |
| Backend | PHP (often mixed with views) | Django 4.2 + DRF (clean API) |
| Auth | Session / PHP session pattern | JWT + httpOnly cookies + proxy |
| Deploy | Classic hosting | Frontend Netlify + API Railway |
| Theme | Usually fixed | Light / dark |
| Brand | Subject to translator quirks | `ArtificAgent` protected from Chrome “ArtificialAgent” rewrite |

### 4.2 Modules (parity with client screenshots)

| Module | Client screens | Our panel |
|---|---|---|
| Ana Sayfa / Command center | Yes | Yes |
| Ajan Ayarı | Yes | Yes (+ voice upload studio) |
| Bilgi Bankası | Yes | Yes |
| Personel Durumu | Yes | Yes |
| Canlı Çağrılar | Yes | Yes |
| Çağrı Geçmişi | Yes | Yes (+ detail / transcript) |
| AI Danışman | Yes | Yes |
| Rakip Analizi | Yes | Yes (+ scan action) |
| Kampanya Araması | Yes | Yes |
| WhatsApp Bot | Yes | Yes (inbox / list) |
| Talep Merkezi | Yes | Yes |
| Ayarlar + dakika bakiyesi | Yes | Yes (profile menu + balance) |

### 4.3 UX upgrades we already added beyond typical PHP panel

- Collapsible sidebar sections (dropdown groups)
- Profile CTA menu (Settings / Theme / Logout) like modern SaaS
- Compact ops headers (less empty scroll)
- Solid panel backgrounds (no broken color seams)
- Brand-safe naming (`ArtificAgent` not auto-translated)

---

## 5. Honest current limit (important for client talks)

Many integrations are still **demo adapters** with production contracts ready:

| Area | Today | Production next |
|---|---|---|
| Telephony / live calls | Demo | Real SIP/PSTN |
| Voice cloning / TTS | Demo / labeled mode | ElevenLabs live |
| Knowledge answers | Demo store | Vector RAG |
| WhatsApp send | Demo list | Meta Cloud API |
| Campaign dialer | Deterministic demo | Live dialer + DNC |
| Competitor maps | Demo scan | Google Places |
| Gold / market price | Demo feed | Licensed API |
| CRM sync | Not connected | HubSpot / custom CRM |

UI should keep **DEMO MODE** vs **CONNECTED** until each adapter is verified.

---

## 6. New things that are possible to add (roadmap)

Prioritized for jewelry / kuyumcu ops + AI agent product.

### P0 — Make money & trust (next build)

1. **Real telephony connect** — inbound/outbound numbers, call webhooks, live status true not seeded  
2. **ElevenLabs (or chosen TTS) go-live** — real voice IDs, clone pipeline, quality test page  
3. **Postgres + backups on Railway** — stop SQLite wipe on redeploy  
4. **Minute billing packages** — request → approve → top-up ledger + invoices  
5. **Role-based access** — Owner / Operator / Viewer (hide settings & campaigns)

### P1 — Daily ops power

6. **Live call websocket** — transcript streams without refresh  
7. **Knowledge RAG** — upload PDF/price lists; agent answers from verified docs  
8. **WhatsApp two-way** — templates, send, read receipts, handoff to staff  
9. **Staff transfer rules** — “if gold > X or angry customer → call Mehmet”  
10. **Request SLA board** — timers, assignees, WhatsApp follow-up from Talep Merkezi  
11. **Call QA scores** — auto summary, sentiment, “missed sale” tags  
12. **Audit log** — who changed agent prompt / knowledge / staff

### P2 — Growth & competition

13. **Campaign builder** — CSV upload, DNC list, schedule windows, retry rules  
14. **Competitor radar** — Places API + price watch alerts  
15. **Gold / kur feed** — licensed source; agent speaks live spread safely  
16. **Multi-branch / multi-number** — one org, many stores  
17. **Customer 360** — merge call + WhatsApp + requests into one profile  
18. **Notifications** — email / push when transfer requested or minutes low

### P3 — Platform polish

19. **EN locale toggle** (UI already Turkish-first)  
20. **Mobile app shell** (PWA) for owner on the road  
21. **SSO / Google login** for enterprise  
22. **Sandbox vs Production** environment switch in settings  
23. **Usage analytics** — cost per call, conversion, top intents  
24. **White-label** — logo / colors per reseller

---

## 7. One-slide pitch (for client)

> Your current panel is PHP pages: every click reloads the page, UI state disappears, and shared APIs often run again and again.  
> ArtificAgent keeps the **same business modules** you already know, but as a modern **app + API**: navigation keeps state, shared data isn’t re-fetched wastefully, and we can plug real voice, WhatsApp, and dialer without rewriting the panel.

---

## 8. Recommended next conversation with client

1. Confirm which integrations must go live first (usually **phone + voice + minutes**).  
2. Pick P0 items for a fixed milestone.  
3. Keep DEMO badges until each integration passes a live test checklist.  
4. Migrate demo Mecidiye data → their real org when adapters are connected.

---

*Document aligned with `docs/PROJECT_REPORT.md` and `docs/INTEGRATIONS.md`.*
