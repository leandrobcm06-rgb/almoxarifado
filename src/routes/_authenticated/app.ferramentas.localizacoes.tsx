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
import { toast } from "sonner";
import { Plus, Trash2, Edit } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/ferramentas/localizacoes")({
  head: () => ({ meta: [{ title: "Localizações | Ferramentas" }] }),
  component: Page,
});

function Page() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["tool-locations"],
    queryFn: async () => (await supabase.from("tool_locations").select("*").order("name")).data ?? [],
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        const { error } = await supabase.from("tool_locations").update({ name }).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("tool_locations").insert({ name });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingId ? "Localização atualizada" : "Localização criada");
      setOpen(false);
      setName("");
      setEditingId(null);
      qc.invalidateQueries({ queryKey: ["tool-locations"] });
    },
    onError: (e: any) => {
      if (e.message?.includes("unique")) {
        toast.error("Já existe uma localização com esse nome.");
      } else {
        toast.error(e.message);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tool_locations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Localização excluída");
      qc.invalidateQueries({ queryKey: ["tool-locations"] });
    },
    onError: (e: any) => {
      if (e.message?.includes("violates foreign key constraint")) {
        toast.error("Não é possível excluir esta localização pois existem ferramentas associadas a ela.");
      } else {
        toast.error(e.message);
      }
    },
  });

  const handleEdit = (loc: any) => {
    setEditingId(loc.id);
    setName(loc.name);
    setOpen(true);
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setName("");
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Localizações de Ferramentas</h1>
          <p className="text-sm text-muted-foreground">Gerencie os locais (caixas, armários, salas) onde as ferramentas são guardadas.</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { if (!v) { setOpen(false); setName(""); setEditingId(null); } else setOpen(true); }}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenNew}><Plus className="h-4 w-4 mr-2" />Nova Localização</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Localização" : "Nova Localização"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Nome da Localização</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Armário A, Gaveta 2..." />
              </div>
              <Button onClick={() => saveMutation.mutate()} disabled={!name || saveMutation.isPending} className="w-full">
                {saveMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0 md:p-0">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-6">Carregando...</TableCell></TableRow>
                ) : data?.length === 0 ? (
                  <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-6">Nenhuma localização cadastrada.</TableCell></TableRow>
                ) : (
                  data?.map((loc) => (
                    <TableRow key={loc.id}>
                      <TableCell className="font-medium">{loc.name}</TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(loc)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => { if (confirm("Excluir esta localização?")) deleteMutation.mutate(loc.id); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="md:hidden space-y-4 p-4">
            {isLoading ? (
              <div className="text-center text-muted-foreground py-6">Carregando...</div>
            ) : data?.length === 0 ? (
              <div className="text-center text-muted-foreground py-6">Nenhuma localização cadastrada.</div>
            ) : (
              data?.map((loc) => (
                <div key={loc.id} className="border rounded-md p-4 bg-card shadow-sm flex items-center justify-between">
                  <div className="font-medium text-base">{loc.name}</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(loc)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => { if (confirm("Excluir esta localização?")) deleteMutation.mutate(loc.id); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
