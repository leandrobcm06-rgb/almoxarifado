import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/app/cobre/pedacos")({
  head: () => ({ meta: [{ title: "Pedaços de Cobre | Almoxarifado" }] }),
  component: CopperPieces,
});

function CopperPieces() {
  const [pieces, setPieces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadPieces() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("copper_pieces")
        .select("*, bar:copper_bars(name, auxiliary_code)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPieces(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar pedaços:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPieces();
  }, []);

  const filteredPieces = pieces.filter(p => 
    p.bar?.name.toLowerCase().includes(search.toLowerCase()) || 
    p.bar?.auxiliary_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Pedaços</h1>
          <p className="text-muted-foreground">Visualize todos os pedaços disponíveis ou encerrados em estoque.</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Pesquisar por nome da barra ou código..." 
          className="pl-9 w-full md:w-[350px]"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pedaços de Cobre</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center p-8 text-muted-foreground">Carregando pedaços...</div>
          ) : filteredPieces.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">Nenhum pedaço encontrado.</div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Barra Origem</TableHead>
                    <TableHead>Comprimento Atual (m)</TableHead>
                    <TableHead>Situação</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead>Observações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPieces.map((piece) => (
                    <TableRow key={piece.id}>
                      <TableCell className="font-medium">
                        {piece.bar?.name} 
                        <span className="text-muted-foreground ml-2 text-xs">({piece.bar?.auxiliary_code})</span>
                      </TableCell>
                      <TableCell>{(piece.current_length_mm / 1000).toFixed(2)} m</TableCell>
                      <TableCell>
                        <Badge variant={piece.status === 'disponivel' ? 'default' : 'secondary'}>
                          {piece.status === 'disponivel' ? 'Disponível' : 'Encerrado'}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(piece.created_at), "dd/MM/yyyy HH:mm")}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {piece.notes || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
