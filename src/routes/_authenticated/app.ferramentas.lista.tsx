import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Plus, Edit, Trash2, Camera, Info, PackageX } from "lucide-react";
import Modal from "@/components/Modal/Modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/UI/EmptyState";
import Skeleton from "@/components/UI/Skeleton";

export const Route = createFileRoute("/_authenticated/app/ferramentas/lista")({
  head: () => ({ meta: [{ title: "Cadastro de Ferramentas | BCM Stock" }] }),
  component: ToolsList,
});

function ToolsList() {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingTool, setEditingTool] = useState<any>(null);
  const [viewingTool, setViewingTool] = useState<any>(null);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [patrimonyNumber, setPatrimonyNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [condition, setCondition] = useState("nova");
  const [acquisitionDate, setAcquisitionDate] = useState("");
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [locationId, setLocationId] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const { data: locations } = useQuery({
    queryKey: ["tool-locations"],
    queryFn: async () => (await supabase.from("tool_locations").select("*").order("name")).data ?? [],
  });

  async function loadTools() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tools")
        .select("*, tool_locations(name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTools(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar ferramentas: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTools();
  }, []);

  const resetForm = () => {
    setName(""); setCategory(""); setBrand(""); setModel(""); setSpecifications("");
    setPatrimonyNumber(""); setSerialNumber(""); setCondition("nova");
    setAcquisitionDate(""); setValue(""); setNotes(""); setLocationId(""); setPhotoFile(null);
    setEditingTool(null);
  };

  const handleEditClick = (tool: any) => {
    setEditingTool(tool);
    setName(tool.name); setCategory(tool.category); setBrand(tool.brand); setModel(tool.model || "");
    setSpecifications(tool.specifications || ""); setPatrimonyNumber(tool.patrimony_number || "");
    setSerialNumber(tool.serial_number || ""); setCondition(tool.condition);
    setAcquisitionDate(tool.acquisition_date || ""); setValue(tool.value?.toString() || "");
    setNotes(tool.notes || ""); setLocationId(tool.location_id || "");
    setIsAddOpen(true);
  };

  const handleDelete = async (id: string, status: string) => {
    if (status === 'emprestada') {
      return toast.error("Não é possível excluir uma ferramenta emprestada.");
    }
    if (!confirm("Tem certeza que deseja excluir esta ferramenta?")) return;

    try {
      const { error } = await supabase.from("tools").delete().eq("id", id);
      if (error) throw error;
      toast.success("Ferramenta excluída com sucesso.");
      loadTools();
    } catch (error: any) {
      toast.error("Erro ao excluir: " + error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      let photo_url = editingTool?.photo_url || null;

      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('tool-photos')
          .upload(fileName, photoFile);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('tool-photos')
          .getPublicUrl(fileName);
          
        photo_url = publicUrl;
      }

      const payload = {
        name,
        category,
        brand,
        model,
        specifications,
        patrimony_number: patrimonyNumber,
        serial_number: serialNumber,
        condition,
        acquisition_date: acquisitionDate || null,
        value: value ? Number(value) : null,
        notes,
        location_id: locationId || null,
        photo_url,
        // Ao cadastrar, o status inicial é sempre disponivel, a menos que esteja editando
        ...(editingTool ? {} : { status: condition === 'danificada' ? 'danificada' : condition === 'manutencao' ? 'manutencao' : 'disponivel' })
      };

      if (editingTool) {
        const { error } = await supabase.from("tools").update(payload).eq("id", editingTool.id);
        if (error) throw error;
        toast.success("Ferramenta atualizada!");
      } else {
        const { data, error } = await supabase.from("tools").insert([payload]).select().single();
        if (error) throw error;
        
        // Registrar movimentação de cadastro
        await supabase.from("tool_movements").insert({
          tool_id: data.id,
          type: "cadastro",
          condition: condition
        });
        
        toast.success("Ferramenta cadastrada!");
      }

      setIsAddOpen(false);
      resetForm();
      loadTools();
    } catch (error: any) {
      toast.error("Erro ao salvar: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTools = tools.filter(t => 
    t.name?.toLowerCase().includes(search.toLowerCase()) || 
    t.category?.toLowerCase().includes(search.toLowerCase()) ||
    t.patrimony_number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Acervo de Ferramentas</h1>
            <p className="page-subtitle">Gerencie todas as ferramentas da empresa.</p>
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn--primary" onClick={() => { resetForm(); setIsAddOpen(true); }}>
            <Plus size={16} className="mr-2" /> Nova Ferramenta
          </button>
        </div>
      </div>

      <div className="filter-bar mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input 
          placeholder="Pesquisar por nome, categoria ou patrimônio..." 
          className="form-input pl-9 w-full md:w-[400px]"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Skeleton height="350px" width="100%" />
          <Skeleton height="350px" width="100%" />
          <Skeleton height="350px" width="100%" />
        </div>
      ) : filteredTools.length === 0 ? (
        <EmptyState 
          icon={PackageX} 
          title="Nenhuma ferramenta encontrada" 
          description="Você ainda não cadastrou nenhuma ferramenta ou a pesquisa não retornou resultados."
          action={
            <button className="btn btn--primary" onClick={() => { resetForm(); setIsAddOpen(true); }}>
              Cadastrar Ferramenta
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTools.map((tool) => (
            <div key={tool.id} className="glass-panel overflow-hidden flex flex-col rounded-xl border border-border transition-all hover:border-primary/50">
              <div className="aspect-video w-full bg-muted/20 flex items-center justify-center overflow-hidden border-b border-border">
                {tool.photo_url ? (
                  <img src={tool.photo_url} alt={tool.name} className="w-full h-full object-cover" />
                ) : (
                  <Camera className="h-10 w-10 text-muted-foreground/30" />
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg leading-tight font-display text-foreground">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground">{tool.brand}</p>
                  </div>
                  <Badge variant={
                    tool.status === 'disponivel' ? 'default' :
                    tool.status === 'emprestada' ? 'secondary' : 'destructive'
                  }>
                    {tool.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mt-auto mb-5 bg-muted/20 p-3 rounded-md">
                  <div>
                    <div className="text-xs text-muted-foreground">Categoria</div>
                    <div className="font-medium text-foreground truncate" title={tool.category}>{tool.category}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Patrimônio</div>
                    <div className="font-medium text-foreground truncate">{tool.patrimony_number || "-"}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground">Estado Físico</div>
                    <div className="font-medium text-foreground capitalize">{tool.condition}</div>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto pt-4 border-t border-border">
                  <button className="btn btn--secondary flex-1" onClick={() => setViewingTool(tool)}>
                    <Info size={16} className="mr-1" /> Detalhes
                  </button>
                  <button className="btn-icon" title="Editar" onClick={() => handleEditClick(tool)}>
                    <Edit size={16} />
                  </button>
                  <button className="btn-icon text-danger hover:text-danger hover:bg-danger-bg" title="Excluir" onClick={() => handleDelete(tool.id, tool.status)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cadastro/Edição Modal */}
      <Modal isOpen={isAddOpen} onClose={() => { setIsAddOpen(false); resetForm(); }} title={editingTool ? "Editar Ferramenta" : "Cadastrar Nova Ferramenta"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Nome (obrigatório)</label>
              <input required className="form-input" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Categoria (obrigatório)</label>
              <input required placeholder="Ex: Elétrica, Manual..." className="form-input" value={category} onChange={e => setCategory(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Marca (obrigatório)</label>
              <input required className="form-input" value={brand} onChange={e => setBrand(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Modelo (obrigatório)</label>
              <input required className="form-input" value={model} onChange={e => setModel(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Número de Patrimônio</label>
              <input className="form-input" value={patrimonyNumber} onChange={e => setPatrimonyNumber(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Número de Série</label>
              <input className="form-input" value={serialNumber} onChange={e => setSerialNumber(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Estado de Conservação</label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger className="form-input h-[42px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="nova">Nova</SelectItem>
                  <SelectItem value="boa">Boa</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="ruim">Ruim</SelectItem>
                  <SelectItem value="manutencao">Em Manutenção</SelectItem>
                  <SelectItem value="danificada">Danificada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="form-group">
              <label className="form-label">Localização (obrigatório)</label>
              <Select value={locationId} onValueChange={setLocationId} required>
                <SelectTrigger className="form-input h-[42px]"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {locations?.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="form-group">
              <label className="form-label">Data de Aquisição (obrigatório)</label>
              <input type="date" required className="form-input" value={acquisitionDate} onChange={e => setAcquisitionDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Valor da Ferramenta (obrigatório)</label>
              <input type="number" step="0.01" required className="form-input" value={value} onChange={e => setValue(e.target.value)} />
            </div>
            <div className="form-group md:col-span-2">
              <label className="form-label">Foto da Ferramenta</label>
              <input type="file" accept="image/*" className="form-input file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90" onChange={e => setPhotoFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Especificações Técnicas (obrigatório)</label>
            <textarea required rows={3} className="form-input min-h-[80px]" value={specifications} onChange={e => setSpecifications(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Observações Gerais</label>
            <textarea rows={2} className="form-input min-h-[80px]" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          
          <div className="form-actions mt-8">
            <button type="button" className="btn btn--ghost" onClick={() => { setIsAddOpen(false); resetForm(); }}>Cancelar</button>
            <button type="submit" className="btn btn--primary" disabled={submitting || !locationId}>{submitting ? "Salvando..." : "Salvar Ferramenta"}</button>
          </div>
        </form>
      </Modal>

      {/* Visualização Detalhada Modal */}
      <Modal isOpen={!!viewingTool} onClose={() => setViewingTool(null)} title="Detalhes da Ferramenta" size="md">
        {viewingTool && (
          <div className="space-y-6">
            {viewingTool.photo_url && (
              <div className="w-full h-64 rounded-xl overflow-hidden bg-black/5 flex justify-center border border-border">
                <img src={viewingTool.photo_url} alt={viewingTool.name} className="object-contain h-full" />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm bg-muted/20 p-5 rounded-xl border border-border">
              <div><strong className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Nome</strong> <span className="font-medium text-foreground">{viewingTool.name}</span></div>
              <div><strong className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Categoria</strong> <span className="text-foreground">{viewingTool.category}</span></div>
              <div><strong className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Marca</strong> <span className="text-foreground">{viewingTool.brand}</span></div>
              <div><strong className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Modelo</strong> <span className="text-foreground">{viewingTool.model}</span></div>
              <div><strong className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Nº Patrimônio</strong> <span className="text-foreground">{viewingTool.patrimony_number || '-'}</span></div>
              <div><strong className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Nº Série</strong> <span className="text-foreground">{viewingTool.serial_number || '-'}</span></div>
              <div><strong className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Situação</strong> <Badge variant={viewingTool.status === 'disponivel' ? 'default' : viewingTool.status === 'emprestada' ? 'secondary' : 'destructive'}>{viewingTool.status.toUpperCase()}</Badge></div>
              <div><strong className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Localização</strong> <span className="text-foreground">{viewingTool.tool_locations?.name || '-'}</span></div>
              <div><strong className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Estado Físico</strong> <span className="capitalize text-foreground">{viewingTool.condition}</span></div>
              <div><strong className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Data Aquisição</strong> <span className="text-foreground">{viewingTool.acquisition_date || '-'}</span></div>
              <div><strong className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Valor Estimado</strong> <span className="text-foreground">{viewingTool.value ? `R$ ${viewingTool.value}` : '-'}</span></div>
            </div>
            
            <div className="text-sm bg-muted/20 p-5 rounded-xl border border-border">
              <strong className="block text-muted-foreground text-xs uppercase tracking-wider mb-2">Especificações</strong>
              <p className="whitespace-pre-wrap text-foreground leading-relaxed">{viewingTool.specifications}</p>
            </div>
            
            <div className="text-sm bg-muted/20 p-5 rounded-xl border border-border">
              <strong className="block text-muted-foreground text-xs uppercase tracking-wider mb-2">Observações</strong>
              <p className="whitespace-pre-wrap text-foreground leading-relaxed">{viewingTool.notes || '-'}</p>
            </div>
            
            <div className="form-actions mt-6">
              <button className="btn btn--primary w-full" onClick={() => setViewingTool(null)}>Fechar</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
