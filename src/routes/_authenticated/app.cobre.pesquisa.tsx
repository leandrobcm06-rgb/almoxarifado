import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowDownRight, ArrowUpRight, Search, FileSearch } from "lucide-react";
import { toast } from "sonner";
import EmptyState from "@/components/UI/EmptyState";
import Skeleton from "@/components/UI/Skeleton";

export const Route = createFileRoute("/_authenticated/app/cobre/pesquisa")({
  head: () => ({ meta: [{ title: "Pesquisa Rápida Cobre | BCM Stock" }] }),
  component: CopperSearch,
});

function CopperSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return toast.error("Digite algo para pesquisar.");

    setLoading(true);
    setHasSearched(true);
    
    try {
      // Procurar em movimentações por Cliente, PCO ou nome/código da barra relacionada
      const searchTerm = `%${query}%`;
      
      const { data, error } = await supabase
        .from("copper_movements")
        .select("*, bar:copper_bars!inner(name, auxiliary_code)")
        .or(`client.ilike.${searchTerm},pco.ilike.${searchTerm},bar.name.ilike.${searchTerm},bar.auxiliary_code.ilike.${searchTerm}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (error: any) {
      console.error("Erro na pesquisa:", error);
      toast.error("Erro ao realizar pesquisa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Pesquisa Avançada</h1>
            <p className="page-subtitle">Encontre movimentações rapidamente por Cliente, PCO, ou Código da Barra.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-border mb-8">
        <form onSubmit={handleSearch} className="flex gap-3 items-end">
          <div className="relative flex-1 form-group mb-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input 
              placeholder="Digite o nome do cliente, número do PCO, código ou nome da barra..." 
              className="form-input pl-10 h-12 text-base"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn--primary h-12 px-6" disabled={loading}>
            {loading ? "Buscando..." : "Pesquisar"}
          </button>
        </form>
      </div>

      {hasSearched && (
        <div className="glass-panel rounded-xl overflow-hidden border border-border animate-fade-in-up">
          <div className="p-5 border-b border-border bg-muted/20">
            <h2 className="text-lg font-semibold font-display">Resultados da Pesquisa</h2>
          </div>
          
          <div className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                <Skeleton height="40px" width="100%" />
                <Skeleton height="40px" width="100%" />
                <Skeleton height="40px" width="100%" />
              </div>
            ) : results.length === 0 ? (
              <EmptyState 
                icon={FileSearch} 
                title="Nenhum resultado encontrado" 
                description={`Não encontramos nenhuma movimentação contendo "${query}".`}
              />
            ) : (
              <div className="table-responsive border-0 shadow-none rounded-none">
                <table className="table table--hover m-0">
                  <thead>
                    <tr>
                      <th className="glass-header">Data/Hora</th>
                      <th className="glass-header">Tipo</th>
                      <th className="glass-header">Barra Original</th>
                      <th className="glass-header text-right">Tamanho</th>
                      <th className="glass-header">Cliente / PCO</th>
                      <th className="glass-header">Responsável</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((mov) => {
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
                            <span className="font-semibold text-foreground">{mov.bar?.name}</span>
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
                <div className="md:hidden flex flex-col gap-3 p-3 bg-muted/10">
                  {results.map((mov) => {
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
                        <div className="grid grid-cols-2 gap-2 text-sm bg-muted/30 p-3 rounded-md mt-1">
                          <div>
                            <span className="block text-xs text-muted-foreground">Tamanho</span>
                            <span className={`font-bold ${isSaida ? "text-danger" : "text-success"}`}>
                              {isSaida ? "-" : "+"}{(mov.length_mm / 1000).toFixed(2)} m
                            </span>
                          </div>
                          <div>
                            <span className="block text-xs text-muted-foreground">Responsável</span>
                            <span className="text-foreground">{mov.responsible || "-"}</span>
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
      )}
    </div>
  );
}
