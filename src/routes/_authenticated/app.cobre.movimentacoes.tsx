import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Scissors, History } from "lucide-react";
import Modal from "@/components/Modal/Modal";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import EmptyState from "@/components/UI/EmptyState";
import Skeleton from "@/components/UI/Skeleton";

export const Route = createFileRoute("/_authenticated/app/cobre/movimentacoes")({
  head: () => ({ meta: [{ title: "Movimentações de Cobre | BCM Stock" }] }),
  component: CobreMovimentacoes,
});

function CobreMovimentacoes() {
  const [movements, setMovements] = useState<any[]>([]);
  const [availablePieces, setAvailablePieces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [type, setType] = useState("saida");

  // Form states
  const [selectedPieceId, setSelectedPieceId] = useState("");
  const [lengthM, setLengthM] = useState("");
  const [clientName, setClientName] = useState("");
  const [pco, setPco] = useState("");
  const [userRequesting, setUserRequesting] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const { data: movs, error: movsError } = await supabase
        .from("copper_movements" as any)
        .select(`
          *,
          piece:copper_pieces(id, bar:copper_bars(name, auxiliary_code))
        `)
        .order("created_at", { ascending: false });

      if (movsError) throw movsError;
      setMovements(movs || []);

      const { data: pieces, error: piecesError } = await supabase
        .from("copper_pieces" as any)
        .select(`
          id, current_length_mm, status,
          bar:copper_bars(name, auxiliary_code)
        `)
        .eq("status", "disponivel");

      if (piecesError) throw piecesError;
      setAvailablePieces(pieces || []);
    } catch (error: any) {
      toast.error("Erro ao carregar movimentações: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleRegisterMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const piece = availablePieces.find(p => p.id === selectedPieceId);
      if (!piece && type === "saida") throw new Error("Selecione um pedaço válido");

      const lengthNum = Number(lengthM);

      if (type === "saida") {
        if (lengthNum * 1000 > piece.current_length_mm) {
          throw new Error(`Não há comprimento suficiente. O pedaço tem apenas ${(piece.current_length_mm / 1000).toFixed(2)} m.`);
        }

        // Criar movimentação de saída
        const { error: movError } = await supabase
          .from("copper_movements" as any)
          .insert({
            piece_id: selectedPieceId,
            type: "saida",
            length_mm: Math.round(lengthNum * 1000),
            client_name: clientName,
            pco,
            user_requesting: userRequesting
          });

        if (movError) throw movError;

        // Atualizar tamanho do pedaço atual ou marcar como esgotado
        const newLength = piece.current_length_mm - Math.round(lengthNum * 1000);
        const newStatus = newLength <= 0 ? "esgotado" : "disponivel";

        const { error: pieceError } = await supabase
          .from("copper_pieces" as any)
          .update({ current_length_mm: newLength, status: newStatus })
          .eq("id", selectedPieceId);

        if (pieceError) throw pieceError;

      } else {
        throw new Error("Devolução direta requer seleção da barra original. Funcionalidade em desenvolvimento.");
      }

      toast.success("Movimentação registrada com sucesso!");
      setIsAddOpen(false);
      setLengthM(""); setClientName(""); setPco(""); setUserRequesting("");
      loadData();
    } catch (error: any) {
      toast.error("Erro: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Histórico de Movimentações</h1>
            <p className="page-subtitle">Registre saídas e cortes do estoque de cobre.</p>
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn--primary" onClick={() => setIsAddOpen(true)}>
            <Scissors size={16} className="mr-2" /> Registrar Saída
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-border">
        <div className="p-5 border-b border-border bg-muted/20">
          <h2 className="text-lg font-semibold font-display">Histórico de Cortes e Saídas</h2>
        </div>
        
        <div className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton height="40px" width="100%" />
              <Skeleton height="40px" width="100%" />
              <Skeleton height="40px" width="100%" />
            </div>
          ) : movements.length === 0 ? (
            <EmptyState 
              icon={History} 
              title="Nenhuma movimentação registrada" 
              description="Você ainda não registrou nenhum corte ou saída de cobre."
            />
          ) : (
            <div className="table-responsive border-0 shadow-none rounded-none">
              <table className="table table--hover m-0">
                <thead>
                  <tr>
                    <th className="glass-header">Data</th>
                    <th className="glass-header">Barra Origem</th>
                    <th className="glass-header">Tamanho Cortado</th>
                    <th className="glass-header">Cliente</th>
                    <th className="glass-header">PCO</th>
                    <th className="glass-header">Solicitante</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((mov) => (
                    <tr key={mov.id}>
                      <td className="whitespace-nowrap text-muted-foreground">{format(new Date(mov.created_at), "dd/MM/yyyy HH:mm")}</td>
                      <td>
                        <span className="font-semibold text-foreground">{mov.piece?.bar?.name}</span>
                        <span className="text-muted-foreground ml-2 text-xs font-mono">({mov.piece?.bar?.auxiliary_code})</span>
                      </td>
                      <td>
                        <Badge variant="destructive">-{((mov.length_mm || 0) / 1000).toFixed(2)} m</Badge>
                      </td>
                      <td className="text-foreground font-medium">{mov.client_name}</td>
                      <td className="text-foreground">{mov.pco || '-'}</td>
                      <td className="text-foreground">{mov.user_requesting}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="md:hidden flex flex-col gap-3 p-3 bg-muted/10">
                {movements.map((mov) => (
                  <div key={mov.id} className="border border-border rounded-md p-4 bg-card shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-muted-foreground">{format(new Date(mov.created_at), "dd/MM/yyyy HH:mm")}</span>
                      <Badge variant="destructive">-{((mov.length_mm || 0) / 1000).toFixed(2)} m</Badge>
                    </div>
                    <div>
                      <div className="font-semibold text-primary font-display">{mov.piece?.bar?.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{mov.piece?.bar?.auxiliary_code}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm bg-muted/30 p-3 rounded-md mt-1">
                      <div>
                        <span className="block text-xs text-muted-foreground">Cliente</span>
                        <span className="text-foreground">{mov.client_name}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground">PCO</span>
                        <span className="text-foreground">{mov.pco || '-'}</span>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-border mt-1">
                        <span className="block text-xs text-muted-foreground mb-1">Solicitante</span>
                        <span className="text-foreground">{mov.user_requesting}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Registrar Saída (Corte)" size="md">
        <form onSubmit={handleRegisterMovement}>
          <div className="form-group">
            <label className="form-label">Pedaço a ser cortado</label>
            <Select value={selectedPieceId} onValueChange={setSelectedPieceId}>
              <SelectTrigger className="form-input h-10">
                <SelectValue placeholder="Selecione um pedaço disponível..." />
              </SelectTrigger>
              <SelectContent>
                {availablePieces.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.bar?.name} ({p.bar?.auxiliary_code}) - {(p.current_length_mm / 1000).toFixed(2)} m disp.
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Tamanho do Corte (m)</label>
              <input type="number" required min="0.01" step="0.01" placeholder="Ex: 0.5" className="form-input" value={lengthM} onChange={e => setLengthM(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">PCO (Obra)</label>
              <input placeholder="Ex: PCO-1234" className="form-input" value={pco} onChange={e => setPco(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Cliente</label>
            <input required placeholder="Nome do cliente" className="form-input" value={clientName} onChange={e => setClientName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Solicitante</label>
            <input required placeholder="Quem solicitou o material" className="form-input" value={userRequesting} onChange={e => setUserRequesting(e.target.value)} />
          </div>
          <div className="form-actions mt-6">
            <button type="button" className="btn btn--ghost" onClick={() => setIsAddOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>{submitting ? "Registrando..." : "Registrar Saída"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
