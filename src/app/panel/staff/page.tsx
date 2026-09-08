"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Card, Input, PageHeader, Select, StatusDot } from "@/components/ui/primitives";
import { staffStatusLabel } from "@/lib/labels";
import { useDemoStore } from "@/stores/demo-store";

export default function StaffPage() {
  const staff = useDemoStore((s) => s.staff);
  const [q, setQ] = useState("");
  const [dep, setDep] = useState("all");
  const filtered = useMemo(
    () =>
      staff.filter(
        (s) =>
          (dep === "all" || s.department === dep) &&
          `${s.name} ${s.role} ${s.authority.join(" ")}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [staff, q, dep],
  );

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Operasyon" title="Personel" description="Yetki ve müsaitlik, canlı çağrı aktarım penceresine yansır." />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Ara" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={dep} onChange={(e) => setDep(e.target.value)} className="sm:w-56">
          <option value="all">Tüm birimler</option>
          {[...new Set(staff.map((s) => s.department))].map((d) => (
            <option key={d}>{d}</option>
          ))}
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((member) => (
          <Link key={member.id} href={`/panel/staff/${member.id}`}>
            <Card className="p-5 transition hover:shadow-lift">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-ink-500">
                    {member.role} · {member.department} · dahili {member.extension}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm">
                  <StatusDot tone={member.status === "available" ? "live" : member.status === "busy" ? "alert" : "neutral"} />
                  {staffStatusLabel[member.status]}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {member.authority.map((a) => (
                  <Badge key={a} tone="gold">
                    {a}
                  </Badge>
                ))}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
