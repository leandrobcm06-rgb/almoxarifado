import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useRef, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { ChevronLeft, Camera, Save, CheckCircle2, Loader2, FileDown, Trash2, ArrowLeft, TriangleAlert } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { runOcrOnPhoto } from "@/lib/ocr.functions";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/app/contagens/$id")({
  head: () => ({ meta: [{ title: "Contagem | BCM Stock" }] }),
  component: Page,
  errorComponent: ({ error }) => <div className="p-4 text-danger font-medium bg-danger-bg rounded-lg">Erro na rota: {error.message} <pre className="mt-2 text-xs opacity-80 overflow-auto">{error.stack}</pre></div>,
});

function Page() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const nav = useNavigate();
  const { hasRole, hasAnyRole } = useAuth();
  const blind = hasRole("contador") && !hasAnyRole(["admin", "gestor", "conferente"]);

  const { data: count, isLoading } = useQuery({
    queryKey: ["count", id],
    queryFn: async () => (await supabase.from("counts").select("*, count_rounds(*)").eq("id", id).single()).data,
  });
  
  const { data: snapshotItems } = useQuery({
    queryKey: ["snapshot-items-full", count?.snapshot_id],
    queryFn: async () => {
      const all: any[] = [];
      let page = 0;
      while (true) {
        const { data } = await supabase.from("stock_snapshot_items")
          .select("*, products(id, codigo, descricao, unidade, cod_auxiliar, fabricante, localizacao)")
          .eq("snapshot_id", count?.snapshot_id)
          .range(page * 1000, (page + 1) * 1000 - 1);
        if (!data || data.length === 0) break;
        all.push(...data);
        if (data.length < 1000) break;
        page++;
      }
      return all;
    },
    enabled: !!count?.snapshot_id,
  });

  const products = useMemo(() => {
    const map = new Map();
    for (const item of (snapshotItems ?? [])) {
      if (item.products) map.set(item.products.id, item.products);
    }
    return Array.from(map.values());
  }, [snapshotItems]);

  const finalize = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("counts").update({ status: "finalizada", finalizado_em: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Contagem finalizada"); qc.invalidateQueries({ queryKey: ["count", id] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteCount = useMutation({
    mutationFn: async () => {
      const roundIds = (count?.count_rounds ?? []).map((r: any) => r.id);
      if (roundIds.length > 0) {
        await supabase.from("count_items").delete().in("round_id", roundIds);
        await supabase.from("count_photos").delete().in("round_id", roundIds);
        await supabase.from("count_rounds").delete().in("count_id", [id]);
      }
      const { error } = await supabase.from("counts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Contagem excluída"); qc.invalidateQueries({ queryKey: ["counts"] }); nav({ to: "/app/contagens" }); },
    onError: (e: any) => toast.error(e.message),
  });

  const [abaAtiva, setAbaAtiva] = useState<string>("r1");

  if (isLoading) {
    return <div className="page-container max-w-7xl mx-auto p-8 text-center text-muted-foreground animate-pulse">Carregando dados da contagem...</div>;
  }
  
  if (!count) return <div className="page-container max-w-7xl mx-auto p-8 text-center text-danger font-medium">Contagem não encontrada.</div>;
  
  const rounds = (count.count_rounds ?? []).sort((a: any, b: any) => a.rodada - b.rodada);

  // set default active tab if not set
  if (!rounds.some((r: any) => `r${r.rodada}` === abaAtiva) && abaAtiva !== 'produtos' && rounds.length > 0) {
    setAbaAtiva(`r${rounds[0].rodada}`);
  }

  return (
    <div className="page-container animate-fade-in max-w-7xl mx-auto">
      <div className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button className="btn-icon bg-muted/50 hover:bg-muted border border-border flex-shrink-0" onClick={() => nav({ to: "/app/contagens" })}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="page-title text-xl sm:text-2xl">{count.nome}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline" className="font-semibold px-2.5 py-0.5">{count.tipo === 'geral' ? 'Geral' : 'Diária'}</Badge>
              <Badge 
                variant={count.status === 'concluido' || count.status === 'finalizada' ? 'success' : count.status === 'em_contagem' ? 'default' : 'secondary'}
                className={count.status === 'em_contagem' ? 'bg-primary/20 text-primary border-primary/30 font-semibold px-2.5 py-0.5' : (count.status === 'concluido' || count.status === 'finalizada') ? 'bg-success-bg text-success border-success-border font-semibold px-2.5 py-0.5' : 'font-semibold px-2.5 py-0.5'}
              >
                {count.status.replace('_', ' ').toUpperCase()}
              </Badge>
              {blind && <Badge variant="secondary" className="font-semibold px-2.5 py-0.5 bg-muted">Modo cego</Badge>}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:ml-auto w-full sm:w-auto">
          {!blind && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="btn btn--danger w-full sm:w-auto"><Trash2 size={16} className="mr-1.5" /> Excluir</button>
              </AlertDialogTrigger>
              <AlertDialogContent className="glass-panel border-border sm:max-w-[425px]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display">Excluir contagem?</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    Essa ação não pode ser desfeita. Todos os dados desta contagem serão apagados permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="btn btn--ghost">Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteCount.mutate()} className="btn btn--danger">Sim, excluir contagem</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {count.status !== "finalizada" && !blind && (
            <button className="btn btn--primary w-full sm:w-auto" onClick={() => finalize.mutate()} disabled={finalize.isPending}>
              <CheckCircle2 size={16} className="mr-1.5" /> Finalizar contagem
            </button>
          )}
          {count.status === "finalizada" && !blind && (
            <Link to="/app/divergencias" className="btn btn--primary bg-orange-600 hover:bg-orange-700 border-orange-600 w-full sm:w-auto">
              <TriangleAlert size={16} className="mr-1.5" /> Ver Divergências
            </Link>
          )}
        </div>
      </div>

      <div className="page-tabs mb-6 overflow-x-auto whitespace-nowrap pb-1">
        {rounds.map((r: any) => (
          <button 
            key={r.id}
            className={`page-tab flex-shrink-0 ${abaAtiva === `r${r.rodada}` ? 'page-tab--active' : ''}`}
            onClick={() => setAbaAtiva(`r${r.rodada}`)}
          >
            Rodada {r.rodada}
          </button>
        ))}
        {!blind && (
          <button 
            className={`page-tab flex-shrink-0 ${abaAtiva === 'produtos' ? 'page-tab--active' : ''}`}
            onClick={() => setAbaAtiva('produtos')}
          >
            Produtos no Sistema
          </button>
        )}
      </div>

      <div className="animate-fade-in-up">
        {rounds.map((r: any) => (
          <div key={r.id} style={{ display: abaAtiva === `r${r.rodada}` ? 'block' : 'none' }}>
            <RoundPanel roundId={r.id} countId={id} products={products ?? []} blind={blind} disabled={count.status === "finalizada"} />
          </div>
        ))}
        {!blind && (
          <div style={{ display: abaAtiva === 'produtos' ? 'block' : 'none' }}>
            <StockPanel snapshotId={count.snapshot_id} products={products ?? []} />
          </div>
        )}
      </div>
    </div>
  );
}

