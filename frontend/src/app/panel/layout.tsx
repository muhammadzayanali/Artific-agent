import { redirect } from "next/navigation";

import { PanelShell } from "@/components/PanelShell";
import { ApiError, api } from "@/lib/api";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  try {
    const profile = await api.getProfile();
    return (
      <PanelShell
        orgName={profile.organization_name || "İşletme"}
        userName={profile.authorized_name || profile.organization_name || "Hesap"}
        userEmail={profile.email || ""}
        remainingMinutes={profile.remaining_minutes}
      >
        {children}
      </PanelShell>
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect("/login");
    throw error;
  }
}
