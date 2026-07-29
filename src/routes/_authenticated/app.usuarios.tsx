import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/usuarios")({
  head: () => ({ meta: [{ title: "Usuários | Almoxarifado" }] }),
  component: Page,
});

const ROLES = ["admin", "gestor", "conferente", "contador"] as const;

function Page() {
  const qc = useQueryClient();

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
      <div><h1 className="text-2xl font-semibold">Usuários e funções</h1><p className="text-sm text-muted-foreground">Marque as funções de cada usuário.</p></div>
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
