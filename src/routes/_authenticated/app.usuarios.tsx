import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, getSecondarySupabaseClient } from "@/integrations/supabase/client";
import Modal from "@/components/Modal/Modal";
import Avatar from "@/components/ui/avatar";
import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Skeleton from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/app/usuarios")({
  head: () => ({ meta: [{ title: "Usuários | BCM Stock" }] }),
  component: Page,
});

const ROLES = ["admin", "gestor", "conferente", "contador"] as const;

function Page() {
  const qc = useQueryClient();
  const [openNewUser, setOpenNewUser] = useState(false);
  const [newNome, setNewNome] = useState("");
  const [newUser, setNewUser] = useState("");
  const [newPass, setNewPass] = useState("");
  const [loadingNew, setLoadingNew] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingNew(true);
    const secClient = getSecondarySupabaseClient();
    const loginEmail = newUser.includes('@') ? newUser : `${newUser}@bcmstock.local`;
    
    const { error } = await secClient.auth.signUp({
      email: loginEmail,
      password: newPass,
      options: { data: { nome: newNome } }
    });
    
    setLoadingNew(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Usuário criado com sucesso!");
      setOpenNewUser(false);
      setNewNome("");
      setNewUser("");
      setNewPass("");
      qc.invalidateQueries({ queryKey: ["profiles"] });
    }
  };

  const { data: profiles, isLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => (await supabase.from("profiles").select("*").order("nome")).data ?? [],
  });
  const { data: roles } = useQuery({
    queryKey: ["all-roles"],
    queryFn: async () => (await supabase.from("user_roles").select("*")).data ?? [],
  });

  const toggleRole = useMutation({
    mutationFn: async ({ userId, role, on }: { userId: string; role: string; on: boolean }) => {
      if (on) {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: role as any });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role as any);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["all-roles"] }),
    onError: (e: any) => toast.error(e.message),
  });

  const userRoles = (userId: string) => (roles ?? []).filter((r) => r.user_id === userId).map((r) => r.role);

  return (
    <div className="page-container animate-fade-in max-w-7xl mx-auto">
      <div className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title flex items-center gap-2"><Users size={24} className="text-primary"/> Usuários e funções</h1>
            <p className="page-subtitle">Gerencie os acessos e permissões de cada usuário no sistema.</p>
          </div>
        </div>
        <div className="page-actions w-full sm:w-auto">
          <button className="btn btn--primary w-full sm:w-auto" onClick={() => setOpenNewUser(true)}>
            <Plus size={16} className="mr-1.5" /> Novo Usuário
          </button>
        </div>
      </div>

      <Modal isOpen={openNewUser} onClose={() => setOpenNewUser(false)} title="Criar Novo Usuário" size="sm">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Nome Completo <span className="text-danger">*</span></label>
            <input 
              required 
              className="form-input" 
              value={newNome} 
              onChange={e => setNewNome(e.target.value)} 
              placeholder="Ex: João da Silva"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Nome de Usuário (Login) <span className="text-danger">*</span></label>
            <input 
              required 
              className="form-input" 
              value={newUser} 
              onChange={e => setNewUser(e.target.value.toLowerCase().replace(/\s/g, ''))} 
              placeholder="Ex: joao.silva"
            />
            <p className="text-[11px] text-muted-foreground mt-1">Será usado para fazer login no sistema.</p>
          </div>
          <div className="form-group">
            <label className="form-label">Senha (4 dígitos) <span className="text-danger">*</span></label>
            <input 
              required 
              minLength={4} 
              maxLength={4} 
              pattern="\d{4}" 
              title="A senha deve conter exatamente 4 dígitos numéricos" 
              type="password" 
              className="form-input font-mono text-center tracking-[0.5em] text-lg" 
              value={newPass} 
              onChange={e => setNewPass(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
            />
          </div>
          <div className="form-actions mt-6 pt-4 border-t border-border flex justify-end gap-3">
            <button type="button" className="btn btn--ghost" onClick={() => setOpenNewUser(false)}>Cancelar</button>
            <button type="submit" disabled={loadingNew || !newNome || !newUser || newPass.length !== 4} className="btn btn--primary">
              {loadingNew ? "Criando..." : "Criar Usuário"}
            </button>
          </div>
        </form>
      </Modal>

      <div className="glass-panel p-0 rounded-xl border border-border overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton height="60px" width="100%" />
            <Skeleton height="60px" width="100%" />
            <Skeleton height="60px" width="100%" />
          </div>
        ) : (
          <div className="table-responsive border-0 shadow-none rounded-none m-0">
            <table className="table table--hover m-0 border-0">
              <thead className="bg-muted/10">
                <tr>
                  <th className="glass-header min-w-[280px]">Usuário</th>
                  {ROLES.map((r) => (
                    <th key={r} className="glass-header w-24 text-center">
                      <div className="text-[10px] uppercase tracking-wider font-semibold">{r}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {profiles?.map((p) => {
                  const has = userRoles(p.id);
                  return (
                    <tr key={p.id}>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <Avatar user={{ nome: p.nome, email: p.email }} size={40} />
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground text-sm leading-tight">{p.nome}</span>
                            <span className="text-xs text-muted-foreground font-mono">{p.email.split('@')[0]}</span>
                          </div>
                        </div>
                      </td>
                      {ROLES.map((r) => {
                        const isChecked = has.includes(r);
                        return (
                          <td key={r} className="text-center">
                            <div className="flex justify-center">
                              <label className="relative flex cursor-pointer items-center rounded-full p-2 hover:bg-muted/50 transition-colors">
                                <input 
                                  type="checkbox" 
                                  className="peer cursor-pointer appearance-none rounded-md border border-border bg-background w-5 h-5 checked:bg-primary checked:border-primary transition-all disabled:opacity-50"
                                  checked={isChecked}
                                  onChange={(e) => toggleRole.mutate({ userId: p.id, role: r, on: e.target.checked })}
                                  disabled={toggleRole.isPending}
                                />
                                <span className="absolute text-white transition-opacity opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                  </svg>
                                </span>
                              </label>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                {(!profiles || profiles.length === 0) && (
                  <tr>
                    <td colSpan={ROLES.length + 1} className="text-center py-8 text-muted-foreground">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
