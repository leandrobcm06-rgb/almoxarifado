import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ChevronLeft, Camera, Save, CheckCircle2, Loader2, FileDown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { runOcrOnPhoto } from "@/lib/ocr.functions";
import { exportToExcel, exportToPDF } from "@/lib/export-utils";

export const Route = createFileRoute("/_authenticated/app/contagens/$id")({
  head: () => ({ meta: [{ title: "Contagem | Almoxarifado" }] }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { hasRole, hasAnyRole } = useAuth();
  const blind = hasRole("contador") && !hasAnyRole(["admin", "gestor", "conferente"]);

  const { data: count } = useQuery({
    queryKey: ["count", id],
    queryFn: async () => (await supabase.from("counts").select("*, count_rounds(*)").eq("id", id).single()).data,
  });
  const { data: products } = useQuery({
    queryKey: ["products-all"], queryFn: async () => (await supabase.from("products").select("id, codigo, descricao, unidade, cod_auxiliar, fabricante, localizacao").order("codigo").limit(5000)).data ?? [],
  });


  const finalize = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("counts").update({ status: "finalizada", finalizado_em: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Contagem finalizada"); qc.invalidateQueries({ queryKey: ["count", id] }); },
    onError: (e: any) => toast.error(e.message),
  });

  if (!count) return <div className="text-muted-foreground">Carregando...</div>;
  const rounds = (count.count_rounds ?? []).sort((a: any, b: any) => a.rodada - b.rodada);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/app/contagens"><Button variant="ghost" size="sm"><ChevronLeft className="h-4 w-4" /></Button></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{count.nome}</h1>
          <div className="flex gap-2 mt-1 text-sm">
            <Badge variant="outline">{count.tipo}</Badge>
            <Badge>{count.status}</Badge>
            {blind && <Badge variant="secondary">Modo cego</Badge>}
          </div>
        </div>
        {count.status !== "finalizada" && !blind && (
          <Button onClick={() => finalize.mutate()}><CheckCircle2 className="h-4 w-4 mr-2" />Finalizar contagem</Button>
        )}
      </div>

      <Tabs defaultValue={`r${rounds[0]?.rodada ?? 1}`}>
        <TabsList>
          {rounds.map((r: any) => <TabsTrigger key={r.id} value={`r${r.rodada}`}>Rodada {r.rodada}</TabsTrigger>)}
        </TabsList>
        {rounds.map((r: any) => (
          <TabsContent key={r.id} value={`r${r.rodada}`}>
            <RoundPanel roundId={r.id} countId={id} products={products ?? []} blind={blind} disabled={count.status === "finalizada"} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function RoundPanel({ roundId, countId, products, blind, disabled }: { roundId: string; countId: string; products: any[]; blind: boolean; disabled: boolean }) {
  const qc = useQueryClient();
  const ocrFn = useServerFn(runOcrOnPhoto);
  const fileRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");

  const { data: items } = useQuery({
    queryKey: ["round-items", roundId],
    queryFn: async () => (await supabase.from("count_items").select("*, products(codigo, descricao, unidade)").eq("round_id", roundId)).data ?? [],
  });
  const { data: photos } = useQuery({
    queryKey: ["round-photos", roundId],
    queryFn: async () => (await supabase.from("count_photos").select("*").eq("round_id", roundId).order("created_at", { ascending: false })).data ?? [],
  });

  const itemMap = useMemo(() => new Map((items ?? []).map((i: any) => [i.product_id, i])), [items]);
  const filtered = (products ?? []).filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return p.codigo.toLowerCase().includes(s) || p.descricao.toLowerCase().includes(s);
  }).slice(0, 200);

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
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-base">Foto + OCR</CardTitle>
          <div>
            <input ref={fileRef} type="file" className="hidden" accept="image/*" capture="environment"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto.mutate(f); e.currentTarget.value = ""; }} />
            <Button disabled={disabled || uploadPhoto.isPending} onClick={() => fileRef.current?.click()}>
              {uploadPhoto.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Camera className="h-4 w-4 mr-2" />}
              Tirar / enviar foto
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {photos?.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma foto. Use o botão acima para fotografar a folha de contagem manuscrita.</p>}
          <div className="space-y-2">
            {photos?.map((p: any) => {
              const result = p.ocr_result as any;
              const n = result?.items?.length ?? 0;
              return (
                <div key={p.id} className="border rounded p-3 flex items-center justify-between">
                  <div className="text-sm">
                    <div className="font-medium">{p.storage_path.split("/").pop()}</div>
                    <div className="text-xs text-muted-foreground">Status OCR: {p.ocr_status} — {n} itens reconhecidos</div>
                  </div>
                  <Button size="sm" disabled={p.ocr_status !== "concluido" || n === 0 || disabled} onClick={() => applyOcr.mutate(p.id)}>
                    <Save className="h-4 w-4 mr-2" />Revisar e aplicar
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-base">Lançamento manual ({items?.length ?? 0} itens contados)</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportToExcel(
              (products ?? []).map((p: any) => ({
                "COD. AUXILIAR": p.cod_auxiliar ?? "", "FABRICANTE": p.fabricante ?? "",
                "LOCALIZAÇÃO": p.localizacao ?? "", "NOME": p.descricao, "FÍSICO": "",
              })), "lista-contagem-em-branco")}><FileDown className="h-4 w-4 mr-2" />Excel em branco</Button>
            <Button variant="outline" size="sm" onClick={() => exportToPDF(
              `Lista de contagem`,
              ["COD. AUXILIAR", "FABRICANTE", "LOCALIZAÇÃO", "NOME", "FÍSICO"],
              (products ?? []).map((p: any) => [p.cod_auxiliar ?? "", p.fabricante ?? "", p.localizacao ?? "", p.descricao, ""]),
              "lista-contagem", "landscape",
            )}><FileDown className="h-4 w-4 mr-2" />PDF para imprimir</Button>

          </div>
        </CardHeader>
        <CardContent>
          <Input placeholder="Buscar produto..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md mb-3" />
          <div className="max-h-[500px] overflow-y-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Código</TableHead><TableHead>Descrição</TableHead><TableHead className="w-32 text-right">Contado</TableHead><TableHead>Origem</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map((p) => {
                  const item = itemMap.get(p.id);
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.codigo}</TableCell>
                      <TableCell className="text-sm">{p.descricao}</TableCell>
                      <TableCell>
                        <Input type="number" step="0.001" disabled={disabled}
                          defaultValue={item?.qty_contada ?? ""}
                          onBlur={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v) && v !== (item?.qty_contada ?? null)) upsertItem.mutate({ productId: p.id, qty: v }); }}
                          className="h-8 text-right" />
                      </TableCell>
                      <TableCell>{item ? <Badge variant="outline" className="text-xs">{item.origem}</Badge> : null}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {(products ?? []).length > 200 && <p className="text-xs text-muted-foreground mt-2">Mostrando 200 — use a busca.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
