import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Skeleton from "@/components/UI/Skeleton";
import EmptyState from "@/components/UI/EmptyState";

export const Route = createFileRoute("/_authenticated/app/contagens/")({
  head: () => ({ meta: [{ title: "Contagens | BCM Stock" }] }),
  component: Page,
});

function Page() {
  const qc = useQueryClient();
  const nav = useNavigate();
  const [mesFiltro, setMesFiltro] = useState<string>("TODOS");

  const { data, isLoading } = useQuery({
    queryKey: ["counts"],
    queryFn: async () => (await supabase.from("counts").select("*, count_rounds(id, rodada, status)").order("created_at", { ascending: false }).limit(100)).data ?? [],
  });

  const filteredData = data?.filter((c: any) => mesFiltro === "TODOS" || c.mes === mesFiltro) ?? [];

  return (
    <div className="page-container animate-fade-in max-w-7xl mx-auto">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Contagens</h1>
            <p className="page-subtitle">Contagem geral (2 rodadas cegas) ou diária (1 rodada).</p>
          </div>
        </div>
        <div className="page-actions flex items-center gap-3">
          <select 
            className="form-input shadow-sm w-44" 
            value={mesFiltro} 
            onChange={(e) => setMesFiltro(e.target.value)}
          >
            <option value="TODOS">Todos os Meses</option>
            {["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <button className="btn btn--primary" onClick={() => nav({ to: "/app/contagens/nova" })}>
            <Plus size={16} className="mr-2" /> Nova contagem
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-border mt-2">
        <div className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton height="50px" width="100%" />
              <Skeleton height="50px" width="100%" />
              <Skeleton height="50px" width="100%" />
            </div>
          ) : filteredData.length === 0 ? (
            <EmptyState 
              icon={ClipboardList} 
              title={mesFiltro !== "TODOS" ? `Nenhuma contagem em ${mesFiltro}` : "Nenhuma contagem encontrada"} 
              description="Você ainda não possui contagens criadas ou os filtros não retornaram resultados."
              action={
                <button className="btn btn--primary mt-4" onClick={() => nav({ to: "/app/contagens/nova" })}>
                  Criar Primeira Contagem
                </button>
              }
            />
          ) : (
            <div className="table-responsive border-0 shadow-none rounded-none">
              <table className="table table--hover m-0">
                <thead>
                  <tr>
                    <th className="glass-header min-w-[200px]">Nome</th>
                    <th className="glass-header w-32 hidden md:table-cell">Mês</th>
                    <th className="glass-header hidden lg:table-cell">Locais</th>
                    <th className="glass-header w-32 hidden sm:table-cell text-center">Tipo</th>
                    <th className="glass-header w-40 text-center">Status</th>
                    <th className="glass-header w-24 text-center hidden md:table-cell">Rodadas</th>
                    <th className="glass-header w-40 text-right">Criada em</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((c: any) => (
                    <tr key={c.id} className="cursor-pointer" onClick={() => nav({ to: "/app/contagens/$id", params: { id: c.id } })}>
                      <td>
                        <Link to="/app/contagens/$id" params={{ id: c.id }} className="font-semibold text-primary hover:underline">
                          {c.nome}
                        </Link>
                      </td>
                      <td className="hidden md:table-cell font-medium text-foreground">{c.mes || "-"}</td>
                      <td className="hidden lg:table-cell text-muted-foreground text-sm">
                        {(c.loc_start || c.loc_end) ? `${c.loc_start || "*"} até ${c.loc_end || "*"}` : "Todas"}
                      </td>
                      <td className="hidden sm:table-cell text-center">
                        <Badge variant="outline" className="font-medium bg-muted/30">{c.tipo === 'geral' ? 'Geral' : 'Diária'}</Badge>
                      </td>
                      <td className="text-center">
                        <Badge 
                          variant={c.status === 'concluido' ? 'success' : c.status === 'em_contagem' ? 'default' : 'secondary'}
                          className={c.status === 'em_contagem' ? 'bg-primary/20 text-primary border-primary/30' : c.status === 'concluido' ? 'bg-success-bg text-success border-success-border' : ''}
                        >
                          {c.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="text-center hidden md:table-cell font-mono text-muted-foreground">
                        {c.count_rounds?.length ?? 0}
                      </td>
                      <td className="text-right text-sm text-muted-foreground">
                        {format(new Date(c.created_at), "dd/MM/yyyy HH:mm")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile View */}
              <div className="md:hidden flex flex-col gap-3 p-3 bg-muted/10">
                {filteredData.map((c: any) => (
                  <div key={c.id} className="border border-border rounded-xl p-4 bg-card shadow-sm flex flex-col gap-3 cursor-pointer hover:border-primary transition-colors" onClick={() => nav({ to: "/app/contagens/$id", params: { id: c.id } })}>
                    <div className="flex justify-between items-start">
                      <div className="font-semibold text-foreground text-base font-display text-primary">{c.nome}</div>
                      <Badge 
                        variant={c.status === 'concluido' ? 'success' : c.status === 'em_contagem' ? 'default' : 'secondary'}
                        className={c.status === 'em_contagem' ? 'bg-primary/20 text-primary border-primary/30' : c.status === 'concluido' ? 'bg-success-bg text-success border-success-border' : ''}
                      >
                        {c.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm bg-muted/30 p-3 rounded-lg mt-1">
                      <div>
                        <span className="block text-xs text-muted-foreground mb-0.5 uppercase tracking-wider font-semibold">Mês</span>
                        <span className="font-medium text-foreground">{c.mes || "-"}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground mb-0.5 uppercase tracking-wider font-semibold">Tipo</span>
                        <Badge variant="outline" className="text-xs bg-background">{c.tipo === 'geral' ? 'Geral' : 'Diária'}</Badge>
                      </div>
                      <div className="col-span-2">
                        <span className="block text-xs text-muted-foreground mb-0.5 uppercase tracking-wider font-semibold">Localização</span>
                        <span className="font-medium text-foreground text-sm">{(c.loc_start || c.loc_end) ? `${c.loc_start || "*"} até ${c.loc_end || "*"}` : "Todas"}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-border mt-1">
                      <span className="font-medium">{c.count_rounds?.length ?? 0} Rodadas</span>
                      <span className="font-mono">{format(new Date(c.created_at), "dd/MM/yyyy HH:mm")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
