import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, FileText, PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/app/ferramentas/pesquisa")({
  head: () => ({ meta: [{ title: "Pesquisa Rápida | Ferramentaria" }] }),
  component: ToolsSearch,
});

function ToolsSearch() {
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
      const searchTerm = `%${query}%`;
      
      // Busca nas Ferramentas diretamente (Nome, Patrimônio, Categoria, Marca)
      const { data: toolsData, error: toolsError } = await supabase
        .from("tools")
        .select("*")
        .or(`name.ilike.${searchTerm},patrimony_number.ilike.${searchTerm},category.ilike.${searchTerm},brand.ilike.${searchTerm}`);

      if (toolsError) throw toolsError;

      // Busca nos Empréstimos Ativos (Cliente, Funcionário) para achar a ferramenta
      const { data: loansData, error: loansError } = await supabase
        .from("tool_loans")
        .select("*, tool:tools(*)")
        .eq("status", "ativo")
        .or(`client.ilike.${searchTerm},employee.ilike.${searchTerm}`);

      if (loansError) throw loansError;

      // Unificar resultados (ferramentas) sem duplicar
      const toolMap = new Map<string, any>();

      // Se achou a ferramenta, vamos tentar achar o empréstimo ativo dela para mostrar os dados (Cliente/Funcionário)
      if (toolsData && toolsData.length > 0) {
        const toolIds = toolsData.map((t: any) => t.id);
        const { data: activeLoans } = await supabase
          .from("tool_loans")
          .select("*")
          .eq("status", "ativo")
          .in("tool_id", toolIds);

        toolsData.forEach((t: any) => {
          const loan = activeLoans?.find((l: any) => l.tool_id === t.id);
          toolMap.set(t.id, { ...t, active_loan: loan });
        });
      }

      // Adicionar as ferramentas encontradas através da busca de empréstimos
      if (loansData) {
        loansData.forEach((l: any) => {
          if (l.tool && !toolMap.has(l.tool.id)) {
            toolMap.set(l.tool.id, { ...l.tool, active_loan: l });
          }
        });
      }

      setResults(Array.from(toolMap.values()));
    } catch (error: any) {
      console.error("Erro na pesquisa:", error);
      toast.error("Erro ao realizar pesquisa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container animate-fade-in max-w-6xl mx-auto">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Pesquisa Omnichannel</h1>
            <p className="page-subtitle">Encontre ferramentas rapidamente por qualquer atributo, funcionário ou cliente.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-border mb-8">
        <form onSubmit={handleSearch} className="flex gap-3 items-end">
          <div className="relative flex-1 form-group mb-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input 
              placeholder="Digite o nome, patrimônio, categoria, marca, funcionário ou cliente..." 
              className="form-input pl-12 h-14 text-lg shadow-sm"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn--primary h-14 px-8 text-lg" disabled={loading}>
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
                <Skeleton height="60px" width="100%" />
                <Skeleton height="60px" width="100%" />
                <Skeleton height="60px" width="100%" />
              </div>
            ) : results.length === 0 ? (
              <EmptyState 
                icon={PackageSearch} 
                title="Nenhum resultado encontrado" 
                description={`Não encontramos nenhuma ferramenta ou empréstimo associado a "${query}".`}
              />
            ) : (
              <div className="table-responsive border-0 shadow-none rounded-none">
                <table className="table table--hover m-0">
                  <thead>
                    <tr>
                      <th className="glass-header">Nome / Patrimônio</th>
                      <th className="glass-header">Categoria / Marca</th>
                      <th className="glass-header">Estado</th>
                      <th className="glass-header">Situação</th>
                      <th className="glass-header">Último Empréstimo (Atual)</th>
                      <th className="glass-header text-right">Ações Rápidas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((tool) => {
                      const loan = tool.active_loan;
                      return (
                        <tr key={tool.id}>
                          <td className="font-medium">
                            <div className="text-base text-foreground">{tool.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">{tool.patrimony_number || "S/N"}</div>
                          </td>
                          <td>
                            <div className="text-foreground font-medium">{tool.category}</div>
                            <div className="text-xs text-muted-foreground">{tool.brand}</div>
                          </td>
                          <td>
                            <span className="capitalize text-foreground font-medium">{tool.condition}</span>
                          </td>
                          <td>
                            <Badge variant={
                              tool.status === 'disponivel' ? 'default' :
                              tool.status === 'emprestada' ? 'secondary' : 'destructive'
                            } className={tool.status === 'emprestada' ? 'bg-primary/20 text-primary border-primary/30' : ''}>
                              {tool.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td>
                            {loan ? (
                              <div className="text-sm">
                                <span className="font-medium text-foreground">{loan.employee}</span>
                                {loan.client && <span className="text-muted-foreground block text-xs">{loan.client} {loan.pco ? `(PCO: ${loan.pco})` : ''}</span>}
                                <span className="text-xs text-muted-foreground block mt-1">Desde: {format(new Date(loan.loan_date), "dd/MM/yy")}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </td>
                          <td className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link to={`/app/ferramentas/lista`} search={{ q: tool.name }} title="Abrir no Cadastro">
                                <button className="btn-icon">
                                  <ExternalLink size={16} />
                                </button>
                              </Link>
                              <Link to={`/app/ferramentas/historico`} search={{ q: tool.name }} title="Ver Histórico">
                                <button className="btn-icon">
                                  <FileText size={16} />
                                </button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                <div className="md:hidden flex flex-col gap-3 p-3 bg-muted/10">
                  {results.map((tool) => {
                    const loan = tool.active_loan;
                    return (
                      <div key={tool.id} className="border border-border rounded-xl p-4 bg-card shadow-sm flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-base font-semibold text-foreground font-display">{tool.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">{tool.patrimony_number || "S/N"}</div>
                          </div>
                          <Badge variant={
                            tool.status === 'disponivel' ? 'default' :
                            tool.status === 'emprestada' ? 'secondary' : 'destructive'
                          } className={tool.status === 'emprestada' ? 'bg-primary/20 text-primary border-primary/30' : ''}>
                            {tool.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm bg-muted/30 p-3 rounded-md">
                          <div>
                            <span className="block text-xs text-muted-foreground">Categoria</span>
                            <span className="font-medium text-foreground">{tool.category || "-"}</span>
                          </div>
                          <div>
                            <span className="block text-xs text-muted-foreground">Marca</span>
                            <span className="font-medium text-foreground">{tool.brand || "-"}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="block text-xs text-muted-foreground">Estado</span>
                            <span className="capitalize font-medium text-foreground">{tool.condition}</span>
                          </div>
                          {loan && (
                            <div className="col-span-2 pt-3 border-t border-border mt-1">
                              <span className="block text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Último Empréstimo (Atual)</span>
                              <div className="flex flex-col gap-0.5">
                                <span className="font-medium text-sm text-foreground">{loan.employee}</span>
                                {loan.client && <span className="text-muted-foreground text-xs">{loan.client} {loan.pco ? `(PCO: ${loan.pco})` : ''}</span>}
                                <span className="text-xs text-muted-foreground mt-1">Desde: {format(new Date(loan.loan_date), "dd/MM/yy")}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-border mt-1">
                          <Link to={`/app/ferramentas/lista`} search={{ q: tool.name }} title="Abrir no Cadastro">
                            <button className="btn btn--outline btn--sm">
                              <ExternalLink size={14} className="mr-2" /> Cadastro
                            </button>
                          </Link>
                          <Link to={`/app/ferramentas/historico`} search={{ q: tool.name }} title="Ver Histórico">
                            <button className="btn btn--outline btn--sm">
                              <FileText size={14} className="mr-2" /> Histórico
                            </button>
                          </Link>
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
