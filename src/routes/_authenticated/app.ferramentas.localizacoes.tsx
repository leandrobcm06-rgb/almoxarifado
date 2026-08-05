import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Edit, MapPin } from "lucide-react";
import Modal from "@/components/Modal/Modal";
import EmptyState from "@/components/UI/EmptyState";
import Skeleton from "@/components/UI/Skeleton";

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
    <div className="page-container animate-fade-in max-w-4xl mx-auto">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Localizações</h1>
            <p className="page-subtitle">Gerencie os locais (caixas, armários, salas) onde as ferramentas são guardadas.</p>
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn--primary" onClick={handleOpenNew}>
            <Plus size={16} className="mr-2" /> Nova Localização
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-border">
        <div className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton height="40px" width="100%" />
              <Skeleton height="40px" width="100%" />
              <Skeleton height="40px" width="100%" />
            </div>
          ) : data?.length === 0 ? (
            <EmptyState 
              icon={MapPin} 
              title="Nenhuma localização cadastrada" 
              description="Cadastre locais para organizar suas ferramentas."
              action={
                <button className="btn btn--primary" onClick={handleOpenNew}>
                  Cadastrar Primeira Localização
                </button>
              }
            />
          ) : (
            <div className="table-responsive border-0 shadow-none rounded-none">
              <table className="table table--hover m-0">
                <thead>
                  <tr>
                    <th className="glass-header">Nome</th>
                    <th className="glass-header text-right w-32">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((loc) => (
                    <tr key={loc.id}>
                      <td className="font-medium text-foreground">{loc.name}</td>
                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <button className="btn-icon" onClick={() => handleEdit(loc)} title="Editar">
                            <Edit size={16} />
                          </button>
                          <button className="btn-icon text-danger hover:text-danger hover:bg-danger-bg" onClick={() => { if (confirm("Excluir esta localização?")) deleteMutation.mutate(loc.id); }} title="Excluir">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="md:hidden flex flex-col gap-3 p-3 bg-muted/10">
                {data?.map((loc) => (
                  <div key={loc.id} className="border border-border rounded-xl p-4 bg-card shadow-sm flex items-center justify-between">
                    <div className="font-medium text-base text-foreground font-display">{loc.name}</div>
                    <div className="flex gap-2">
                      <button className="btn btn--outline btn--sm px-3" onClick={() => handleEdit(loc)}>
                        <Edit size={14} />
                      </button>
                      <button className="btn btn--outline btn--sm px-3 text-danger border-danger-border hover:bg-danger-bg" onClick={() => { if (confirm("Excluir esta localização?")) deleteMutation.mutate(loc.id); }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={open} onClose={() => { setOpen(false); setName(""); setEditingId(null); }} title={editingId ? "Editar Localização" : "Nova Localização"} size="sm">
        <div className="space-y-6">
          <div className="form-group">
            <label className="form-label">Nome da Localização</label>
            <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Armário A, Gaveta 2..." />
          </div>
          <div className="form-actions mt-8">
            <button className="btn btn--ghost w-full sm:w-auto" onClick={() => { setOpen(false); setName(""); setEditingId(null); }}>
              Cancelar
            </button>
            <button className="btn btn--primary w-full sm:w-auto" onClick={() => saveMutation.mutate()} disabled={!name || saveMutation.isPending}>
              {saveMutation.isPending ? "Salvando..." : "Salvar Localização"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
