import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { HardHat, User, ArrowLeftRight, Calendar, Paperclip, Download, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empréstimos</h1>
          <p className="text-muted-foreground">Controle de ferramentas com colaboradores e obras.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><HardHat className="h-4 w-4 mr-2" /> Novo Empréstimo</Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Saída de Ferramenta</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleRegisterLoan} className="space-y-4">
              <div className="space-y-2">
                <Label>Ferramenta</Label>
                <Select required value={selectedToolId} onValueChange={setSelectedToolId}>
                  <SelectTrigger>
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
              <div className="space-y-2">
                <Label>Funcionário</Label>
                <Input required placeholder="Nome de quem retirou a ferramenta" value={employee} onChange={e => setEmployee(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cliente / Empresa</Label>
                  <Input placeholder="Ex: ABC Construções" value={client} onChange={e => setClient(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>PCO (Obra)</Label>
                  <Input placeholder="Ex: 12345" value={pco} onChange={e => setPco(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Data Prevista p/ Devolução (Opcional)</Label>
                <Input type="date" value={expectedReturnDate} onChange={e => setExpectedReturnDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Comprovante Assinado (Opcional)</Label>
                <Input type="file" accept="image/*,application/pdf" onChange={e => setReceiptFile(e.target.files?.[0] || null)} />
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea placeholder="Qualquer detalhe extra..." value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={submitting || availableTools.length === 0}>
                  {submitting ? "Registrando..." : "Registrar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center p-8 text-muted-foreground">Carregando histórico...</div>
          ) : loans.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
              Nenhum empréstimo registrado.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Ferramenta</TableHead>
                    <TableHead>Funcionário / Obra</TableHead>
                    <TableHead>Previsão Volta</TableHead>
                    <TableHead>Comprovante</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {format(new Date(loan.loan_date), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        {loan.tool?.name}
                        {loan.tool?.patrimony_number && <span className="block text-xs text-muted-foreground">{loan.tool.patrimony_number}</span>}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{loan.employee}</div>
                        <div className="text-xs text-muted-foreground">{loan.client ? `${loan.client} (PCO: ${loan.pco || '-'})` : '-'}</div>
                      </TableCell>
                      <TableCell>
                        {loan.expected_return_date ? format(new Date(loan.expected_return_date), "dd/MM/yyyy") : "-"}
                      </TableCell>
                      <TableCell>
                        {loan.proof_image_url ? (
                          <Button variant="ghost" size="sm" onClick={() => setViewReceipt(loan.proof_image_url)} title="Ver Comprovante">
                            <Paperclip className="h-4 w-4 text-blue-500" />
                          </Button>
                        ) : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={loan.status === 'ativo' ? "secondary" : "outline"}>
                          {loan.status === 'ativo' ? 'Emprestada' : 'Devolvida'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {loan.status === 'ativo' && (
                          <Button variant="outline" size="sm" onClick={() => {
                            setSelectedLoanToReturn(loan);
                            setIsReturnOpen(true);
                          }}>
                            <ArrowLeftRight className="h-4 w-4 mr-2" /> Devolver
                          </Button>
                        )}
                        {loan.status === 'devolvido' && loan.actual_return_date && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            Voltou em {format(new Date(loan.actual_return_date), "dd/MM/yy")}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Devolução */}
      <Dialog open={isReturnOpen} onOpenChange={setIsReturnOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Devolução</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReturnTool} className="space-y-4">
            <div className="space-y-2">
              <Label>Ferramenta Sendo Devolvida</Label>
              <div className="p-3 bg-muted rounded-md text-sm font-medium">
                {selectedLoanToReturn?.tool?.name} - {selectedLoanToReturn?.employee}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Estado de Conservação ao Retornar</Label>
              <Select value={returnCondition} onValueChange={setReturnCondition}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="boa">Boa (Pronta para uso)</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="ruim">Ruim</SelectItem>
                  <SelectItem value="manutencao">Necessita Manutenção (Indisponibilizar)</SelectItem>
                  <SelectItem value="danificada">Danificada (Indisponibilizar)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Observações na Devolução</Label>
              <Textarea placeholder="Peça quebrada, atraso justificado, etc..." value={returnNotes} onChange={e => setReturnNotes(e.target.value)} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsReturnOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={submitting}>{submitting ? "Processando..." : "Confirmar Devolução"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Visualização de Comprovante */}
      <Dialog open={!!viewReceipt} onOpenChange={() => setViewReceipt(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Comprovante de Empréstimo</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-4 bg-muted rounded-md overflow-hidden min-h-[300px]">
            {viewReceipt && (
              <img src={viewReceipt} alt="Comprovante" className="max-h-[70vh] object-contain" />
            )}
          </div>
          <DialogFooter>
            <a href={viewReceipt || '#'} target="_blank" rel="noopener noreferrer" download>
              <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Baixar Original</Button>
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
