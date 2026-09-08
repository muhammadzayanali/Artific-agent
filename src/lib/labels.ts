import type {
  AgentStatus,
  CallStatus,
  CampaignStatus,
  IntegrationStatus,
  KnowledgeCategory,
  RequestStatus,
  RequestType,
  StaffStatus,
} from "@/types";

export const callStatusLabel: Record<CallStatus, string> = {
  ringing: "Çalıyor",
  "ai-handling": "AI yanıtlıyor",
  "escalation-required": "İnsan aktarımı gerekli",
  "waiting-staff": "Personel bekleniyor",
  "human-handling": "İnsan yanıtlıyor",
  completed: "Tamamlandı",
  missed: "Cevapsız",
  failed: "Başarısız",
  busy: "Meşgul",
};

export const staffStatusLabel: Record<StaffStatus, string> = {
  available: "Müsait",
  busy: "Meşgul",
  offline: "Çevrimdışı",
};

export const requestStatusLabel: Record<RequestStatus, string> = {
  new: "Yeni",
  "in-progress": "İşlemde",
  completed: "Tamamlandı",
  cancelled: "İptal",
};

export const requestTypeLabel: Record<RequestType, string> = {
  callback: "Geri arama",
  complaint: "Şikayet",
  booking: "Randevu",
  "price-quote": "Fiyat teklifi",
  question: "Müşteri sorusu",
  "human-escalation": "İnsan aktarımı",
};

export const agentStatusLabel: Record<AgentStatus, string> = {
  active: "Aktif",
  paused: "Duraklatıldı",
  draft: "Taslak",
};

export const knowledgeCategoryLabel: Record<KnowledgeCategory, string> = {
  business: "İşletme bilgisi",
  hours: "Çalışma saatleri",
  location: "Adres ve konum",
  products: "Ürün ve hizmetler",
  prices: "Fiyatlar",
  faq: "SSS",
  campaigns: "Kampanyalar",
  prohibited: "Yasak yanıtlar",
  escalation: "İnsan aktarım kuralları",
  emergency: "Acil durum",
  industry: "Sektöre özel",
  additional: "Ek bilgi",
};

export const campaignStatusLabel: Record<CampaignStatus, string> = {
  draft: "Taslak",
  scheduled: "Planlandı",
  running: "Çalışıyor",
  paused: "Duraklatıldı",
  completed: "Tamamlandı",
};

export const integrationStatusLabel: Record<IntegrationStatus, string> = {
  connected: "Bağlı",
  "not-connected": "Bağlı değil",
  demo: "Demo Mode",
};
