import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FileDown, FileText, Wrench } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/app/ajustes")({
  head: () => ({ meta: [{ title: "Ajustes | Almoxarifado" }] }),
  component: Page,
});

function Page() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<"pendente" | "em_andamento" | "ajustado">("pendente");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [obs, setObs] = useState("");

  const { data } = useQuery({
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
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-semibold">Gestão de ajustes</h1><p className="text-sm text-muted-foreground">Fluxo: pendente → em andamento → ajustado.</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={async () => {
            const { exportToExcel } = await import("@/lib/export-utils");
            exportToExcel(filtered.map((i: any) => ({
              codigo: i.products?.codigo, descricao: i.products?.descricao, empresa: i.companies?.nome,
              ajuste: i.ajuste_sugerido, status: i.status, observacao: i.observacao,
            })), `ajustes-${status}`)
          }}><FileDown className="h-4 w-4 mr-2" />Excel</Button>
          <Button variant="outline" size="sm" onClick={async () => {
            const { exportToPDF } = await import("@/lib/export-utils");
            exportToPDF("Ajustes — " + status, ["Código", "Descrição", "Empresa", "Ajuste", "Obs."],
              filtered.map((i: any) => [i.products?.codigo, i.products?.descricao, i.companies?.nome, i.ajuste_sugerido, i.observacao ?? ""]),
              `ajustes-${status}`, "landscape")
          }}><FileText className="h-4 w-4 mr-2" />PDF</Button>
        </div>
      </div>

      <Tabs value={status} onValueChange={(v: any) => setStatus(v)}>
        <TabsList>
          <TabsTrigger value="pendente">Pendentes</TabsTrigger>
          <TabsTrigger value="em_andamento">Em andamento</TabsTrigger>
          <TabsTrigger value="ajustado">Ajustados</TabsTrigger>
        </TabsList>
      </Tabs>

      <Input placeholder="Buscar por código ou descrição..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Código</TableHead><TableHead>Descrição</TableHead><TableHead>Empresa</TableHead><TableHead className="text-right">Ajuste</TableHead><TableHead>Atualizado</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((d: any) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-xs">{d.products?.codigo}</TableCell>
                  <TableCell className="text-sm">{d.products?.descricao}</TableCell>
                  <TableCell className="text-sm">{d.companies?.nome}</TableCell>
                  <TableCell className={`text-right font-medium ${Number(d.ajuste_sugerido) < 0 ? "text-destructive" : "text-green-600"}`}>{Number(d.ajuste_sugerido).toFixed(3)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{format(new Date(d.updated_at), "dd/MM HH:mm")}</TableCell>
                  <TableCell><Button size="sm" variant="outline" onClick={() => { setEditing(d); setObs(d.observacao ?? ""); }}><Wrench className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-6">Nenhum item.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(v) => { if (!v) setEditing(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Atualizar ajuste</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="text-sm">
                <div><span className="text-muted-foreground">Produto:</span> {editing.products?.codigo} — {editing.products?.descricao}</div>
                <div><span className="text-muted-foreground">Empresa:</span> {editing.companies?.nome}</div>
                <div><span className="text-muted-foreground">Ajuste sugerido:</span> {Number(editing.ajuste_sugerido).toFixed(3)}</div>
                <div><span className="text-muted-foreground">Status atual:</span> <Badge>{editing.status}</Badge></div>
              </div>
              <div><Label>Observação</Label><Textarea value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Detalhes do ajuste no ERP, motivo, etc." /></div>
              <div className="flex gap-2 justify-end">
                {editing.status !== "em_andamento" && <Button variant="outline" onClick={() => update.mutate({ id: editing.id, newStatus: "em_andamento", observacao: obs })}>Em andamento</Button>}
                {editing.status !== "ignorado" && <Button variant="outline" onClick={() => update.mutate({ id: editing.id, newStatus: "ignorado", observacao: obs })}>Ignorar</Button>}
                <Button onClick={() => update.mutate({ id: editing.id, newStatus: "ajustado", observacao: obs })}>Marcar ajustado</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
