import { AnalyzeButton } from "@/components/AnalyzeButton";
import { AnalysisWorkspace } from "@/components/AnalysisWorkspace";
import { PageHeader } from "@/components/ui";
import { api } from "@/lib/api";

export default async function AiConsultantPage() {
  const reports = await api.getAnalysis();

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI işletme danışmanı"
        description="Yapay zeka, müşteri çağrılarınızı analiz ederek size stratejik öneriler ve kampanya fikirleri sunar."
        action={<AnalyzeButton />}
      />
      <AnalysisWorkspace reports={reports} />
    </div>
  );
}
