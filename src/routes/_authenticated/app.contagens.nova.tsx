import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, FileDown, Save, Trash2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/app/contagens/nova")({
  head: () => ({ meta: [{ title: "Nova Contagem | Almoxarifado" }] }),
  component: Page,
});

type Row = { codigo: string; descricao?: string; cod_auxiliar?: string; fabricante?: string; localizacao?: string; qty: number; company_id: string; product_id?: string | null };

function pick(row: any, keys: string[]): any {
  const norm = (s: string) => s.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
  const map: Record<string, any> = {};
  for (const k of Object.keys(row)) map[norm(k)] = row[k];
  for (const k of keys) { const v = map[norm(k)]; if (v !== undefined && v !== null && v !== "") return v; }
  return undefined;
}

function Page() {
  const qc = useQueryClient();
  const nav = useNavigate();
  
  // Contagem states
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"geral" | "diaria">("diaria");
  
  // Estoque states
  const [snapshotDate, setSnapshotDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [pending, setPending] = useState<Row[]>([]);
  const [activeCnpj, setActiveCnpj] = useState<string>("");

  const { data: companies } = useQuery({
    queryKey: ["active-companies"], queryFn: async () => (await supabase.from("companies").select("*").eq("ativo", true).order("nome")).data ?? [],
  });

  const handleFile = async (file: File, companyId: string) => {
    if (!companyId) return toast.error("Selecione a empresa antes");
    try {
      const { parseExcelFile } = await import("@/lib/export-utils");
      const rows = await parseExcelFile(file);
      const parsed: Row[] = [];
      let skipped = 0;
      for (const r of rows) {
        const codigoRef = String(pick(r, ["codreferencia", "cod_referencia", "referencia", "cod. referencia", "codigo", "cod"]) ?? "").trim().toUpperCase();
        const codAux = String(pick(r, ["codauxiliar", "cod_auxiliar", "auxiliar", "cod. auxiliar"]) ?? "").trim().toUpperCase();
        
        const codigo = codigoRef || codAux;
        
        const qtyRaw = pick(r, ["quantidadesistema", "quantidade_sistema", "qtdsistema", "sistema", "qty", "quantidade", "saldo", "estoque", "qtd", "fisico"]);
        let qty = 0;
        if (typeof qtyRaw === "number") {
          qty = qtyRaw;
        } else {
          let str = String(qtyRaw ?? "0").trim();
          if (str.includes(",")) str = str.replace(/\./g, "").replace(",", ".");
          qty = Number(str);
        }

        if (!codigo || isNaN(qty)) {
          skipped++;
          continue;
        }
        
        let loc = pick(r, ["localizacao", "local", "endereco"]) ? String(pick(r, ["localizacao", "local", "endereco"])).trim().toUpperCase() : undefined;
        if (loc === "UNICA" || loc === "ÚNICA") {
          loc = undefined;
        }

        parsed.push({
          codigo,
          descricao: String(pick(r, ["produto", "descricao", "nome", "descricaoproduto"]) ?? ""),
          cod_auxiliar: codAux || undefined,
          fabricante: pick(r, ["fabricante", "marca"]) ? String(pick(r, ["fabricante", "marca"])) : undefined,
          localizacao: loc,
          qty,
          company_id: companyId,
        });
      }
      
      if (parsed.length === 0) return toast.error("Nenhuma linha reconhecida. Verifique se a planilha tem colunas Codigo e Quantidade.");
      
      // consolidate duplicates
      const map = new Map<string, Row>();
      let consolidated = 0;
      for (const p of parsed) {
        const key = `${p.company_id}|${p.codigo}`;
        const ex = map.get(key);
        if (ex) {
          ex.qty += p.qty;
          consolidated++;
        } else {
          map.set(key, { ...p });
        }
      }
      
      setPending((prev) => {
        const others = prev.filter((r) => r.company_id !== companyId);
        return [...others, ...Array.from(map.values())];
      });
      
      let msg = `${map.size} linhas carregadas prontas para revisão.`;
      if (consolidated > 0) msg += ` (${consolidated} itens repetidos foram somados).`;
      if (skipped > 0) toast.warning(`${skipped} linhas da planilha foram ignoradas por não terem código ou quantidade válida.`);
      toast.success(msg);
    } catch (e: any) {
      toast.error(e.message);
    }
  };


  const confirm = useMutation({
    mutationFn: async () => {
      if (!nome) throw new Error("Informe o nome da contagem");
      if (pending.length === 0) throw new Error("Carregue o estoque de pelo menos uma empresa antes de criar a contagem");
      
      toast.info("Iniciando processamento do estoque...");
      
      const codes = Array.from(new Set(pending.map((r) => r.codigo.toUpperCase())));
      
      // Upsert ALL products from the spreadsheet to ensure descriptions and locations are up-to-date
      toast.info("Atualizando cadastro de produtos...");
      const toUpsert = codes.map((c) => {
        const sample = pending.find((p) => p.codigo.toUpperCase() === c);
        return {
          codigo: c,
          descricao: sample?.descricao || c,
          unidade: "UN",
          cod_auxiliar: sample?.cod_auxiliar ?? null,
          fabricante: sample?.fabricante ?? null,
          localizacao: sample?.localizacao ?? null,
        };
      });

      const productMap = new Map<string, string>();
      for (let i = 0; i < toUpsert.length; i += 200) {
        const chunk = toUpsert.slice(i, i + 200);
        const { data: upserted, error } = await supabase.from("products").upsert(chunk, { onConflict: "codigo" }).select("id, codigo");
        if (error) throw new Error("Erro ao atualizar produtos: " + error.message);
        for (const p of upserted ?? []) productMap.set(p.codigo.toUpperCase(), p.id);
      }

      toast.info("Criando registro de snapshot...");
      const { data: snap, error: snapErr } = await supabase.from("stock_snapshots")
        .insert({ snapshot_date: snapshotDate, status: "confirmado", confirmed_at: new Date().toISOString(), observacao: nome })
        .select().single();
      if (snapErr) throw new Error("Erro ao criar snapshot: " + snapErr.message);

      toast.info("Processando itens do estoque...");
      const itemsMap = new Map<string, { snapshot_id: string; product_id: string; company_id: string; qty: number }>();
      for (const r of pending) {
        const pid = productMap.get(r.codigo.toUpperCase());
        if (!pid) throw new Error(`Produto não encontrado após criação: ${r.codigo}`);
        const key = `${r.company_id}|${pid}`;
        const ex = itemsMap.get(key);
        if (ex) ex.qty += r.qty;
        else itemsMap.set(key, { snapshot_id: snap.id, product_id: pid, company_id: r.company_id, qty: r.qty });
      }
      const items = Array.from(itemsMap.values());
      
      toast.info(`Salvando ${items.length} itens no banco...`);
      for (let i = 0; i < items.length; i += 500) {
        const chunk = items.slice(i, i + 500);
        const { error } = await supabase.from("stock_snapshot_items").insert(chunk);
        if (error) throw new Error("Erro ao salvar itens: " + error.message);
      }
      
      toast.info("Criando a Contagem...");
      const { data: c, error: cErr } = await supabase.from("counts").insert({
        nome, tipo, status: "em_contagem",
        snapshot_id: snap.id,
      }).select().single();
      if (cErr) throw cErr;
      
      const rounds = tipo === "geral" ? [1, 2] : [1];
      const { error: rErr } = await supabase.from("count_rounds").insert(rounds.map((r) => ({ count_id: c.id, rodada: r })));
      if (rErr) throw rErr;

      return c.id;
    },
    onSuccess: (id) => { 
      toast.success("Contagem e estoque confirmados com sucesso!"); 
      setPending([]); 
      qc.invalidateQueries({ queryKey: ["snapshots"] });
      qc.invalidateQueries({ queryKey: ["counts"] });
      nav({ to: "/app/contagens/$id", params: { id } });
    },
    onError: (e: any) => { console.error(e); toast.error(e?.message || "Erro desconhecido ao confirmar"); },
  });

  const groupedByCompany = (companies ?? []).map((c) => ({
    company: c, count: pending.filter((r) => r.company_id === c.id).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => nav({ to: "/app/contagens" })}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-semibold">Nova Contagem Unificada</h1>
          <p className="text-sm text-muted-foreground">
            Crie a contagem e importe o estoque diário de uma vez só.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>1. Dados da Contagem</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nome</Label>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Inventário Anual 2026" />
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={(v: any) => setTipo(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">Geral (2 rodadas cegas)</SelectItem>
                  <SelectItem value="diaria">Diária (rotativa, 1 rodada)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Importação do Estoque Base (Snapshots)</CardTitle>
          <p className="text-sm text-muted-foreground font-normal">
            Para juntar o estoque de várias empresas nesta contagem, <b>carregue todas as planilhas uma por vez ANTES de clicar em Confirmar</b>.<br/>
            O sistema reconhece as colunas: <code>COD. REFERENCIA</code>, <code>NOME</code>, <code>SISTEMA</code> (saldo) e, opcionalmente, <code>COD. AUXILIAR</code>.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div><Label>Data de Referência do Estoque</Label><Input type="date" value={snapshotDate} onChange={(e) => setSnapshotDate(e.target.value)} /></div>
            <div className="md:col-span-2">
              <Label>Empresa (selecione, depois carregue o arquivo)</Label>
              <div className="flex gap-2">
                <Select value={activeCnpj} onValueChange={setActiveCnpj}>
                  <SelectTrigger><SelectValue placeholder="Escolha o CNPJ" /></SelectTrigger>
                  <SelectContent>{companies?.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome} — {c.cnpj}</SelectItem>)}</SelectContent>
                </Select>
                <label className={`inline-flex items-center gap-2 px-4 h-9 rounded-md text-sm font-medium cursor-pointer ${activeCnpj ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}>
                  <input type="file" className="hidden" accept=".xlsx,.xls" disabled={!activeCnpj}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f, activeCnpj); e.currentTarget.value = ""; }} />
                  <Upload className="h-4 w-4" />Carregar planilha
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-sm pt-2">
            {groupedByCompany.map((g) => (
              <Badge key={g.company.id} variant={g.count > 0 ? "default" : "outline"}>
                {g.company.nome}: {g.count} itens
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {pending.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Revisão do Estoque ({pending.length} linhas)</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={async () => {
                const { exportToExcel } = await import("@/lib/export-utils");
                exportToExcel(pending, "estoque-revisao");
              }}><FileDown className="h-4 w-4 mr-2" />Excel</Button>
              <Button variant="outline" onClick={() => setPending([])}><Trash2 className="h-4 w-4 mr-2" />Limpar</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Empresa</TableHead><TableHead>Código</TableHead><TableHead>Descrição</TableHead><TableHead className="text-right">Qtd Sistema</TableHead></TableRow></TableHeader>
                <TableBody>
                  {pending.slice(0, 300).map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-xs">{companies?.find((c) => c.id === r.company_id)?.nome}</TableCell>
                      <TableCell className="font-mono text-xs">{r.codigo}</TableCell>
                      <TableCell className="text-sm">{r.descricao}</TableCell>
                      <TableCell className="text-right">{r.qty}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end pt-4">
        <Button size="lg" onClick={() => confirm.mutate()} disabled={confirm.isPending || pending.length === 0 || !nome} className="w-full md:w-auto px-12">
          <Save className="h-5 w-5 mr-2" />
          Confirmar Estoque e Criar Contagem
        </Button>
      </div>

    </div>
  );
}
