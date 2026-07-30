import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Search, Plus, ArrowRightLeft, ArrowDownToLine, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Search params for pre-selecting asset
type EmprestimosSearch = { assetId?: string };

export const Route = createFileRoute("/_authenticated/app/patrimonios/emprestimos")({
  validateSearch: (search: Record<string, unknown>): EmprestimosSearch => {
    return { assetId: search.assetId as string | undefined };
  },
  head: () => ({ meta: [{ title: "Empréstimos de Patrimônios | Almoxarifado" }] }),
  component: EmprestimosList,
});

function EmprestimosList() {
  const { assetId: initialAssetId } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [loans, setLoans] = useState<any[]>([]);
  const [availableAssets, setAvailableAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Dialogs
  const [isLoanOpen, setIsLoanOpen] = useState(!!initialAssetId);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Loan Form State
  const [assetId, setAssetId] = useState(initialAssetId || "");
  const [withdrawnBy, setWithdrawnBy] = useState("");
  const [destination, setDestination] = useState("");
  const [authorizedBy, setAuthorizedBy] = useState("");
  const [loanDate, setLoanDate] = useState(new Date().toISOString().split("T")[0]);
  const [expectedReturn, setExpectedReturn] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  // Return Form State
  const [returningLoan, setReturningLoan] = useState<any>(null);
  const [actualReturn, setActualReturn] = useState(new Date().toISOString().split("T")[0]);
  const [returnedBy, setReturnedBy] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [returnCondition, setReturnCondition] = useState("");
  const [returnDamages, setReturnDamages] = useState("");
  const [returnNotes, setReturnNotes] = useState("");

  async function loadData() {
    setLoading(true);
    try {
      const [loansRes, assetsRes] = await Promise.all([
        supabase.from("asset_loans").select("*, asset:assets(*)").order("created_at", { ascending: false }),
        supabase.from("assets").select("*").eq("is_active", true).eq("status", "disponivel").order("description")
      ]);

      if (loansRes.error) throw loansRes.error;
      if (assetsRes.error) throw assetsRes.error;

      // Update loans statuses if delayed
      let updatedLoans = loansRes.data || [];
      const today = new Date().toISOString().split("T")[0];
      
      const toUpdate = updatedLoans.filter(l => l.status === 'em aberto' && l.expected_return_date < today);
      if (toUpdate.length > 0) {
        for (const l of toUpdate) {
          await supabase.from("asset_loans").update({ status: 'atrasado' }).eq("id", l.id);
          l.status = 'atrasado';
        }
      }

      setLoans(updatedLoans);
      setAvailableAssets(assetsRes.data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar dados: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const resetLoanForm = () => {
    setAssetId(""); setWithdrawnBy(""); setDestination(""); setAuthorizedBy("");
    setLoanDate(new Date().toISOString().split("T")[0]); setExpectedReturn("");
    setReason(""); setNotes("");
    if (initialAssetId) navigate({ search: {} });
  };

  const handleLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const asset = availableAssets.find(a => a.id === assetId);
      if (!asset) throw new Error("Patrimônio não encontrado ou não está disponível.");

      const payload = {
        asset_id: assetId, withdrawn_by: withdrawnBy, destination, authorized_by: authorizedBy,
        loan_date: new Date(loanDate).toISOString(), expected_return_date: expectedReturn,
        reason, notes, status: "em aberto"
      };

      const { data: user } = await supabase.auth.getUser();

      const { error } = await supabase.from("asset_loans").insert(payload);
      if (error) throw error;

      await supabase.from("assets").update({ status: "emprestado" }).eq("id", assetId);

      await supabase.from("asset_history").insert({
        asset_id: assetId, action: "Empréstimo",
        description: `Emprestado para ${withdrawnBy} no setor ${destination}.`, user_name: user.user?.email
      });

      toast.success("Empréstimo registrado!");
      setIsLoanOpen(false);
      resetLoanForm();
      loadData();
    } catch (error: any) {
      toast.error("Erro ao registrar: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenReturn = (loan: any) => {
    setReturningLoan(loan);
    setActualReturn(new Date().toISOString().split("T")[0]);
    setReturnedBy(loan.withdrawn_by);
    setReceivedBy("");
    setReturnCondition(loan.asset?.condition || "Bom");
    setReturnDamages("");
    setReturnNotes("");
    setIsReturnOpen(true);
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data: user } = await supabase.auth.getUser();

      // Update loan
      const { error: loanErr } = await supabase.from("asset_loans").update({
        status: "devolvido",
        actual_return_date: new Date(actualReturn).toISOString(),
        returned_by: returnedBy,
        received_by: receivedBy,
        return_condition: returnCondition,
        return_damages: returnDamages,
        return_notes: returnNotes
      }).eq("id", returningLoan.id);
      if (loanErr) throw loanErr;

      // Update asset status and condition
      const { error: assetErr } = await supabase.from("assets").update({ 
        status: "disponivel",
        condition: returnCondition
      }).eq("id", returningLoan.asset_id);
      if (assetErr) throw assetErr;

      // Add History
      let desc = `Devolvido por ${returnedBy}. Estado: ${returnCondition}.`;
      if (returnDamages) desc += ` Avarias: ${returnDamages}`;

      await supabase.from("asset_history").insert({
        asset_id: returningLoan.asset_id, action: "Devolução",
        description: desc, user_name: user.user?.email
      });

      toast.success("Devolução registrada com sucesso!");
      setIsReturnOpen(false);
      loadData();
    } catch (error: any) {
      toast.error("Erro ao devolver: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search) return loans;
    const lower = search.toLowerCase();
    return loans.filter((l) => 
      l.asset?.description.toLowerCase().includes(lower) || 
      l.asset?.asset_number.toLowerCase().includes(lower) || 
      l.withdrawn_by.toLowerCase().includes(lower) ||
      l.destination.toLowerCase().includes(lower)
    );
  }, [loans, search]);

  const statusColors: Record<string, string> = { 
    "em aberto": "default", 
    "devolvido": "success", 
    "atrasado": "destructive",
    "cancelado": "secondary"
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empréstimos de Patrimônios</h1>
          <p className="text-sm text-muted-foreground">Registre e controle as saídas e devoluções dos bens.</p>
        </div>
        <Dialog open={isLoanOpen} onOpenChange={(v) => { if (!v) resetLoanForm(); setIsLoanOpen(v); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Novo Empréstimo</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Empréstimo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleLoanSubmit} className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="assetId">Patrimônio *</Label>
                <Select value={assetId} onValueChange={setAssetId} required>
                  <SelectTrigger><SelectValue placeholder="Selecione um patrimônio disponível" /></SelectTrigger>
                  <SelectContent>
                    {availableAssets.map(a => (
                      <SelectItem key={a.id} value={a.id}>{a.asset_number} - {a.description}</SelectItem>
                    ))}
                    {availableAssets.length === 0 && <SelectItem value="none" disabled>Nenhum disponível</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="withdrawnBy">Retirado por (Pessoa) *</Label>
                <Input id="withdrawnBy" required value={withdrawnBy} onChange={(e) => setWithdrawnBy(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Setor ou Empresa de Destino *</Label>
                <Input id="destination" required value={destination} onChange={(e) => setDestination(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authorizedBy">Autorizado por *</Label>
                <Input id="authorizedBy" required value={authorizedBy} onChange={(e) => setAuthorizedBy(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Motivo do Empréstimo *</Label>
                <Input id="reason" required value={reason} onChange={(e) => setReason(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanDate">Data do Empréstimo *</Label>
                <Input id="loanDate" type="date" required value={loanDate} onChange={(e) => setLoanDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedReturn">Previsão de Devolução *</Label>
                <Input id="expectedReturn" type="date" required value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="resize-none" rows={3} />
              </div>
              <DialogFooter className="col-span-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsLoanOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={submitting || !assetId}>{submitting ? "Salvando..." : "Registrar Saída"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Histórico e Empréstimos Atuais</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Pesquisar..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Carregando empréstimos...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Nenhum empréstimo encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Patrimônio</th>
                    <th className="px-4 py-3 font-medium">Retirado por</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Destino</th>
                    <th className="px-4 py-3 font-medium">Saída</th>
                    <th className="px-4 py-3 font-medium">Devolução Prev.</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((l) => (
                    <tr key={l.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium">{l.asset?.description}</div>
                        <div className="text-xs text-muted-foreground">{l.asset?.asset_number}</div>
                      </td>
                      <td className="px-4 py-3">{l.withdrawn_by}</td>
                      <td className="px-4 py-3 hidden md:table-cell">{l.destination}</td>
                      <td className="px-4 py-3">{new Date(l.loan_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                      <td className="px-4 py-3">{new Date(l.expected_return_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusColors[l.status] as any || "outline"}>
                          {l.status === 'em aberto' ? 'Em aberto' : l.status.charAt(0).toUpperCase() + l.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {(l.status === 'em aberto' || l.status === 'atrasado') && (
                          <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleOpenReturn(l)}>
                            <ArrowDownToLine className="h-4 w-4 mr-2" /> Devolver
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Return Dialog */}
      <Dialog open={isReturnOpen} onOpenChange={setIsReturnOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Registrar Devolução</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReturnSubmit} className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 text-sm bg-muted/50 p-3 rounded-md mb-2">
              <strong>Patrimônio:</strong> {returningLoan?.asset?.asset_number} - {returningLoan?.asset?.description}
            </div>
            <div className="space-y-2">
              <Label htmlFor="actualReturn">Data da Devolução *</Label>
              <Input id="actualReturn" type="date" required value={actualReturn} onChange={(e) => setActualReturn(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="returnCondition">Estado de conservação *</Label>
              <Select value={returnCondition} onValueChange={setReturnCondition}>
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
              <Label htmlFor="returnedBy">Devolvido por *</Label>
              <Input id="returnedBy" required value={returnedBy} onChange={(e) => setReturnedBy(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receivedBy">Recebido por *</Label>
              <Input id="receivedBy" required value={receivedBy} onChange={(e) => setReceivedBy(e.target.value)} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="returnDamages">Registro de Avarias</Label>
              <Input id="returnDamages" placeholder="Ocorreu algum dano?" value={returnDamages} onChange={(e) => setReturnDamages(e.target.value)} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="returnNotes">Observações</Label>
              <Textarea id="returnNotes" value={returnNotes} onChange={(e) => setReturnNotes(e.target.value)} className="resize-none" rows={2} />
            </div>
            
            <DialogFooter className="col-span-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setIsReturnOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={submitting}>{submitting ? "Processando..." : "Confirmar Devolução"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
