import { CreateResourceButton } from "@/components/CreateResourceButton";
import { StaffActions } from "@/components/StaffActions";
import { Badge, Card, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";

export default async function StaffPage() {
  const staff = await api.getStaff();

  return (
    <div>
      <PageHeader
        title="Personel Yönetimi"
        description="Yapay zeka asistanının yönlendireceği personel listesi."
        action={
          <CreateResourceButton
            label="+ Personel Ekle"
            endpoint="staff"
            defaults={{ availability: "available" }}
            fields={[
              { name: "name", label: "Ad Soyad", required: true },
              { name: "title", label: "Unvan", required: true },
              { name: "phone", label: "Telefon", required: true },
              { name: "specialty", label: "Uzmanlık" },
              {
                name: "availability",
                label: "Durum",
                type: "select",
                options: [
                  { value: "available", label: "Müsait" },
                  { value: "busy", label: "Meşgul" },
                  { value: "offline", label: "Çevrimdışı" },
                ],
              },
            ]}
          />
        }
      />
      <Card className="mb-5 border-[color-mix(in_srgb,var(--signal)_25%,transparent)] bg-[var(--signal-soft)] p-4 text-sm text-[var(--text)]">
        Bu liste, müşteri temsilci istediğinde asistanın aktarım veya geri arama talebi oluşturması
        için kullanılır.
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {staff.map((member) => (
          <Card key={member.id} className="min-w-0 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--panel-solid)] text-sm font-semibold">
                  {member.name.slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-[var(--text)]">{member.name}</p>
                  <p className="truncate text-sm text-[var(--muted)]">{member.title}</p>
                </div>
              </div>
              <Badge
                tone={
                  member.availability === "available"
                    ? "ok"
                    : member.availability === "busy"
                      ? "danger"
                      : "neutral"
                }
              >
                {member.availability === "available"
                  ? "Müsait"
                  : member.availability === "busy"
                    ? "Meşgul"
                    : "Çevrimdışı"}
              </Badge>
            </div>
            <p className="mt-4 break-all text-sm text-[var(--muted)]">{member.phone}</p>
            {member.specialty ? (
              <p className="mt-2 inline-flex max-w-full rounded-lg bg-[var(--gilt-soft)] px-2 py-1 text-xs text-[var(--gilt)]">
                <span className="truncate">{member.specialty}</span>
              </p>
            ) : null}
            <StaffActions id={member.id} availability={member.availability} />
          </Card>
        ))}
      </div>
    </div>
  );
}
