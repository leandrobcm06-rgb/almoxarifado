import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/empresas")({
  head: () => ({ meta: [{ title: "Empresas | Almoxarifado" }] }),
  component: Page,
});
import { useEffect } from "react";

function Page() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [cnpj, setCnpj] = useState("");
  const [nome, setNome] = useState("");

  useEffect(() => {
    async function seedCompanies() {
      const companies = [
        { cnpj: "08.695.687/0001-39", nome: "BCM" },
        { cnpj: "24.000.214/0001-26", nome: "CONECT" },
        { cnpj: "50.430.526/0001-80", nome: "CMS" },
        { cnpj: "05.415.977/0001-93", nome: "JLS" }
      ];
      try {
        await supabase.from("companies").upsert(companies, { onConflict: "cnpj" });
        qc.invalidateQueries({ queryKey: ["companies"] });
      } catch (e) {
        console.error("Seed error:", e);
      }
    }
    seedCompanies();
  }, [qc]);

  const { data, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => (await supabase.from("companies").select("*").order("nome")).data ?? [],
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("companies").insert({ cnpj, nome });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Empresa criada"); setOpen(false); setCnpj(""); setNome(""); qc.invalidateQueries({ queryKey: ["companies"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase.from("companies").update({ ativo }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-semibold">Empresas (CNPJs)</h1><p className="text-sm text-muted-foreground">Os 4 estabelecimentos do almoxarifado.</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Nova empresa</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova empresa</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>CNPJ</Label><Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} placeholder="00.000.000/0000-00" /></div>
              <div><Label>Nome</Label><Input value={nome} onChange={(e) => setNome(e.target.value)} /></div>
              <Button onClick={() => create.mutate()} disabled={!cnpj || !nome || create.isPending} className="w-full">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>CNPJ</TableHead><TableHead>Nome</TableHead><TableHead className="text-right">Ativo</TableHead></TableRow></TableHeader>
            <TableBody>
              {isLoading ? <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-6">Carregando...</TableCell></TableRow> :
                data?.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-sm">{c.cnpj}</TableCell>
                    <TableCell>{c.nome}</TableCell>
                    <TableCell className="text-right"><Switch checked={c.ativo} onCheckedChange={(v) => toggle.mutate({ id: c.id, ativo: v })} /></TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
