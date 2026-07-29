import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/app/contagens/")({
  head: () => ({ meta: [{ title: "Contagens | Almoxarifado" }] }),
  component: Page,
});

function Page() {
  const qc = useQueryClient();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"geral" | "diaria">("diaria");

  const { data } = useQuery({
    queryKey: ["counts"],
    queryFn: async () => (await supabase.from("counts").select("*, count_rounds(id, rodada, status)").order("created_at", { ascending: false }).limit(100)).data ?? [],
  });
  const { data: snapshots } = useQuery({
    queryKey: ["snapshots-confirmed"],
    queryFn: async () => (await supabase.from("stock_snapshots").select("id, snapshot_date, created_at, observacao").eq("status", "confirmado").order("created_at", { ascending: false }).limit(20)).data ?? [],
  });
  const [snapshotId, setSnapshotId] = useState("");

  const create = useMutation({
    mutationFn: async () => {
      const { data: c, error } = await supabase.from("counts").insert({
        nome, tipo, status: "em_contagem",
        snapshot_id: snapshotId || null,
      }).select().single();
      if (error) throw error;
      const rounds = tipo === "geral" ? [1, 2] : [1];
      const { error: rErr } = await supabase.from("count_rounds").insert(rounds.map((r) => ({ count_id: c.id, rodada: r })));
      if (rErr) throw rErr;
      return c.id;
    },
    onSuccess: (id) => { toast.success("Contagem criada"); setOpen(false); qc.invalidateQueries({ queryKey: ["counts"] }); nav({ to: "/app/contagens/$id", params: { id } }); },
    onError: (e: any) => toast.error(e.message),
  });

  const [mesFiltro, setMesFiltro] = useState<string>("TODOS");

  const filteredData = data?.filter((c: any) => mesFiltro === "TODOS" || c.mes === mesFiltro) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-semibold">Contagens</h1><p className="text-sm text-muted-foreground">Contagem geral (2 rodadas cegas) ou diária (1 rodada).</p></div>
        <div className="flex gap-4 items-center">
          <Select value={mesFiltro} onValueChange={setMesFiltro}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filtrar por Mês" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos os Meses</SelectItem>
              {["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"].map(m => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => nav({ to: "/app/contagens/nova" })}><Plus className="h-4 w-4 mr-2" />Nova contagem</Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0 md:p-0">
          <div className="hidden md:block">
            <Table>
              <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Mês</TableHead><TableHead>Locais</TableHead><TableHead>Tipo</TableHead><TableHead>Status</TableHead><TableHead>Rodadas</TableHead><TableHead>Criada em</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredData.map((c: any) => (
                  <TableRow key={c.id} className="cursor-pointer hover:bg-accent" onClick={() => nav({ to: "/app/contagens/$id", params: { id: c.id } })}>
                    <TableCell className="font-medium"><Link to="/app/contagens/$id" params={{ id: c.id }}>{c.nome}</Link></TableCell>
                    <TableCell className="text-sm">{c.mes || "-"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{(c.loc_start || c.loc_end) ? `${c.loc_start || "*"} até ${c.loc_end || "*"}` : "Todas"}</TableCell>
                    <TableCell><Badge variant="outline">{c.tipo}</Badge></TableCell>
                    <TableCell><Badge>{c.status}</Badge></TableCell>
                    <TableCell className="text-sm">{c.count_rounds?.length ?? 0}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{format(new Date(c.created_at), "dd/MM/yyyy HH:mm")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="md:hidden space-y-4 p-4">
            {filteredData.map((c: any) => (
              <div key={c.id} className="border rounded-md p-4 bg-card shadow-sm cursor-pointer hover:border-primary transition-colors" onClick={() => nav({ to: "/app/contagens/$id", params: { id: c.id } })}>
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-lg text-primary">{c.nome}</div>
                  <Badge>{c.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div><span className="text-muted-foreground block text-xs">Mês</span>{c.mes || "-"}</div>
                  <div><span className="text-muted-foreground block text-xs">Tipo</span><Badge variant="outline" className="text-xs">{c.tipo}</Badge></div>
                  <div className="col-span-2"><span className="text-muted-foreground block text-xs">Localização</span>{(c.loc_start || c.loc_end) ? `${c.loc_start || "*"} até ${c.loc_end || "*"}` : "Todas"}</div>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t mt-2">
                  <span>{c.count_rounds?.length ?? 0} Rodadas</span>
                  <span>{format(new Date(c.created_at), "dd/MM/yyyy HH:mm")}</span>
                </div>
              </div>
            ))}
            {filteredData.length === 0 && (
              <div className="text-center text-muted-foreground py-6">Nenhuma contagem encontrada.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
