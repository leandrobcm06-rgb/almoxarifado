import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FileDown, FileText, RefreshCw, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
  const { data: reports } = useQuery({
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
    onSuccess: () => { toast.success("Relatório gerado"); qc.invalidateQueries({ queryKey: ["divergence-reports"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold">Divergências</h1><p className="text-sm text-muted-foreground">Gere o relatório a partir de uma contagem finalizada.</p></div>

      <Card>
        <CardHeader><CardTitle>Novo relatório</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-3 items-end flex-wrap">
            <div className="flex-1 min-w-[240px]">
              <Select value={countId} onValueChange={setCountId}>
                <SelectTrigger><SelectValue placeholder="Contagem finalizada" /></SelectTrigger>
                <SelectContent>{counts?.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button onClick={() => generate.mutate()} disabled={!countId || generate.isPending}><RefreshCw className="h-4 w-4 mr-2" />Gerar relatório</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Relatórios</CardTitle></CardHeader>
        <CardContent className="p-0">
          {reports?.length === 0 && <div className="p-6 text-center text-muted-foreground text-sm">Nenhum relatório ainda.</div>}
          {reports?.map((r: any) => <ReportSection key={r.id} report={r} />)}
        </CardContent>
      </Card>
    </div>
  );
}

function ReportSection({ report }: { report: any }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: items } = useQuery({
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
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { error } = await supabase.from("divergence_items").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["div-items"] }); },
    onError: (e: any) => toast.error(e.message),
  });

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
    <div className="border-b last:border-b-0">
      <div className="p-3 flex items-center justify-between hover:bg-accent cursor-pointer" onClick={() => setOpen((v) => !v)}>
        <div>
          <div className="font-medium">{report.counts?.nome}</div>
          <div className="text-xs text-muted-foreground">Gerado em {format(new Date(report.gerado_em), "dd/MM/yyyy HH:mm")}</div>
        </div>
        <Badge variant="outline">{open ? "fechar" : "abrir"}</Badge>
      </div>
      {open && (
        <div className="p-3 space-y-3 bg-muted/30">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_andamento">Em andamento</SelectItem>
                <SelectItem value="ajustado">Ajustado</SelectItem>
                <SelectItem value="ignorado">Ignorado</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" onClick={async () => {
              const { exportToExcel } = await import("@/lib/export-utils");
              exportToExcel(filtered.map((i: any) => ({
                codigo: i.products?.codigo, descricao: i.products?.descricao,
                saldo_sistema: i.saldo_sistema, qtd_contada: i.qty_contada, diferenca: i.diferenca, status: i.status,
              })), `divergencias-${report.id.slice(0, 6)}`);
            }}><FileDown className="h-4 w-4 mr-2" />Excel</Button>
            <Button size="sm" variant="outline" onClick={async () => {
              const { exportToPDF } = await import("@/lib/export-utils");
              exportToPDF("Divergências", ["Código", "Descrição", "Sistema", "Contado", "Diferença", "Status"],
              filtered.map((i: any) => [i.products?.codigo, i.products?.descricao, i.saldo_sistema, i.qty_contada, i.diferenca, i.status]),
              `divergencias-${report.id.slice(0, 6)}`, "portrait");
            }}><FileText className="h-4 w-4 mr-2" />PDF</Button>
            
            <div className="flex-1" />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive"><Trash2 className="h-4 w-4 mr-2" />Excluir Relatório</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir relatório?</AlertDialogTitle>
                  <AlertDialogDescription>Essa ação não pode ser desfeita. Todos os itens calculados neste relatório serão perdidos.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteReport.mutate()} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="hidden md:block">
            <Table>
              <TableHeader><TableRow><TableHead>Código</TableHead><TableHead>Descrição</TableHead><TableHead className="text-right">Sistema</TableHead><TableHead className="text-right">Contado</TableHead><TableHead className="text-right">Diferença</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map((i: any) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-mono text-xs">{i.products?.codigo}</TableCell>
                    <TableCell className="text-sm">{i.products?.descricao}</TableCell>
                    <TableCell className="text-right">{Number(i.saldo_sistema).toFixed(2)}</TableCell>
                    <TableCell className="text-right">{Number(i.qty_contada).toFixed(2)}</TableCell>
                    <TableCell className={`text-right font-medium ${Number(i.diferenca) < 0 ? "text-destructive" : Number(i.diferenca) > 0 ? "text-green-600" : ""}`}>{Number(i.diferenca).toFixed(2)}</TableCell>
                    <TableCell>
                      <Select value={i.status} onValueChange={(val) => updateStatus.mutate({ id: i.id, status: val })}>
                        <SelectTrigger className="h-8 text-xs w-[110px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="em_andamento">Em andam.</SelectItem>
                          <SelectItem value="ajustado">Ajustado</SelectItem>
                          <SelectItem value="ignorado">Ignorado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="md:hidden space-y-4">
            {filtered.map((i: any) => (
              <div key={i.id} className="border rounded-md p-4 bg-card shadow-sm flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs text-muted-foreground">{i.products?.codigo}</span>
                  <Select value={i.status} onValueChange={(val) => updateStatus.mutate({ id: i.id, status: val })}>
                    <SelectTrigger className="h-8 text-xs w-[110px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="em_andamento">Em andam.</SelectItem>
                      <SelectItem value="ajustado">Ajustado</SelectItem>
                      <SelectItem value="ignorado">Ignorado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm font-medium leading-snug">{i.products?.descricao}</div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-3 bg-muted/50 p-2 rounded-md">
                  <div className="text-xs"><span className="block text-muted-foreground mb-0.5">Sistema</span><span className="font-semibold">{Number(i.saldo_sistema).toFixed(2)}</span></div>
                  <div className="text-xs"><span className="block text-muted-foreground mb-0.5">Contado</span><span className="font-semibold">{Number(i.qty_contada).toFixed(2)}</span></div>
                  <div className="text-xs col-span-2"><span className="block text-muted-foreground mb-0.5">Diferença</span><span className={`font-semibold ${Number(i.diferenca) < 0 ? "text-destructive" : Number(i.diferenca) > 0 ? "text-green-600" : ""}`}>{Number(i.diferenca).toFixed(2)}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
