import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/app/cobre/saida")({
  head: () => ({ meta: [{ title: "Saída de Cobre | BCM Stock" }] }),
  component: CopperExit,
});

function CopperExit() {
  const { user } = useAuth();
  const [pieces, setPieces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [selectedPieceId, setSelectedPieceId] = useState("");
  const [cutLength, setCutLength] = useState("");
  const [client, setClient] = useState("");
  const [pco, setPco] = useState("");
  const [responsible, setResponsible] = useState("");
  const [notes, setNotes] = useState("");

  async function loadAvailablePieces() {
    try {
      const { data, error } = await supabase
        .from("copper_pieces")
        .select("*, bar:copper_bars(name, auxiliary_code)")
        .eq("status", "disponivel")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPieces(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar pedaços disponíveis: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAvailablePieces();
  }, []);

  const handleRegisterExit = async (e: React.FormEvent) => {
    e.preventDefault();
    const piece = pieces.find(p => p.id === selectedPieceId);
    if (!piece) return toast.error("Selecione um pedaço.");
    
    const cut = Number(cutLength) * 1000;
    if (cut <= 0) return toast.error("O tamanho do corte deve ser maior que zero.");
    if (cut > piece.current_length_mm) return toast.error("O corte não pode ser maior que o tamanho disponível no pedaço selecionado.");

    setSubmitting(true);
    
    try {
      const newLength = piece.current_length_mm - cut;
      const newStatus = newLength === 0 ? 'encerrado' : 'disponivel';

      // 1. Atualizar pedaço
      const { error: pieceError } = await supabase
        .from("copper_pieces")
        .update({ current_length_mm: newLength, status: newStatus })
        .eq("id", piece.id);
      
      if (pieceError) throw pieceError;

      // 2. Registrar movimentação (Saída) - USANDO AS COLUNAS CORRETAS: client e responsible
      const { error: movError } = await supabase
        .from("copper_movements")
        .insert({
          piece_id: piece.id,
          bar_id: piece.bar_id,
          type: 'saida',
          length_mm: cut,
          client: client,
          pco: pco,
          responsible: responsible,
          notes: notes
        });
      
      if (movError) throw movError;

      toast.success("Saída de material registrada com sucesso!");
      
      // Reset form
      setSelectedPieceId("");
      setCutLength("");
      setClient("");
      setPco("");
      setResponsible("");
      setNotes("");
      
      // Reload pieces
      loadAvailablePieces();

    } catch (error: any) {
      toast.error("Erro ao registrar saída: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPiece = pieces.find(p => p.id === selectedPieceId);

  return (
    <div className="page-container animate-fade-in max-w-3xl mx-auto">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Saída de Material (Corte)</h1>
            <p className="page-subtitle">Registre um corte para retirar material de um pedaço existente.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 md:p-8 rounded-xl border border-border">
        <form onSubmit={handleRegisterExit} className="space-y-8">
          
          <div className="space-y-5">
            <h3 className="font-semibold text-lg text-foreground border-b border-border pb-2 font-display">
              Material de Origem
            </h3>
            <div className="form-group">
              <label className="form-label">Pedaço a ser cortado</label>
              <Select disabled={loading} value={selectedPieceId} onValueChange={setSelectedPieceId} required>
                <SelectTrigger className="form-input bg-card h-11">
                  <SelectValue placeholder="Selecione uma barra/pedaço disponível..." />
                </SelectTrigger>
                <SelectContent>
                  {pieces.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.bar?.name} ({p.bar?.auxiliary_code}) - Restante: {(p.current_length_mm / 1000).toFixed(2)} m
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPiece && (
                <p className="text-xs text-muted-foreground mt-1">
                  Corte máximo permitido: <strong>{(selectedPiece.current_length_mm / 1000).toFixed(2)} m</strong>. Se você cortar o total, o pedaço será encerrado automaticamente.
                </p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Tamanho do Corte Retirado (m)</label>
              <input type="number" step="0.01" required min="0.01" max={selectedPiece ? (selectedPiece.current_length_mm / 1000) : undefined} className="form-input" value={cutLength} onChange={e => setCutLength(e.target.value)} />
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="font-semibold text-lg text-foreground border-b border-border pb-2 font-display">
              Destino e Responsável
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-group">
                <label className="form-label">Cliente</label>
                <input required placeholder="Ex: Nome da Empresa" className="form-input" value={client} onChange={e => setClient(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">PCO (Obra)</label>
                <input required placeholder="Ex: 123456" className="form-input" value={pco} onChange={e => setPco(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Responsável pela retirada</label>
              <input required placeholder="Nome do funcionário ou solicitante" className="form-input" value={responsible} onChange={e => setResponsible(e.target.value)} />
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="font-semibold text-lg text-foreground border-b border-border pb-2 font-display">
              Observações Adicionais
            </h3>
            <div className="form-group">
              <textarea placeholder="Detalhes adicionais sobre a saída (opcional)" className="form-input min-h-[100px]" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>

          <button type="submit" className="btn btn--primary w-full py-3 text-base" disabled={submitting || loading}>
            {submitting ? "Registrando Saída..." : "Registrar Saída"}
          </button>
        </form>
      </div>
    </div>
  );
}
