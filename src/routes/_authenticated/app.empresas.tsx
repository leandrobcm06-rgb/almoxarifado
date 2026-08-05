import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Building2 } from "lucide-react";
import Modal from "@/components/Modal/Modal";
import Skeleton from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/app/empresas")({
  head: () => ({ meta: [{ title: "Empresas | BCM Stock" }] }),
  component: Page,
});

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
    onSuccess: () => { toast.success("Empresa criada com sucesso"); setOpen(false); setCnpj(""); setNome(""); qc.invalidateQueries({ queryKey: ["companies"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { error } = await supabase.from("companies").update({ ativo }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Status atualizado");
      qc.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="page-container animate-fade-in max-w-5xl mx-auto">
      <div className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title flex items-center gap-2"><Building2 size={24} className="text-primary"/> Empresas (CNPJs)</h1>
            <p className="page-subtitle">Gerencie os estabelecimentos vinculados ao sistema.</p>
          </div>
        </div>
        
        <div className="page-actions w-full sm:w-auto">
          <button className="btn btn--primary w-full sm:w-auto" onClick={() => setOpen(true)}>
            <Plus size={16} className="mr-1.5" /> Nova empresa
          </button>
        </div>
      </div>

      <div className="glass-panel p-0 rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton height="60px" width="100%" />
              <Skeleton height="60px" width="100%" />
              <Skeleton height="60px" width="100%" />
            </div>
          ) : !data || data.length === 0 ? (
            <EmptyState 
              icon={Building2} 
              title="Nenhuma empresa cadastrada" 
              description="Você ainda não possui empresas (CNPJs) cadastradas no sistema."
              action={<button className="btn btn--primary" onClick={() => setOpen(true)}>Cadastrar Primeira Empresa</button>}
            />
          ) : (
            <>
              <div className="hidden md:block table-responsive border-0 shadow-none rounded-none m-0">
                <table className="table table--hover m-0 border-0">
                  <thead className="bg-muted/10">
                    <tr>
                      <th className="glass-header w-48">CNPJ</th>
                      <th className="glass-header">Nome da Empresa</th>
                      <th className="glass-header w-32 text-center">Status</th>
                      <th className="glass-header w-32 text-right">Ativo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((c) => (
                      <tr key={c.id}>
                        <td className="font-mono text-sm font-semibold">{c.cnpj}</td>
                        <td className="text-sm font-medium">{c.nome}</td>
                        <td className="text-center">
                          <Badge variant="outline" className={c.ativo ? 'bg-success-bg text-success border-success-border' : 'bg-muted/50 text-muted-foreground'}>
                            {c.ativo ? 'Ativa' : 'Inativa'}
                          </Badge>
                        </td>
                        <td className="text-right">
                          <div className="flex justify-end pr-2">
                            <Switch checked={c.ativo} onCheckedChange={(v) => toggle.mutate({ id: c.id, ativo: v })} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-3 p-3 bg-muted/5 h-full">
                {data.map((c) => (
                  <div key={c.id} className="border border-border rounded-lg p-4 bg-card shadow-sm flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-base flex items-center gap-2">
                        {c.nome}
                        {!c.ativo && <Badge variant="outline" className="text-[10px] bg-muted/50 text-muted-foreground ml-1">Inativa</Badge>}
                      </div>
                      <div className="font-mono text-xs text-muted-foreground mt-1 bg-muted/30 px-2 py-0.5 rounded-md inline-block">{c.cnpj}</div>
                    </div>
                    <div>
                      <Switch checked={c.ativo} onCheckedChange={(v) => toggle.mutate({ id: c.id, ativo: v })} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Nova empresa" size="sm">
        <form onSubmit={(e) => { e.preventDefault(); create.mutate(); }} className="space-y-4">
          <div className="form-group">
            <label className="form-label">CNPJ <span className="text-danger">*</span></label>
            <input 
              value={cnpj} 
              onChange={(e) => setCnpj(e.target.value)} 
              placeholder="00.000.000/0000-00" 
              className="form-input font-mono"
              autoFocus
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Nome Fantasia / Razão Social <span className="text-danger">*</span></label>
            <input 
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
              className="form-input"
              placeholder="Digite o nome da empresa"
              required
            />
          </div>
          <div className="form-actions mt-6 pt-4 border-t border-border flex justify-end gap-3">
            <button type="button" className="btn btn--ghost" onClick={() => setOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn--primary" disabled={!cnpj || !nome || create.isPending}>
              {create.isPending ? 'Salvando...' : 'Salvar Empresa'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
