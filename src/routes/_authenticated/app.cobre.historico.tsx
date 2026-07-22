import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowDownRight, ArrowUpRight, FilterX } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/cobre/historico")({
  head: () => ({ meta: [{ title: "Histórico de Cobre | Almoxarifado" }] }),
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Extrato de Movimentações</h1>
          <p className="text-muted-foreground">Histórico completo de entradas e saídas de pedaços de cobre.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <CardTitle>Histórico de Transações</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={filterPeriod} onValueChange={(v: any) => setFilterPeriod(v)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo o período</SelectItem>
                  <SelectItem value="current">Mês Atual</SelectItem>
                  <SelectItem value="previous">Mês Anterior</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="saida">Saídas (Cortes)</SelectItem>
                  <SelectItem value="devolucao">Devoluções</SelectItem>
                </SelectContent>
              </Select>

              {(filterType !== "all" || filterPeriod !== "all") && (
                <Button variant="ghost" size="icon" onClick={clearFilters} title="Limpar filtros">
                  <FilterX className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center p-8 text-muted-foreground">Carregando histórico...</div>
          ) : movements.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
              Nenhuma movimentação encontrada para os filtros selecionados.
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Barra Original</TableHead>
                    <TableHead className="text-right">Movimentação</TableHead>
                    <TableHead>Cliente / PCO</TableHead>
                    <TableHead>Responsável</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((mov) => {
                    const isSaida = mov.type === 'saida';
                    return (
                      <TableRow key={mov.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(mov.created_at), "dd/MM/yyyy HH:mm")}
                        </TableCell>
                        <TableCell>
                          <Badge variant={isSaida ? "destructive" : "default"} className="flex w-fit items-center gap-1">
                            {isSaida ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                            {isSaida ? "Saída" : "Devolução"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {mov.bar?.name} <span className="text-muted-foreground font-normal text-xs">({mov.bar?.auxiliary_code})</span>
                        </TableCell>
                        <TableCell className={`text-right font-bold ${isSaida ? "text-red-500" : "text-green-500"}`}>
                          {isSaida ? "-" : "+"}{(mov.length_mm / 1000).toFixed(2)} m
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{mov.client || "-"}</div>
                          <div className="text-xs text-muted-foreground">PCO: {mov.pco || "-"}</div>
                        </TableCell>
                        <TableCell>{mov.responsible || "-"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
