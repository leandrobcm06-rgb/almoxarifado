import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FileDown, FileText, Wrench, Search, Settings2, PackageX, ChevronRight, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import Modal from "@/components/Modal/Modal";
import EmptyState from "@/components/UI/EmptyState";
import Skeleton from "@/components/UI/Skeleton";

export const Route = createFileRoute("/_authenticated/app/ajustes")({
  head: () => ({ meta: [{ title: "Ajustes | BCM Stock" }] }),
  component: Page,
});

function Page() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<"pendente" | "em_andamento" | "ajustado">("pendente");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [obs, setObs] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["adjustments", status],
    queryFn: async () => (await supabase.from("divergence_items")
      .select("*, products(codigo, descricao), companies(nome), divergence_reports(counts(nome))")
      .eq("status", status)
      .order("updated_at", { ascending: false }).limit(500)).data ?? [],
  });

  const update = useMutation({
    mutationFn: async ({ id, newStatus, observacao }: { id: string; newStatus: string; observacao?: string }) => {
      const { data: u } = await supabase.auth.getUser();
      const patch: any = { status: newStatus, observacao };
      if (newStatus === "ajustado") { patch.ajustado_por = u.user?.id; patch.ajustado_em = new Date().toISOString(); }
      const { error } = await supabase.from("divergence_items").update(patch).eq("id", id);
      if (error) throw error;
      await supabase.from("audit_log").insert({ user_id: u.user?.id, acao: `divergencia.${newStatus}`, entidade: "divergence_item", entidade_id: id, dados: patch });
    },
    onSuccess: () => { toast.success("Ajuste atualizado"); setEditing(null); setObs(""); qc.invalidateQueries({ queryKey: ["adjustments"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = (data ?? []).filter((d: any) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return d.products?.codigo?.toLowerCase().includes(s) || d.products?.descricao?.toLowerCase().includes(s);
  });

  return (
    <div className="page-container animate-fade-in max-w-7xl mx-auto">
      <div className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="page-title-area w-full sm:w-auto">
          <div className="page-title-text">
            <h1 className="page-title">Gestão de ajustes</h1>
            <p className="page-subtitle">Fluxo: pendente → em andamento → ajustado.</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="btn btn--outline bg-background flex-1 sm:flex-none" onClick={async () => {
            const { exportToExcel } = await import("@/lib/export-utils");
            exportToExcel(filtered.map((i: any) => ({
              codigo: i.products?.codigo, descricao: i.products?.descricao, empresa: i.companies?.nome,
              ajuste: i.ajuste_sugerido, status: i.status, observacao: i.observacao,
            })), `ajustes-${status}`)
          }}><FileDown size={16} className="mr-2" />Excel</button>
          <button className="btn btn--outline bg-background flex-1 sm:flex-none" onClick={async () => {
            const { exportToPDF } = await import("@/lib/export-utils");
            exportToPDF("Ajustes — " + status, ["Código", "Descrição", "Empresa", "Ajuste", "Obs."],
              filtered.map((i: any) => [i.products?.codigo, i.products?.descricao, i.companies?.nome, i.ajuste_sugerido, i.observacao ?? ""]),
              `ajustes-${status}`, "landscape")
          }}><FileText size={16} className="mr-2" />PDF</button>
        </div>
      </div>

      <div className="page-tabs mb-6 overflow-x-auto whitespace-nowrap pb-1">
        <button 
          className={`page-tab flex-shrink-0 ${status === 'pendente' ? 'page-tab--active text-warning border-warning' : ''}`}
          onClick={() => setStatus('pendente')}
        >
          Pendentes
        </button>
        <button 
          className={`page-tab flex-shrink-0 ${status === 'em_andamento' ? 'page-tab--active text-primary border-primary' : ''}`}
          onClick={() => setStatus('em_andamento')}
        >
          Em andamento
        </button>
        <button 
          className={`page-tab flex-shrink-0 ${status === 'ajustado' ? 'page-tab--active text-success border-success' : ''}`}
          onClick={() => setStatus('ajustado')}
        >
          Ajustados
        </button>
      </div>

      <div className="filter-bar mb-6 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input 
          placeholder="Buscar por código ou descrição..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="form-input pl-9 w-full max-w-md shadow-sm" 
        />
      </div>

      <div className="glass-panel p-0 rounded-xl border border-border overflow-hidden animate-fade-in-up">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton height="50px" width="100%" />
            <Skeleton height="50px" width="100%" />
            <Skeleton height="50px" width="100%" />
            <Skeleton height="50px" width="100%" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState 
            icon={search ? PackageX : Settings2} 
            title={search ? "Nenhum resultado" : `Nenhum ajuste ${status.replace('_', ' ')}`} 
            description={search ? `Não encontramos itens para "${search}".` : "Não há itens nesta aba no momento."} 
          />
        ) : (
          <>
            <div className="hidden md:block table-responsive m-0 rounded-none shadow-none border-0">
              <table className="table table--hover m-0 border-0">
                <thead className="bg-muted/10">
                  <tr>
                    <th className="glass-header w-32">Código</th>
                    <th className="glass-header">Descrição</th>
                    <th className="glass-header w-48">Empresa</th>
                    <th className="glass-header w-32 text-right">Ajuste</th>
                    <th className="glass-header w-40 text-center">Atualizado</th>
                    <th className="glass-header w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d: any) => (
                    <tr key={d.id} className="group cursor-pointer" onClick={() => { setEditing(d); setObs(d.observacao ?? ""); }}>
                      <td className="font-mono text-xs font-semibold">{d.products?.codigo}</td>
                      <td className="text-sm font-medium">{d.products?.descricao}</td>
                      <td className="text-sm text-muted-foreground">{d.companies?.nome}</td>
                      <td className={`text-right font-bold ${Number(d.ajuste_sugerido) < 0 ? "text-danger" : "text-success"}`}>
                        {Number(d.ajuste_sugerido) > 0 ? '+' : ''}{Number(d.ajuste_sugerido).toFixed(3)}
                      </td>
                      <td className="text-xs text-muted-foreground text-center font-medium">
                        {format(new Date(d.updated_at), "dd/MM HH:mm")}
                      </td>
                      <td className="text-right">
                        <button className="btn-icon bg-muted/50 border border-border group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-colors" title="Atualizar Ajuste">
                          <Wrench size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-3 p-3 bg-muted/5 h-full">
              {filtered.map((d: any) => (
                <div key={d.id} className="border border-border rounded-lg p-3 bg-card shadow-sm cursor-pointer hover:border-primary transition-colors" onClick={() => { setEditing(d); setObs(d.observacao ?? ""); }}>
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-mono text-xs font-bold bg-muted/50 px-1.5 py-0.5 rounded text-foreground">{d.products?.codigo}</span>
                    <Badge variant="outline" className="text-[10px] bg-background max-w-[120px] truncate">{d.companies?.nome}</Badge>
                  </div>
                  <div className="text-sm font-medium leading-snug mb-3 text-foreground">{d.products?.descricao}</div>
                  <div className="flex items-center justify-between border-t border-border pt-2 mt-2">
                    <div className="text-xs text-muted-foreground flex flex-col">
                      <span className="uppercase tracking-wider font-semibold mb-0.5">Ajuste</span>
                      <span className={`font-bold text-sm ${Number(d.ajuste_sugerido) < 0 ? "text-danger" : "text-success"}`}>
                        {Number(d.ajuste_sugerido) > 0 ? '+' : ''}{Number(d.ajuste_sugerido).toFixed(3)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">{format(new Date(d.updated_at), "dd/MM HH:mm")}</span>
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Atualizar Ajuste" size="md">
        {editing && (
          <div className="space-y-5">
            <div className="bg-muted/30 p-4 rounded-xl border border-border">
              <div className="flex justify-between items-start gap-4 mb-3">
                <div>
                  <div className="font-mono text-xs text-muted-foreground font-semibold mb-1">{editing.products?.codigo}</div>
                  <div className="text-sm font-medium text-foreground">{editing.products?.descricao}</div>
                </div>
                <Badge 
                  variant="outline" 
                  className={editing.status === 'pendente' ? 'text-warning border-warning-border bg-warning-bg font-semibold' : editing.status === 'em_andamento' ? 'text-primary border-primary/30 bg-primary/10 font-semibold' : 'text-success border-success-border bg-success-bg font-semibold'}
                >
                  {editing.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                <div>
                  <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Empresa</span>
                  <span className="text-sm font-medium">{editing.companies?.nome}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Ajuste Sugerido</span>
                  <span className={`text-sm font-bold ${Number(editing.ajuste_sugerido) < 0 ? "text-danger" : "text-success"}`}>
                    {Number(editing.ajuste_sugerido) > 0 ? '+' : ''}{Number(editing.ajuste_sugerido).toFixed(3)}
                  </span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label flex items-center gap-1.5"><MessageSquare size={14}/> Observação</label>
              <textarea 
                value={obs} 
                onChange={(e) => setObs(e.target.value)} 
                placeholder="Detalhes do ajuste no ERP, motivo, etc." 
                className="form-input min-h-[120px] resize-none"
              />
            </div>
          </div>
        )}
        
        {editing && (
          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-5 border-t border-border">
            {editing.status !== "em_andamento" && (
              <button 
                className="btn btn--outline border-primary/30 text-primary hover:bg-primary/10 w-full" 
                onClick={() => update.mutate({ id: editing.id, newStatus: "em_andamento", observacao: obs })}
                disabled={update.isPending}
              >
                Mover para Em Andamento
              </button>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:ml-auto">
              {editing.status !== "ignorado" && (
                <button 
                  className="btn btn--ghost text-muted-foreground hover:text-foreground w-full sm:w-auto" 
                  onClick={() => update.mutate({ id: editing.id, newStatus: "ignorado", observacao: obs })}
                  disabled={update.isPending}
                >
                  Ignorar
                </button>
              )}
              <button 
                className="btn btn--primary w-full sm:w-auto shadow-md shadow-primary/20" 
                onClick={() => update.mutate({ id: editing.id, newStatus: "ajustado", observacao: obs })}
                disabled={update.isPending}
              >
                Confirmar Ajuste
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
