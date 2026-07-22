import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Search, Plus, ListPlus, Link as LinkIcon, Trash2, Edit, MoreVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/_authenticated/app/cobre/barras")({
  head: () => ({ meta: [{ title: "Barras de Cobre | Almoxarifado" }] }),
  component: CopperBars,
});

function CopperBars() {
  const [bars, setBars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBar, setSelectedBar] = useState<any>(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [material, setMaterial] = useState("Cobre");
  const [length, setLength] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadBars() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("copper_bars")
        .select("*, pieces:copper_pieces(id, current_length_mm, status)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBars(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar barras: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBars();
  }, []);

  const openEdit = (bar: any) => {
    setSelectedBar(bar);
    setName(bar.name);
    setCode(bar.auxiliary_code);
    setMaterial(bar.material);
    setLength(bar.original_length_mm.toString());
    setNotes(bar.notes || "");
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta barra? Todos os pedaços e movimentações vinculadas também serão apagados.")) return;
    
    try {
      const { error } = await supabase.from("copper_bars").delete().eq("id", id);
      if (error) throw error;
      toast.success("Barra excluída com sucesso.");
      loadBars();
    } catch (error: any) {
      toast.error("Erro ao excluir: " + error.message);
    }
  };

  const handleSaveBar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (isEditOpen && selectedBar) {
        const { error } = await supabase.from("copper_bars").update({
          name, auxiliary_code: code, material, original_length_mm: Number(length), notes
        }).eq("id", selectedBar.id);
        
        if (error) throw error;
        toast.success("Barra atualizada com sucesso!");
        setIsEditOpen(false);
      } else {
        const barResponse: any = await supabase.from("copper_bars").insert({
          name, auxiliary_code: code, material, original_length_mm: Number(length), notes
        }).select().single();
        
        if (barResponse.error) throw barResponse.error;
        const bar = barResponse.data;

        const { error: pieceError } = await supabase.from("copper_pieces").insert({
          bar_id: bar.id,
          current_length_mm: Number(length),
          status: 'disponivel',
          notes: 'Pedaço original'
        });

        if (pieceError) throw pieceError;
        toast.success("Barra cadastrada com sucesso!");
        setIsAddOpen(false);
      }

      setName(""); setCode(""); setLength(""); setNotes("");
      loadBars();
    } catch (error: any) {
      toast.error("Erro ao salvar barra: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBars = bars.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.auxiliary_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cadastro de Barras</h1>
          <p className="text-muted-foreground">Gerencie o estoque matriz de cobre.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={open => {
          if(open) {
            setName(""); setCode(""); setLength(""); setNotes("");
          }
          setIsAddOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Nova Barra</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Barra</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveBar} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Barra</Label>
                <Input required placeholder="Ex: Barra chata 3/4" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Código Auxiliar</Label>
                  <Input required placeholder="Ex: CB-001" value={code} onChange={e => setCode(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Comprimento Inicial (mm)</Label>
                  <Input type="number" required min="1" placeholder="Ex: 6000" value={length} onChange={e => setLength(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Material</Label>
                <Input required value={material} onChange={e => setMaterial(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={submitting}>{submitting ? "Salvando..." : "Salvar"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Pesquisar por nome ou código..." 
          className="pl-9 w-full md:w-[300px]"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center p-8 text-muted-foreground">Carregando barras...</div>
      ) : filteredBars.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
          Nenhuma barra encontrada.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBars.map((bar) => {
            const totalDisponivel = bar.pieces?.filter((p: any) => p.status === 'disponivel').reduce((acc: number, p: any) => acc + Number(p.current_length_mm), 0) || 0;
            const disponivelCount = bar.pieces?.filter((p: any) => p.status === 'disponivel').length || 0;

            return (
              <Card key={bar.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{bar.name}</CardTitle>
                      <div className="text-sm text-muted-foreground font-mono mt-1">{bar.auxiliary_code}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={totalDisponivel > 0 ? "default" : "destructive"}>
                        {totalDisponivel} mm
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(bar)}>
                            <Edit className="h-4 w-4 mr-2" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(bar.id)} className="text-red-600 focus:text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Original:</span>
                      <span className="font-medium">{bar.original_length_mm} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Material:</span>
                      <span className="font-medium">{bar.material}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pedaços Disp.:</span>
                      <span className="font-medium">{disponivelCount} parte(s)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Barra</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveBar} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome da Barra</Label>
              <Input required placeholder="Ex: Barra chata 3/4" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Código Auxiliar</Label>
                <Input required placeholder="Ex: CB-001" value={code} onChange={e => setCode(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Comprimento Inicial (mm)</Label>
                <Input type="number" required min="1" value={length} onChange={e => setLength(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Material</Label>
              <Input required value={material} onChange={e => setMaterial(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={submitting}>{submitting ? "Salvando..." : "Salvar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
