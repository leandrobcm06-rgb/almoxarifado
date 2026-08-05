import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Search, PackageX } from "lucide-react";
import { format } from "date-fns";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/app/cobre/pedacos")({
  head: () => ({ meta: [{ title: "Pedaços de Cobre | BCM Stock" }] }),
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
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Gerenciamento de Pedaços</h1>
            <p className="page-subtitle">Visualize todos os pedaços disponíveis ou encerrados em estoque.</p>
          </div>
        </div>
      </div>

      <div className="filter-bar mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input 
          placeholder="Pesquisar por nome da barra ou código..." 
          className="form-input pl-9 w-full md:w-[350px]"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-border">
        <div className="p-5 border-b border-border bg-muted/20">
          <h2 className="text-lg font-semibold font-display">Pedaços de Cobre</h2>
        </div>
        
        <div className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton height="40px" width="100%" />
              <Skeleton height="40px" width="100%" />
              <Skeleton height="40px" width="100%" />
            </div>
          ) : filteredPieces.length === 0 ? (
            <EmptyState 
              icon={PackageX} 
              title="Nenhum pedaço encontrado" 
              description="A pesquisa não retornou nenhum resultado para os filtros atuais."
            />
          ) : (
            <div className="table-responsive border-0 shadow-none rounded-none">
              <table className="table table--hover m-0">
                <thead>
                  <tr>
                    <th className="glass-header">Barra Origem</th>
                    <th className="glass-header text-right">Comprimento Atual</th>
                    <th className="glass-header">Situação</th>
                    <th className="glass-header">Data de Cadastro</th>
                    <th className="glass-header w-[250px]">Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPieces.map((piece) => (
                    <tr key={piece.id}>
                      <td>
                        <span className="font-semibold text-foreground">{piece.bar?.name}</span>
                        <span className="text-muted-foreground ml-2 text-xs font-mono">({piece.bar?.auxiliary_code})</span>
                      </td>
                      <td className="text-right font-medium">{(piece.current_length_mm / 1000).toFixed(2)} m</td>
                      <td>
                        <Badge variant={piece.status === 'disponivel' ? 'default' : 'secondary'}>
                          {piece.status === 'disponivel' ? 'Disponível' : 'Encerrado'}
                        </Badge>
                      </td>
                      <td className="text-muted-foreground text-sm">{format(new Date(piece.created_at), "dd/MM/yyyy HH:mm")}</td>
                      <td className="text-muted-foreground text-sm truncate max-w-[250px]" title={piece.notes}>
                        {piece.notes || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="md:hidden flex flex-col gap-3 p-3 bg-muted/10">
                {filteredPieces.map((piece) => (
                  <div key={piece.id} className="border border-border rounded-md p-4 bg-card shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-primary font-display">{piece.bar?.name}</div>
                        <div className="text-xs font-mono text-muted-foreground">{piece.bar?.auxiliary_code}</div>
                      </div>
                      <Badge variant={piece.status === 'disponivel' ? 'default' : 'secondary'}>
                        {piece.status === 'disponivel' ? 'Disponível' : 'Encerrado'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm bg-muted/30 p-3 rounded-md">
                      <div>
                        <span className="block text-xs text-muted-foreground">Comprimento</span>
                        <span className="font-medium text-foreground">{(piece.current_length_mm / 1000).toFixed(2)} m</span>
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground">Cadastro</span>
                        <span className="text-foreground">{format(new Date(piece.created_at), "dd/MM/yy")}</span>
                      </div>
                      {piece.notes && (
                        <div className="col-span-2 pt-2 border-t border-border mt-1">
                          <span className="block text-xs text-muted-foreground mb-1">Observações</span>
                          <span className="text-xs text-foreground italic">{piece.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
