import { cache } from "react";

import { getAccessToken } from "@/lib/auth";
import type {
  Agent,
  AnalysisReport,
  CallStats,
  Campaign,
  Competitor,
  Conversation,
  Dashboard,
  KnowledgeEntry,
  Profile,
  ServiceRequest,
  StaffMember,
  User,
  WhatsAppMessage,
} from "@/lib/types";

const API_URL = (process.env.DJANGO_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function getDjangoUrl() {
  return API_URL;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    // Prefer caller cache hints; default no-store for mutations/auth-sensitive reads
    cache: init?.cache ?? "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (response.status === 401) throw new ApiError("Unauthorized", 401);
  if (!response.ok) throw new ApiError("Request failed", response.status);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

/** Dedupes identical GETs within one server render (layout + page). */
const getMeCached = cache(() => apiFetch<User>("/api/auth/me/"));
const getDashboardCached = cache(() => apiFetch<Dashboard>("/api/dashboard/"));
const getProfileCached = cache(() => apiFetch<Profile>("/api/profile/"));

export const api = {
  getMe: getMeCached,
  getDashboard: getDashboardCached,
  getProfile: getProfileCached,
  getAgents: () => apiFetch<Agent[]>("/api/agents/"),
  getKnowledge: () => apiFetch<KnowledgeEntry[]>("/api/knowledge/"),
  createKnowledge: (body: Partial<KnowledgeEntry>) =>
    apiFetch<KnowledgeEntry>("/api/knowledge/", { method: "POST", body: JSON.stringify(body) }),
  getStaff: () => apiFetch<StaffMember[]>("/api/staff/"),
  updateStaff: (id: number, body: Partial<StaffMember>) =>
    apiFetch<StaffMember>(`/api/staff/${id}/`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteStaff: (id: number) =>
    apiFetch<void>(`/api/staff/${id}/`, { method: "DELETE" }),
  getRequests: (category?: string) =>
    apiFetch<ServiceRequest[]>(
      `/api/requests/${category ? `?category=${encodeURIComponent(category)}` : ""}`,
    ),
  updateRequest: (id: number, body: Partial<ServiceRequest>) =>
    apiFetch<ServiceRequest>(`/api/requests/${id}/`, { method: "PATCH", body: JSON.stringify(body) }),
  getCampaigns: () => apiFetch<Campaign[]>("/api/campaigns/"),
  startCampaign: (id: number) =>
    apiFetch<Campaign>(`/api/campaigns/${id}/start/`, { method: "POST", body: "{}" }),
  getWhatsapp: (q?: string) =>
    apiFetch<WhatsAppMessage[]>(`/api/whatsapp/${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  getCompetitors: () => apiFetch<Competitor[]>("/api/competitors/"),
  getAnalysis: () => apiFetch<AnalysisReport[]>("/api/analysis/"),
  createAnalysis: () =>
    apiFetch<AnalysisReport>("/api/analysis/", { method: "POST", body: "{}" }),
  getLiveCalls: () => apiFetch<Conversation[]>("/api/calls/live/"),
  getCallHistory: (params?: { q?: string; tag?: string }) => {
    const search = new URLSearchParams();
    if (params?.q) search.set("q", params.q);
    if (params?.tag) search.set("tag", params.tag);
    const qs = search.toString();
    return apiFetch<Conversation[]>(`/api/calls/history/${qs ? `?${qs}` : ""}`);
  },
  getCallStats: () => apiFetch<CallStats>("/api/calls/stats/"),
  getConversation: (id: string) => apiFetch<Conversation>(`/api/calls/${id}/`),
};
