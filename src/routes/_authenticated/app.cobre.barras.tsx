import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Plus, Trash2, Edit, MoreVertical, PackageX } from "lucide-react";
import Modal from "@/components/Modal/Modal";
import EmptyState from "@/components/UI/EmptyState";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/_authenticated/app/cobre/barras")({
  head: () => ({ meta: [{ title: "Barras de Cobre | BCM Stock" }] }),
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
    setLength((bar.original_length_mm / 1000).toString());
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
          name, auxiliary_code: code, material, original_length_mm: Math.round(Number(length) * 1000), notes
        }).eq("id", selectedBar.id);
        
        if (error) throw error;
        toast.success("Barra atualizada com sucesso!");
        setIsEditOpen(false);
      } else {
        const barResponse: any = await supabase.from("copper_bars").insert({
          name, auxiliary_code: code, material, original_length_mm: Math.round(Number(length) * 1000), notes
        }).select().single();
        
        if (barResponse.error) throw barResponse.error;
        const bar = barResponse.data;

        const { error: pieceError } = await supabase.from("copper_pieces").insert({
          bar_id: bar.id,
          current_length_mm: Math.round(Number(length) * 1000),
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
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Cadastro de Barras</h1>
            <p className="page-subtitle">Gerencie o estoque matriz de cobre.</p>
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn--primary" onClick={() => {
            setName(""); setCode(""); setLength(""); setNotes("");
            setIsAddOpen(true);
          }}>
            <Plus size={16} className="mr-2" /> Nova Barra
          </button>
        </div>
      </div>

      <div className="filter-bar mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input 
          placeholder="Pesquisar por nome ou código..." 
          className="form-input pl-9 w-full md:w-[320px]"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center p-8 text-muted-foreground">Carregando barras...</div>
      ) : filteredBars.length === 0 ? (
        <EmptyState 
          icon={PackageX} 
          title="Nenhuma barra encontrada" 
          description="A pesquisa não retornou nenhum resultado para os filtros atuais."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBars.map((bar) => {
            const totalDisponivel = bar.pieces?.filter((p: any) => p.status === 'disponivel').reduce((acc: number, p: any) => acc + Number(p.current_length_mm), 0) || 0;
            const disponivelCount = bar.pieces?.filter((p: any) => p.status === 'disponivel').length || 0;

            return (
              <div key={bar.id} className="glass-panel overflow-hidden rounded-xl border border-border">
                <div className="bg-muted/30 p-4 border-b border-border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold font-display text-foreground">{bar.name}</h3>
                      <div className="text-sm text-muted-foreground font-mono mt-1">{bar.auxiliary_code}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={totalDisponivel > 0 ? "default" : "destructive"}>
                        {(totalDisponivel / 1000).toFixed(2)} m
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="btn-icon h-8 w-8 text-muted-foreground"><MoreVertical size={16} /></button>
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
                </div>
                <div className="p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-border-light">
                      <span className="text-muted-foreground">Original:</span>
                      <span className="font-medium">{(bar.original_length_mm / 1000).toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-border-light">
                      <span className="text-muted-foreground">Material:</span>
                      <span className="font-medium">{bar.material}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Pedaços Disp.:</span>
                      <span className="font-medium text-primary">{disponivelCount} parte(s)</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Dialog */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Cadastrar Nova Barra" size="md">
        <form onSubmit={handleSaveBar}>
          <div className="form-group">
            <label className="form-label">Nome da Barra</label>
            <input required placeholder="Ex: Barra chata 3/4" className="form-input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Código Auxiliar</label>
              <input required placeholder="Ex: CB-001" className="form-input" value={code} onChange={e => setCode(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Comprimento Inicial (m)</label>
              <input type="number" step="0.01" required min="0.01" placeholder="Ex: 6.00" className="form-input" value={length} onChange={e => setLength(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Material</label>
            <input required className="form-input" value={material} onChange={e => setMaterial(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Observações</label>
            <textarea className="form-input min-h-[80px]" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div className="form-actions mt-6">
            <button type="button" className="btn btn--ghost" onClick={() => setIsAddOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>{submitting ? "Salvando..." : "Salvar Barra"}</button>
          </div>
        </form>
      </Modal>

      {/* Edit Dialog */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Editar Barra" size="md">
        <form onSubmit={handleSaveBar}>
          <div className="form-group">
            <label className="form-label">Nome da Barra</label>
            <input required placeholder="Ex: Barra chata 3/4" className="form-input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Código Auxiliar</label>
              <input required placeholder="Ex: CB-001" className="form-input" value={code} onChange={e => setCode(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Comprimento Inicial (m)</label>
              <input type="number" step="0.01" required min="0.01" className="form-input" value={length} onChange={e => setLength(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Material</label>
            <input required className="form-input" value={material} onChange={e => setMaterial(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Observações</label>
            <textarea className="form-input min-h-[80px]" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div className="form-actions mt-6">
            <button type="button" className="btn btn--ghost" onClick={() => setIsEditOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>{submitting ? "Salvando..." : "Salvar Alterações"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
