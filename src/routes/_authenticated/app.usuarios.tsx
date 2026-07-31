import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, getSecondarySupabaseClient } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

  const { data: profiles } = useQuery({
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-2xl font-semibold">Usuários e funções</h1><p className="text-sm text-muted-foreground">Marque as funções de cada usuário.</p></div>
        <Dialog open={openNewUser} onOpenChange={setOpenNewUser}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Novo Usuário</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Criar Novo Usuário</DialogTitle></DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4 mt-2">
              <div className="space-y-2"><Label>Nome Completo</Label><Input required value={newNome} onChange={e => setNewNome(e.target.value)} /></div>
              <div className="space-y-2"><Label>Nome de Usuário (Login)</Label><Input required value={newUser} onChange={e => setNewUser(e.target.value.toLowerCase().replace(/\s/g, ''))} /></div>
              <div className="space-y-2"><Label>Senha</Label><Input required minLength={6} type="password" value={newPass} onChange={e => setNewPass(e.target.value)} /></div>
              <Button type="submit" disabled={loadingNew} className="w-full">{loadingNew ? "Criando..." : "Criar Usuário"}</Button>
            </form>
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
                  <TableHead>Email</TableHead>
                  {ROLES.map((r) => <TableHead key={r} className="text-center capitalize">{r}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles?.map((p) => {
                  const has = userRoles(p.id);
                  return (
                    <TableRow key={p.id}>
                      <TableCell>{p.nome}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{p.email}</TableCell>
                      {ROLES.map((r) => (
                        <TableCell key={r} className="text-center">
                          <Checkbox checked={has.includes(r)} onCheckedChange={(v) => toggleRole.mutate({ userId: p.id, role: r, on: Boolean(v) })} />
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="md:hidden space-y-4 p-4">
            {profiles?.map((p) => {
              const has = userRoles(p.id);
              return (
                <div key={p.id} className="border rounded-md p-4 bg-card shadow-sm">
                  <div className="font-semibold">{p.nome}</div>
                  <div className="text-muted-foreground text-sm mb-4">{p.email}</div>
                  <div className="grid grid-cols-2 gap-3">
                    {ROLES.map((r) => (
                      <div key={r} className="flex items-center space-x-2">
                        <Checkbox id={`${p.id}-${r}`} checked={has.includes(r)} onCheckedChange={(v) => toggleRole.mutate({ userId: p.id, role: r, on: Boolean(v) })} />
                        <label htmlFor={`${p.id}-${r}`} className="text-sm capitalize font-medium leading-none cursor-pointer">{r}</label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
