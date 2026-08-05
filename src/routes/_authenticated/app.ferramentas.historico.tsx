import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FilterX, ArrowUpRight, ArrowDownRight, PackagePlus, Search, History } from "lucide-react";
import { toast } from "sonner";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/app/ferramentas/historico")({
  head: () => ({ meta: [{ title: "Histórico de Movimentações | Ferramentaria" }] }),
  component: ToolsHistory,
});

function ToolsHistory() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterTool, setFilterTool] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterClient, setFilterClient] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDateStart, setFilterDateStart] = useState("");
  const [filterDateEnd, setFilterDateEnd] = useState("");

  async function loadMovements() {
    setLoading(true);
    try {
      let query = supabase
        .from("tool_movements")
        .select("*, tool:tools(name, patrimony_number)")
        .order("created_at", { ascending: false });

      if (filterType !== "all") {
        query = query.eq("type", filterType);
      }
      if (filterEmployee) {
        query = query.ilike("employee", `%${filterEmployee}%`);
      }
      if (filterClient) {
        query = query.or(`client.ilike.%${filterClient}%,pco.ilike.%${filterClient}%`);
      }
      if (filterDateStart) {
        query = query.gte("created_at", new Date(filterDateStart).toISOString());
      }
      if (filterDateEnd) {
        // add 1 day to include the end date fully
        const end = new Date(filterDateEnd);
        end.setDate(end.getDate() + 1);
        query = query.lt("created_at", end.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Client-side filter for Tool Name (since it's a join)
      let results = data || [];
      if (filterTool) {
        results = results.filter((m: any) => 
          m.tool?.name.toLowerCase().includes(filterTool.toLowerCase()) || 
          m.tool?.patrimony_number?.toLowerCase().includes(filterTool.toLowerCase())
        );
      }
      
      setMovements(results);
    } catch (error: any) {
      console.error("Erro ao carregar histórico:", error);
      toast.error("Erro ao carregar auditoria.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMovements();
  }, [filterType, filterDateStart, filterDateEnd]); // Re-fetch on explicit filters changes

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();
    loadMovements();
  };

  const clearFilters = () => {
    setFilterTool("");
    setFilterEmployee("");
    setFilterClient("");
    setFilterType("all");
    setFilterDateStart("");
    setFilterDateEnd("");
    setTimeout(loadMovements, 0); // Load after state clears
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Auditoria e Histórico</h1>
            <p className="page-subtitle">Registro permanente de todas as movimentações da ferramentaria.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-5 rounded-xl mb-6 border border-border">
        <div className="mb-4">
          <h2 className="text-lg font-semibold font-display text-foreground">Filtros de Pesquisa</h2>
        </div>
        <form onSubmit={handleSearchClick} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="form-group mb-0 lg:col-span-2">
              <input placeholder="Buscar Ferramenta ou Patrimônio..." className="form-input" value={filterTool} onChange={e => setFilterTool(e.target.value)} />
            </div>
            <div className="form-group mb-0 lg:col-span-1">
              <input placeholder="Funcionário..." className="form-input" value={filterEmployee} onChange={e => setFilterEmployee(e.target.value)} />
            </div>
            <div className="form-group mb-0 lg:col-span-1">
              <input placeholder="Cliente ou PCO..." className="form-input" value={filterClient} onChange={e => setFilterClient(e.target.value)} />
            </div>
            <div className="form-group mb-0 lg:col-span-2 flex gap-2">
              <input type="date" className="form-input" value={filterDateStart} onChange={e => setFilterDateStart(e.target.value)} title="Data Inicial" />
              <input type="date" className="form-input" value={filterDateEnd} onChange={e => setFilterDateEnd(e.target.value)} title="Data Final" />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2 border-t border-border mt-2">
            <div className="w-full sm:w-[250px] form-group mb-0">
              <select className="form-input" value={filterType} onChange={(e: any) => setFilterType(e.target.value)}>
                <option value="all">Todas as Movimentações</option>
                <option value="cadastro">Cadastro Inicial</option>
                <option value="emprestimo">Empréstimos</option>
                <option value="devolucao">Devoluções</option>
              </select>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button type="button" className="btn btn--ghost w-full sm:w-auto" onClick={clearFilters}>
                <FilterX size={16} className="mr-2" /> Limpar
              </button>
              <button type="submit" className="btn btn--primary w-full sm:w-auto">
                <Search size={16} className="mr-2" /> Pesquisar
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-border">
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
              description="Tente ajustar ou limpar os filtros para encontrar os registros."
              action={
                <button className="btn btn--primary" onClick={clearFilters}>
                  Limpar Filtros
                </button>
              }
            />
          ) : (
            <div className="table-responsive border-0 shadow-none rounded-none">
              <table className="table table--hover m-0">
                <thead>
                  <tr>
                    <th className="glass-header">Data/Hora</th>
                    <th className="glass-header">Tipo</th>
                    <th className="glass-header">Ferramenta</th>
                    <th className="glass-header">Funcionário</th>
                    <th className="glass-header">Cliente / PCO</th>
                    <th className="glass-header">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((mov) => {
                    const isSaida = mov.type === 'emprestimo';
                    const isCadastro = mov.type === 'cadastro';
                    const isDevolucao = mov.type === 'devolucao';
                    
                    return (
                      <tr key={mov.id}>
                        <td className="whitespace-nowrap text-muted-foreground">
                          {format(new Date(mov.created_at), "dd/MM/yyyy HH:mm")}
                        </td>
                        <td>
                          <Badge variant={isSaida ? "destructive" : isDevolucao ? "default" : "secondary"} className="flex w-fit items-center gap-1">
                            {isSaida && <ArrowUpRight className="h-3 w-3" />}
                            {isDevolucao && <ArrowDownRight className="h-3 w-3" />}
                            {isCadastro && <PackagePlus className="h-3 w-3" />}
                            <span className="capitalize">{mov.type}</span>
                          </Badge>
                        </td>
                        <td className="font-medium text-foreground">
                          {mov.tool?.name} <span className="text-muted-foreground font-mono font-normal text-xs ml-1">({mov.tool?.patrimony_number || "S/N"})</span>
                        </td>
                        <td className="text-foreground">{mov.employee || "-"}</td>
                        <td>
                          {mov.client || mov.pco ? (
                            <>
                              <div className="text-sm font-medium text-foreground">{mov.client || "-"}</div>
                              <div className="text-xs text-muted-foreground">PCO: {mov.pco || "-"}</div>
                            </>
                          ) : <span className="text-muted-foreground">-</span>}
                        </td>
                        <td>
                          {mov.condition ? (
                            <span className={`capitalize font-medium ${
                              mov.condition === 'danificada' || mov.condition === 'ruim' ? 'text-danger' :
                              mov.condition === 'manutencao' ? 'text-warning' : 'text-success'
                            }`}>
                              {mov.condition}
                            </span>
                          ) : <span className="text-muted-foreground">-</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="md:hidden flex flex-col gap-3 p-3 bg-muted/10">
                {movements.map((mov) => {
                  const isSaida = mov.type === 'emprestimo';
                  const isCadastro = mov.type === 'cadastro';
                  const isDevolucao = mov.type === 'devolucao';
                  return (
                    <div key={mov.id} className="border border-border rounded-xl p-4 bg-card shadow-sm flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <Badge variant={isSaida ? "destructive" : isDevolucao ? "default" : "secondary"} className="flex w-fit items-center gap-1">
                          {isSaida && <ArrowUpRight className="h-3 w-3" />}
                          {isDevolucao && <ArrowDownRight className="h-3 w-3" />}
                          {isCadastro && <PackagePlus className="h-3 w-3" />}
                          <span className="capitalize">{mov.type}</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground">{format(new Date(mov.created_at), "dd/MM/yyyy HH:mm")}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground font-display">{mov.tool?.name}</div>
                        <div className="text-xs font-mono text-muted-foreground">{mov.tool?.patrimony_number || "S/N"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm bg-muted/30 p-3 rounded-md">
                        <div>
                          <span className="block text-xs text-muted-foreground">Funcionário</span>
                          <span className="font-medium text-foreground">{mov.employee || "-"}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-muted-foreground">Estado</span>
                          <span className={`capitalize font-medium ${
                            mov.condition === 'danificada' || mov.condition === 'ruim' ? 'text-danger' :
                            mov.condition === 'manutencao' ? 'text-warning' : 'text-success'
                          }`}>{mov.condition || "-"}</span>
                        </div>
                        <div className="col-span-2 pt-2 border-t border-border mt-1">
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
