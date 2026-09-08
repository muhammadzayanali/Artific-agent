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

export type Dashboard = {
  calls_today: number;
  remaining_minutes: number;
  potential_leads: number;
  transfer_requests: number;
  pending_requests: number;
  total_talk_time: string;
  active_calls: number;
  total_calls: number;
  weekly: { day: string; date: string; calls: number }[];
  recent_calls: Conversation[];
  recent_transfers: {
    id: number;
    summary: string;
    started_at: string;
    caller_number: string;
  }[];
  ai_line: string;
  language: string;
  assistant_active: boolean;
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
