import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileSpreadsheet, Printer } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/app/cobre/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios de Cobre | Almoxarifado" }] }),
  component: ReportsView,
});

function ReportsView() {
  const [reportType, setReportType] = useState("cobre_estoque");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [loading, setLoading] = useState(false);

  const exportCSV = (filename: string, headers: string[], data: any[]) => {
    const csvContent = [
      headers.join(";"),
      ...data.map(row => 
        headers.map(field => {
          let val = row[field];
          if (val === null || val === undefined) val = '';
          val = val.toString().replace(/"/g, '""');
          return `"${val}"`;
        }).join(";")
      )
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}_${format(new Date(), 'dd-MM-yyyy')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async (formatType: 'csv' | 'pdf') => {
    setLoading(true);
    try {
      if (reportType === "cobre_estoque") {
        const { data, error } = await supabase.from("copper_pieces").select("*, bar:copper_bars(name, auxiliary_code)").eq("status", "disponivel");
        if (error) throw error;
        if (!data || data.length === 0) return toast.info("Nenhum dado encontrado.");
        
        const flatData = data.map(d => ({
          barra: d.bar?.name,
          codigo: d.bar?.auxiliary_code,
          comprimento_m: (d.current_length_mm / 1000).toFixed(2),
          status: d.status
        }));

        if (formatType === 'csv') {
          exportCSV("Estoque_Cobre", ["barra", "codigo", "comprimento_m", "status"], flatData);
        } else {
          printView("Estoque de Cobre Atual", flatData, ["Barra Matriz", "Cód. Auxiliar", "Comprimento (m)", "Status"], ["barra", "codigo", "comprimento_m", "status"]);
        }
      } else if (reportType === "cobre_consumo") {
        let query = supabase.from("copper_movements").select("*, bar:copper_bars(name)").eq("type", "saida");
        if (dateStart) query = query.gte("created_at", new Date(dateStart).toISOString());
        if (dateEnd) {
          const end = new Date(dateEnd);
          end.setDate(end.getDate() + 1);
          query = query.lt("created_at", end.toISOString());
        }
        
        const { data, error } = await query;
        if (error) throw error;
        if (!data || data.length === 0) return toast.info("Nenhum dado encontrado.");

        const flatData = data.map(d => ({
          data: format(new Date(d.created_at), "dd/MM/yyyy"),
          barra: d.bar?.name,
          saida_m: (d.length_mm / 1000).toFixed(2),
          cliente: d.client,
          pco: d.pco,
          responsavel: d.responsible
        }));

        if (formatType === 'csv') {
          exportCSV("Consumo_Cobre", ["data", "barra", "saida_m", "cliente", "pco", "responsavel"], flatData);
        } else {
          printView("Consumo de Cobre", flatData, ["Data", "Barra", "Saída (m)", "Cliente", "PCO", "Responsável"], ["data", "barra", "saida_m", "cliente", "pco", "responsavel"]);
        }
      } else if (reportType === "cobre_entradas") {
        let query = supabase.from("copper_movements").select("*, bar:copper_bars(name)").in("type", ["corte", "devolucao", "ajuste_entrada"]);
        if (dateStart) query = query.gte("created_at", new Date(dateStart).toISOString());
        if (dateEnd) {
          const end = new Date(dateEnd);
          end.setDate(end.getDate() + 1);
          query = query.lt("created_at", end.toISOString());
        }
        
        const { data, error } = await query;
        if (error) throw error;
        if (!data || data.length === 0) return toast.info("Nenhum dado encontrado.");

        const flatData = data.map(d => ({
          data: format(new Date(d.created_at), "dd/MM/yyyy HH:mm"),
          tipo: d.type,
          barra: d.bar?.name,
          comprimento_m: (d.length_mm / 1000).toFixed(2),
          responsavel: d.responsible
        }));

        if (formatType === 'csv') {
          exportCSV("Entradas_Cobre", ["data", "tipo", "barra", "comprimento_m", "responsavel"], flatData);
        } else {
          printView("Histórico de Entradas de Cobre", flatData, ["Data/Hora", "Tipo", "Barra", "Tamanho (m)", "Responsável"], ["data", "tipo", "barra", "comprimento_m", "responsavel"]);
        }
      }
    } catch (error: any) {
      toast.error("Erro ao gerar relatório: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const printView = (title: string, data: any[], colTitles: string[], colKeys: string[]) => {
    let html = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <button class="no-print" onclick="window.print()" style="padding: 10px 20px; margin-bottom: 20px; cursor: pointer; background: #000; color: #fff; border: none; border-radius: 4px;">Imprimir PDF</button>
          <h1>${title}</h1>
          <p>Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}</p>
          <table>
            <thead>
              <tr>${colTitles.map(t => `<th>${t}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${colKeys.map(k => `<td>${row[k] || '-'}</td>`).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios de Cobre</h1>
        <p className="text-muted-foreground">Exporte dados do estoque e movimentações de cobre para análise.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuração do Relatório</CardTitle>
          <CardDescription>Selecione o tipo de relatório e aplique os filtros desejados antes de exportar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Selecione o Relatório</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cobre_estoque">Posição Atual de Estoque (Pedaços Disponíveis)</SelectItem>
                <SelectItem value="cobre_consumo">Histórico de Consumo (Saídas p/ Clientes e Obras)</SelectItem>
                <SelectItem value="cobre_entradas">Histórico de Entradas (Devoluções e Novos Cortes)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data Inicial (Filtro para históricos)</Label>
              <Input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} disabled={reportType === 'cobre_estoque'} />
            </div>
            <div className="space-y-2">
              <Label>Data Final (Filtro para históricos)</Label>
              <Input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} disabled={reportType === 'cobre_estoque'} />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Button className="w-full flex-1" size="lg" disabled={loading} onClick={() => handleGenerate('csv')}>
              <FileSpreadsheet className="h-5 w-5 mr-2" /> 
              Exportar para Excel (CSV)
            </Button>
            <Button className="w-full flex-1" size="lg" variant="outline" disabled={loading} onClick={() => handleGenerate('pdf')}>
              <Printer className="h-5 w-5 mr-2" /> 
              Gerar PDF (Imprimir)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
