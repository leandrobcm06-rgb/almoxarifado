import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Plus, ArrowRightLeft, ArrowDownToLine, Monitor } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Modal from "@/components/Modal/Modal";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/skeleton";

// Search params for pre-selecting asset
type EmprestimosSearch = { assetId?: string };

export const Route = createFileRoute("/_authenticated/app/patrimonios/emprestimos")({
  validateSearch: (search: Record<string, unknown>): EmprestimosSearch => {
    return { assetId: search.assetId as string | undefined };
  },
  head: () => ({ meta: [{ title: "Empréstimos de Patrimônios | BCM Stock" }] }),
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

  return (
    <div className="page-container animate-fade-in max-w-7xl mx-auto">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Empréstimos de Patrimônios</h1>
            <p className="page-subtitle">Registre e controle as saídas e devoluções dos bens.</p>
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn--primary" onClick={() => { resetLoanForm(); setIsLoanOpen(true); }}>
            <Plus size={16} className="mr-2" /> Novo Empréstimo
          </button>
        </div>
      </div>

      <div className="filter-bar mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            placeholder="Pesquisar por patrimônio, pessoa, destino..." 
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
              icon={ArrowRightLeft} 
              title={search ? "Nenhum empréstimo encontrado" : "Nenhum empréstimo registrado"} 
              description={search ? `Não encontramos resultados para "${search}".` : "Comece registrando a saída do primeiro patrimônio."}
              action={!search ? (
                <button className="btn btn--primary" onClick={() => { resetLoanForm(); setIsLoanOpen(true); }}>
                  Registrar Primeiro Empréstimo
                </button>
              ) : undefined}
            />
          ) : (
            <div className="table-responsive border-0 shadow-none rounded-none">
              <table className="table table--hover m-0">
                <thead>
                  <tr>
                    <th className="glass-header">Patrimônio</th>
                    <th className="glass-header">Retirado por</th>
                    <th className="glass-header hidden md:table-cell">Destino</th>
                    <th className="glass-header">Saída</th>
                    <th className="glass-header">Devolução Prev.</th>
                    <th className="glass-header text-center">Status</th>
                    <th className="glass-header text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((l) => (
                    <tr key={l.id}>
                      <td>
                        <div className="font-semibold text-foreground text-sm">{l.asset?.description}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">{l.asset?.asset_number}</div>
                      </td>
                      <td className="font-medium text-foreground">{l.withdrawn_by}</td>
                      <td className="hidden md:table-cell text-muted-foreground">{l.destination}</td>
                      <td className="text-foreground">{new Date(l.loan_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                      <td className="text-foreground">{new Date(l.expected_return_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                      <td className="text-center">
                        <Badge 
                          variant={l.status === 'atrasado' ? 'destructive' : l.status === 'devolvido' ? 'default' : 'secondary'}
                          className={l.status === 'em aberto' ? 'bg-primary/20 text-primary border-primary/30' : l.status === 'devolvido' ? 'bg-success-bg text-success border-success-border' : ''}
                        >
                          {l.status === 'em aberto' ? 'Em aberto' : l.status.charAt(0).toUpperCase() + l.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        {(l.status === 'em aberto' || l.status === 'atrasado') ? (
                          <button className="btn btn--outline btn--sm text-primary border-primary hover:bg-primary-bg ml-auto" onClick={() => handleOpenReturn(l)}>
                            <ArrowDownToLine size={14} className="mr-2" /> Devolver
                          </button>
                        ) : (
                          <span className="text-xs font-medium text-success text-right block w-full">Devolvido</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile View */}
              <div className="md:hidden flex flex-col gap-3 p-3 bg-muted/10">
                {filtered.map((l) => (
                  <div key={l.id} className="border border-border rounded-xl p-4 bg-card shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-foreground text-base font-display">{l.asset?.description}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">{l.asset?.asset_number}</div>
                      </div>
                      <Badge 
                        variant={l.status === 'atrasado' ? 'destructive' : l.status === 'devolvido' ? 'default' : 'secondary'}
                        className={l.status === 'em aberto' ? 'bg-primary/20 text-primary border-primary/30' : l.status === 'devolvido' ? 'bg-success-bg text-success border-success-border' : ''}
                      >
                        {l.status === 'em aberto' ? 'Em aberto' : l.status.charAt(0).toUpperCase() + l.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm bg-muted/30 p-3 rounded-lg mt-1">
                      <div>
                        <span className="block text-xs text-muted-foreground mb-0.5">Retirado por</span>
                        <span className="font-medium text-foreground">{l.withdrawn_by}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground mb-0.5">Destino</span>
                        <span className="font-medium text-foreground">{l.destination}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground mb-0.5">Saída</span>
                        <span className="font-medium text-foreground">{new Date(l.loan_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground mb-0.5">Devolução Prev.</span>
                        <span className="font-medium text-foreground">{new Date(l.expected_return_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                      </div>
                    </div>

                    {(l.status === 'em aberto' || l.status === 'atrasado') && (
                      <div className="flex justify-end pt-2 border-t border-border mt-1">
                        <button className="btn btn--outline btn--sm text-primary border-primary hover:bg-primary-bg" onClick={() => handleOpenReturn(l)}>
                          <ArrowDownToLine size={14} className="mr-2" /> Devolver Patrimônio
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isLoanOpen} onClose={() => { resetLoanForm(); setIsLoanOpen(false); }} title="Registrar Empréstimo de Patrimônio" size="lg">
        <form onSubmit={handleLoanSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="form-group md:col-span-2">
              <label className="form-label" htmlFor="assetId">Patrimônio *</label>
              <select id="assetId" className="form-input" value={assetId} onChange={e => setAssetId(e.target.value)} required>
                <option value="">Selecione um patrimônio disponível...</option>
                {availableAssets.map(a => (
                  <option key={a.id} value={a.id}>{a.asset_number} - {a.description}</option>
                ))}
                {availableAssets.length === 0 && <option value="none" disabled>Nenhum disponível</option>}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="withdrawnBy">Retirado por (Pessoa) *</label>
              <input id="withdrawnBy" required className="form-input" value={withdrawnBy} onChange={(e) => setWithdrawnBy(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="destination">Setor ou Empresa de Destino *</label>
              <input id="destination" required className="form-input" value={destination} onChange={(e) => setDestination(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="authorizedBy">Autorizado por *</label>
              <input id="authorizedBy" required className="form-input" value={authorizedBy} onChange={(e) => setAuthorizedBy(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reason">Motivo do Empréstimo *</label>
              <input id="reason" required className="form-input" value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="loanDate">Data do Empréstimo *</label>
              <input id="loanDate" type="date" required className="form-input" value={loanDate} onChange={(e) => setLoanDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="expectedReturn">Previsão de Devolução *</label>
              <input id="expectedReturn" type="date" required className="form-input" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} />
            </div>
            <div className="form-group md:col-span-2">
              <label className="form-label" htmlFor="notes">Observações adicionais</label>
              <textarea id="notes" className="form-input min-h-[80px]" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
          <div className="form-actions mt-8">
            <button type="button" className="btn btn--ghost" onClick={() => setIsLoanOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn--primary" disabled={submitting || !assetId}>{submitting ? "Registrando..." : "Registrar Saída"}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isReturnOpen} onClose={() => setIsReturnOpen(false)} title="Registrar Devolução" size="md">
        <form onSubmit={handleReturnSubmit} className="space-y-6">
          <div className="p-4 bg-muted/20 border border-border rounded-lg text-sm text-foreground mb-6">
            <span className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Patrimônio Sendo Devolvido</span>
            <strong className="font-mono">{returningLoan?.asset?.asset_number}</strong> - {returningLoan?.asset?.description}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="form-group md:col-span-2">
              <label className="form-label" htmlFor="actualReturn">Data da Devolução *</label>
              <input id="actualReturn" type="date" required className="form-input" value={actualReturn} onChange={(e) => setActualReturn(e.target.value)} />
            </div>
            
            <div className="form-group md:col-span-2">
              <label className="form-label" htmlFor="returnCondition">Estado de conservação ao retornar *</label>
              <select id="returnCondition" className="form-input" value={returnCondition} onChange={(e) => setReturnCondition(e.target.value)}>
                <option value="Ótimo">Ótimo</option>
                <option value="Bom">Bom</option>
                <option value="Regular">Regular</option>
                <option value="Ruim">Ruim</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="returnedBy">Devolvido por *</label>
              <input id="returnedBy" required className="form-input" value={returnedBy} onChange={(e) => setReturnedBy(e.target.value)} />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="receivedBy">Recebido por *</label>
              <input id="receivedBy" required className="form-input" value={receivedBy} onChange={(e) => setReceivedBy(e.target.value)} />
            </div>
            
            <div className="form-group md:col-span-2">
              <label className="form-label" htmlFor="returnDamages">Registro de Avarias</label>
              <input id="returnDamages" className="form-input" placeholder="Ocorreu algum dano?" value={returnDamages} onChange={(e) => setReturnDamages(e.target.value)} />
            </div>
            
            <div className="form-group md:col-span-2">
              <label className="form-label" htmlFor="returnNotes">Observações adicionais</label>
              <textarea id="returnNotes" className="form-input min-h-[80px]" value={returnNotes} onChange={(e) => setReturnNotes(e.target.value)} />
            </div>
          </div>
          
          <div className="form-actions mt-8">
            <button type="button" className="btn btn--ghost" onClick={() => setIsReturnOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>{submitting ? "Processando..." : "Confirmar Devolução"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
