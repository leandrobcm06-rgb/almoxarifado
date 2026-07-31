import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Search, Plus, Monitor, Edit, Eye, ArrowRightLeft, PowerOff, FileSpreadsheet, HardHat } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/app/patrimonios/lista")({
  head: () => ({ meta: [{ title: "Lista de Patrimônios | BCM Stock" }] }),
  component: PatrimoniosList,
});

const calculateDepreciation = (asset: any) => {
  if (!asset.acquisition_date || !asset.initial_value || !asset.category) return null;
  
  const start = new Date(asset.acquisition_date);
  const now = new Date();
  const years = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  
  if (years < 0) return { depreciatedValue: asset.initial_value, percentage: 0, initialValue: asset.initial_value };
  
  let rate = 0;
  switch (asset.category) {
    case "Eletrônicos": rate = 0.20; break;
    case "Ferramentas elétricas": rate = 0.20; break;
    case "Ferramentas hidráulicas portáteis": rate = 0.20; break;
    case "Ferramentas manuais": rate = 0.10; break;
    case "Equipamentos hidráulicos industriais": rate = 0.10; break;
    case "Móveis": rate = 0.10; break;
    default: rate = 0;
  }
  
  let depreciationPercentage = years * rate;
  if (depreciationPercentage > 1) depreciationPercentage = 1;
  
  const depreciatedValue = asset.initial_value * (1 - depreciationPercentage);
  return {
    depreciatedValue,
    percentage: depreciationPercentage,
    initialValue: asset.initial_value
  };
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

function PatrimoniosList() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);

  // Form State
  const [description, setDescription] = useState("");
  const [model, setModel] = useState("");
  const [brand, setBrand] = useState("");
  const [assetNumber, setAssetNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [responsible, setResponsible] = useState("");
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState("Bom");
  const [acquisitionDate, setAcquisitionDate] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("");
  const [initialValue, setInitialValue] = useState("");

  // Deactivation State
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deactivatingAsset, setDeactivatingAsset] = useState<any>(null);
  const [deactivateReason, setDeactivateReason] = useState("");
  const [deactivateOther, setDeactivateOther] = useState("");
  const [deactivateNotes, setDeactivateNotes] = useState("");

  async function loadAssets() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("is_active", true)
        .order("asset_number", { ascending: true });

      if (error) throw error;
      setAssets(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar patrimônios: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssets();
  }, []);

  const resetForm = () => {
    setDescription(""); setModel(""); setBrand(""); setAssetNumber("");
    setSerialNumber(""); setResponsible(""); setLocation("");
    setCondition("Bom"); setAcquisitionDate(""); setNotes("");
    setCategory(""); setInitialValue("");
    setEditingAsset(null);
  };

  const handleEditClick = (asset: any) => {
    setEditingAsset(asset);
    setDescription(asset.description); setModel(asset.model || ""); setBrand(asset.brand || "");
    setAssetNumber(asset.asset_number); setSerialNumber(asset.serial_number || "");
    setResponsible(asset.responsible || ""); setLocation(asset.location || "");
    setCondition(asset.condition); setAcquisitionDate(asset.acquisition_date || "");
    setNotes(asset.notes || "");
    setCategory(asset.category || ""); setInitialValue(asset.initial_value ? String(asset.initial_value) : "");
    setIsAddOpen(true);
  };

  const checkSerialNumber = async (serial: string, excludeId?: string) => {
    if (!serial) return false;
    let q = supabase.from("assets").select("id").eq("serial_number", serial);
    if (excludeId) q = q.neq("id", excludeId);
    const { data } = await q;
    return data && data.length > 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (await checkSerialNumber(serialNumber, editingAsset?.id)) {
        toast.warning("Atenção: Já existe um patrimônio com este número de série.", { duration: 5000 });
      }

      const payload = {
        description, model, brand, asset_number: assetNumber, serial_number: serialNumber,
        responsible, location, condition, acquisition_date: acquisitionDate || null, notes,
        category: category || null, initial_value: initialValue ? parseFloat(initialValue) : null,
      };

      if (editingAsset) {
        const { error } = await supabase.from("assets").update(payload).eq("id", editingAsset.id);
        if (error) throw error;
        
        const { data: user } = await supabase.auth.getUser();
        await supabase.from("asset_history").insert({
          asset_id: editingAsset.id, action: "Edição",
          description: "Informações do patrimônio atualizadas.", user_name: user.user?.email
        });
        
        toast.success("Patrimônio atualizado!");
      } else {
        const { data: newAsset, error } = await supabase.from("assets").insert(payload).select().single();
        if (error) throw error;

        const { data: user } = await supabase.auth.getUser();
        await supabase.from("asset_history").insert({
          asset_id: newAsset.id, action: "Cadastro",
          description: "Patrimônio cadastrado no sistema.", user_name: user.user?.email
        });

        toast.success("Patrimônio cadastrado!");
      }
      setIsAddOpen(false);
      resetForm();
      loadAssets();
    } catch (error: any) {
      if (error.message?.includes("assets_asset_number_key") || error.code === '23505') {
        toast.error("O número de patrimônio deve ser único. Já existe um item com esse número.");
      } else {
        toast.error("Erro ao salvar: " + error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deactivateReason) return toast.error("Selecione um motivo.");
    
    const finalReason = deactivateReason === "Outro" ? deactivateOther : deactivateReason;
    if (!finalReason) return toast.error("Informe o motivo.");

    setSubmitting(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      const { error } = await supabase.from("assets").update({
        is_active: false,
        deactivation_reason: finalReason + (deactivateNotes ? ` - ${deactivateNotes}` : ""),
        deactivation_date: new Date().toISOString(),
        deactivation_user: user.user?.email
      }).eq("id", deactivatingAsset.id);

      if (error) throw error;

      await supabase.from("asset_history").insert({
        asset_id: deactivatingAsset.id, action: "Desativação",
        description: `Patrimônio desativado. Motivo: ${finalReason}`, user_name: user.user?.email
      });

      toast.success("Patrimônio desativado com sucesso.");
      setDeactivateOpen(false);
      loadAssets();
    } catch (error: any) {
      toast.error("Erro ao desativar: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search) return assets;
    const lower = search.toLowerCase();
    return assets.filter((a) => 
      a.description.toLowerCase().includes(lower) || 
      a.asset_number.toLowerCase().includes(lower) || 
      (a.serial_number && a.serial_number.toLowerCase().includes(lower)) ||
      (a.brand && a.brand.toLowerCase().includes(lower)) ||
      (a.responsible && a.responsible.toLowerCase().includes(lower)) ||
      (a.location && a.location.toLowerCase().includes(lower)) ||
      (a.category && a.category.toLowerCase().includes(lower))
    );
  }, [assets, search]);

  const conditionColors: Record<string, string> = { "Ruim": "destructive", "Regular": "warning", "Bom": "default", "Ótimo": "success" };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patrimônios</h1>
          <p className="text-sm text-muted-foreground">Lista de todos os bens patrimoniais ativos da empresa.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={(v) => { if (!v) resetForm(); setIsAddOpen(v); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Cadastrar Patrimônio</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAsset ? "Editar Patrimônio" : "Cadastrar Patrimônio"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Descrição do patrimônio *</Label>
                <Input id="description" required value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assetNumber">Número do patrimônio *</Label>
                <Input id="assetNumber" required value={assetNumber} onChange={(e) => setAssetNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Número de série</Label>
                <Input id="serialNumber" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Modelo</Label>
                <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsible">Responsável atual</Label>
                <Input id="responsible" value={responsible} onChange={(e) => setResponsible(e.target.value)} placeholder="Nome ou setor" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Onde o bem se encontra" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Estado de conservação *</Label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ruim">Ruim</SelectItem>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="Bom">Bom</SelectItem>
                    <SelectItem value="Ótimo">Ótimo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="acquisitionDate">Data de aquisição</Label>
                <Input id="acquisitionDate" type="date" value={acquisitionDate} onChange={(e) => setAcquisitionDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                    <SelectItem value="Ferramentas manuais">Ferramentas manuais</SelectItem>
                    <SelectItem value="Ferramentas elétricas">Ferramentas elétricas</SelectItem>
                    <SelectItem value="Ferramentas hidráulicas portáteis">Ferramentas hidráulicas portáteis</SelectItem>
                    <SelectItem value="Equipamentos hidráulicos industriais">Equipamentos hidráulicos industriais</SelectItem>
                    <SelectItem value="Móveis">Móveis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="initialValue">Valor inicial (R$)</Label>
                <Input id="initialValue" type="number" step="0.01" value={initialValue} onChange={(e) => setInitialValue(e.target.value)} placeholder="0.00" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="resize-none" rows={3} />
              </div>
              <DialogFooter className="col-span-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={submitting}>{submitting ? "Salvando..." : "Salvar"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Bens Patrimoniais</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Pesquisar por descrição, nº, marca..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Carregando patrimônios...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Nenhum patrimônio encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Nº Patrimônio</th>
                    <th className="px-4 py-3 font-medium">Descrição</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Marca/Modelo</th>
                    <th className="px-4 py-3 font-medium hidden lg:table-cell">Responsável/Local</th>
                    <th className="px-4 py-3 font-medium">Categoria/Valor</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((a) => (
                    <tr key={a.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium">{a.asset_number}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{a.description}</div>
                        {a.serial_number && <div className="text-xs text-muted-foreground">S/N: {a.serial_number}</div>}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div>{a.brand || "-"}</div>
                        <div className="text-xs text-muted-foreground">{a.model || "-"}</div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div>{a.responsible || "-"}</div>
                        <div className="text-xs text-muted-foreground">{a.location || "-"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-xs">{a.category || "-"}</div>
                        {a.initial_value ? (
                          <div className="text-xs">
                            {(() => {
                              const dep = calculateDepreciation(a);
                              if (!dep) return formatCurrency(a.initial_value);
                              return (
                                <div className="flex flex-col">
                                  <span className={dep.percentage > 0 ? "line-through text-muted-foreground text-[10px]" : ""}>
                                    {formatCurrency(dep.initialValue)}
                                  </span>
                                  {dep.percentage > 0 && (
                                    <span className="text-emerald-600 font-semibold">
                                      {formatCurrency(dep.depreciatedValue)} <span className="text-[10px] text-muted-foreground">(-{(dep.percentage * 100).toFixed(0)}%)</span>
                                    </span>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={conditionColors[a.condition] as any || "outline"}>{a.condition}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {a.status === 'disponivel' ? (
                          <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Disponível</Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">Emprestado</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <Link to={`/app/patrimonios/${a.id}`} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8 mr-1">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8 mr-1" onClick={() => handleEditClick(a)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 mr-1" asChild>
                           <Link to={`/app/patrimonios/emprestimos`} search={{ assetId: a.id }}><ArrowRightLeft className="h-4 w-4" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => { setDeactivatingAsset(a); setDeactivateReason(""); setDeactivateOther(""); setDeactivateNotes(""); setDeactivateOpen(true); }}>
                          <PowerOff className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deactivate Dialog */}
      <Dialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desativar Patrimônio</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleDeactivate} className="space-y-4 py-4">
            <div className="text-sm">
              Tem certeza que deseja desativar o patrimônio <strong>{deactivatingAsset?.asset_number} - {deactivatingAsset?.description}</strong>? Ele não poderá mais ser emprestado e será movido para os Inativos.
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deactivateReason">Motivo da desativação *</Label>
              <Select value={deactivateReason} onValueChange={setDeactivateReason}>
                <SelectTrigger><SelectValue placeholder="Selecione um motivo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Danificado">Danificado</SelectItem>
                  <SelectItem value="Sem condições de uso">Sem condições de uso</SelectItem>
                  <SelectItem value="Vendido">Vendido</SelectItem>
                  <SelectItem value="Doado">Doado</SelectItem>
                  <SelectItem value="Extraviado">Extraviado</SelectItem>
                  <SelectItem value="Furtado ou roubado">Furtado ou roubado</SelectItem>
                  <SelectItem value="Substituído">Substituído</SelectItem>
                  <SelectItem value="Descartado">Descartado</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {deactivateReason === "Outro" && (
              <div className="space-y-2">
                <Label htmlFor="deactivateOther">Qual o motivo? *</Label>
                <Input id="deactivateOther" required value={deactivateOther} onChange={(e) => setDeactivateOther(e.target.value)} />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="deactivateNotes">Observações adicionais</Label>
              <Textarea id="deactivateNotes" value={deactivateNotes} onChange={(e) => setDeactivateNotes(e.target.value)} />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDeactivateOpen(false)}>Cancelar</Button>
              <Button type="submit" variant="destructive" disabled={submitting}>{submitting ? "Desativando..." : "Desativar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
