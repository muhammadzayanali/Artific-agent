import type { Agent, ConversationStatus } from "@/lib/types";

const conversationStyles: Record<ConversationStatus, string> = {
  live: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  ended: "bg-ink-900/5 text-ink-700 ring-ink-900/10",
  missed: "bg-amber-50 text-amber-800 ring-amber-200",
  failed: "bg-rose-50 text-rose-800 ring-rose-200",
};

const agentStyles: Record<Agent["status"], string> = {
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  paused: "bg-amber-50 text-amber-800 ring-amber-200",
  setup: "bg-ink-900/5 text-ink-700 ring-ink-900/10",
};

export function ConversationStatusBadge({ status }: { status: ConversationStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${conversationStyles[status]}`}
    >
      {status === "live" ? (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600" />
      ) : null}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function AgentStatusBadge({ status }: { status: Agent["status"] }) {
  const label = status === "setup" ? "In setup" : status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${agentStyles[status]}`}>
      {label}
    </span>
  );
}
