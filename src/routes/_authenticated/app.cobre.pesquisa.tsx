import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDownRight, ArrowUpRight, Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/cobre/pesquisa")({
  head: () => ({ meta: [{ title: "Pesquisa Rápida Cobre | Almoxarifado" }] }),
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pesquisa Avançada</h1>
          <p className="text-muted-foreground">Encontre movimentações rapidamente por Cliente, PCO, ou Código da Barra.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Digite o nome do cliente, número do PCO, código ou nome da barra..." 
                className="pl-9 w-full"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading}>
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
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Barra Original</TableHead>
                      <TableHead className="text-right">Tamanho</TableHead>
                      <TableHead>Cliente / PCO</TableHead>
                      <TableHead>Responsável</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((mov) => {
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
      )}
    </div>
  );
}
