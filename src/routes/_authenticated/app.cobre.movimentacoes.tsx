import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Search, Plus, Scissors, ArrowLeftRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/app/cobre/movimentacoes")({
  head: () => ({ meta: [{ title: "Movimentações de Cobre | Almoxarifado" }] }),
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
        // Para devolução, assumimos que criamos um novo pedaço disponível atrelado à barra original
        // Ou atualizamos o pedaço existente. O mais seguro é criar um novo pedaço devolvido.
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Histórico de Movimentações</h1>
          <p className="text-muted-foreground">Registre saídas e cortes do estoque de cobre.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Scissors className="h-4 w-4 mr-2" /> Registrar Saída</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Saída (Corte)</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleRegisterMovement} className="space-y-4">
              <div className="space-y-2">
                <Label>Pedaço a ser cortado</Label>
                <Select value={selectedPieceId} onValueChange={setSelectedPieceId}>
                  <SelectTrigger>
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
                <div className="space-y-2">
                  <Label>Tamanho do Corte (m)</Label>
                  <Input type="number" required min="0.01" step="0.01" placeholder="Ex: 0.5" value={lengthM} onChange={e => setLengthM(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>PCO (Obra)</Label>
                  <Input placeholder="Ex: PCO-1234" value={pco} onChange={e => setPco(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Input required placeholder="Nome do cliente" value={clientName} onChange={e => setClientName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Solicitante</Label>
                <Input required placeholder="Quem solicitou o material" value={userRequesting} onChange={e => setUserRequesting(e.target.value)} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={submitting}>{submitting ? "Registrando..." : "Registrar Saída"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Cortes e Saídas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Barra Origem</TableHead>
                <TableHead>Tamanho Cortado</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>PCO</TableHead>
                <TableHead>Solicitante</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Carregando...</TableCell>
                </TableRow>
              ) : movements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhuma movimentação registrada.</TableCell>
                </TableRow>
              ) : (
                movements.map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell className="whitespace-nowrap">{format(new Date(mov.created_at), "dd/MM/yyyy HH:mm")}</TableCell>
                    <TableCell className="font-medium">
                      {mov.piece?.bar?.name} <span className="text-muted-foreground text-xs">({mov.piece?.bar?.auxiliary_code})</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">-{((mov.length_mm || 0) / 1000).toFixed(2)} m</Badge>
                    </TableCell>
                    <TableCell>{mov.client_name}</TableCell>
                    <TableCell>{mov.pco || '-'}</TableCell>
                    <TableCell>{mov.user_requesting}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
