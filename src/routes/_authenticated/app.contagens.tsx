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

export const Route = createFileRoute("/_authenticated/app/contagens")({
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
    queryFn: async () => (await supabase.from("stock_snapshots").select("id, snapshot_date").eq("status", "confirmado").order("snapshot_date", { ascending: false }).limit(20)).data ?? [],
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-semibold">Contagens</h1><p className="text-sm text-muted-foreground">Contagem geral (2 rodadas cegas) ou diária (1 rodada).</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Nova contagem</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova contagem</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Nome</Label><Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Inventário Anual 2026" /></div>
              <div><Label>Tipo</Label>
                <Select value={tipo} onValueChange={(v: any) => setTipo(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geral">Geral (2 rodadas cegas)</SelectItem>
                    <SelectItem value="diaria">Diária (rotativa, 1 rodada)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Snapshot de estoque (referência)</Label>
                <Select value={snapshotId} onValueChange={setSnapshotId}>
                  <SelectTrigger><SelectValue placeholder="Selecione um snapshot confirmado" /></SelectTrigger>
                  <SelectContent>{snapshots?.map((s) => <SelectItem key={s.id} value={s.id}>{format(new Date(s.snapshot_date + "T00:00"), "dd/MM/yyyy")}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button onClick={() => create.mutate()} disabled={!nome || !snapshotId || create.isPending} className="w-full">Criar e abrir</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Tipo</TableHead><TableHead>Status</TableHead><TableHead>Rodadas</TableHead><TableHead>Criada em</TableHead></TableRow></TableHeader>
            <TableBody>
              {data?.map((c: any) => (
                <TableRow key={c.id} className="cursor-pointer hover:bg-accent" onClick={() => nav({ to: "/app/contagens/$id", params: { id: c.id } })}>
                  <TableCell className="font-medium"><Link to="/app/contagens/$id" params={{ id: c.id }}>{c.nome}</Link></TableCell>
                  <TableCell><Badge variant="outline">{c.tipo}</Badge></TableCell>
                  <TableCell><Badge>{c.status}</Badge></TableCell>
                  <TableCell className="text-sm">{c.count_rounds?.length ?? 0}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{format(new Date(c.created_at), "dd/MM/yyyy HH:mm")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
