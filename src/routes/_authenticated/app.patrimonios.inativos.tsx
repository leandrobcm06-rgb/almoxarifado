import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Power, Eye, ArchiveRestore } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/app/patrimonios/inativos")({
  head: () => ({ meta: [{ title: "Patrimônios Inativos | Almoxarifado" }] }),
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
        .order("deactivation_date", { ascending: false })
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-muted-foreground flex items-center gap-2">
            Patrimônios Inativos
          </h1>
          <p className="text-sm text-muted-foreground">Bens desativados, descartados ou perdidos.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Histórico de Desativações</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Pesquisar..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Carregando inativos...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Nenhum patrimônio inativo encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium whitespace-nowrap">Nº Patrimônio</th>
                    <th className="px-4 py-3 font-medium">Descrição</th>
                    <th className="px-4 py-3 font-medium">Motivo da Desativação</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Desativado em</th>
                    <th className="px-4 py-3 font-medium hidden lg:table-cell">Por</th>
                    <th className="px-4 py-3 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((a) => (
                    <tr key={a.id} className="hover:bg-muted/50 transition-colors opacity-75">
                      <td className="px-4 py-3 font-mono font-medium">{a.asset_number}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{a.description}</div>
                        {a.serial_number && <div className="text-xs text-muted-foreground">S/N: {a.serial_number}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-destructive font-medium">{a.deactivation_reason}</div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {a.deactivation_date ? new Date(a.deactivation_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">{a.deactivation_user || "-"}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <Link to={`/app/patrimonios/${a.id}`} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8 mr-1">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Button variant="outline" size="sm" className="h-8" disabled={submitting} onClick={() => handleReactivate(a)}>
                          <ArchiveRestore className="h-4 w-4 mr-2" /> Reativar
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
    </div>
  );
}