function StockPanel({ snapshotId, products }: { snapshotId: string; products: any[] }) {
  const [search, setSearch] = useState("");
  
  const { data: items } = useQuery({
    queryKey: ["snapshot-items", snapshotId],
    queryFn: async () => (await supabase.from("stock_snapshot_items").select("qty, product_id").eq("snapshot_id", snapshotId)).data ?? [],
  });

  const grouped = useMemo(() => {
    const qtyMap = new Map();
    for (const item of (items ?? [])) {
      qtyMap.set(item.product_id, (qtyMap.get(item.product_id) ?? 0) + Number(item.qty));
    }
    
    const arr = products.map(p => ({
      ...p,
      qty: qtyMap.get(p.id) ?? 0
    })).sort((a: any, b: any) => String(a.codigo).localeCompare(String(b.codigo)));

    if (!search) return arr;
    const s = search.toLowerCase();
    return arr.filter(p => String(p.codigo).toLowerCase().includes(s) || String(p.descricao).toLowerCase().includes(s));
  }, [items, products, search]);

  return (
    <div className="glass-panel p-0 rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-[calc(100vh-14rem)] min-h-[500px]">
      <div className="p-6 border-b border-border bg-muted/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h2 className="text-lg font-semibold font-display text-foreground mb-1">Catálogo de Produtos da Contagem</h2>
          <p className="text-sm text-muted-foreground">{grouped.length} itens no snapshot original.</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="btn btn--danger btn--sm"><Trash2 size={14} className="mr-1.5" /> Limpar Banco</button>
          </AlertDialogTrigger>
          <AlertDialogContent className="glass-panel border-border sm:max-w-[425px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display text-danger">Tem certeza absoluta?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Isso irá apagar <strong className="text-foreground">TODOS</strong> os produtos, empresas, fotos e contagens do banco de dados. 
                Use isso apenas se quiser recomeçar o sistema do zero para uma nova implantação.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="btn btn--ghost">Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={async () => {
                try {
                  await supabase.from("count_items").delete().not("id", "is", null);
                  await supabase.from("count_photos").delete().not("id", "is", null);
                  await supabase.from("count_rounds").delete().not("id", "is", null);
                  await supabase.from("divergence_items").delete().not("id", "is", null);
                  await supabase.from("divergence_reports").delete().not("id", "is", null);
                  await supabase.from("counts").delete().not("id", "is", null);
                  await supabase.from("stock_snapshot_items").delete().not("id", "is", null);
                  await supabase.from("stock_snapshots").delete().not("id", "is", null);
                  await supabase.from("products").delete().not("id", "is", null);
                  await supabase.from("companies").delete().not("id", "is", null);
                  toast.success("Banco de dados limpo com sucesso!");
                  window.location.reload();
                } catch (e: any) {
                  toast.error("Erro ao limpar: " + e.message);
                }
              }} className="btn btn--danger">Sim, apagar tudo</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <div className="p-4 border-b border-border bg-background flex-shrink-0">
        <input 
          placeholder="Buscar por código ou descrição..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="form-input max-w-md w-full" 
        />
      </div>
      
      <div className="flex-1 overflow-auto bg-background">
        <div className="hidden md:block">
          <table className="table table--hover m-0">
            <thead className="sticky top-0 bg-background z-10 shadow-sm">
              <tr>
                <th className="glass-header min-w-[120px]">Código</th>
                <th className="glass-header w-full">Descrição</th>
                <th className="glass-header w-32 text-right">Qtd Sistema</th>
              </tr>
            </thead>
            <tbody>
              {grouped.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-8 text-muted-foreground font-medium">Nenhum produto cadastrado ou filtro não encontrou resultados.</td></tr>
              ) : (
                grouped.map((g: any, i) => (
                  <tr key={i}>
                    <td className="font-mono text-xs font-semibold text-foreground">{g.codigo}</td>
                    <td className="text-sm">{g.descricao}</td>
                    <td className="text-right font-medium">{g.qty}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="md:hidden space-y-3 p-3 bg-muted/10 h-full">
          {grouped.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm font-medium">Nenhum produto cadastrado.</div>
          ) : (
            grouped.map((g: any, i) => (
              <div key={i} className="border border-border rounded-lg p-3 bg-card shadow-sm">
                <div className="flex justify-between items-start mb-1.5">
                  <div className="font-mono text-xs font-bold bg-muted/50 px-1.5 py-0.5 rounded">{g.codigo}</div>
                  <div className="font-semibold text-sm">Qtd: {g.qty}</div>
                </div>
                <div className="text-sm font-medium leading-snug">{g.descricao}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function RoundPanel({ roundId, countId, products, blind, disabled }: { roundId: string; countId: string; products: any[]; blind: boolean; disabled: boolean }) {
  const qc = useQueryClient();
  const ocrFn = useServerFn(runOcrOnPhoto);
  const fileRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [locStart, setLocStart] = useState("TODAS");
  const [locEnd, setLocEnd] = useState("TODAS");

  const { data: items } = useQuery({
    queryKey: ["round-items", roundId],
    queryFn: async () => (await supabase.from("count_items").select("*, products(codigo, descricao, unidade)").eq("round_id", roundId)).data ?? [],
  });
  const { data: photos } = useQuery({
    queryKey: ["round-photos", roundId],
    queryFn: async () => (await supabase.from("count_photos").select("*").eq("round_id", roundId).order("created_at", { ascending: false })).data ?? [],
  });

  const itemMap = useMemo(() => new Map((items ?? []).map((i: any) => [i.product_id, i])), [items]);
  
  const locations = useMemo(() => {
    const locs = new Set((products ?? []).map((p: any) => p.localizacao).filter(Boolean));
    return Array.from(locs).sort((a: any, b: any) => String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' }));
  }, [products]);

  const filtered = (products ?? []).filter((p) => {
    if (locStart !== "TODAS" || locEnd !== "TODAS") {
      if (!p.localizacao) return false;
      const pIdx = locations.indexOf(p.localizacao);
      if (pIdx === -1) return false;
      if (locStart !== "TODAS" && pIdx < locations.indexOf(locStart)) return false;
      if (locEnd !== "TODAS" && pIdx > locations.indexOf(locEnd)) return false;
    }
    if (!search) return true;
    const s = search.toLowerCase();
    return String(p.codigo ?? "").toLowerCase().includes(s) || String(p.descricao ?? "").toLowerCase().includes(s);
  });
  
  const displayFiltered = filtered.slice(0, 200);

  const getLocTitle = () => {
    if (locStart === "TODAS" && locEnd === "TODAS") return "";
    if (locStart !== "TODAS" && locEnd === "TODAS") return ` - De ${locStart} em diante`;
    if (locStart === "TODAS" && locEnd !== "TODAS") return ` - Até ${locEnd}`;
    if (locStart === locEnd) return ` - ${locStart}`;
    return ` - ${locStart} até ${locEnd}`;
  };

  const upsertItem = useMutation({
    mutationFn: async ({ productId, qty }: { productId: string; qty: number }) => {
      const { data: u } = await supabase.auth.getUser();
      const ex = itemMap.get(productId);
      if (ex) {
        const { error } = await supabase.from("count_items").update({ qty_contada: qty, origem: "manual" }).eq("id", ex.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("count_items").insert({ round_id: roundId, product_id: productId, qty_contada: qty, origem: "manual", created_by: u.user?.id });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["round-items", roundId] }),
    onError: (e: any) => toast.error(e.message),
  });

  const uploadPhoto = useMutation({
    mutationFn: async (file: File) => {
      const path = `${countId}/${roundId}/${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage.from("count-photos").upload(path, file);
      if (error) throw error;
      const { data: u } = await supabase.auth.getUser();
      const { data: photo, error: ie } = await supabase.from("count_photos").insert({ round_id: roundId, storage_path: path, uploaded_by: u.user?.id, ocr_status: "processando" }).select().single();
      if (ie) throw ie;
      await ocrFn({ data: { photoId: photo.id } });
      return photo.id;
    },
    onSuccess: () => { toast.success("Foto processada — revise abaixo"); qc.invalidateQueries({ queryKey: ["round-photos", roundId] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const applyOcr = useMutation({
    mutationFn: async (photoId: string) => {
      const photo = photos?.find((p: any) => p.id === photoId);
      const result = photo?.ocr_result as { items: { codigo: string; qty: number }[] } | undefined;
      if (!result?.items?.length) throw new Error("Sem itens reconhecidos");
      const productByCode = new Map((products ?? []).map((p) => [p.codigo, p.id]));
      const { data: u } = await supabase.auth.getUser();
      const toUpsert = result.items.filter((i) => productByCode.has(i.codigo)).map((i) => ({
        round_id: roundId,
        product_id: productByCode.get(i.codigo)!,
        qty_contada: i.qty,
        origem: "foto" as const,
        photo_id: photoId,
        created_by: u.user?.id,
      }));
      if (toUpsert.length === 0) throw new Error("Nenhum código reconhecido bate com produtos cadastrados");
      const { error } = await supabase.from("count_items").upsert(toUpsert, { onConflict: "round_id,product_id" });
      if (error) throw error;
      return toUpsert.length;
    },
    onSuccess: (n) => { toast.success(`${n} itens importados da foto`); qc.invalidateQueries({ queryKey: ["round-items", roundId] }); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4 mb-4">
          <h2 className="text-lg font-semibold font-display text-foreground flex items-center gap-2"><Camera size={18} className="text-primary" /> Foto + OCR</h2>
          <div>
            <input ref={fileRef} type="file" className="hidden" accept="image/*" capture="environment"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto.mutate(f); e.currentTarget.value = ""; }} />
            <button className="btn btn--secondary" disabled={disabled || uploadPhoto.isPending} onClick={() => fileRef.current?.click()}>
              {uploadPhoto.isPending ? <Loader2 size={16} className="mr-1.5 animate-spin" /> : <Camera size={16} className="mr-1.5" />}
              Tirar / enviar foto
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {photos?.length === 0 && <p className="text-sm text-muted-foreground p-4 bg-muted/10 rounded-lg border border-dashed border-border text-center">Nenhuma foto enviada. Use o botão acima para fotografar a folha de contagem manuscrita.</p>}
          
          {photos?.map((p: any) => {
            const result = p.ocr_result as any;
            const n = result?.items?.length ?? 0;
            return (
              <div key={p.id} className="border border-border bg-background rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div className="text-sm">
                  <div className="font-semibold text-foreground truncate max-w-xs">{p.storage_path.split("/").pop()}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Status OCR:</span>
                    <Badge variant="outline" className={p.ocr_status === 'processando' ? 'bg-warning-bg text-warning border-warning-border' : p.ocr_status === 'concluido' ? 'bg-success-bg text-success border-success-border' : 'bg-danger-bg text-danger border-danger-border'}>
                      {p.ocr_status}
                    </Badge>
                    <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded ml-2">{n} itens encontrados</span>
                  </div>
                </div>
                <button 
                  className="btn btn--primary btn--sm w-full sm:w-auto" 
                  disabled={p.ocr_status !== "concluido" || n === 0 || disabled} 
                  onClick={() => applyOcr.mutate(p.id)}
                >
                  <Save size={14} className="mr-1.5" /> Revisar e aplicar
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-panel p-0 rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-[calc(100vh-28rem)] min-h-[500px]">
        <div className="p-6 border-b border-border bg-muted/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold font-display text-foreground mb-1">Lançamento manual</h2>
            <p className="text-sm text-muted-foreground">{items?.length ?? 0} itens já contados nesta rodada.</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn--outline bg-background" onClick={async () => {
              const { exportToExcel } = await import("@/lib/export-utils");
              exportToExcel(
                filtered.map((p: any) => ({
                  "COD. REFERENCIA": p.codigo ?? "", "COD. AUXILIAR": p.cod_auxiliar ?? "", "FABRICANTE": p.fabricante ?? "",
                  "LOCALIZAÇÃO": p.localizacao ?? "", "NOME": p.descricao, "FÍSICO": "",
                })), "lista-contagem-em-branco")
            }}><FileDown size={16} className="mr-1.5" /> Excel vazio</button>
            
            <button className="btn btn--outline bg-background text-primary border-primary hover:bg-primary/10" onClick={async () => {
              const { exportToPDF } = await import("@/lib/export-utils");
              exportToPDF(
                `Lista de contagem${getLocTitle()}`,
                ["COD. REFERENCIA", "COD. AUXILIAR", "FABRICANTE", "LOCALIZAÇÃO", "NOME", "FÍSICO"],
                filtered.map((p: any) => [p.codigo ?? "", p.cod_auxiliar ?? "", p.fabricante ?? "", p.localizacao ?? "", p.descricao, ""]),
                "lista-contagem", "landscape",
              )
            }}><FileDown size={16} className="mr-1.5" /> PDF imprimir</button>
          </div>
        </div>
        
        <div className="p-4 border-b border-border bg-background flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              placeholder="Buscar produto por código ou nome..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="form-input flex-1" 
            />
            <div className="w-full sm:w-48">
              <select className="form-input" value={locStart} onChange={(e) => setLocStart(e.target.value)}>
                <option value="TODAS">Loc. Inicial (Todas)</option>
                {locations.map((loc: any) => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
            <div className="w-full sm:w-48">
              <select className="form-input" value={locEnd} onChange={(e) => setLocEnd(e.target.value)}>
                <option value="TODAS">Loc. Final (Todas)</option>
                {locations.map((loc: any) => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto bg-background">
          <div className="hidden md:block">
            <table className="table table--hover m-0">
              <thead className="sticky top-0 bg-background z-10 shadow-sm">
                <tr>
                  <th className="glass-header w-32">Código</th>
                  <th className="glass-header">Descrição</th>
                  <th className="glass-header w-40 text-center">Contado</th>
                  <th className="glass-header w-24 text-center">Origem</th>
                </tr>
              </thead>
              <tbody>
                {displayFiltered.map((p) => {
                  const item = itemMap.get(p.id);
                  return (
                    <tr key={p.id}>
                      <td className="font-mono text-xs font-semibold">{p.codigo}</td>
                      <td className="text-sm font-medium">{p.descricao}</td>
                      <td className="p-2">
                        <div className="flex justify-center">
                          <input 
                            type="number" 
                            step="0.001" 
                            disabled={disabled}
                            defaultValue={item?.qty_contada ?? ""}
                            onBlur={(e) => { 
                              const v = parseFloat(e.target.value); 
                              if (!isNaN(v) && v !== (item?.qty_contada ?? null)) upsertItem.mutate({ productId: p.id, qty: v }); 
                            }}
                            className="form-input text-right font-mono font-medium h-9 w-32" 
                          />
                        </div>
                      </td>
                      <td className="text-center">
                        {item ? <Badge variant="outline" className="text-xs bg-muted/50 uppercase tracking-wider">{item.origem}</Badge> : null}
                      </td>
                    </tr>
                  );
                })}
                {displayFiltered.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-8 text-muted-foreground font-medium">Nenhum produto encontrado.</td></tr>
                )}
                {filtered.length > 200 && (
                  <tr className="bg-muted/10">
                    <td colSpan={4} className="text-center text-xs text-muted-foreground p-3 font-medium">
                      Mostrando 200 de {filtered.length} produtos. Use a busca ou filtros de localização para refinar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="md:hidden space-y-3 p-3 bg-muted/10 h-full">
            {displayFiltered.map((p) => {
              const item = itemMap.get(p.id);
              return (
                <div key={p.id} className="border border-border rounded-lg p-3 relative bg-card shadow-sm">
                  <div className="font-mono text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded inline-block">{p.codigo}</div>
                  <div className="text-sm font-medium leading-snug mt-2 mb-3 text-foreground">{p.descricao}</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <input 
                        type="number" 
                        step="0.001" 
                        disabled={disabled}
                        defaultValue={item?.qty_contada ?? ""}
                        onBlur={(e) => { 
                          const v = parseFloat(e.target.value); 
                          if (!isNaN(v) && v !== (item?.qty_contada ?? null)) upsertItem.mutate({ productId: p.id, qty: v }); 
                        }}
                        className="form-input w-full font-mono text-lg py-2" 
                        placeholder="Qtd..." 
                      />
                    </div>
                    <div className="w-24 text-right">
                      {item ? <Badge variant="outline" className="text-[10px] bg-muted/50 uppercase tracking-wider">{item.origem}</Badge> : null}
                    </div>
                  </div>
                </div>
              );
            })}
            {displayFiltered.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm font-medium">Nenhum produto encontrado.</div>
            )}
            {filtered.length > 200 && (
              <div className="text-center text-xs text-muted-foreground py-2 font-medium">
                Mostrando 200 de {filtered.length}. Use a busca.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
