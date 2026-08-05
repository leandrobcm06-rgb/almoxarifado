import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useState } from "react";
import { Eye, ShieldAlert, FileClock } from "lucide-react";
import Modal from "@/components/Modal/Modal";
import Skeleton from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/badge";

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
    <div className="page-container animate-fade-in max-w-7xl mx-auto">
      <div className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title flex items-center gap-2"><ShieldAlert size={24} className="text-primary"/> Auditoria</h1>
            <p className="page-subtitle">Rastreamento de ações e alterações realizadas no sistema (Últimos 100 registros).</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-0 rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton height="50px" width="100%" />
              <Skeleton height="50px" width="100%" />
              <Skeleton height="50px" width="100%" />
              <Skeleton height="50px" width="100%" />
            </div>
          ) : !logs || logs.length === 0 ? (
            <EmptyState 
              icon={FileClock} 
              title="Nenhum log encontrado" 
              description="Não há registros de auditoria no sistema no momento." 
            />
          ) : (
            <>
              <div className="hidden md:block table-responsive border-0 shadow-none rounded-none m-0">
                <table className="table table--hover m-0 border-0">
                  <thead className="bg-muted/10">
                    <tr>
                      <th className="glass-header w-44">Data / Hora</th>
                      <th className="glass-header w-48">Usuário</th>
                      <th className="glass-header w-32">Ação</th>
                      <th className="glass-header w-48">Módulo</th>
                      <th className="glass-header">Registro Afetado</th>
                      <th className="glass-header w-24 text-center">Detalhes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log: any) => (
                      <tr key={log.id}>
                        <td className="text-xs text-muted-foreground font-mono font-medium whitespace-nowrap">
                          {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss")}
                        </td>
                        <td className="text-sm font-medium text-foreground">{log.profiles?.nome || "Sistema"}</td>
                        <td>
                          <Badge variant="outline" className={`text-xs font-semibold uppercase tracking-wider
                            ${log.acao?.toLowerCase().includes('exclusão') || log.acao?.toLowerCase().includes('delete') ? 'bg-danger-bg text-danger border-danger-border' : 
                              log.acao?.toLowerCase().includes('edição') || log.acao?.toLowerCase().includes('update') ? 'bg-warning-bg text-warning border-warning-border' : 
                              log.acao?.toLowerCase().includes('cadastro') || log.acao?.toLowerCase().includes('insert') ? 'bg-success-bg text-success border-success-border' : 
                              'bg-primary/10 text-primary border-primary/30'}`}
                          >
                            {log.acao}
                          </Badge>
                        </td>
                        <td className="text-sm">{translateEntity(log.entidade)}</td>
                        <td className="text-sm font-medium max-w-[250px] truncate" title={getEntityName(log)}>
                          {getEntityName(log)}
                        </td>
                        <td className="text-center">
                          <button 
                            className="btn-icon bg-muted/50 border border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors mx-auto" 
                            onClick={() => setViewingData(log)} 
                            disabled={!log.dados}
                            title="Ver Detalhes do Log (JSON)"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-3 p-3 bg-muted/5 h-full">
                {logs.map((log: any) => (
                  <div key={log.id} className="border border-border rounded-lg p-4 bg-card shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className={`text-[10px] font-semibold uppercase tracking-wider
                        ${log.acao?.toLowerCase().includes('exclusão') || log.acao?.toLowerCase().includes('delete') ? 'bg-danger-bg text-danger border-danger-border' : 
                          log.acao?.toLowerCase().includes('edição') || log.acao?.toLowerCase().includes('update') ? 'bg-warning-bg text-warning border-warning-border' : 
                          log.acao?.toLowerCase().includes('cadastro') || log.acao?.toLowerCase().includes('insert') ? 'bg-success-bg text-success border-success-border' : 
                          'bg-primary/10 text-primary border-primary/30'}`}
                      >
                        {log.acao}
                      </Badge>
                      <span className="text-xs font-mono text-muted-foreground">{format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss")}</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Usuário</span>
                      <span className="font-medium text-foreground">{log.profiles?.nome || "Sistema"}</span>
                    </div>
                    
                    <div className="bg-muted/30 p-3 rounded-md border border-border/50">
                      <div className="text-xs mb-1">
                        <span className="text-muted-foreground">Módulo:</span> <span className="font-medium">{translateEntity(log.entidade)}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Registro:</span> <span className="font-medium truncate block mt-0.5">{getEntityName(log)}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-1 border-t border-border mt-1">
                      <button 
                        className="btn btn--outline btn--sm w-full" 
                        onClick={() => setViewingData(log)} 
                        disabled={!log.dados}
                      >
                        <Eye size={14} className="mr-1.5" /> Ver Detalhes (JSON)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Modal isOpen={!!viewingData} onClose={() => setViewingData(null)} title="Detalhes do Log de Auditoria" size="lg">
        {viewingData && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-muted/20 p-4 rounded-xl border border-border">
              <div>
                <strong className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block mb-1">Usuário</strong>
                <div className="text-sm font-medium">{viewingData?.profiles?.nome || "Sistema"}</div>
              </div>
              <div>
                <strong className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block mb-1">Ação</strong>
                <Badge variant="outline" className={`text-xs font-semibold
                    ${viewingData?.acao?.toLowerCase().includes('exclusão') || viewingData?.acao?.toLowerCase().includes('delete') ? 'bg-danger-bg text-danger border-danger-border' : 
                      viewingData?.acao?.toLowerCase().includes('edição') || viewingData?.acao?.toLowerCase().includes('update') ? 'bg-warning-bg text-warning border-warning-border' : 
                      viewingData?.acao?.toLowerCase().includes('cadastro') || viewingData?.acao?.toLowerCase().includes('insert') ? 'bg-success-bg text-success border-success-border' : 
                      'bg-primary/10 text-primary border-primary/30'}`}
                  >
                    {viewingData?.acao}
                  </Badge>
              </div>
              <div>
                <strong className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block mb-1">Entidade</strong>
                <div className="text-sm font-medium">{translateEntity(viewingData?.entidade)}</div>
              </div>
              <div>
                <strong className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block mb-1">Data/Hora</strong>
                <div className="text-sm font-mono">{format(new Date(viewingData.created_at), "dd/MM/yyyy HH:mm:ss")}</div>
              </div>
            </div>
            
            <div>
              <strong className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5 mb-2 border-b border-border pb-2">
                <FileClock size={14} /> Dados Técnicos (JSON)
              </strong>
              <div className="bg-muted/30 border border-border rounded-xl overflow-hidden">
                <pre className="p-4 overflow-x-auto text-xs font-mono text-foreground leading-relaxed">
                  {JSON.stringify(viewingData?.dados, null, 2)}
                </pre>
              </div>
            </div>
            
            <div className="form-actions border-t border-border pt-4 mt-6">
              <button type="button" className="btn btn--secondary w-full sm:w-auto" onClick={() => setViewingData(null)}>
                Fechar Detalhes
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
