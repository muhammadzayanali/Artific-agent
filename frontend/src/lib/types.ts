export type User = {
  id: number;
  email: string;
  name: string;
  role: "owner" | "operator";
  organization: number | null;
  organization_name: string | null;
};

export type PhoneLine = {
  id: number;
  label: string;
  number: string;
  is_primary: boolean;
};

export type Agent = {
  id: number;
  name: string;
  mode: "voice" | "voice_chat" | "chat";
  status: "active" | "paused" | "setup";
  main_goal: string;
  greeting: string;
  instructions: string;
  voice_label: string;
  speaking_style: string;
  voice_sample_url: string | null;
  tools_enabled: string[];
  languages: string[];
  lines: PhoneLine[];
  last_call_at: string | null;
  live_call_count: number;
  last_synced_at?: string | null;
  last_sync_ok?: boolean;
  updated_at: string;
};

export type ConversationStatus = "live" | "ended" | "missed" | "failed";

export type Conversation = {
  id: number;
  agent: number;
  agent_name: string;
  direction: "inbound" | "outbound";
  status: ConversationStatus;
  outcome: string;
  caller_name: string;
  caller_number: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;
  summary: string;
  detected_need: string;
  action_taken?: string;
  recording_url?: string;
  turns?: TranscriptTurn[];
};

export type TranscriptTurn = {
  id: number;
  speaker: "agent" | "caller";
  text: string;
  started_offset_seconds: number;
};

export type DashboardTrend = {
  direction: "up" | "down" | "flat";
  delta_pct: number | null;
  label: string;
};

export type DashboardAttentionItem = {
  id: string;
  severity: "red" | "amber";
  title: string;
  body: string;
  href: string;
};

export type DashboardQueue = {
  actionable_now: number;
  needs_review: number;
  oldest: {
    id: number;
    title: string;
    created_at: string;
    age_hours: number;
    phone: string;
  } | null;
};

export type DashboardKnowledge = {
  live_entries: number;
  pending_entries: number;
  last_synced_at: string | null;
  last_sync_ok: boolean;
  agent_name: string | null;
  agent_status: string | null;
};

export type DashboardChartPoint = {
  date: string;
  day: string;
  calls: number;
  potential: number;
  transfer: number;
};

export type DashboardCampaign = {
  id: number;
  name: string;
  status: string;
  targets: number;
  connect_rate: number | null;
  conversion_rate: number | null;
  called: number;
  success: number;
};

export type Dashboard = {
  period: {
    key: string;
    label: string;
    start: string;
    end: string;
    previous_start: string;
    previous_end: string;
  };
  attention: DashboardAttentionItem[];
  metrics: {
    calls_handled: {
      value: number;
      trend: DashboardTrend;
      interpretation: string;
    };
    potential_rate: {
      value: number | null;
      trend: DashboardTrend;
      interpretation: string;
    };
    transfer_rate: {
      value: number | null;
      trend: DashboardTrend;
      interpretation: string;
    };
    minutes: {
      consumed: number;
      remaining: number;
      burn_per_day: number;
      days_remaining_at_pace: number | null;
      burn_line: string;
      trend: DashboardTrend;
    };
    leads: {
      value: number;
      trend: DashboardTrend;
      interpretation: string;
    };
  };
  queue: DashboardQueue;
  knowledge: DashboardKnowledge;
  chart: {
    series: DashboardChartPoint[];
    overlay: string[];
  };
  campaign: DashboardCampaign | null;
  assistant: {
    ai_line: string;
    language: string;
    active: boolean;
  };
};

export type Profile = {
  organization_id: number;
  organization_name: string;
  authorized_name: string;
  mobile_phone: string;
  ai_line: string;
  email: string;
  external_agent_id: string;
  remaining_minutes: string | number;
  gold_price_source: string;
  language: string;
  is_active: boolean;
  registered_at: string | null;
};

export type KnowledgeEntry = {
  id: number;
  category: string;
  title: string;
  content: string;
  tags: string;
  priority: number;
  status: "live" | "pending" | "draft";
  created_at: string;
  updated_at: string;
};

export type StaffMember = {
  id: number;
  name: string;
  title: string;
  phone: string;
  specialty: string;
  availability: "available" | "busy" | "offline";
};

export type ServiceRequest = {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  phone: string;
  assignee: number | null;
  assignee_name: string | null;
  created_at: string;
};

export type Campaign = {
  id: number;
  name: string;
  agent: number | null;
  agent_name: string | null;
  line_label: string;
  message: string;
  status: string;
  contacts: {
    id: number;
    name: string;
    phone: string;
    source: string;
    call_status: string;
  }[];
  total_targets: number;
  called_count: number;
  success_count: number;
  failed_count: number;
};

export type WhatsAppMessage = {
  id: number;
  customer_number: string;
  preview: string;
  occurred_at: string;
};

export type Competitor = {
  id: number;
  name: string;
  address: string;
  rating: string | null;
  review_count: number;
  notes: string;
};

export type AnalysisReport = {
  id: number;
  title: string;
  summary: string;
  recommendations: string;
  created_at: string;
};

export type CallStats = {
  total: number;
  potential: number;
  transfers: number;
  total_duration: string;
};
