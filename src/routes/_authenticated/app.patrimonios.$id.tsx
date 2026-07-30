import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Monitor, Calendar, CheckCircle2, History, User, MapPin, Tag, Box, Info, ArrowRightLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/_authenticated/app/patrimonios/$id")({
  head: () => ({ meta: [{ title: "Detalhes do Patrimônio | BCM Stock" }] }),
  component: PatrimoniosDetails,
});

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

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando detalhes...</div>;
  if (!asset) return <div className="p-8 text-center text-destructive">Patrimônio não encontrado.</div>;

  const conditionColors: Record<string, string> = { "Ruim": "destructive", "Regular": "warning", "Bom": "default", "Ótimo": "success" };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to={asset.is_active ? "/app/patrimonios/lista" : "/app/patrimonios/inativos"}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{asset.asset_number} - {asset.description}</h1>
            <div className="flex items-center gap-2 mt-1">
              {!asset.is_active && <Badge variant="destructive">Inativo</Badge>}
              {asset.is_active && asset.status === 'disponivel' && <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Disponível</Badge>}
              {asset.is_active && asset.status === 'emprestado' && <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">Emprestado</Badge>}
              <Badge variant={conditionColors[asset.condition] as any || "outline"}>{asset.condition}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground flex items-center gap-2 mb-1"><Tag className="h-3.5 w-3.5"/> Marca</div>
                <div className="font-medium">{asset.brand || "-"}</div>
              </div>
              <div>
                <div className="text-muted-foreground flex items-center gap-2 mb-1"><Box className="h-3.5 w-3.5"/> Modelo</div>
                <div className="font-medium">{asset.model || "-"}</div>
              </div>
              <div>
                <div className="text-muted-foreground flex items-center gap-2 mb-1"><Monitor className="h-3.5 w-3.5"/> Nº de Série</div>
                <div className="font-medium">{asset.serial_number || "-"}</div>
              </div>
              <div>
                <div className="text-muted-foreground flex items-center gap-2 mb-1"><Calendar className="h-3.5 w-3.5"/> Aquisição</div>
                <div className="font-medium">{asset.acquisition_date ? new Date(asset.acquisition_date).toLocaleDateString() : "-"}</div>
              </div>
              <div>
                <div className="text-muted-foreground flex items-center gap-2 mb-1"><User className="h-3.5 w-3.5"/> Responsável</div>
                <div className="font-medium">{asset.responsible || "-"}</div>
              </div>
              <div>
                <div className="text-muted-foreground flex items-center gap-2 mb-1"><MapPin className="h-3.5 w-3.5"/> Localização</div>
                <div className="font-medium">{asset.location || "-"}</div>
              </div>
            </div>

            {asset.notes && (
              <div className="pt-4 border-t mt-4">
                <div className="text-muted-foreground flex items-center gap-2 mb-1 text-sm"><Info className="h-3.5 w-3.5"/> Observações</div>
                <div className="text-sm bg-muted/50 p-3 rounded-md">{asset.notes}</div>
              </div>
            )}

            {!asset.is_active && (
              <div className="pt-4 border-t mt-4 border-destructive/20">
                <div className="text-destructive font-semibold mb-2 flex items-center gap-2 text-sm"><Info className="h-4 w-4"/> Detalhes da Desativação</div>
                <div className="text-sm bg-destructive/5 border border-destructive/20 p-3 rounded-md">
                  <div><strong>Motivo:</strong> {asset.deactivation_reason}</div>
                  <div><strong>Data:</strong> {new Date(asset.deactivation_date).toLocaleString()}</div>
                  <div><strong>Por:</strong> {asset.deactivation_user}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo de Empréstimos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4 bg-muted/30 rounded-lg">
              <div className="text-3xl font-bold">{loans.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Total de Movimentações</div>
            </div>
            
            {loans.length > 0 && (
              <div className="space-y-3">
                <div className="font-medium text-sm border-b pb-2">Última Movimentação</div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium">{loans[0].status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Retirado por:</span>
                    <span className="font-medium">{loans[0].withdrawn_by}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data:</span>
                    <span className="font-medium">{new Date(loans[0].loan_date).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-2 text-xs" asChild>
                  <Link to="/app/patrimonios/emprestimos" search={{ assetId: asset.id }}>
                    <ArrowRightLeft className="h-3.5 w-3.5 mr-2"/> Gerenciar Empréstimos
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" /> Histórico Completo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {history.map((h, i) => (
              <div key={h.id} className="flex gap-4 relative">
                {i !== history.length - 1 && <div className="absolute top-6 left-2 bottom-[-1.5rem] w-px bg-border" />}
                <div className="mt-1">
                  <div className={`h-4 w-4 rounded-full border-2 border-background ring-1 
                    ${h.action === 'Cadastro' ? 'bg-primary ring-primary' : 
                      h.action === 'Desativação' ? 'bg-destructive ring-destructive' : 
                      h.action === 'Empréstimo' ? 'bg-amber-500 ring-amber-500' :
                      h.action === 'Devolução' ? 'bg-green-500 ring-green-500' :
                      'bg-muted-foreground ring-muted-foreground'}`} 
                  />
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{h.action}</span>
                    <span className="text-xs text-muted-foreground">• {format(new Date(h.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}</span>
                  </div>
                  <div className="text-sm mt-1">{h.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">Por: {h.user_name || "Sistema"}</div>
                </div>
              </div>
            ))}
            {history.length === 0 && <div className="text-sm text-muted-foreground">Nenhum histórico encontrado.</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
