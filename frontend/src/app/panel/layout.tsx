import { redirect } from "next/navigation";

import { PanelShell } from "@/components/PanelShell";
import { ApiError, api } from "@/lib/api";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  try {
    // Lean shell fetch — full dashboard only loads on /panel page (deduped via cache())
    const [profile, live] = await Promise.all([api.getProfile(), api.getLiveCalls()]);
    return (
      <PanelShell
        orgName={profile.organization_name || "İşletme"}
        remainingMinutes={profile.remaining_minutes}
        activeCalls={live.length}
      >
        {children}
      </PanelShell>
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect("/login");
    throw error;
  }
}
