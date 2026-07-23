import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, FileDown, FileText, Upload } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/produtos")({
  head: () => ({ meta: [{ title: "Produtos | Almoxarifado" }] }),
  component: Page,
});

function Page() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [unidade, setUnidade] = useState("UN");

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const all: any[] = [];
      let page = 0;
      while (true) {
        const { data: rows } = await supabase.from("products").select("*").order("codigo").range(page * 1000, (page + 1) * 1000 - 1);
        if (!rows || rows.length === 0) break;
        all.push(...rows);
        if (rows.length < 1000) break;
        page++;
      }
      return all;
    },
  });

  const { data: totals } = useQuery({
    queryKey: ["product-totals"],
    queryFn: async () => {
      // Pega as últimas 50 importações confirmadas
      const { data: snaps } = await supabase.from("stock_snapshots").select("id, snapshot_date").eq("status", "confirmado").order("snapshot_date", { ascending: false }).limit(50);
      if (!snaps || snaps.length === 0) return new Map<string, number>();
      
      const map = new Map<string, number>();
      const seen = new Set<string>(); // company_id | product_id
      
      for (const snap of snaps) {
        let from = 0;
        while (true) {
          const { data: rows } = await supabase.from("stock_snapshot_items").select("product_id, company_id, qty").eq("snapshot_id", snap.id).range(from, from + 999);
          if (!rows || rows.length === 0) break;
          for (const r of rows) {
            const key = `${r.company_id}|${r.product_id}`;
            if (!seen.has(key)) {
              seen.add(key);
              map.set(r.product_id, (map.get(r.product_id) ?? 0) + Number(r.qty));
            }
          }
          if (rows.length < 1000) break;
          from += 1000;
        }
      }
      return map;
    },
  });

  const filtered = useMemo(() => {
    if (!q) return data ?? [];
    const s = q.toLowerCase();
    return (data ?? []).filter((p) => p.codigo.toLowerCase().includes(s) || p.descricao.toLowerCase().includes(s));
  }, [data, q]);

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("products").insert({ codigo, descricao, unidade });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Produto criado"); setOpen(false); setCodigo(""); setDescricao(""); qc.invalidateQueries({ queryKey: ["products"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const importExcel = useMutation({
    mutationFn: async (file: File) => {
      const { parseExcelFile } = await import("@/lib/export-utils");
      const rows = await parseExcelFile(file);
      const products = rows.map((r: any) => ({
        codigo: String(r.codigo ?? r.Codigo ?? r.código ?? r.Código ?? r.CODIGO ?? "").trim(),
        descricao: String(r.descricao ?? r.Descricao ?? r.descrição ?? r.Descrição ?? r.DESCRICAO ?? "").trim(),
        unidade: String(r.unidade ?? r.Unidade ?? r.UN ?? "UN").trim() || "UN",
      })).filter((p) => p.codigo && p.descricao);
      if (products.length === 0) throw new Error("Planilha vazia ou sem colunas codigo/descricao");
      const { error } = await supabase.from("products").upsert(products, { onConflict: "codigo" });
      if (error) throw error;
      return products.length;
    },
    onSuccess: (n) => { toast.success(`${n} produtos importados`); qc.invalidateQueries({ queryKey: ["products"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-semibold">Produtos</h1><p className="text-sm text-muted-foreground">Catálogo de itens do almoxarifado.</p></div>
        <div className="flex flex-wrap gap-2">
          <label>
            <input type="file" className="hidden" accept=".xlsx,.xls" onChange={(e) => e.target.files?.[0] && importExcel.mutate(e.target.files[0])} />
            <Button asChild variant="outline"><span><Upload className="h-4 w-4 mr-2" />Importar Excel</span></Button>
          </label>
          <Button variant="outline" onClick={async () => {
            const { exportToExcel } = await import("@/lib/export-utils");
            exportToExcel(filtered, "produtos");
          }}><FileDown className="h-4 w-4 mr-2" />Excel</Button>
          <Button variant="outline" onClick={async () => {
            const { exportToPDF } = await import("@/lib/export-utils");
            exportToPDF("Produtos", ["Código", "Descrição", "UN"], filtered.map(p => [p.codigo, p.descricao, p.unidade]), "produtos");
          }}><FileText className="h-4 w-4 mr-2" />PDF</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Novo</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Novo produto</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Código</Label><Input value={codigo} onChange={(e) => setCodigo(e.target.value)} /></div>
                <div><Label>Descrição</Label><Input value={descricao} onChange={(e) => setDescricao(e.target.value)} /></div>
                <div><Label>Unidade</Label><Input value={unidade} onChange={(e) => setUnidade(e.target.value)} /></div>
                <Button onClick={() => create.mutate()} disabled={!codigo || !descricao} className="w-full">Salvar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Input placeholder="Buscar por código ou descrição..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-md" />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Código</TableHead><TableHead>Descrição</TableHead><TableHead className="text-right">Qtd total</TableHead></TableRow></TableHeader>
            <TableBody>
              {isLoading ? <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground">Carregando...</TableCell></TableRow> :
                filtered.length === 0 ? <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground">Nenhum produto. Importe uma planilha (colunas: codigo, descricao, unidade).</TableCell></TableRow> :
                filtered.slice(0, 500).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.codigo}</TableCell>
                    <TableCell>{p.descricao}</TableCell>
                    <TableCell className="text-right tabular-nums">{totals?.get(p.id) ?? 0}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {filtered.length > 500 && <div className="p-3 text-xs text-muted-foreground text-center">Mostrando 500 de {filtered.length}. Refine a busca.</div>}
        </CardContent>
      </Card>
    </div>
  );
}
