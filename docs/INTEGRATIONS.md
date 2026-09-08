# Future production integrations

Demo providers implement the same contracts as future production adapters.

| Concern | Demo today | Production replacement |
|---|---|---|
| Auth | `DemoAuthService` | SSO / tenant identity |
| Calls | `DemoCallService` + Demo Telephony | SIP/PSTN provider |
| Voice | ElevenLabs labeled Demo Mode | ElevenLabs VoiceService |
| Knowledge / RAG | `DemoKnowledgeService` | Vector store + retrieval |
| WhatsApp | `DemoWhatsAppService` | Meta Cloud API |
| Campaigns | Deterministic progress | Live dialer + DNC rules |
| Maps / competitors | Static demo set | Google Maps Places |
| Market data | Harem Altın demo feed + local spread math | Licensed gold/forex API |
| CRM | Not connected | Customer audience sync |

UI must keep `DEMO MODE` vs `CONNECTED` badges. Do not mark an integration connected until the production adapter is verified.
