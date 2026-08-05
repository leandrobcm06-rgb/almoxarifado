import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Upload, FileDown, Save, Trash2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/app/contagens/nova")({
  head: () => ({ meta: [{ title: "Nova Contagem | BCM Stock" }] }),
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
  const [mes, setMes] = useState("");
  
  // Estoque states
  const [snapshotDate, setSnapshotDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [pending, setPending] = useState<Row[]>([]);
  const [locStart, setLocStart] = useState("TODAS");
  const [locEnd, setLocEnd] = useState("TODAS");
  const [activeCnpj, setActiveCnpj] = useState<string>("");

  const locations = useMemo(() => {
    const locs = new Set(pending.map(r => r.localizacao).filter(Boolean));
    return Array.from(locs).sort((a: any, b: any) => String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' }));
  }, [pending]);

  const filteredPending = useMemo(() => {
    return pending.filter(r => {
      if (locStart !== "TODAS" || locEnd !== "TODAS") {
        if (!r.localizacao) return false;
        const pIdx = locations.indexOf(r.localizacao);
        if (pIdx === -1) return false;
        if (locStart !== "TODAS" && pIdx < locations.indexOf(locStart)) return false;
        if (locEnd !== "TODAS" && pIdx > locations.indexOf(locEnd)) return false;
      }
      return true;
    });
  }, [pending, locStart, locEnd, locations]);

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
        if (loc) {
          if (loc === "UNICA" || loc === "ÚNICA") {
            loc = undefined;
          } else {
            const letterCount = (loc.match(/[A-Z]/g) || []).length;
            if (letterCount > 1 && !loc.includes("/")) {
              loc = undefined;
            }
          }
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
      if (!mes) throw new Error("Selecione o mês da contagem");
      if (filteredPending.length === 0) throw new Error("Carregue o estoque e ajuste o filtro para ter itens antes de criar a contagem");
      
      toast.info("Iniciando processamento do estoque...");
      
      const codes = Array.from(new Set(filteredPending.map((r) => r.codigo.toUpperCase())));
      
      // Upsert ALL products from the spreadsheet to ensure descriptions and locations are up-to-date
      toast.info("Atualizando cadastro de produtos...");
      const toUpsert = codes.map((c) => {
        const sample = filteredPending.find((p) => p.codigo.toUpperCase() === c);
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
      for (const r of filteredPending) {
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
        mes, loc_start: locStart === "TODAS" ? null : locStart, loc_end: locEnd === "TODAS" ? null : locEnd
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
    company: c, count: filteredPending.filter((r) => r.company_id === c.id).length,
  }));

  return (
    <div className="page-container animate-fade-in max-w-5xl mx-auto">
      <div className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button className="btn-icon bg-muted/50 hover:bg-muted border border-border flex-shrink-0" onClick={() => nav({ to: "/app/contagens" })}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="page-title text-xl sm:text-2xl">Nova Contagem Unificada</h1>
            <p className="page-subtitle mt-1">Crie a contagem e importe o estoque diário de uma vez só.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-border mb-6 shadow-sm">
        <h2 className="text-lg font-semibold font-display text-foreground border-b border-border pb-3 mb-5">1. Dados da Contagem</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="form-group">
            <label className="form-label" htmlFor="nome">Nome *</label>
            <input id="nome" className="form-input" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Inventário Anual 2026" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="mes">Mês *</label>
            <select id="mes" className="form-input" value={mes} onChange={(e) => setMes(e.target.value)}>
              <option value="">Selecione o mês</option>
              {["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="tipo">Tipo *</label>
            <select id="tipo" className="form-input" value={tipo} onChange={(e: any) => setTipo(e.target.value)}>
              <option value="geral">Geral (2 rodadas cegas)</option>
              <option value="diaria">Diária (rotativa, 1 rodada)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-border mb-6 shadow-sm">
        <div className="border-b border-border pb-4 mb-5">
          <h2 className="text-lg font-semibold font-display text-foreground mb-1">2. Importação do Estoque Base (Snapshots)</h2>
          <p className="text-sm text-muted-foreground font-normal">
            Para juntar o estoque de várias empresas nesta contagem, <b>carregue todas as planilhas uma por vez ANTES de clicar em Confirmar</b>.<br/>
            O sistema reconhece as colunas: <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">COD. REFERENCIA</code>, <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">NOME</code>, <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">SISTEMA</code> (saldo) e, opcionalmente, <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">COD. AUXILIAR</code>.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
          <div className="form-group">
            <label className="form-label" htmlFor="snapshotDate">Data de Referência do Estoque</label>
            <input id="snapshotDate" type="date" className="form-input" value={snapshotDate} onChange={(e) => setSnapshotDate(e.target.value)} />
          </div>
          <div className="form-group md:col-span-2">
            <label className="form-label">Empresa (selecione, depois carregue o arquivo)</label>
            <div className="flex gap-3">
              <select className="form-input flex-1" value={activeCnpj} onChange={(e) => setActiveCnpj(e.target.value)}>
                <option value="">Escolha o CNPJ</option>
                {companies?.map((c) => <option key={c.id} value={c.id}>{c.nome} — {c.cnpj}</option>)}
              </select>
              <label className={`inline-flex items-center gap-2 px-4 h-10 rounded-md text-sm font-medium transition-colors border ${activeCnpj ? "bg-primary text-primary-foreground border-primary hover:opacity-90 cursor-pointer" : "bg-muted text-muted-foreground border-border cursor-not-allowed"}`}>
                <input type="file" className="hidden" accept=".xlsx,.xls" disabled={!activeCnpj}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f, activeCnpj); e.currentTarget.value = ""; }} />
                <Upload size={16} /> Carregar planilha
              </label>
            </div>
          </div>
        </div>

        {groupedByCompany.some(g => g.count > 0) && (
          <div className="flex flex-wrap gap-2 text-sm pt-4 border-t border-border mt-2">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider self-center mr-2">Status da Importação:</span>
            {groupedByCompany.map((g) => (
              <Badge key={g.company.id} variant={g.count > 0 ? "default" : "outline"} className={g.count > 0 ? 'bg-primary/20 text-primary border-primary/30' : ''}>
                {g.company.nome}: {g.count} itens
              </Badge>
            ))}
          </div>
        )}
      </div>

      {pending.length > 0 && (
        <div className="glass-panel p-0 rounded-xl border border-border mb-6 shadow-sm overflow-hidden animate-fade-in-up">
          <div className="p-6 border-b border-border bg-muted/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold font-display text-foreground mb-1">3. Revisão do Estoque ({filteredPending.length} linhas filtradas)</h2>
              <p className="text-sm text-muted-foreground">
                Filtre de qual a qual localização será essa contagem. Só as que aparecem aqui vão pro snapshot!
              </p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn--outline" onClick={async () => {
                const { exportToExcel } = await import("@/lib/export-utils");
                exportToExcel(filteredPending, "estoque-revisao");
              }}><FileDown size={16} className="mr-2" /> Excel</button>
              <button className="btn btn--outline text-danger border-danger-border hover:bg-danger-bg hover:border-danger" onClick={() => setPending([])}>
                <Trash2 size={16} className="mr-2" /> Limpar
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-muted/20 border border-border rounded-lg">
              <div className="form-group flex-1">
                <label className="form-label text-xs uppercase tracking-wider" htmlFor="locStart">Localização Inicial</label>
                <select id="locStart" className="form-input" value={locStart} onChange={(e) => setLocStart(e.target.value)}>
                  <option value="TODAS">TODAS</option>
                  {locations.map((loc: any) => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
              <div className="form-group flex-1">
                <label className="form-label text-xs uppercase tracking-wider" htmlFor="locEnd">Localização Final</label>
                <select id="locEnd" className="form-input" value={locEnd} onChange={(e) => setLocEnd(e.target.value)}>
                  <option value="TODAS">TODAS</option>
                  {locations.map((loc: any) => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto border border-border rounded-lg shadow-inner">
              <div className="hidden md:block">
                <table className="table table--hover m-0">
                  <thead className="sticky top-0 bg-background z-10 shadow-sm">
                    <tr>
                      <th className="glass-header text-xs">Empresa</th>
                      <th className="glass-header text-xs">Código</th>
                      <th className="glass-header text-xs">Descrição</th>
                      <th className="glass-header text-xs">Loc</th>
                      <th className="glass-header text-right text-xs">Qtd Sistema</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPending.slice(0, 300).map((r, i) => (
                      <tr key={i}>
                        <td className="text-xs text-muted-foreground">{companies?.find((c) => c.id === r.company_id)?.nome}</td>
                        <td className="font-mono text-xs font-semibold">{r.codigo}</td>
                        <td className="text-sm font-medium">{r.descricao}</td>
                        <td className="text-xs text-muted-foreground">{r.localizacao}</td>
                        <td className="text-right font-medium">{r.qty}</td>
                      </tr>
                    ))}
                    {filteredPending.length > 300 && (
                      <tr className="bg-muted/10">
                        <td colSpan={5} className="text-center text-xs text-muted-foreground p-3 font-medium">
                          Mostrando 300 de {filteredPending.length} registros. A lista completa será processada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="md:hidden space-y-3 p-3 bg-muted/10">
                {filteredPending.slice(0, 300).map((r, i) => (
                  <div key={i} className="border border-border rounded-lg p-3 bg-card shadow-sm flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xs font-bold text-foreground bg-muted/50 px-1.5 py-0.5 rounded">{r.codigo}</span>
                      <Badge variant="outline" className="text-[10px] bg-background">{companies?.find((c) => c.id === r.company_id)?.nome}</Badge>
                    </div>
                    <div className="text-sm font-medium leading-snug text-foreground">{r.descricao}</div>
                    <div className="flex justify-between items-center text-xs pt-1 border-t border-border mt-1">
                      <span className="text-muted-foreground">Loc: <strong className="text-foreground">{r.localizacao || "-"}</strong></span>
                      <span className="font-semibold text-sm">Qtd: {r.qty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-4 pb-12">
        <button 
          className="btn btn--primary btn--lg w-full md:w-auto px-12 h-12 shadow-md shadow-primary/20 text-[15px]" 
          onClick={() => confirm.mutate()} 
          disabled={confirm.isPending || pending.length === 0 || !nome || !mes}
        >
          <Save size={18} className="mr-2" />
          {confirm.isPending ? "Processando..." : "Confirmar Estoque e Criar Contagem"}
        </button>
      </div>
    </div>
  );
}
