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
  head: () => ({ meta: [{ title: "Auditoria | Almoxarifado" }] }),
  component: Page,
});

function Page() {
  const [viewingData, setViewingData] = useState<any>(null);

  const { data: logs, isLoading } = useQuery({
    queryKey: ["audit_logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_log")
        .select("*, profiles(nome)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
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
                  <TableHead>Entidade</TableHead>
                  <TableHead>ID da Entidade</TableHead>
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
                      <TableCell className="font-medium">{log.profiles?.nome || "Desconhecido"}</TableCell>
                      <TableCell><span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs font-semibold">{log.acao}</span></TableCell>
                      <TableCell>{log.entidade}</TableCell>
                      <TableCell className="font-mono text-xs">{log.entidade_id || "-"}</TableCell>
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
                  <div className="text-sm font-medium">{log.profiles?.nome || "Desconhecido"}</div>
                  <div className="text-sm text-muted-foreground">{log.entidade} <span className="font-mono text-xs ml-1">{log.entidade_id || ""}</span></div>
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
