import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Plus, Edit, Eye, ArrowRightLeft, PowerOff, Monitor, ArchiveX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Modal from "@/components/Modal/Modal";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/skeleton";

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

  const conditionColors: Record<string, string> = { 
    "Ruim": "destructive", 
    "Regular": "warning", 
    "Bom": "default", 
    "Ótimo": "success" 
  };

  return (
    <div className="page-container animate-fade-in max-w-7xl mx-auto">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Patrimônios</h1>
            <p className="page-subtitle">Lista de todos os bens patrimoniais ativos da empresa.</p>
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn--primary" onClick={() => { resetForm(); setIsAddOpen(true); }}>
            <Plus size={16} className="mr-2" /> Cadastrar Patrimônio
          </button>
        </div>
      </div>

      <div className="filter-bar mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            placeholder="Pesquisar por descrição, nº, marca, responsável..." 
            className="form-input pl-10 w-full shadow-sm" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-border">
        <div className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton height="50px" width="100%" />
              <Skeleton height="50px" width="100%" />
              <Skeleton height="50px" width="100%" />
              <Skeleton height="50px" width="100%" />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState 
              icon={Monitor} 
              title={search ? "Nenhum patrimônio encontrado" : "Nenhum patrimônio cadastrado"} 
              description={search ? `Não encontramos resultados para "${search}".` : "Comece cadastrando o primeiro bem patrimonial."}
              action={!search ? (
                <button className="btn btn--primary" onClick={() => { resetForm(); setIsAddOpen(true); }}>
                  Cadastrar Primeiro Patrimônio
                </button>
              ) : undefined}
            />
          ) : (
            <div className="table-responsive border-0 shadow-none rounded-none">
              <table className="table table--hover m-0">
                <thead>
                  <tr>
                    <th className="glass-header whitespace-nowrap w-32">Nº Patrimônio</th>
                    <th className="glass-header min-w-[200px]">Descrição</th>
                    <th className="glass-header hidden md:table-cell">Marca/Modelo</th>
                    <th className="glass-header hidden lg:table-cell">Responsável/Local</th>
                    <th className="glass-header hidden sm:table-cell w-32 text-center">Estado</th>
                    <th className="glass-header w-32 text-center">Status</th>
                    <th className="glass-header text-right w-40">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.id}>
                      <td className="font-mono font-medium text-foreground">{a.asset_number}</td>
                      <td>
                        <div className="font-semibold text-foreground">{a.description}</div>
                        {a.serial_number && <div className="text-xs text-muted-foreground font-mono mt-0.5">S/N: {a.serial_number}</div>}
                      </td>
                      <td className="hidden md:table-cell">
                        <div className="font-medium text-foreground">{a.brand || "-"}</div>
                        <div className="text-xs text-muted-foreground">{a.model || "-"}</div>
                      </td>
                      <td className="hidden lg:table-cell">
                        <div className="font-medium text-foreground">{a.responsible || "-"}</div>
                        <div className="text-xs text-muted-foreground">{a.location || "-"}</div>
                      </td>
                      <td className="hidden sm:table-cell text-center">
                        <Badge variant={conditionColors[a.condition] as any || "outline"}>{a.condition}</Badge>
                      </td>
                      <td className="text-center">
                        {a.status === 'disponivel' ? (
                          <Badge variant="outline" className="text-success bg-success-bg border-success-border font-medium">Disponível</Badge>
                        ) : (
                          <Badge variant="outline" className="text-warning bg-warning-bg border-warning-border font-medium">Emprestado</Badge>
                        )}
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <div className="flex justify-end gap-1.5">
                          <Link to={`/app/patrimonios/${a.id}`} title="Visualizar" className="btn-icon">
                            <Eye size={16} />
                          </Link>
                          <button className="btn-icon" onClick={() => handleEditClick(a)} title="Editar">
                            <Edit size={16} />
                          </button>
                          <Link to={`/app/patrimonios/emprestimos`} search={{ assetId: a.id }} title="Empréstimos" className="btn-icon">
                            <ArrowRightLeft size={16} />
                          </Link>
                          <button 
                            className="btn-icon text-danger hover:text-danger hover:bg-danger-bg ml-2" 
                            onClick={() => { setDeactivatingAsset(a); setDeactivateReason(""); setDeactivateOther(""); setDeactivateNotes(""); setDeactivateOpen(true); }}
                            title="Desativar"
                          >
                            <PowerOff size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Mobile View */}
              <div className="md:hidden flex flex-col gap-3 p-3 bg-muted/10">
                {filtered.map((a) => (
                  <div key={a.id} className="border border-border rounded-xl p-4 bg-card shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-foreground text-base">{a.description}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">{a.asset_number} {a.serial_number ? `• S/N: ${a.serial_number}` : ''}</div>
                      </div>
                      {a.status === 'disponivel' ? (
                        <Badge variant="outline" className="text-success bg-success-bg border-success-border font-medium">Disponível</Badge>
                      ) : (
                        <Badge variant="outline" className="text-warning bg-warning-bg border-warning-border font-medium">Emprestado</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm bg-muted/30 p-3 rounded-lg mt-1">
                      <div>
                        <span className="block text-xs text-muted-foreground mb-0.5">Marca/Modelo</span>
                        <span className="font-medium text-foreground">{a.brand || "-"} {a.model ? `/ ${a.model}` : ''}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground mb-0.5">Responsável</span>
                        <span className="font-medium text-foreground">{a.responsible || "-"}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground mb-0.5">Localização</span>
                        <span className="font-medium text-foreground">{a.location || "-"}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground mb-1">Estado</span>
                        <Badge variant={conditionColors[a.condition] as any || "outline"} className="text-[10px] h-5">{a.condition}</Badge>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-2 border-t border-border mt-1">
                      <Link to={`/app/patrimonios/${a.id}`} className="btn btn--outline btn--sm px-3">
                        <Eye size={14} />
                      </Link>
                      <button className="btn btn--outline btn--sm px-3" onClick={() => handleEditClick(a)}>
                        <Edit size={14} />
                      </button>
                      <Link to={`/app/patrimonios/emprestimos`} search={{ assetId: a.id }} className="btn btn--outline btn--sm px-3">
                        <ArrowRightLeft size={14} />
                      </Link>
                      <button 
                        className="btn btn--outline btn--sm px-3 text-danger border-danger-border hover:bg-danger-bg" 
                        onClick={() => { setDeactivatingAsset(a); setDeactivateReason(""); setDeactivateOther(""); setDeactivateNotes(""); setDeactivateOpen(true); }}
                      >
                        <PowerOff size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isAddOpen} onClose={() => { resetForm(); setIsAddOpen(false); }} title={editingAsset ? "Editar Patrimônio" : "Cadastrar Patrimônio"} size="xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="form-group md:col-span-2">
              <label className="form-label" htmlFor="description">Descrição do patrimônio *</label>
              <input id="description" required className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="assetNumber">Número do patrimônio *</label>
              <input id="assetNumber" required className="form-input font-mono" value={assetNumber} onChange={(e) => setAssetNumber(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="serialNumber">Número de série</label>
              <input id="serialNumber" className="form-input font-mono" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="brand">Marca</label>
              <input id="brand" className="form-input" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="model">Modelo</label>
              <input id="model" className="form-input" value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
            
            <div className="md:col-span-2 my-2">
              <div className="h-px w-full bg-border"></div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="responsible">Responsável atual</label>
              <input id="responsible" className="form-input" value={responsible} onChange={(e) => setResponsible(e.target.value)} placeholder="Nome ou setor" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="location">Localização</label>
              <input id="location" className="form-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Onde o bem se encontra" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="condition">Estado de conservação *</label>
              <select id="condition" className="form-input" value={condition} onChange={(e) => setCondition(e.target.value)}>
                <option value="Ótimo">Ótimo</option>
                <option value="Bom">Bom</option>
                <option value="Regular">Regular</option>
                <option value="Ruim">Ruim</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="acquisitionDate">Data de aquisição</label>
              <input id="acquisitionDate" type="date" className="form-input" value={acquisitionDate} onChange={(e) => setAcquisitionDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="category">Categoria</label>
              <select id="category" className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Selecione...</option>
                <option value="Eletrônicos">Eletrônicos</option>
                <option value="Ferramentas manuais">Ferramentas manuais</option>
                <option value="Ferramentas elétricas">Ferramentas elétricas</option>
                <option value="Ferramentas hidráulicas portáteis">Ferramentas hidráulicas portáteis</option>
                <option value="Equipamentos hidráulicos industriais">Equipamentos hidráulicos industriais</option>
                <option value="Móveis">Móveis</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="initialValue">Valor inicial (R$)</label>
              <input id="initialValue" type="number" step="0.01" className="form-input" value={initialValue} onChange={(e) => setInitialValue(e.target.value)} placeholder="0.00" />
            </div>
            <div className="form-group md:col-span-2">
              <label className="form-label" htmlFor="notes">Observações</label>
              <textarea id="notes" className="form-input min-h-[80px]" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
          <div className="form-actions mt-8">
            <button type="button" className="btn btn--ghost" onClick={() => { resetForm(); setIsAddOpen(false); }}>Cancelar</button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>{submitting ? "Salvando..." : "Salvar Patrimônio"}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={deactivateOpen} onClose={() => setDeactivateOpen(false)} title="Desativar Patrimônio" size="md">
        <form onSubmit={handleDeactivate} className="space-y-6">
          <div className="p-4 bg-muted/20 border border-border rounded-lg text-sm text-foreground mb-6">
            Tem certeza que deseja desativar o patrimônio <strong>{deactivatingAsset?.asset_number} - {deactivatingAsset?.description}</strong>? Ele não poderá mais ser emprestado e será movido para os Inativos.
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="deactivateReason">Motivo da desativação *</label>
            <select id="deactivateReason" className="form-input" value={deactivateReason} onChange={(e) => setDeactivateReason(e.target.value)}>
              <option value="">Selecione um motivo</option>
              <option value="Danificado">Danificado</option>
              <option value="Sem condições de uso">Sem condições de uso</option>
              <option value="Vendido">Vendido</option>
              <option value="Doado">Doado</option>
              <option value="Extraviado">Extraviado</option>
              <option value="Furtado ou roubado">Furtado ou roubado</option>
              <option value="Substituído">Substituído</option>
              <option value="Descartado">Descartado</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          
          {deactivateReason === "Outro" && (
            <div className="form-group">
              <label className="form-label" htmlFor="deactivateOther">Qual o motivo? *</label>
              <input id="deactivateOther" required className="form-input" value={deactivateOther} onChange={(e) => setDeactivateOther(e.target.value)} />
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label" htmlFor="deactivateNotes">Observações adicionais</label>
            <textarea id="deactivateNotes" className="form-input min-h-[80px]" value={deactivateNotes} onChange={(e) => setDeactivateNotes(e.target.value)} />
          </div>
          
          <div className="form-actions mt-8">
            <button type="button" className="btn btn--ghost" onClick={() => setDeactivateOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn--danger" disabled={submitting}>
              <PowerOff size={16} className="mr-2" />
              {submitting ? "Desativando..." : "Confirmar Desativação"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
