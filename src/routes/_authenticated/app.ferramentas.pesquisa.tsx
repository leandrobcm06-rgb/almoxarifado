import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink, HardHat, FileText } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

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
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pesquisa Omnichannel</h1>
        <p className="text-muted-foreground">Encontre ferramentas rapidamente por qualquer atributo, funcionário ou cliente.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Digite o nome, patrimônio, categoria, marca, funcionário ou cliente..." 
                className="pl-10 h-12 text-lg w-full shadow-sm"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8" disabled={loading}>
              {loading ? "Buscando..." : "Pesquisar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados da Pesquisa</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center p-8 text-muted-foreground">Procurando...</div>
            ) : results.length === 0 ? (
              <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                Nenhum resultado encontrado para "{query}".
              </div>
            ) : (
              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome / Patrimônio</TableHead>
                      <TableHead>Categoria / Marca</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Situação</TableHead>
                      <TableHead>Último Empréstimo (Atual)</TableHead>
                      <TableHead className="text-right">Ações Rápidas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((tool) => {
                      const loan = tool.active_loan;
                      return (
                        <TableRow key={tool.id}>
                          <TableCell className="font-medium">
                            <div className="text-base">{tool.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">{tool.patrimony_number || "S/N"}</div>
                          </TableCell>
                          <TableCell>
                            <div>{tool.category}</div>
                            <div className="text-xs text-muted-foreground">{tool.brand}</div>
                          </TableCell>
                          <TableCell>
                            <span className="capitalize">{tool.condition}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              tool.status === 'disponivel' ? 'default' :
                              tool.status === 'emprestada' ? 'secondary' : 'destructive'
                            }>
                              {tool.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {loan ? (
                              <div className="text-sm">
                                <span className="font-medium">{loan.employee}</span>
                                {loan.client && <span className="text-muted-foreground block text-xs">{loan.client} {loan.pco ? `(PCO: ${loan.pco})` : ''}</span>}
                                <span className="text-xs text-muted-foreground block mt-1">Desde: {format(new Date(loan.loan_date), "dd/MM/yy")}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link to={`/app/ferramentas/lista`} search={{ q: tool.name }} title="Abrir no Cadastro">
                                <Button variant="outline" size="sm">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link to={`/app/ferramentas/historico`} search={{ q: tool.name }} title="Ver Histórico">
                                <Button variant="outline" size="sm">
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
