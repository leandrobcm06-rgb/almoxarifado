import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/app/cobre/devolucao")({
  head: () => ({ meta: [{ title: "Devolução de Cobre | BCM Stock" }] }),
  component: CopperReturn,
});

function CopperReturn() {
  const { user } = useAuth();
  const [bars, setBars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [selectedBarId, setSelectedBarId] = useState("");
  const [returnLength, setReturnLength] = useState("");
  const [client, setClient] = useState("");
  const [pco, setPco] = useState("");
  const [responsible, setResponsible] = useState("");
  const [notes, setNotes] = useState("");

  async function loadBars() {
    try {
      const { data, error } = await supabase
        .from("copper_bars")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setBars(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar barras matrizes: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBars();
  }, []);

  const handleRegisterReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    const bar = bars.find(b => b.id === selectedBarId);
    if (!bar) return toast.error("Selecione a barra origem.");
    
    const length = Number(returnLength) * 1000;
    if (length <= 0) return toast.error("O tamanho devolvido deve ser maior que zero.");

    setSubmitting(true);
    
    try {
      // 1. Criar novo pedaço de cobre
      const { data: newPiece, error: pieceError } = await supabase
        .from("copper_pieces")
        .insert({
          bar_id: bar.id,
          current_length_mm: length,
          status: 'disponivel',
          notes: 'Gerado via devolução'
        })
        .select()
        .single();
      
      if (pieceError) throw pieceError;

      // 2. Registrar movimentação (Devolução)
      const { error: movError } = await supabase
        .from("copper_movements")
        .insert({
          piece_id: newPiece.id,
          bar_id: bar.id,
          type: 'devolucao',
          length_mm: length,
          client: client,
          pco: pco,
          responsible: responsible,
          notes: notes
        });
      
      if (movError) throw movError;

      toast.success("Devolução registrada com sucesso! Um novo pedaço foi criado no estoque.");
      
      // Reset form
      setSelectedBarId("");
      setReturnLength("");
      setClient("");
      setPco("");
      setResponsible("");
      setNotes("");

    } catch (error: any) {
      toast.error("Erro ao registrar devolução: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container animate-fade-in max-w-3xl mx-auto">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Devolução de Material</h1>
            <p className="page-subtitle">Registre material que sobrou de uma obra e retornou ao estoque livre.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 md:p-8 rounded-xl border border-border">
        <form onSubmit={handleRegisterReturn} className="space-y-8">
          
          <div className="space-y-5">
            <h3 className="font-semibold text-lg text-foreground border-b border-border pb-2 font-display">
              Material Devolvido
            </h3>
            <div className="form-group">
              <label className="form-label">Barra Matriz (Referência)</label>
              <Select disabled={loading} value={selectedBarId} onValueChange={setSelectedBarId} required>
                <SelectTrigger className="form-input bg-card h-11">
                  <SelectValue placeholder="Selecione a que tipo de barra este pedaço pertence..." />
                </SelectTrigger>
                <SelectContent>
                  {bars.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name} ({b.auxiliary_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                A devolução criará um NOVO pedaço disponível vinculado a esta barra.
              </p>
            </div>
            <div className="form-group">
              <label className="form-label">Tamanho Devolvido (m)</label>
              <input type="number" step="0.01" required min="0.01" className="form-input" value={returnLength} onChange={e => setReturnLength(e.target.value)} />
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="font-semibold text-lg text-foreground border-b border-border pb-2 font-display">
              Origem e Responsável
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
              <label className="form-label">Responsável pela devolução</label>
              <input required placeholder="Nome do funcionário que devolveu" className="form-input" value={responsible} onChange={e => setResponsible(e.target.value)} />
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="font-semibold text-lg text-foreground border-b border-border pb-2 font-display">
              Observações Adicionais
            </h3>
            <div className="form-group">
              <textarea placeholder="Motivo ou detalhes adicionais (opcional)" className="form-input min-h-[100px]" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>

          <button type="submit" className="btn btn--primary w-full py-3 text-base" disabled={submitting || loading}>
            {submitting ? "Registrando Devolução..." : "Registrar Devolução"}
          </button>
        </form>
      </div>
    </div>
  );
}
