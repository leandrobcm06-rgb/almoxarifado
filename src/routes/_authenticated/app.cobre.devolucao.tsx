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

export const Route = createFileRoute("/_authenticated/app/cobre/devolucao")({
  head: () => ({ meta: [{ title: "Devolução de Cobre | Almoxarifado" }] }),
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
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Devolução de Material</h1>
        <p className="text-muted-foreground">Registre material que sobrou de uma obra e retornou ao estoque.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleRegisterReturn} className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="font-medium border-b pb-2">Material Devolvido</h3>
              <div className="space-y-2">
                <Label>Barra Matriz (Referência)</Label>
                <Select disabled={loading} value={selectedBarId} onValueChange={setSelectedBarId} required>
                  <SelectTrigger>
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
                <p className="text-xs text-muted-foreground">
                  A devolução criará um NOVO pedaço disponível vinculado a esta barra.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Tamanho Devolvido (m)</Label>
                <Input type="number" step="0.01" required min="0.01" value={returnLength} onChange={e => setReturnLength(e.target.value)} />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="font-medium border-b pb-2">Origem e Responsável</h3>
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
                <Label>Responsável pela devolução</Label>
                <Input required placeholder="Nome do funcionário que devolveu" value={responsible} onChange={e => setResponsible(e.target.value)} />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Observações Adicionais</Label>
                <Textarea placeholder="Motivo ou detalhes adicionais (opcional)" value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={submitting || loading}>
              {submitting ? "Registrando..." : "Registrar Devolução"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
