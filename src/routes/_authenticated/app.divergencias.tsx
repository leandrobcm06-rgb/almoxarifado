import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FileDown, FileText, RefreshCw, Trash2, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Modal from "@/components/Modal/Modal";
import EmptyState from "@/components/ui/EmptyState";

export const Route = createFileRoute("/_authenticated/app/divergencias")({
  head: () => ({ meta: [{ title: "Divergências | BCM Stock" }] }),
  component: Page,
});

function Page() {
  const qc = useQueryClient();
  const [countId, setCountId] = useState<string>("");

  const { data: counts } = useQuery({
    queryKey: ["counts-finalized"],
    queryFn: async () => (await supabase.from("counts").select("id, nome, status, snapshot_id").eq("status", "finalizada").order("created_at", { ascending: false })).data ?? [],
  });
  const { data: reports, isLoading } = useQuery({
    queryKey: ["divergence-reports"],
    queryFn: async () => (await supabase.from("divergence_reports").select("*, counts(nome)").order("gerado_em", { ascending: false })).data ?? [],
  });

  const generate = useMutation({
    mutationFn: async () => {
      const count = counts?.find((c) => c.id === countId);
      if (!count || !count.snapshot_id) throw new Error("Selecione uma contagem finalizada com snapshot");

      // sum count_items across rounds (média se >1 rodada)
      const { data: rounds } = await supabase.from("count_rounds").select("id").eq("count_id", count.id);
      const roundIds = (rounds ?? []).map((r) => r.id);
      const { data: items } = await supabase.from("count_items").select("product_id, qty_contada, round_id").in("round_id", roundIds);

      const totalPerProduct = new Map<string, { sum: number; n: number }>();
      for (const it of items ?? []) {
        const e = totalPerProduct.get(it.product_id) ?? { sum: 0, n: 0 };
        e.sum += Number(it.qty_contada); e.n++;
        totalPerProduct.set(it.product_id, e);
      }

      const { data: snapItems } = await supabase.from("stock_snapshot_items").select("product_id, company_id, qty").eq("snapshot_id", count.snapshot_id);

      // per product, get total system across all CNPJs
      const perProductCnpjSaldos = new Map<string, Map<string, number>>();
      for (const si of snapItems ?? []) {
        const m = perProductCnpjSaldos.get(si.product_id) ?? new Map();
        m.set(si.company_id, Number(si.qty));
        perProductCnpjSaldos.set(si.product_id, m);
      }

      const { data: fallbackComp } = await supabase.from("companies").select("id").limit(1).single();
      const fallbackCompanyId = fallbackComp?.id;

      const { data: rep, error } = await supabase.from("divergence_reports").insert({ count_id: count.id, snapshot_id: count.snapshot_id }).select().single();
      if (error) throw error;

      const allProducts = new Set([...totalPerProduct.keys(), ...perProductCnpjSaldos.keys()]);
      const divItems: any[] = [];
      for (const pid of allProducts) {
        const contado = totalPerProduct.has(pid) ? (totalPerProduct.get(pid)!.sum / totalPerProduct.get(pid)!.n) : 0;
        const cnpjMap = perProductCnpjSaldos.get(pid) ?? new Map();
        const totalSistema = Array.from(cnpjMap.values()).reduce((a, b) => a + b, 0);
        const diferenca = contado - totalSistema;
        if (diferenca === 0) continue;
        
        const company_id = Array.from(cnpjMap.keys())[0] ?? fallbackCompanyId;

        divItems.push({
          report_id: rep.id, 
          product_id: pid, 
          company_id: company_id, 
          saldo_sistema: totalSistema, 
          qty_contada: contado, 
          diferenca: diferenca, 
          ajuste_sugerido: diferenca 
        });
      }
      for (let i = 0; i < divItems.length; i += 500) {
        const chunk = divItems.slice(i, i + 500);
        const { error: ie } = await supabase.from("divergence_items").insert(chunk);
        if (ie) throw ie;
      }
      return rep.id;
    },
    onSuccess: () => { toast.success("Relatório gerado"); qc.invalidateQueries({ queryKey: ["divergence-reports"] }); setCountId(""); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="page-container animate-fade-in max-w-7xl mx-auto">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Divergências</h1>
            <p className="page-subtitle">Gere e gerencie relatórios de divergências a partir de contagens finalizadas.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-border mb-6">
        <h2 className="text-lg font-semibold mb-4 font-display text-foreground border-b border-border pb-2">Novo Relatório</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="form-group flex-1 min-w-[240px] m-0">
            <label className="form-label" htmlFor="countSelect">Selecione a contagem</label>
            <select id="countSelect" className="form-input" value={countId} onChange={(e) => setCountId(e.target.value)}>
              <option value="">Contagem finalizada</option>
              {counts?.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <button className="btn btn--primary h-[40px] w-full sm:w-auto" onClick={() => generate.mutate()} disabled={!countId || generate.isPending}>
            <RefreshCw size={16} className={`mr-2 ${generate.isPending ? 'animate-spin' : ''}`} />
            {generate.isPending ? 'Gerando...' : 'Gerar Relatório'}
          </button>
        </div>
      </div>

      <div className="glass-panel p-0 rounded-xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border bg-muted/10">
          <h2 className="text-lg font-semibold font-display text-foreground">Relatórios Gerados</h2>
        </div>
        <div>
          {isLoading && <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando relatórios...</div>}
          {!isLoading && reports?.length === 0 && (
            <EmptyState 
              icon={FileText} 
              title="Nenhum relatório gerado" 
              description="Selecione uma contagem finalizada acima para gerar seu primeiro relatório de divergências." 
            />
          )}
          {reports?.map((r: any) => <ReportSection key={r.id} report={r} />)}
        </div>
      </div>
    </div>
  );
}

function ReportSection({ report }: { report: any }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [obsDialogOpen, setObsDialogOpen] = useState(false);
  const [obsItem, setObsItem] = useState<any>(null);
  const [obsText, setObsText] = useState("");

  const { data: items, isLoading } = useQuery({
    queryKey: ["div-items", report.id],
    enabled: open,
    queryFn: async () => (await supabase.from("divergence_items").select("*, products(codigo, descricao), companies(nome)").eq("report_id", report.id).order("diferenca", { ascending: false })).data ?? [],
  });
  const [filter, setFilter] = useState("todos");
  const filtered = useMemo(() => {
    if (!items) return [];
    if (filter === "todos") return items;
    return items.filter((i: any) => i.status === filter);
  }, [items, filter]);

  const updateStatus = useMutation({
    mutationFn: async ({ id, status, observacao }: { id: string, status: string, observacao?: string }) => {
      const payload: any = { status };
      if (observacao !== undefined) payload.observacao = observacao;
      const { error } = await supabase.from("divergence_items").update(payload).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["div-items"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const handleStatusChange = (i: any, val: string) => {
    if (val === "ajustado") {
      setObsItem(i);
      setObsText(i.observacao || "");
      setObsDialogOpen(true);
    } else {
      updateStatus.mutate({ id: i.id, status: val });
    }
  };

  const saveAjustado = () => {
    if (obsItem) {
      updateStatus.mutate({ id: obsItem.id, status: "ajustado", observacao: obsText });
      setObsDialogOpen(false);
    }
  };

  const deleteReport = useMutation({
    mutationFn: async () => {
      await supabase.from("divergence_items").delete().eq("report_id", report.id);
      const { error } = await supabase.from("divergence_reports").delete().eq("id", report.id);
      if (error) throw error;
    },
    onSuccess: () => { 
      toast.success("Relatório excluído com sucesso"); 
      qc.invalidateQueries({ queryKey: ["divergence-reports"] }); 
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="border-b border-border last:border-b-0">
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => setOpen((v) => !v)}>
        <div>
          <div className="font-semibold text-primary font-display flex items-center gap-2">
            <FileText size={16} />
            {report.counts?.nome}
          </div>
          <div className="text-xs font-medium text-muted-foreground mt-1">
            Gerado em <span className="text-foreground/80">{format(new Date(report.gerado_em), "dd/MM/yyyy HH:mm")}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-background flex items-center gap-1">
            {open ? <><ChevronUp size={14} /> Fechar</> : <><ChevronDown size={14} /> Abrir</>}
          </Badge>
        </div>
      </div>
      
      {open && (
        <div className="p-0 sm:p-4 bg-muted/10 border-t border-border animate-fade-in-up">
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 p-4 sm:p-0 mb-4">
            <select className="form-input w-full sm:w-48 bg-background" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="todos">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em andamento</option>
              <option value="ajustado">Ajustado</option>
              <option value="ignorado">Ignorado</option>
            </select>
            
            <div className="flex gap-2 flex-1">
              <button className="btn btn--outline bg-background flex-1 sm:flex-none" onClick={async () => {
                const { exportToExcel } = await import("@/lib/export-utils");
                exportToExcel(filtered.map((i: any) => ({
                  codigo: i.products?.codigo, descricao: i.products?.descricao,
                  saldo_sistema: i.saldo_sistema, qtd_contada: i.qty_contada, diferenca: i.diferenca, status: i.status,
                })), `divergencias-${report.id.slice(0, 6)}`);
              }}><FileDown size={16} className="mr-1.5" /> Excel</button>
              
              <button className="btn btn--outline bg-background flex-1 sm:flex-none" onClick={async () => {
                const { exportToPDF } = await import("@/lib/export-utils");
                exportToPDF("Divergências", ["Código", "Descrição", "Sistema", "Contado", "Diferença", "Status"],
                filtered.map((i: any) => [i.products?.codigo, i.products?.descricao, i.saldo_sistema, i.qty_contada, i.diferenca, i.status]),
                `divergencias-${report.id.slice(0, 6)}`, "portrait");
              }}><FileText size={16} className="mr-1.5" /> PDF</button>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="btn btn--danger w-full sm:w-auto mt-2 sm:mt-0"><Trash2 size={16} className="mr-1.5" /> Excluir</button>
              </AlertDialogTrigger>
              <AlertDialogContent className="glass-panel border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display">Excluir relatório?</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    Essa ação não pode ser desfeita. Todos os itens calculados neste relatório serão perdidos permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="btn btn--ghost">Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteReport.mutate()} className="btn btn--danger">Sim, excluir</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <div className="glass-panel p-0 rounded-xl sm:rounded-lg border-0 sm:border border-border overflow-hidden">
            <div className="hidden md:block table-responsive m-0 rounded-none shadow-none border-0">
              <table className="table table--hover m-0 border-0">
                <thead>
                  <tr>
                    <th className="glass-header w-32">Código</th>
                    <th className="glass-header">Descrição</th>
                    <th className="glass-header w-32 text-right">Sistema</th>
                    <th className="glass-header w-32 text-right">Contado</th>
                    <th className="glass-header w-32 text-right">Diferença</th>
                    <th className="glass-header" style={{ width: 170 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && <tr><td colSpan={6} className="text-center py-8 text-muted-foreground animate-pulse">Carregando itens...</td></tr>}
                  {!isLoading && filtered.length === 0 && (
                     <tr>
                       <td colSpan={6} className="text-center py-8 text-muted-foreground font-medium">
                         Nenhum item encontrado com o status selecionado.
                       </td>
                     </tr>
                  )}
                  {filtered.map((i: any) => (
                    <tr key={i.id}>
                      <td className="font-mono text-xs font-semibold">{i.products?.codigo}</td>
                      <td className="text-sm font-medium">{i.products?.descricao}</td>
                      <td className="text-right font-medium">{Number(i.saldo_sistema).toFixed(2)}</td>
                      <td className="text-right font-medium">{Number(i.qty_contada).toFixed(2)}</td>
                      <td className={`text-right font-bold ${Number(i.diferenca) < 0 ? "text-danger" : Number(i.diferenca) > 0 ? "text-success" : "text-foreground"}`}>
                        {Number(i.diferenca) > 0 ? '+' : ''}{Number(i.diferenca).toFixed(2)}
                      </td>
                      <td className="flex items-center gap-2 border-0">
                        <select 
                          className="form-input h-8 py-0 px-2 text-xs w-[120px] bg-background font-medium shadow-sm"
                          value={i.status} 
                          onChange={(e) => handleStatusChange(i, e.target.value)}
                        >
                          <option value="pendente">Pendente</option>
                          <option value="em_andamento">Em andamento</option>
                          <option value="ajustado">Ajustado</option>
                          <option value="ignorado">Ignorado</option>
                        </select>
                        {(i.status === "ajustado" || i.observacao) && (
                          <button className="btn-icon h-8 w-8 bg-muted hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors border border-border" onClick={() => { setObsItem(i); setObsText(i.observacao || ""); setObsDialogOpen(true); }} title="Ver/Editar Observação">
                            <MessageSquare size={14} className={i.observacao ? "text-primary" : ""} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="md:hidden space-y-3 p-3 bg-muted/5">
              {isLoading && <div className="text-center py-8 text-muted-foreground animate-pulse text-sm">Carregando itens...</div>}
              {!isLoading && filtered.length === 0 && <div className="text-center py-8 text-muted-foreground text-sm font-medium">Nenhum item encontrado.</div>}
              {filtered.map((i: any) => (
                <div key={i.id} className="border border-border rounded-lg p-3 bg-card shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-mono text-xs font-bold text-foreground bg-muted/50 px-1.5 py-0.5 rounded">{i.products?.codigo}</span>
                    <div className="flex items-center gap-2">
                      <select 
                        className="form-input h-8 py-0 px-2 text-[11px] w-[110px] bg-background font-medium"
                        value={i.status} 
                        onChange={(e) => handleStatusChange(i, e.target.value)}
                      >
                        <option value="pendente">Pendente</option>
                        <option value="em_andamento">Em andamento</option>
                        <option value="ajustado">Ajustado</option>
                        <option value="ignorado">Ignorado</option>
                      </select>
                      {(i.status === "ajustado" || i.observacao) && (
                        <button className="btn-icon h-8 w-8 bg-muted/50 border border-border" onClick={() => { setObsItem(i); setObsText(i.observacao || ""); setObsDialogOpen(true); }}>
                          <MessageSquare size={14} className={i.observacao ? "text-primary" : ""} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="text-sm font-medium leading-snug">{i.products?.descricao}</div>
                  <div className="grid grid-cols-3 gap-x-2 gap-y-3 bg-muted/30 p-2.5 rounded-md mt-1 border border-border/50">
                    <div className="text-center"><span className="block text-xs text-muted-foreground mb-0.5 uppercase tracking-wider font-semibold">Sistema</span><span className="font-semibold text-sm">{Number(i.saldo_sistema).toFixed(2)}</span></div>
                    <div className="text-center"><span className="block text-xs text-muted-foreground mb-0.5 uppercase tracking-wider font-semibold">Contado</span><span className="font-semibold text-sm">{Number(i.qty_contada).toFixed(2)}</span></div>
                    <div className="text-center"><span className="block text-xs text-muted-foreground mb-0.5 uppercase tracking-wider font-semibold">Dif.</span><span className={`font-bold text-sm ${Number(i.diferenca) < 0 ? "text-danger" : Number(i.diferenca) > 0 ? "text-success" : ""}`}>{Number(i.diferenca) > 0 ? '+' : ''}{Number(i.diferenca).toFixed(2)}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={obsDialogOpen} onClose={() => setObsDialogOpen(false)} title="Observação de Ajuste" size="md">
        <div className="space-y-4">
          <div className="text-sm font-medium p-4 bg-muted/30 rounded-lg border border-border flex flex-col">
            <span className="font-mono text-xs text-muted-foreground mb-1">{obsItem?.products?.codigo}</span>
            <span className="text-foreground">{obsItem?.products?.descricao}</span>
          </div>
          <div className="form-group">
            <label className="form-label">Descrição do que foi feito <span className="text-danger">*</span></label>
            <textarea
              placeholder="Ex: Contagem foi re-conferida e o estoque foi corrigido via ajuste de saída."
              value={obsText}
              onChange={(e) => setObsText(e.target.value)}
              className="form-input min-h-[120px] resize-none"
              autoFocus
            />
          </div>
        </div>
        <div className="form-actions mt-6 pt-4 border-t border-border flex justify-end gap-3">
          <button type="button" className="btn btn--ghost" onClick={() => setObsDialogOpen(false)}>Cancelar</button>
          <button type="button" className="btn btn--primary" onClick={saveAjustado} disabled={!obsText.trim()}>Salvar Observação</button>
        </div>
      </Modal>
    </div>
  );
}
