import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, AlertTriangle, FileSpreadsheet, Wrench } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/app/")({
  head: () => ({ meta: [{ title: "Dashboard | Almoxarifado" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { roles } = useAuth();
  const { data } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [counts, divs, snap, adjPend] = await Promise.all([
        supabase.from("counts").select("id", { count: "exact", head: true }).in("status", ["rascunho", "em_contagem", "aguardando_revisao"]),
        supabase.from("divergence_items").select("id", { count: "exact", head: true }).eq("status", "pendente"),
        supabase.from("stock_snapshots").select("snapshot_date, status").eq("status", "confirmado").order("snapshot_date", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("divergence_items").select("id", { count: "exact", head: true }).eq("status", "em_andamento"),
      ]);
      return {
        contagensAbertas: counts.count ?? 0,
        divergenciasPendentes: divs.count ?? 0,
        ajustesEmAndamento: adjPend.count ?? 0,
        ultimoSnapshot: snap.data?.snapshot_date ?? null,
      };
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do almoxarifado</p>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<ClipboardList />} label="Contagens em aberto" value={data?.contagensAbertas ?? "-"} />
        <Stat icon={<AlertTriangle />} label="Divergências pendentes" value={data?.divergenciasPendentes ?? "-"} />
        <Stat icon={<Wrench />} label="Ajustes em andamento" value={data?.ajustesEmAndamento ?? "-"} />
        <Stat icon={<FileSpreadsheet />} label="Último estoque" value={data?.ultimoSnapshot ? format(new Date(data.ultimoSnapshot + "T00:00"), "dd/MM/yyyy") : "—"} />
      </div>
      <Card>
        <CardHeader><CardTitle>Suas funções</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {roles.length === 0 ? <span className="text-sm text-muted-foreground">Nenhuma função atribuída. Peça a um administrador.</span> :
              roles.map((r) => <span key={r} className="px-2 py-1 rounded bg-secondary text-xs font-medium">{r}</span>)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-xl font-semibold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
