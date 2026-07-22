import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Search, Plus, Wrench, Edit, Trash2, Camera, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/app/ferramentas/lista")({
  head: () => ({ meta: [{ title: "Cadastro de Ferramentas | Almoxarifado" }] }),
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
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  async function loadTools() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
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
    setAcquisitionDate(""); setValue(""); setNotes(""); setPhotoFile(null);
    setEditingTool(null);
  };

  const handleEditClick = (tool: any) => {
    setEditingTool(tool);
    setName(tool.name); setCategory(tool.category); setBrand(tool.brand); setModel(tool.model || "");
    setSpecifications(tool.specifications || ""); setPatrimonyNumber(tool.patrimony_number || "");
    setSerialNumber(tool.serial_number || ""); setCondition(tool.condition);
    setAcquisitionDate(tool.acquisition_date || ""); setValue(tool.value?.toString() || "");
    setNotes(tool.notes || "");
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Acervo de Ferramentas</h1>
          <p className="text-muted-foreground">Gerencie todas as ferramentas da empresa.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={(v) => { if(!v) resetForm(); setIsAddOpen(v); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Nova Ferramenta</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTool ? "Editar Ferramenta" : "Cadastrar Nova Ferramenta"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome (obrigatório)</Label>
                  <Input required value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Categoria (obrigatório)</Label>
                  <Input required placeholder="Ex: Elétrica, Manual..." value={category} onChange={e => setCategory(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Marca (obrigatório)</Label>
                  <Input required value={brand} onChange={e => setBrand(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Modelo (obrigatório)</Label>
                  <Input required value={model} onChange={e => setModel(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Número de Patrimônio</Label>
                  <Input value={patrimonyNumber} onChange={e => setPatrimonyNumber(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Número de Série</Label>
                  <Input value={serialNumber} onChange={e => setSerialNumber(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Estado de Conservação</Label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                <div className="space-y-2">
                  <Label>Data de Aquisição (obrigatório)</Label>
                  <Input type="date" required value={acquisitionDate} onChange={e => setAcquisitionDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Valor da Ferramenta (obrigatório)</Label>
                  <Input type="number" step="0.01" required value={value} onChange={e => setValue(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Foto da Ferramenta</Label>
                  <Input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files?.[0] || null)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Especificações Técnicas (obrigatório)</Label>
                <Textarea required rows={3} value={specifications} onChange={e => setSpecifications(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Observações Gerais</Label>
                <Textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={submitting}>{submitting ? "Salvando..." : "Salvar Ferramenta"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Pesquisar por nome, categoria ou patrimônio..." 
          className="pl-9 w-full md:w-[400px]"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center p-8 text-muted-foreground">Carregando ferramentas...</div>
      ) : filteredTools.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
          Nenhuma ferramenta encontrada.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTools.map((tool) => (
            <Card key={tool.id} className="overflow-hidden">
              <div className="aspect-video w-full bg-muted flex items-center justify-center overflow-hidden">
                {tool.photo_url ? (
                  <img src={tool.photo_url} alt={tool.name} className="w-full h-full object-cover" />
                ) : (
                  <Camera className="h-10 w-10 text-muted-foreground/50" />
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground">{tool.brand}</p>
                  </div>
                  <Badge variant={
                    tool.status === 'disponivel' ? 'default' :
                    tool.status === 'emprestada' ? 'secondary' : 'destructive'
                  }>
                    {tool.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-y-1 text-sm mt-4">
                  <div className="text-muted-foreground">Categoria:</div>
                  <div className="font-medium text-right truncate" title={tool.category}>{tool.category}</div>
                  
                  <div className="text-muted-foreground">Patrimônio:</div>
                  <div className="font-medium text-right truncate">{tool.patrimony_number || "-"}</div>
                  
                  <div className="text-muted-foreground">Estado:</div>
                  <div className="font-medium text-right capitalize">{tool.condition}</div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setViewingTool(tool)}>
                    <Info className="h-4 w-4 mr-1" /> Detalhes
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(tool)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(tool.id, tool.status)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Visualização Detalhada Modal */}
      <Dialog open={!!viewingTool} onOpenChange={() => setViewingTool(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Ferramenta</DialogTitle>
          </DialogHeader>
          {viewingTool && (
            <div className="space-y-4">
              {viewingTool.photo_url && (
                <div className="w-full h-64 rounded-md overflow-hidden bg-black flex justify-center">
                  <img src={viewingTool.photo_url} alt={viewingTool.name} className="object-contain h-full" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong className="block text-muted-foreground">Nome</strong> {viewingTool.name}</div>
                <div><strong className="block text-muted-foreground">Categoria</strong> {viewingTool.category}</div>
                <div><strong className="block text-muted-foreground">Marca</strong> {viewingTool.brand}</div>
                <div><strong className="block text-muted-foreground">Modelo</strong> {viewingTool.model}</div>
                <div><strong className="block text-muted-foreground">Nº Patrimônio</strong> {viewingTool.patrimony_number || '-'}</div>
                <div><strong className="block text-muted-foreground">Nº Série</strong> {viewingTool.serial_number || '-'}</div>
                <div><strong className="block text-muted-foreground">Situação</strong> <Badge>{viewingTool.status}</Badge></div>
                <div><strong className="block text-muted-foreground">Estado Físico</strong> <span className="capitalize">{viewingTool.condition}</span></div>
                <div><strong className="block text-muted-foreground">Data Aquisição</strong> {viewingTool.acquisition_date || '-'}</div>
                <div><strong className="block text-muted-foreground">Valor Estimado</strong> {viewingTool.value ? `R$ ${viewingTool.value}` : '-'}</div>
              </div>
              <div className="text-sm">
                <strong className="block text-muted-foreground">Especificações</strong>
                <p className="whitespace-pre-wrap">{viewingTool.specifications}</p>
              </div>
              <div className="text-sm">
                <strong className="block text-muted-foreground">Observações</strong>
                <p className="whitespace-pre-wrap">{viewingTool.notes || '-'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
