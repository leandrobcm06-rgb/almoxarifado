import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileDown, FileSpreadsheet, Download } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/app/patrimonios/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios de Patrimônios | BCM Stock" }] }),
  component: PatrimoniosRelatorios,
});

function PatrimoniosRelatorios() {
  const [loading, setLoading] = useState(false);

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
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios de Patrimônios</h1>
        <p className="text-sm text-muted-foreground">Exporte listagens e históricos para PDF ou Excel.</p>
      </div>

      <Tabs defaultValue="bens" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="bens">Bens Patrimoniais</TabsTrigger>
          <TabsTrigger value="emprestimos">Empréstimos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bens" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Todos os Patrimônios</CardTitle>
                <CardDescription>Inclui ativos e inativos.</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => generateAssetsReport('pdf', 'todos')} disabled={loading}>
                  <FileDown className="h-4 w-4 mr-2 text-red-500" /> PDF
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => generateAssetsReport('excel', 'todos')} disabled={loading}>
                  <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" /> Excel
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Somente Ativos</CardTitle>
                <CardDescription>Apenas os bens em uso ou disponíveis.</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => generateAssetsReport('pdf', 'ativos')} disabled={loading}>
                  <FileDown className="h-4 w-4 mr-2 text-red-500" /> PDF
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => generateAssetsReport('excel', 'ativos')} disabled={loading}>
                  <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" /> Excel
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Somente Inativos</CardTitle>
                <CardDescription>Bens desativados, descartados, etc.</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => generateAssetsReport('pdf', 'inativos')} disabled={loading}>
                  <FileDown className="h-4 w-4 mr-2 text-red-500" /> PDF
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => generateAssetsReport('excel', 'inativos')} disabled={loading}>
                  <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" /> Excel
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="emprestimos" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Todos os Empréstimos</CardTitle>
                <CardDescription>Histórico completo de empréstimos e devoluções.</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => generateLoansReport('pdf', 'todos')} disabled={loading}>
                  <FileDown className="h-4 w-4 mr-2 text-red-500" /> PDF
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => generateLoansReport('excel', 'todos')} disabled={loading}>
                  <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" /> Excel
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Empréstimos em Aberto</CardTitle>
                <CardDescription>Apenas os empréstimos ativos e atrasados.</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => generateLoansReport('pdf', 'abertos')} disabled={loading}>
                  <FileDown className="h-4 w-4 mr-2 text-red-500" /> PDF
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => generateLoansReport('excel', 'abertos')} disabled={loading}>
                  <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" /> Excel
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
