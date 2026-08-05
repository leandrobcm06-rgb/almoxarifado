import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Eye, ArchiveRestore, ArchiveX } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/app/patrimonios/inativos")({
  head: () => ({ meta: [{ title: "Patrimônios Inativos | BCM Stock" }] }),
  component: PatrimoniosInativos,
});

function PatrimoniosInativos() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadAssets() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("is_active", false)
        .order("asset_number", { ascending: true });

      if (error) throw error;
      setAssets(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar patrimônios inativos: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssets();
  }, []);

  const handleReactivate = async (asset: any) => {
    if (!confirm(`Tem certeza que deseja reativar o patrimônio ${asset.asset_number}? Ele voltará a ficar "Disponível".`)) return;
    
    setSubmitting(true);
    try {
      const { data: user } = await supabase.auth.getUser();

      const { error } = await supabase.from("assets").update({
        is_active: true,
        status: 'disponivel',
        deactivation_reason: null,
        deactivation_date: null,
        deactivation_user: null
      }).eq("id", asset.id);

      if (error) throw error;

      await supabase.from("asset_history").insert({
        asset_id: asset.id, action: "Ativação",
        description: "Patrimônio reativado e retornado para Disponível.", user_name: user.user?.email
      });

      toast.success("Patrimônio reativado com sucesso!");
      loadAssets();
    } catch (error: any) {
      toast.error("Erro ao reativar: " + error.message);
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
      (a.deactivation_reason && a.deactivation_reason.toLowerCase().includes(lower))
    );
  }, [assets, search]);

  return (
    <div className="page-container animate-fade-in max-w-7xl mx-auto">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title text-muted-foreground">Patrimônios Inativos</h1>
            <p className="page-subtitle">Bens desativados, descartados ou perdidos.</p>
          </div>
        </div>
      </div>

      <div className="filter-bar mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            placeholder="Pesquisar inativos por número, descrição, motivo..." 
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
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState 
              icon={ArchiveX} 
              title={search ? "Nenhum inativo encontrado" : "Nenhum patrimônio inativo"} 
              description={search ? `Não encontramos inativos para "${search}".` : "Não há patrimônios desativados no momento."}
            />
          ) : (
            <div className="table-responsive border-0 shadow-none rounded-none">
              <table className="table table--hover m-0">
                <thead>
                  <tr>
                    <th className="glass-header whitespace-nowrap w-32">Nº Patrimônio</th>
                    <th className="glass-header min-w-[200px]">Descrição</th>
                    <th className="glass-header">Motivo da Desativação</th>
                    <th className="glass-header hidden md:table-cell">Desativado em</th>
                    <th className="glass-header hidden lg:table-cell">Por</th>
                    <th className="glass-header text-right w-40">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.id} className="opacity-80 hover:opacity-100 transition-opacity">
                      <td className="font-mono font-medium text-muted-foreground">{a.asset_number}</td>
                      <td>
                        <div className="font-medium text-foreground line-through decoration-muted-foreground/30">{a.description}</div>
                        {a.serial_number && <div className="text-xs text-muted-foreground font-mono mt-0.5">S/N: {a.serial_number}</div>}
                      </td>
                      <td>
                        <div className="text-danger font-medium text-sm">{a.deactivation_reason}</div>
                      </td>
                      <td className="hidden md:table-cell text-muted-foreground">
                        {a.deactivation_date ? new Date(a.deactivation_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="hidden lg:table-cell text-muted-foreground">
                        {a.deactivation_user || "-"}
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <div className="flex justify-end gap-1.5 items-center">
                          <Link to={`/app/patrimonios/${a.id}`} title="Visualizar" className="btn-icon">
                            <Eye size={16} />
                          </Link>
                          <button 
                            className="btn btn--outline btn--sm ml-2" 
                            disabled={submitting} 
                            onClick={() => handleReactivate(a)}
                          >
                            <ArchiveRestore size={14} className="mr-1.5" /> Reativar
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
                  <div key={a.id} className="border border-border rounded-xl p-4 bg-card shadow-sm flex flex-col gap-3 opacity-80">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-foreground text-base line-through decoration-muted-foreground/30">{a.description}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">{a.asset_number}</div>
                      </div>
                    </div>
                    
                    <div className="bg-danger-bg border border-danger-border p-3 rounded-lg mt-1">
                      <span className="block text-xs text-danger font-semibold mb-0.5">Motivo da Desativação</span>
                      <span className="font-medium text-danger text-sm">{a.deactivation_reason}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm bg-muted/30 p-3 rounded-lg mt-1">
                      <div>
                        <span className="block text-xs text-muted-foreground mb-0.5">Data</span>
                        <span className="font-medium text-muted-foreground">{a.deactivation_date ? new Date(a.deactivation_date).toLocaleDateString() : '-'}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground mb-0.5">Por</span>
                        <span className="font-medium text-muted-foreground">{a.deactivation_user || "-"}</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-border mt-1">
                      <Link to={`/app/patrimonios/${a.id}`} className="btn btn--outline btn--sm px-3">
                        <Eye size={14} />
                      </Link>
                      <button 
                        className="btn btn--outline btn--sm px-4" 
                        disabled={submitting} 
                        onClick={() => handleReactivate(a)}
                      >
                        <ArchiveRestore size={14} className="mr-1.5" /> Reativar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
