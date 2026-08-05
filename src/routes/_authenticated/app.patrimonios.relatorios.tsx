import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileDown, FileSpreadsheet, Monitor, ArrowRightLeft } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const Route = createFileRoute("/_authenticated/app/patrimonios/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios de Patrimônios | BCM Stock" }] }),
  component: PatrimoniosRelatorios,
});

function PatrimoniosRelatorios() {
  const [loading, setLoading] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<'bens' | 'emprestimos'>('bens');

  const generateAssetsReport = async (type: 'pdf' | 'excel', filter: 'todos' | 'ativos' | 'inativos') => {
    setLoading(true);
    try {
      let query = supabase.from("assets").select("*").order("created_at", { ascending: false });
      if (filter === 'ativos') query = query.eq("is_active", true);
      if (filter === 'inativos') query = query.eq("is_active", false);

      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) return toast.warning("Nenhum dado encontrado para gerar o relatório.");

      if (type === 'excel') {
        const wsData = data.map(a => ({
          "Nº Patrimônio": a.asset_number,
          "Descrição": a.description,
          "Marca": a.brand || "-",
          "Modelo": a.model || "-",
          "S/N": a.serial_number || "-",
          "Estado": a.condition,
          "Responsável": a.responsible || "-",
          "Localização": a.location || "-",
          "Status": a.status,
          "Ativo?": a.is_active ? "Sim" : "Não",
          "Aquisição": a.acquisition_date ? new Date(a.acquisition_date).toLocaleDateString() : "-",
          "Data Desativação": a.deactivation_date ? new Date(a.deactivation_date).toLocaleDateString() : "-",
          "Motivo Desativação": a.deactivation_reason || "-"
        }));
        
        const ws = XLSX.utils.json_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Patrimônios");
        XLSX.writeFile(wb, `Relatorio_Patrimonios_${filter}_${new Date().toISOString().split('T')[0]}.xlsx`);
      } else {
        const doc = new jsPDF("landscape");
        doc.text(`Relatório de Patrimônios - ${filter.toUpperCase()}`, 14, 15);
        
        const tableData = data.map(a => [
          a.asset_number,
          a.description,
          a.brand || "-",
          a.condition,
          a.responsible || "-",
          a.location || "-",
          a.is_active ? (a.status === 'disponivel' ? 'Disp.' : 'Emprest.') : 'Inativo'
        ]);

        autoTable(doc, {
          startY: 20,
          head: [["Nº Patr.", "Descrição", "Marca", "Estado", "Responsável", "Localização", "Status"]],
          body: tableData,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [41, 128, 185] }
        });
        
        doc.save(`Relatorio_Patrimonios_${filter}_${new Date().toISOString().split('T')[0]}.pdf`);
      }
      toast.success("Relatório gerado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao gerar relatório: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateLoansReport = async (type: 'pdf' | 'excel', filter: 'todos' | 'abertos') => {
    setLoading(true);
    try {
      let query = supabase.from("asset_loans").select("*, asset:assets(description, asset_number)").order("created_at", { ascending: false });
      if (filter === 'abertos') query = query.in("status", ["em aberto", "atrasado"]);

      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) return toast.warning("Nenhum dado encontrado para gerar o relatório.");

      if (type === 'excel') {
        const wsData = data.map(l => ({
          "Nº Patrimônio": l.asset?.asset_number,
          "Descrição": l.asset?.description,
          "Retirado Por": l.withdrawn_by,
          "Destino": l.destination,
          "Autorizado Por": l.authorized_by,
          "Data Saída": new Date(l.loan_date).toLocaleDateString(),
          "Devolução Prevista": new Date(l.expected_return_date).toLocaleDateString(),
          "Devolução Real": l.actual_return_date ? new Date(l.actual_return_date).toLocaleDateString() : "-",
          "Status": l.status,
          "Motivo": l.reason
        }));
        
        const ws = XLSX.utils.json_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Empréstimos");
        XLSX.writeFile(wb, `Relatorio_Emprestimos_Patrimonios_${filter}_${new Date().toISOString().split('T')[0]}.xlsx`);
      } else {
        const doc = new jsPDF("landscape");
        doc.text(`Relatório de Empréstimos de Patrimônios - ${filter.toUpperCase()}`, 14, 15);
        
        const tableData = data.map(l => [
          l.asset?.asset_number,
          l.asset?.description,
          l.withdrawn_by,
          l.destination,
          new Date(l.loan_date).toLocaleDateString(),
          new Date(l.expected_return_date).toLocaleDateString(),
          l.status
        ]);

        autoTable(doc, {
          startY: 20,
          head: [["Nº Patr.", "Descrição", "Retirado Por", "Destino", "Data Saída", "Prev. Devolução", "Status"]],
          body: tableData,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [41, 128, 185] }
        });
        
        doc.save(`Relatorio_Emprestimos_Patrimonios_${filter}_${new Date().toISOString().split('T')[0]}.pdf`);
      }
      toast.success("Relatório gerado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao gerar relatório: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container animate-fade-in max-w-7xl mx-auto">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Relatórios de Patrimônios</h1>
            <p className="page-subtitle">Exporte listagens e históricos para PDF ou Excel.</p>
          </div>
        </div>
      </div>

      <div className="page-tabs mb-6">
        <button 
          className={`page-tab ${abaAtiva === 'bens' ? 'page-tab--active' : ''}`}
          onClick={() => setAbaAtiva('bens')}
        >
          <Monitor size={16} /> Bens Patrimoniais
        </button>
        <button 
          className={`page-tab ${abaAtiva === 'emprestimos' ? 'page-tab--active' : ''}`}
          onClick={() => setAbaAtiva('emprestimos')}
        >
          <ArrowRightLeft size={16} /> Empréstimos
        </button>
      </div>

      <div className="px-0 sm:px-2 md:px-4">
        {abaAtiva === 'bens' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
            <div className="glass-panel p-6 rounded-xl border border-border flex flex-col h-full">
              <h3 className="text-lg font-semibold font-display text-foreground mb-1">Todos os Patrimônios</h3>
              <p className="text-sm text-muted-foreground mb-6 flex-1">Inclui todos os ativos e inativos cadastrados no sistema.</p>
              
              <div className="flex gap-3 mt-auto">
                <button 
                  className="btn btn--outline flex-1 border-border hover:bg-danger-bg hover:text-danger hover:border-danger-border transition-colors group" 
                  onClick={() => generateAssetsReport('pdf', 'todos')} 
                  disabled={loading}
                >
                  <FileDown size={16} className="mr-2 text-danger group-hover:scale-110 transition-transform" /> PDF
                </button>
                <button 
                  className="btn btn--outline flex-1 border-border hover:bg-success-bg hover:text-success hover:border-success-border transition-colors group" 
                  onClick={() => generateAssetsReport('excel', 'todos')} 
                  disabled={loading}
                >
                  <FileSpreadsheet size={16} className="mr-2 text-success group-hover:scale-110 transition-transform" /> Excel
                </button>
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-xl border border-border flex flex-col h-full">
              <h3 className="text-lg font-semibold font-display text-foreground mb-1">Somente Ativos</h3>
              <p className="text-sm text-muted-foreground mb-6 flex-1">Apenas os bens em uso, disponíveis ou emprestados.</p>
              
              <div className="flex gap-3 mt-auto">
                <button 
                  className="btn btn--outline flex-1 border-border hover:bg-danger-bg hover:text-danger hover:border-danger-border transition-colors group" 
                  onClick={() => generateAssetsReport('pdf', 'ativos')} 
                  disabled={loading}
                >
                  <FileDown size={16} className="mr-2 text-danger group-hover:scale-110 transition-transform" /> PDF
                </button>
                <button 
                  className="btn btn--outline flex-1 border-border hover:bg-success-bg hover:text-success hover:border-success-border transition-colors group" 
                  onClick={() => generateAssetsReport('excel', 'ativos')} 
                  disabled={loading}
                >
                  <FileSpreadsheet size={16} className="mr-2 text-success group-hover:scale-110 transition-transform" /> Excel
                </button>
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-xl border border-border flex flex-col h-full">
              <h3 className="text-lg font-semibold font-display text-foreground mb-1">Somente Inativos</h3>
              <p className="text-sm text-muted-foreground mb-6 flex-1">Apenas os bens desativados, descartados ou extraviados.</p>
              
              <div className="flex gap-3 mt-auto">
                <button 
                  className="btn btn--outline flex-1 border-border hover:bg-danger-bg hover:text-danger hover:border-danger-border transition-colors group" 
                  onClick={() => generateAssetsReport('pdf', 'inativos')} 
                  disabled={loading}
                >
                  <FileDown size={16} className="mr-2 text-danger group-hover:scale-110 transition-transform" /> PDF
                </button>
                <button 
                  className="btn btn--outline flex-1 border-border hover:bg-success-bg hover:text-success hover:border-success-border transition-colors group" 
                  onClick={() => generateAssetsReport('excel', 'inativos')} 
                  disabled={loading}
                >
                  <FileSpreadsheet size={16} className="mr-2 text-success group-hover:scale-110 transition-transform" /> Excel
                </button>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === 'emprestimos' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
            <div className="glass-panel p-6 rounded-xl border border-border flex flex-col h-full">
              <h3 className="text-lg font-semibold font-display text-foreground mb-1">Todos os Empréstimos</h3>
              <p className="text-sm text-muted-foreground mb-6 flex-1">Histórico completo de empréstimos, devoluções e atrasos.</p>
              
              <div className="flex gap-3 mt-auto">
                <button 
                  className="btn btn--outline flex-1 border-border hover:bg-danger-bg hover:text-danger hover:border-danger-border transition-colors group" 
                  onClick={() => generateLoansReport('pdf', 'todos')} 
                  disabled={loading}
                >
                  <FileDown size={16} className="mr-2 text-danger group-hover:scale-110 transition-transform" /> PDF
                </button>
                <button 
                  className="btn btn--outline flex-1 border-border hover:bg-success-bg hover:text-success hover:border-success-border transition-colors group" 
                  onClick={() => generateLoansReport('excel', 'todos')} 
                  disabled={loading}
                >
                  <FileSpreadsheet size={16} className="mr-2 text-success group-hover:scale-110 transition-transform" /> Excel
                </button>
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-xl border border-border flex flex-col h-full">
              <h3 className="text-lg font-semibold font-display text-foreground mb-1">Empréstimos em Aberto</h3>
              <p className="text-sm text-muted-foreground mb-6 flex-1">Apenas os empréstimos ativos no momento e atrasados.</p>
              
              <div className="flex gap-3 mt-auto">
                <button 
                  className="btn btn--outline flex-1 border-border hover:bg-danger-bg hover:text-danger hover:border-danger-border transition-colors group" 
                  onClick={() => generateLoansReport('pdf', 'abertos')} 
                  disabled={loading}
                >
                  <FileDown size={16} className="mr-2 text-danger group-hover:scale-110 transition-transform" /> PDF
                </button>
                <button 
                  className="btn btn--outline flex-1 border-border hover:bg-success-bg hover:text-success hover:border-success-border transition-colors group" 
                  onClick={() => generateLoansReport('excel', 'abertos')} 
                  disabled={loading}
                >
                  <FileSpreadsheet size={16} className="mr-2 text-success group-hover:scale-110 transition-transform" /> Excel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
