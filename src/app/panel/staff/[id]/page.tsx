"use client";

import { useParams } from "next/navigation";
import { Badge, Card, EmptyState, PageHeader, Select } from "@/components/ui/primitives";
import type { StaffStatus } from "@/types";
import { services } from "@/services";
import { useDemoStore } from "@/stores/demo-store";

export default function StaffDetailPage() {
  const { id } = useParams<{ id: string }>();
  const member = useDemoStore((s) => s.staff.find((s) => s.id === id));
  if (!member) return <EmptyState title="Personel yok" body="Kayıt bulunamadı." />;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Personel" title={member.name} description={`${member.role} · ${member.email}`} />
      <Card className="grid gap-4 p-5 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase text-ink-400">Birim</p>
          <p>{member.department}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-ink-400">Dahili</p>
          <p>{member.extension}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-ink-400">Yetki</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {member.authority.map((a) => (
              <Badge key={a} tone="gold">
                {a}
              </Badge>
            ))}
          </div>
        </div>
        <label className="grid gap-1 text-sm">
          <span className="text-xs uppercase text-ink-400">Durum</span>
          <Select value={member.status} onChange={(e) => services.staff.setStatus(member.id, e.target.value as StaffStatus)}>
            <option value="available">Müsait</option>
            <option value="busy">Meşgul</option>
            <option value="offline">Çevrimdışı</option>
          </Select>
        </label>
      </Card>
    </div>
  );
}
