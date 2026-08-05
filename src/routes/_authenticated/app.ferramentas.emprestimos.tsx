import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HardHat, ArrowLeftRight, Paperclip, Download, PackageOpen } from "lucide-react";
import Modal from "@/components/Modal/Modal";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/app/ferramentas/emprestimos")({
  head: () => ({ meta: [{ title: "Empréstimos | Ferramentaria" }] }),
  component: FerramentasEmprestimos,
});

function FerramentasEmprestimos() {
  const [loans, setLoans] = useState<any[]>([]);
  const [availableTools, setAvailableTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [selectedLoanToReturn, setSelectedLoanToReturn] = useState<any>(null);
  const [viewReceipt, setViewReceipt] = useState<string | null>(null);

  // Form states for Loan
  const [selectedToolId, setSelectedToolId] = useState("");
  const [employee, setEmployee] = useState("");
  const [client, setClient] = useState("");
  const [pco, setPco] = useState("");
  const [expectedReturnDate, setExpectedReturnDate] = useState("");
  const [notes, setNotes] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Return State
  const [returnCondition, setReturnCondition] = useState("boa");
  const [returnNotes, setReturnNotes] = useState("");

  async function loadData() {
    setLoading(true);
    try {
      const { data: loansData, error: loansError } = await supabase
        .from("tool_loans")
        .select(`*, tool:tools(name, patrimony_number)`)
        .order("loan_date", { ascending: false });

      if (loansError) throw loansError;
      setLoans(loansData || []);

      const { data: toolsData, error: toolsError } = await supabase
        .from("tools")
        .select("id, name, patrimony_number")
        .eq("status", "disponivel");

      if (toolsError) throw toolsError;
      setAvailableTools(toolsData || []);
    } catch (error: any) {
      toast.error("Erro ao carregar empréstimos: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleRegisterLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (!selectedToolId) throw new Error("Selecione uma ferramenta");

      let proof_image_url = null;
      if (receiptFile) {
        const fileExt = receiptFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('loan-receipts')
          .upload(fileName, receiptFile);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('loan-receipts')
          .getPublicUrl(fileName);
          
        proof_image_url = publicUrl;
      }

      const { error: loanError, data: newLoan } = await supabase
        .from("tool_loans")
        .insert({
          tool_id: selectedToolId,
          employee,
          client,
          pco,
          expected_return_date: expectedReturnDate || null,
          notes,
          proof_image_url
        }).select().single();

      if (loanError) throw loanError;

      const { error: toolUpdateError } = await supabase
        .from("tools")
        .update({ status: "emprestada" })
        .eq("id", selectedToolId);

      if (toolUpdateError) throw toolUpdateError;

      // Registrar movimento
      await supabase.from("tool_movements").insert({
        tool_id: selectedToolId,
        type: "emprestimo",
        employee,
        client,
        pco
      });

      toast.success("Empréstimo registrado com sucesso!");
      setIsAddOpen(false);
      
      // Reset form
      setSelectedToolId(""); setEmployee(""); setClient(""); setPco("");
      setExpectedReturnDate(""); setNotes(""); setReceiptFile(null);
      
      loadData();
    } catch (error: any) {
      toast.error("Erro ao registrar: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturnTool = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (!selectedLoanToReturn) return;

      const { error: loanError } = await supabase
        .from("tool_loans")
        .update({
          status: "devolvido",
          actual_return_date: new Date().toISOString()
        })
        .eq("id", selectedLoanToReturn.id);

      if (loanError) throw loanError;

      // Determine novo status da ferramenta com base na condição
      const newStatus = (returnCondition === 'danificada' || returnCondition === 'manutencao') 
        ? returnCondition 
        : 'disponivel';

      const { error: toolUpdateError } = await supabase
        .from("tools")
        .update({ 
          status: newStatus,
          condition: returnCondition 
        })
        .eq("id", selectedLoanToReturn.tool_id);

      if (toolUpdateError) throw toolUpdateError;

      // Registrar movimento
      await supabase.from("tool_movements").insert({
        tool_id: selectedLoanToReturn.tool_id,
        type: "devolucao",
        employee: selectedLoanToReturn.employee,
        client: selectedLoanToReturn.client,
        pco: selectedLoanToReturn.pco,
        condition: returnCondition
      });

      toast.success("Devolução registrada com sucesso!");
      setIsReturnOpen(false);
      setSelectedLoanToReturn(null);
      setReturnCondition("boa");
      setReturnNotes("");
      loadData();
    } catch (error: any) {
      toast.error("Erro ao registrar devolução: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Empréstimos</h1>
            <p className="page-subtitle">Controle de ferramentas com colaboradores e obras.</p>
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn--primary" onClick={() => setIsAddOpen(true)}>
            <HardHat size={16} className="mr-2" /> Novo Empréstimo
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-border">
        <div className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton height="40px" width="100%" />
              <Skeleton height="40px" width="100%" />
              <Skeleton height="40px" width="100%" />
              <Skeleton height="40px" width="100%" />
            </div>
          ) : loans.length === 0 ? (
            <EmptyState 
              icon={PackageOpen} 
              title="Nenhum empréstimo registrado" 
              description="Você não possui nenhum empréstimo de ferramenta no momento."
              action={
                <button className="btn btn--primary" onClick={() => setIsAddOpen(true)}>
                  Registrar Primeiro Empréstimo
                </button>
              }
            />
          ) : (
            <div className="table-responsive border-0 shadow-none rounded-none">
              <table className="table table--hover m-0">
                <thead>
                  <tr>
                    <th className="glass-header">Data</th>
                    <th className="glass-header">Ferramenta</th>
                    <th className="glass-header">Funcionário / Obra</th>
                    <th className="glass-header">Previsão Volta</th>
                    <th className="glass-header text-center">Comprovante</th>
                    <th className="glass-header">Status</th>
                    <th className="glass-header text-right">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan.id}>
                      <td className="whitespace-nowrap text-muted-foreground">
                        {format(new Date(loan.loan_date), "dd/MM/yyyy HH:mm")}
                      </td>
                      <td>
                        <div className="font-semibold text-foreground font-display">{loan.tool?.name}</div>
                        {loan.tool?.patrimony_number && <div className="text-xs font-mono text-muted-foreground">{loan.tool.patrimony_number}</div>}
                      </td>
                      <td>
                        <div className="font-medium text-foreground">{loan.employee}</div>
                        <div className="text-xs text-muted-foreground">{loan.client ? `${loan.client} (PCO: ${loan.pco || '-'})` : '-'}</div>
                      </td>
                      <td className="text-foreground">
                        {loan.expected_return_date ? format(new Date(loan.expected_return_date), "dd/MM/yyyy") : "-"}
                      </td>
                      <td className="text-center">
                        {loan.proof_image_url ? (
                          <button className="btn-icon mx-auto text-primary" onClick={() => setViewReceipt(loan.proof_image_url)} title="Ver Comprovante">
                            <Paperclip size={16} />
                          </button>
                        ) : <span className="text-muted-foreground">-</span>}
                      </td>
                      <td>
                        <Badge variant={loan.status === 'ativo' ? "secondary" : "outline"} className={loan.status === 'ativo' ? 'bg-primary/20 text-primary border-primary/30' : ''}>
                          {loan.status === 'ativo' ? 'Emprestada' : 'Devolvida'}
                        </Badge>
                      </td>
                      <td className="text-right">
                        {loan.status === 'ativo' ? (
                          <button className="btn btn--outline btn--sm ml-auto" onClick={() => {
                            setSelectedLoanToReturn(loan);
                            setIsReturnOpen(true);
                          }}>
                            <ArrowLeftRight size={14} className="mr-2" /> Devolver
                          </button>
                        ) : loan.actual_return_date ? (
                          <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                            Voltou em {format(new Date(loan.actual_return_date), "dd/MM/yy")}
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="md:hidden flex flex-col gap-3 p-3 bg-muted/10">
                {loans.map((loan) => (
                  <div key={loan.id} className="border border-border rounded-xl p-4 bg-card shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-foreground font-display">{loan.tool?.name}</div>
                        {loan.tool?.patrimony_number && <div className="text-xs font-mono text-muted-foreground">{loan.tool.patrimony_number}</div>}
                      </div>
                      <Badge variant={loan.status === 'ativo' ? "secondary" : "outline"} className={loan.status === 'ativo' ? 'bg-primary/20 text-primary border-primary/30' : ''}>
                        {loan.status === 'ativo' ? 'Emprestada' : 'Devolvida'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm bg-muted/30 p-3 rounded-md mt-1">
                      <div className="col-span-2">
                        <span className="block text-xs text-muted-foreground">Funcionário</span>
                        <span className="font-medium text-foreground">{loan.employee}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="block text-xs text-muted-foreground">Obra / Cliente</span>
                        <span className="text-foreground">{loan.client ? `${loan.client} (PCO: ${loan.pco || '-'})` : '-'}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground">Data Retirada</span>
                        <span className="text-foreground">{format(new Date(loan.loan_date), "dd/MM/yy HH:mm")}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground">Previsão Volta</span>
                        <span className="text-foreground">{loan.expected_return_date ? format(new Date(loan.expected_return_date), "dd/MM/yy") : "-"}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-border mt-1">
                      {loan.proof_image_url ? (
                        <button className="btn btn--ghost text-primary px-2" onClick={() => setViewReceipt(loan.proof_image_url)}>
                          <Paperclip size={14} className="mr-1" /> Comprovante
                        </button>
                      ) : <span className="text-xs text-muted-foreground italic">Sem comprovante</span>}
                      
                      {loan.status === 'ativo' ? (
                        <button className="btn btn--outline btn--sm" onClick={() => {
                          setSelectedLoanToReturn(loan);
                          setIsReturnOpen(true);
                        }}>
                          <ArrowLeftRight size={14} className="mr-1" /> Devolver
                        </button>
                      ) : loan.actual_return_date ? (
                        <span className="text-xs text-muted-foreground font-medium">Voltou em {format(new Date(loan.actual_return_date), "dd/MM/yy")}</span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Registrar Saída de Ferramenta" size="lg">
        <form onSubmit={handleRegisterLoan} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Ferramenta (obrigatório)</label>
            <Select required value={selectedToolId} onValueChange={setSelectedToolId}>
              <SelectTrigger className="form-input h-10">
                <SelectValue placeholder="Selecione uma ferramenta disponível..." />
              </SelectTrigger>
              <SelectContent>
                {availableTools.map(t => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} {t.patrimony_number ? `(${t.patrimony_number})` : ''}
                  </SelectItem>
                ))}
                {availableTools.length === 0 && (
                  <SelectItem value="none" disabled>Nenhuma ferramenta disponível</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="form-group">
            <label className="form-label">Funcionário (obrigatório)</label>
            <input required placeholder="Nome de quem retirou a ferramenta" className="form-input" value={employee} onChange={e => setEmployee(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Cliente / Empresa</label>
              <input placeholder="Ex: ABC Construções" className="form-input" value={client} onChange={e => setClient(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">PCO (Obra)</label>
              <input placeholder="Ex: 12345" className="form-input" value={pco} onChange={e => setPco(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Data Prevista p/ Devolução (Opcional)</label>
            <input type="date" className="form-input" value={expectedReturnDate} onChange={e => setExpectedReturnDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Comprovante Assinado (Opcional)</label>
            <input type="file" accept="image/*,application/pdf" className="form-input file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90" onChange={e => setReceiptFile(e.target.files?.[0] || null)} />
          </div>
          <div className="form-group">
            <label className="form-label">Observações</label>
            <textarea placeholder="Qualquer detalhe extra..." className="form-input min-h-[80px]" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div className="form-actions mt-6">
            <button type="button" className="btn btn--ghost" onClick={() => setIsAddOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn--primary" disabled={submitting || availableTools.length === 0}>
              {submitting ? "Registrando..." : "Registrar Saída"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isReturnOpen} onClose={() => setIsReturnOpen(false)} title="Registrar Devolução" size="md">
        <form onSubmit={handleReturnTool} className="space-y-6">
          <div className="form-group">
            <label className="form-label">Ferramenta Sendo Devolvida</label>
            <div className="p-4 bg-muted/20 border border-border rounded-lg text-sm font-medium text-foreground flex items-center justify-between">
              <span>{selectedLoanToReturn?.tool?.name}</span>
              <span className="text-muted-foreground font-normal bg-card px-2 py-1 rounded shadow-sm border border-border">{selectedLoanToReturn?.employee}</span>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Estado de Conservação ao Retornar</label>
            <Select value={returnCondition} onValueChange={setReturnCondition}>
              <SelectTrigger className="form-input h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="boa">Boa (Pronta para uso)</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="ruim">Ruim</SelectItem>
                <SelectItem value="manutencao">Necessita Manutenção (Indisponibilizar)</SelectItem>
                <SelectItem value="danificada">Danificada (Indisponibilizar)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="form-group">
            <label className="form-label">Observações na Devolução</label>
            <textarea placeholder="Peça quebrada, atraso justificado, etc..." className="form-input min-h-[100px]" value={returnNotes} onChange={e => setReturnNotes(e.target.value)} />
          </div>

          <div className="form-actions mt-8">
            <button type="button" className="btn btn--ghost" onClick={() => setIsReturnOpen(false)}>Cancelar</button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? "Processando..." : "Confirmar Devolução"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!viewReceipt} onClose={() => setViewReceipt(null)} title="Comprovante de Empréstimo" size="lg">
        <div className="space-y-6">
          <div className="flex justify-center p-4 bg-black/5 rounded-xl border border-border overflow-hidden min-h-[300px]">
            {viewReceipt && (
              <img src={viewReceipt} alt="Comprovante" className="max-h-[70vh] object-contain rounded-md" />
            )}
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" className="btn btn--ghost" onClick={() => setViewReceipt(null)}>Fechar</button>
            <a href={viewReceipt || '#'} target="_blank" rel="noopener noreferrer" download>
              <button className="btn btn--primary"><Download size={16} className="mr-2" /> Baixar Original</button>
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
}
