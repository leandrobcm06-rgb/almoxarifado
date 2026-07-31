import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/auditoria")({
  head: () => ({ meta: [{ title: "Auditoria | BCM Stock" }] }),
  component: Page,
});

const getEntityName = (log: any) => {
  if (!log.dados) return log.entidade_id || "-";
  
  const data = log.acao === "Edição" ? log.dados.depois || log.dados : log.dados;
  if (!data) return log.entidade_id || "-";

  let nameStr = data.name || data.nome || data.description || data.descricao || data.codigo;
  
  if (log.entidade === "assets" && data.asset_number) {
    nameStr = `${data.asset_number} - ${data.description || ''}`;
  } else if (log.entidade === "tools" && data.patrimony_number) {
    nameStr = `${data.patrimony_number} - ${data.name || ''}`;
  }

  return nameStr || log.entidade_id || "-";
};

const translateEntity = (entity: string) => {
  const map: Record<string, string> = {
    assets: "Patrimônio", asset_loans: "Empréstimo (Patr.)",
    tools: "Ferramenta", tool_loans: "Empréstimo (Ferr.)", tool_locations: "Local (Ferr.)",
    copper_bars: "Barra de Cobre", copper_pieces: "Peça de Cobre", copper_movements: "Movimentação (Cobre)",
    counts: "Contagem", count_items: "Item de Contagem", divergence_items: "Divergência",
    profiles: "Usuário", user_roles: "Permissão"
  };
  return map[entity] || entity;
};

function Page() {
  const [viewingData, setViewingData] = useState<any>(null);

  const { data: logs, isLoading } = useQuery({
    queryKey: ["audit_logs"],
    queryFn: async () => {
      const { data: auditData, error } = await supabase
        .from("audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      if (!auditData || auditData.length === 0) return [];

      const userIds = [...new Set(auditData.map(log => log.user_id).filter(Boolean))];
      
      let profilesMap: Record<string, any> = {};
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, nome")
          .in("id", userIds);
          
        profilesMap = (profilesData || []).reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {});
      }

      return auditData.map(log => ({
        ...log,
        profiles: profilesMap[log.user_id] || null
      }));
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Auditoria</h1>
          <p className="text-muted-foreground">Rastreamento de ações e alterações realizadas no sistema.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 md:p-0">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data / Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Registro Afetado</TableHead>
                  <TableHead className="w-24 text-center">Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-6">Carregando logs...</TableCell></TableRow>
                ) : logs?.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-6">Nenhum registro de auditoria encontrado.</TableCell></TableRow>
                ) : (
                  logs?.map((log: any) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">{format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss")}</TableCell>
                      <TableCell className="font-medium">{log.profiles?.nome || "Sistema"}</TableCell>
                      <TableCell><span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs font-semibold">{log.acao}</span></TableCell>
                      <TableCell>{translateEntity(log.entidade)}</TableCell>
                      <TableCell className="font-medium max-w-[250px] truncate" title={getEntityName(log)}>{getEntityName(log)}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" onClick={() => setViewingData(log)} disabled={!log.dados}>
                          <Eye className="h-4 w-4" />
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
              <div className="text-center text-muted-foreground py-6">Carregando logs...</div>
            ) : logs?.length === 0 ? (
              <div className="text-center text-muted-foreground py-6">Nenhum registro de auditoria encontrado.</div>
            ) : (
              logs?.map((log: any) => (
                <div key={log.id} className="border rounded-md p-4 bg-card shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs font-semibold">{log.acao}</span>
                    <span className="text-xs text-muted-foreground">{format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss")}</span>
                  </div>
                  <div className="text-sm font-medium">{log.profiles?.nome || "Sistema"}</div>
                  <div className="text-sm text-muted-foreground">
                    {translateEntity(log.entidade)} <span className="font-medium ml-1 block truncate mt-1">{getEntityName(log)}</span>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button variant="outline" size="sm" onClick={() => setViewingData(log)} disabled={!log.dados}>
                      <Eye className="h-4 w-4 mr-2" /> Detalhes
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>


      <Dialog open={!!viewingData} onOpenChange={() => setViewingData(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Ação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><strong className="text-muted-foreground block">Usuário</strong>{viewingData?.profiles?.nome}</div>
              <div><strong className="text-muted-foreground block">Ação</strong>{viewingData?.acao}</div>
              <div><strong className="text-muted-foreground block">Entidade</strong>{viewingData?.entidade}</div>
              <div><strong className="text-muted-foreground block">Data</strong>{viewingData ? format(new Date(viewingData.created_at), "dd/MM/yyyy HH:mm:ss") : ""}</div>
            </div>
            <div>
              <strong className="text-muted-foreground block mb-2">Dados (JSON)</strong>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs font-mono">
                {JSON.stringify(viewingData?.dados, null, 2)}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
