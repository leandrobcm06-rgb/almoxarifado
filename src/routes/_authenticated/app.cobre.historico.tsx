import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { ArrowDownRight, ArrowUpRight, FilterX, History } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/app/cobre/historico")({
  head: () => ({ meta: [{ title: "Histórico de Cobre | BCM Stock" }] }),
  component: CopperHistory,
});

function CopperHistory() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterType, setFilterType] = useState<"all" | "saida" | "devolucao">("all");
  const [filterPeriod, setFilterPeriod] = useState<"all" | "current" | "previous">("all");

  async function loadMovements() {
    setLoading(true);
    try {
      let query = supabase
        .from("copper_movements")
        .select("*, bar:copper_bars(name, auxiliary_code)")
        .order("created_at", { ascending: false });

      if (filterType !== "all") {
        query = query.eq("type", filterType);
      }

      if (filterPeriod === "current") {
        query = query.gte("created_at", startOfMonth(new Date()).toISOString())
                     .lte("created_at", endOfMonth(new Date()).toISOString());
      } else if (filterPeriod === "previous") {
        const prevMonth = subMonths(new Date(), 1);
        query = query.gte("created_at", startOfMonth(prevMonth).toISOString())
                     .lte("created_at", endOfMonth(prevMonth).toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      setMovements(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMovements();
  }, [filterType, filterPeriod]);

  const clearFilters = () => {
    setFilterType("all");
    setFilterPeriod("all");
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Extrato de Movimentações</h1>
            <p className="page-subtitle">Histórico completo de entradas e saídas de pedaços de cobre.</p>
          </div>
        </div>
      </div>

      <div className="filter-bar mb-6 flex flex-wrap items-end gap-4">
        <div className="form-group mb-0">
          <label className="form-label text-xs">Período</label>
          <select 
            className="form-input w-[180px]" 
            value={filterPeriod} 
            onChange={(e: any) => setFilterPeriod(e.target.value)}
          >
            <option value="all">Todo o período</option>
            <option value="current">Mês Atual</option>
            <option value="previous">Mês Anterior</option>
          </select>
        </div>

        <div className="form-group mb-0">
          <label className="form-label text-xs">Tipo</label>
          <select 
            className="form-input w-[160px]" 
            value={filterType} 
            onChange={(e: any) => setFilterType(e.target.value)}
          >
            <option value="all">Todas</option>
            <option value="saida">Saídas (Cortes)</option>
            <option value="devolucao">Devoluções</option>
          </select>
        </div>

        {(filterType !== "all" || filterPeriod !== "all") && (
          <button className="btn btn--secondary h-[40px]" onClick={clearFilters} title="Limpar filtros">
            <FilterX size={16} className="mr-2" /> Limpar Filtros
          </button>
        )}
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-border">
        <div className="p-5 border-b border-border bg-muted/20">
          <h2 className="text-lg font-semibold font-display">Histórico de Transações</h2>
        </div>
        
        <div className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton height="40px" width="100%" />
              <Skeleton height="40px" width="100%" />
              <Skeleton height="40px" width="100%" />
              <Skeleton height="40px" width="100%" />
            </div>
          ) : movements.length === 0 ? (
            <EmptyState 
              icon={History} 
              title="Nenhuma movimentação encontrada" 
              description="Não foram encontrados registros para os filtros selecionados."
              action={
                (filterType !== "all" || filterPeriod !== "all") ? (
                  <button className="btn btn--primary" onClick={clearFilters}>Limpar Filtros</button>
                ) : undefined
              }
            />
          ) : (
            <div className="table-responsive border-0 shadow-none rounded-none">
              <table className="table table--hover m-0">
                <thead>
                  <tr>
                    <th className="glass-header">Data/Hora</th>
                    <th className="glass-header">Tipo</th>
                    <th className="glass-header">Barra Original</th>
                    <th className="glass-header text-right">Movimentação</th>
                    <th className="glass-header">Cliente / PCO</th>
                    <th className="glass-header">Responsável</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((mov) => {
                    const isSaida = mov.type === 'saida';
                    return (
                      <tr key={mov.id}>
                        <td className="whitespace-nowrap text-muted-foreground">
                          {format(new Date(mov.created_at), "dd/MM/yyyy HH:mm")}
                        </td>
                        <td>
                          <Badge variant={isSaida ? "destructive" : "default"} className="flex w-fit items-center gap-1">
                            {isSaida ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                            {isSaida ? "Saída" : "Devolução"}
                          </Badge>
                        </td>
                        <td>
                          <span className="font-medium text-foreground">{mov.bar?.name}</span>
                          <span className="text-muted-foreground ml-2 text-xs font-mono">({mov.bar?.auxiliary_code})</span>
                        </td>
                        <td className={`text-right font-bold font-mono ${isSaida ? "text-danger" : "text-success"}`}>
                          {isSaida ? "-" : "+"}{(mov.length_mm / 1000).toFixed(2)} m
                        </td>
                        <td>
                          <div className="text-sm font-medium text-foreground">{mov.client || "-"}</div>
                          <div className="text-xs text-muted-foreground">PCO: {mov.pco || "-"}</div>
                        </td>
                        <td className="text-muted-foreground">{mov.responsible || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {/* Mobile View */}
              <div className="md:hidden flex flex-col gap-3 p-3 bg-muted/10">
                {movements.map((mov) => {
                  const isSaida = mov.type === 'saida';
                  return (
                    <div key={mov.id} className="border border-border rounded-md p-4 bg-card shadow-sm flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <Badge variant={isSaida ? "destructive" : "default"} className="flex w-fit items-center gap-1">
                          {isSaida ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                          {isSaida ? "Saída" : "Devolução"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{format(new Date(mov.created_at), "dd/MM/yyyy HH:mm")}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-primary font-display">{mov.bar?.name}</div>
                        <div className="text-xs font-mono text-muted-foreground">{mov.bar?.auxiliary_code}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm bg-muted/30 p-3 rounded-md">
                        <div>
                          <span className="block text-xs text-muted-foreground">Movimentação</span>
                          <span className={`font-bold ${isSaida ? "text-danger" : "text-success"}`}>
                            {isSaida ? "-" : "+"}{(mov.length_mm / 1000).toFixed(2)} m
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs text-muted-foreground">Responsável</span>
                          <span className="text-foreground">{mov.responsible || "-"}</span>
                        </div>
                        <div className="col-span-2 border-t border-border mt-1 pt-2">
                          <span className="block text-xs text-muted-foreground mb-1">Cliente / PCO</span>
                          <span className="text-foreground">{mov.client || "-"} {mov.pco ? `(PCO: ${mov.pco})` : ""}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
