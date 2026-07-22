import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/app/cobre/saida")({
  head: () => ({ meta: [{ title: "Saída de Cobre | Almoxarifado" }] }),
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
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Saída de Material (Corte)</h1>
        <p className="text-muted-foreground">Registre um corte para retirar material de um pedaço existente.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleRegisterExit} className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="font-medium border-b pb-2">Material de Origem</h3>
              <div className="space-y-2">
                <Label>Pedaço a ser cortado</Label>
                <Select disabled={loading} value={selectedPieceId} onValueChange={setSelectedPieceId} required>
                  <SelectTrigger>
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
                  <p className="text-xs text-muted-foreground">
                    Corte máximo permitido: <strong>{(selectedPiece.current_length_mm / 1000).toFixed(2)} m</strong>. Se você cortar o total, o pedaço será encerrado automaticamente.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Tamanho do Corte Retirado (m)</Label>
                <Input type="number" step="0.01" required min="0.01" max={selectedPiece ? (selectedPiece.current_length_mm / 1000) : undefined} value={cutLength} onChange={e => setCutLength(e.target.value)} />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="font-medium border-b pb-2">Destino e Responsável</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Input required placeholder="Ex: Nome da Empresa" value={client} onChange={e => setClient(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>PCO (Obra)</Label>
                  <Input required placeholder="Ex: 123456" value={pco} onChange={e => setPco(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Responsável pela retirada</Label>
                <Input required placeholder="Nome do funcionário ou solicitante" value={responsible} onChange={e => setResponsible(e.target.value)} />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Observações Adicionais</Label>
                <Textarea placeholder="Detalhes adicionais sobre a saída (opcional)" value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={submitting || loading}>
              {submitting ? "Registrando..." : "Registrar Saída"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
