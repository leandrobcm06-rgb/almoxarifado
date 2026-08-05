import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Monitor, Calendar, CheckCircle2, History, User, MapPin, Tag, Box, Info, ArrowRightLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Skeleton from "@/components/UI/Skeleton";

export const Route = createFileRoute("/_authenticated/app/patrimonios/$id")({
  head: () => ({ meta: [{ title: "Detalhes do Patrimônio | BCM Stock" }] }),
  component: PatrimoniosDetails,
});

const calculateDepreciation = (asset: any) => {
  if (!asset.acquisition_date || !asset.initial_value || !asset.category) return null;
  
  const start = new Date(asset.acquisition_date);
  const now = new Date();
  const years = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  
  if (years < 0) return { depreciatedValue: asset.initial_value, percentage: 0, initialValue: asset.initial_value };
  
  let rate = 0;
  switch (asset.category) {
    case "Eletrônicos": rate = 0.20; break;
    case "Ferramentas elétricas": rate = 0.20; break;
    case "Ferramentas hidráulicas portáteis": rate = 0.20; break;
    case "Ferramentas manuais": rate = 0.10; break;
    case "Equipamentos hidráulicos industriais": rate = 0.10; break;
    case "Móveis": rate = 0.10; break;
    default: rate = 0;
  }
  
  let depreciationPercentage = years * rate;
  if (depreciationPercentage > 1) depreciationPercentage = 1;
  
  const depreciatedValue = asset.initial_value * (1 - depreciationPercentage);
  return {
    depreciatedValue,
    percentage: depreciationPercentage,
    initialValue: asset.initial_value
  };
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

function PatrimoniosDetails() {
  const { id } = Route.useParams();
  const [asset, setAsset] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: assetData, error: assetErr } = await supabase.from("assets").select("*").eq("id", id).single();
        if (assetErr) throw assetErr;
        setAsset(assetData);

        const { data: historyData } = await supabase.from("asset_history").select("*").eq("asset_id", id).order("created_at", { ascending: false });
        setHistory(historyData || []);

        const { data: loansData } = await supabase.from("asset_loans").select("*").eq("asset_id", id).order("created_at", { ascending: false });
        setLoans(loansData || []);
      } catch (error: any) {
        toast.error("Erro ao carregar detalhes: " + error.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container max-w-6xl mx-auto">
        <div className="page-header">
          <Skeleton height="40px" width="300px" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Skeleton height="350px" width="100%" />
          </div>
          <div>
            <Skeleton height="250px" width="100%" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!asset) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-bold text-destructive mb-4">Patrimônio não encontrado</h2>
        <Link to="/app/patrimonios/lista" className="btn btn--primary">
          <ArrowLeft size={16} className="mr-2" /> Voltar para Lista
        </Link>
      </div>
    );
  }

  const conditionColors: Record<string, string> = { 
    "Ruim": "destructive", 
    "Regular": "warning", 
    "Bom": "default", 
    "Ótimo": "success" 
  };

  return (
    <div className="page-container animate-fade-in max-w-6xl mx-auto">
      <div className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Link to={asset.is_active ? "/app/patrimonios/lista" : "/app/patrimonios/inativos"} className="btn-icon bg-muted/50 hover:bg-muted border border-border flex-shrink-0">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="page-title font-mono text-xl sm:text-2xl">{asset.asset_number} - {asset.description}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {!asset.is_active && <Badge variant="destructive" className="font-semibold px-2.5 py-0.5">Inativo</Badge>}
              {asset.is_active && asset.status === 'disponivel' && <Badge variant="outline" className="text-success bg-success-bg border-success-border font-semibold px-2.5 py-0.5">Disponível</Badge>}
              {asset.is_active && asset.status === 'emprestado' && <Badge variant="outline" className="text-warning bg-warning-bg border-warning-border font-semibold px-2.5 py-0.5">Emprestado</Badge>}
              <Badge variant={conditionColors[asset.condition] as any || "outline"} className="font-semibold px-2.5 py-0.5">{asset.condition}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="glass-panel p-6 rounded-xl border border-border md:col-span-2 flex flex-col h-full">
          <h2 className="text-lg font-semibold font-display text-foreground border-b border-border pb-3 mb-5">Informações Gerais</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5"><Tag size={14}/> Marca</div>
              <div className="font-medium text-foreground text-[15px]">{asset.brand || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5"><Box size={14}/> Modelo</div>
              <div className="font-medium text-foreground text-[15px]">{asset.model || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5"><Monitor size={14}/> Nº de Série</div>
              <div className="font-medium text-foreground font-mono text-[15px]">{asset.serial_number || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5"><Calendar size={14}/> Aquisição</div>
              <div className="font-medium text-foreground text-[15px]">{asset.acquisition_date ? new Date(asset.acquisition_date).toLocaleDateString() : "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5"><User size={14}/> Responsável</div>
              <div className="font-medium text-foreground text-[15px]">{asset.responsible || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5"><MapPin size={14}/> Localização</div>
              <div className="font-medium text-foreground text-[15px]">{asset.location || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5"><Tag size={14}/> Categoria</div>
              <div className="font-medium text-foreground text-[15px]">{asset.category || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5"><Tag size={14}/> Valor Atual</div>
              <div className="font-medium text-[15px]">
                {(() => {
                  if (!asset.initial_value) return <span className="text-foreground">-</span>;
                  const dep = calculateDepreciation(asset);
                  if (!dep) return <span className="text-foreground">{formatCurrency(asset.initial_value)}</span>;
                  if (dep.percentage === 0) return <span className="text-foreground">{formatCurrency(asset.initial_value)}</span>;
                  return (
                    <div className="flex flex-col">
                      <span className="text-success font-semibold">{formatCurrency(dep.depreciatedValue)}</span>
                      <span className="text-[11px] text-muted-foreground line-through decoration-muted-foreground/50">Inicial: {formatCurrency(dep.initialValue)}</span>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {asset.notes && (
            <div className="mt-6 pt-5 border-t border-border">
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2 flex items-center gap-1.5"><Info size={14}/> Observações</div>
              <div className="text-sm bg-muted/30 p-4 rounded-lg text-foreground leading-relaxed">{asset.notes}</div>
            </div>
          )}

          {!asset.is_active && (
            <div className="mt-6 pt-5 border-t border-danger-border/30">
              <div className="text-xs text-danger font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5"><Info size={14}/> Detalhes da Desativação</div>
              <div className="text-sm bg-danger-bg border border-danger-border p-4 rounded-lg space-y-2">
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <strong className="text-danger/90">Motivo:</strong> 
                  <span className="text-danger font-medium">{asset.deactivation_reason}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <strong className="text-danger/90">Data:</strong> 
                  <span className="text-danger">{asset.deactivation_date ? new Date(asset.deactivation_date).toLocaleString() : '-'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <strong className="text-danger/90">Por:</strong> 
                  <span className="text-danger">{asset.deactivation_user}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="glass-panel p-6 rounded-xl border border-border h-full flex flex-col">
          <h2 className="text-lg font-semibold font-display text-foreground border-b border-border pb-3 mb-5">Resumo de Empréstimos</h2>
          
          <div className="text-center py-6 bg-muted/20 rounded-xl border border-border/50 mb-5">
            <div className="text-4xl font-bold font-display text-foreground">{loans.length}</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-2">Total de Movimentações</div>
          </div>
          
          {loans.length > 0 ? (
            <div className="flex flex-col flex-1">
              <div className="font-semibold text-sm text-foreground mb-3">Última Movimentação</div>
              <div className="text-sm space-y-2.5 bg-background p-4 rounded-lg border border-border flex-1">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="text-muted-foreground text-xs font-medium uppercase">Status:</span>
                  <Badge variant="outline" className={loans[0].status === 'em aberto' ? 'text-primary bg-primary/10 border-primary/20' : loans[0].status === 'devolvido' ? 'text-success bg-success-bg border-success-border' : loans[0].status === 'atrasado' ? 'text-danger bg-danger-bg border-danger-border' : ''}>
                    {loans[0].status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-muted-foreground text-xs font-medium uppercase">Retirado por:</span>
                  <span className="font-semibold text-foreground text-right max-w-[120px] truncate" title={loans[0].withdrawn_by}>{loans[0].withdrawn_by}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs font-medium uppercase">Data:</span>
                  <span className="font-medium text-foreground">{new Date(loans[0].loan_date).toLocaleDateString()}</span>
                </div>
              </div>
              
              <Link to="/app/patrimonios/emprestimos" search={{ assetId: asset.id }} className="btn btn--secondary w-full mt-4">
                <ArrowRightLeft size={16} className="mr-2"/> Gerenciar Empréstimos
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border p-6 text-center">
              <ArrowRightLeft size={24} className="mb-2 opacity-50" />
              <span className="text-sm">Nenhum empréstimo registrado para este patrimônio.</span>
            </div>
          )}
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-border">
        <h2 className="text-lg font-semibold font-display text-foreground border-b border-border pb-3 mb-6 flex items-center gap-2">
          <History size={18} className="text-primary" /> Histórico Completo
        </h2>
        
        <div className="space-y-6">
          {history.map((h, i) => (
            <div key={h.id} className="flex gap-4 relative">
              {i !== history.length - 1 && <div className="absolute top-6 left-[11px] bottom-[-1.5rem] w-[2px] bg-border" />}
              
              <div className="mt-1 relative z-10">
                <div className={`h-6 w-6 rounded-full border-2 border-background flex items-center justify-center shadow-sm
                  ${h.action === 'Cadastro' ? 'bg-primary' : 
                    h.action === 'Desativação' ? 'bg-danger' : 
                    h.action === 'Empréstimo' ? 'bg-warning' :
                    h.action === 'Devolução' ? 'bg-success' :
                    h.action === 'Edição' ? 'bg-info' :
                    'bg-muted-foreground'}`} 
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-background" />
                </div>
              </div>
              
              <div className="flex-1 pb-4 bg-muted/10 p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className={`font-semibold text-sm px-2 py-0.5 rounded-md
                    ${h.action === 'Cadastro' ? 'text-primary bg-primary/10' : 
                    h.action === 'Desativação' ? 'text-danger bg-danger-bg' : 
                    h.action === 'Empréstimo' ? 'text-warning bg-warning-bg' :
                    h.action === 'Devolução' ? 'text-success bg-success-bg' :
                    h.action === 'Edição' ? 'text-info bg-info-bg' :
                    'text-muted-foreground bg-muted'}`}
                  >
                    {h.action}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground bg-background px-2 py-1 rounded-md border border-border shadow-sm">
                    {format(new Date(h.created_at), "dd 'de' MMM, yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <div className="text-sm text-foreground mb-3 leading-relaxed">{h.description}</div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <User size={12} />
                  Por: <span className="text-foreground">{h.user_name || "Sistema"}</span>
                </div>
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <div className="text-center p-8 bg-muted/10 rounded-lg border border-dashed border-border text-muted-foreground text-sm">
              Nenhum histórico encontrado para este patrimônio.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
