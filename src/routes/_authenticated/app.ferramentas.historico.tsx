import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterX, ArrowUpRight, ArrowDownRight, Wrench, PackagePlus } from "lucide-react";
import { toast } from "sonner";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Auditoria e Histórico</h1>
        <p className="text-muted-foreground">Registro permanente de todas as movimentações da ferramentaria.</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Filtros de Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearchClick} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="space-y-2 lg:col-span-2">
                <Input placeholder="Buscar Ferramenta ou Patrimônio..." value={filterTool} onChange={e => setFilterTool(e.target.value)} />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <Input placeholder="Funcionário..." value={filterEmployee} onChange={e => setFilterEmployee(e.target.value)} />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <Input placeholder="Cliente ou PCO..." value={filterClient} onChange={e => setFilterClient(e.target.value)} />
              </div>
              <div className="space-y-2 lg:col-span-2 flex gap-2">
                <Input type="date" value={filterDateStart} onChange={e => setFilterDateStart(e.target.value)} title="Data Inicial" />
                <Input type="date" value={filterDateEnd} onChange={e => setFilterDateEnd(e.target.value)} title="Data Final" />
              </div>
            </div>
            
            <div className="flex gap-4 items-center justify-between">
              <div className="w-[200px]">
                <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de Movimento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Movimentações</SelectItem>
                    <SelectItem value="cadastro">Cadastro Inicial</SelectItem>
                    <SelectItem value="emprestimo">Empréstimos</SelectItem>
                    <SelectItem value="devolucao">Devoluções</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={clearFilters}>
                  <FilterX className="h-4 w-4 mr-2" /> Limpar
                </Button>
                <Button type="submit">Pesquisar</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
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
                    <TableHead>Ferramenta</TableHead>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Cliente / PCO</TableHead>
                    <TableHead>Estado da Ferramenta</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((mov) => {
                    const isSaida = mov.type === 'emprestimo';
                    const isCadastro = mov.type === 'cadastro';
                    const isDevolucao = mov.type === 'devolucao';
                    
                    return (
                      <TableRow key={mov.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(mov.created_at), "dd/MM/yyyy HH:mm")}
                        </TableCell>
                        <TableCell>
                          <Badge variant={isSaida ? "destructive" : isDevolucao ? "default" : "secondary"} className="flex w-fit items-center gap-1">
                            {isSaida && <ArrowUpRight className="h-3 w-3" />}
                            {isDevolucao && <ArrowDownRight className="h-3 w-3" />}
                            {isCadastro && <PackagePlus className="h-3 w-3" />}
                            <span className="capitalize">{mov.type}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {mov.tool?.name} <span className="text-muted-foreground font-normal text-xs">({mov.tool?.patrimony_number || "S/N"})</span>
                        </TableCell>
                        <TableCell>{mov.employee || "-"}</TableCell>
                        <TableCell>
                          {mov.client || mov.pco ? (
                            <>
                              <div className="text-sm font-medium">{mov.client || "-"}</div>
                              <div className="text-xs text-muted-foreground">PCO: {mov.pco || "-"}</div>
                            </>
                          ) : "-"}
                        </TableCell>
                        <TableCell>
                          {mov.condition ? (
                            <span className={`capitalize font-medium ${
                              mov.condition === 'danificada' || mov.condition === 'ruim' ? 'text-red-500' :
                              mov.condition === 'manutencao' ? 'text-orange-500' : 'text-green-500'
                            }`}>
                              {mov.condition}
                            </span>
                          ) : "-"}
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
    </div>
  );
}
