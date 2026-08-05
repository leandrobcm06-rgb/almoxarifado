import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileSpreadsheet, Printer } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/app/ferramentas/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios | Ferramentaria e Cobre" }] }),
  component: ReportsView,
});

function ReportsView() {
  const [reportType, setReportType] = useState("tools_all");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [loading, setLoading] = useState(false);

  // Tools CSV Export Function
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
      if (reportType.startsWith("tools_")) {
        await generateToolsReport(formatType);
      } else if (reportType.startsWith("cobre_")) {
        await generateCopperReport(formatType);
      }
    } catch (error: any) {
      toast.error("Erro ao gerar relatório: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateToolsReport = async (formatType: 'csv' | 'pdf') => {
    if (reportType === "tools_all" || reportType === "tools_available" || reportType === "tools_loaned" || reportType === "tools_broken") {
      let query = supabase.from("tools").select("*");
      
      if (reportType === "tools_available") query = query.eq("status", "disponivel");
      if (reportType === "tools_loaned") query = query.eq("status", "emprestada");
      if (reportType === "tools_broken") query = query.in("status", ["danificada", "manutencao"]);

      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) return toast.info("Nenhum dado encontrado para este filtro.");

      if (formatType === 'csv') {
        const headers = ["id", "name", "category", "brand", "patrimony_number", "status", "condition", "value", "created_at"];
        exportCSV("Relatorio_Ferramentas", headers, data);
      } else {
        printView("Relatório de Ferramentas", data, ["Nome", "Categoria", "Patrimônio", "Status", "Estado"], ["name", "category", "patrimony_number", "status", "condition"]);
      }
    } else if (reportType === "tools_history") {
      let query = supabase.from("tool_movements").select("*, tool:tools(name, patrimony_number)");
      if (dateStart) query = query.gte("created_at", new Date(dateStart).toISOString());
      if (dateEnd) {
        const end = new Date(dateEnd);
        end.setDate(end.getDate() + 1);
        query = query.lt("created_at", end.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) return toast.info("Nenhum dado encontrado para este filtro.");

      const flatData = data.map(d => ({
        data: format(new Date(d.created_at), "dd/MM/yyyy HH:mm"),
        tipo: d.type,
        ferramenta: d.tool?.name,
        funcionario: d.employee || "",
        cliente: d.client || "",
        pco: d.pco || "",
        estado: d.condition || ""
      }));

      if (formatType === 'csv') {
        const headers = ["data", "tipo", "ferramenta", "funcionario", "cliente", "pco", "estado"];
        exportCSV("Auditoria_Ferramentas", headers, flatData);
      } else {
        printView("Auditoria de Ferramentaria", flatData, ["Data", "Tipo", "Ferramenta", "Funcionário", "Cliente", "Estado"], ["data", "tipo", "ferramenta", "funcionario", "cliente", "estado"]);
      }
    }
  };

  const generateCopperReport = async (formatType: 'csv' | 'pdf') => {
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
    }
  };

  const printView = (title: string, data: any[], colTitles: string[], colKeys: string[]) => {
    let html = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #0f172a; }
            h1 { text-align: center; font-family: 'Outfit', sans-serif; color: #0f172a; margin-bottom: 8px; }
            .subtitle { text-align: center; color: #64748b; font-size: 14px; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
            th, td { border: 1px solid #e2e8f0; padding: 12px 16px; text-align: left; }
            th { background-color: #f8fafc; font-weight: 600; color: #475569; text-transform: uppercase; font-size: 12px; letter-spacing: 0.05em; }
            tr:nth-child(even) { background-color: #f8fafc; }
            @media print {
              .no-print { display: none; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <button class="no-print" onclick="window.print()" style="padding: 10px 20px; margin-bottom: 20px; cursor: pointer; background: #2563eb; color: #fff; border: none; border-radius: 6px; font-weight: 500;">Imprimir PDF</button>
          <h1>${title}</h1>
          <div class="subtitle">Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}</div>
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
      // Wait for resources to load before triggering print dialog is best practice, but for simple HTML this works.
    }
  };

  return (
    <div className="page-container animate-fade-in max-w-4xl mx-auto">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Central de Relatórios</h1>
            <p className="page-subtitle">Exporte dados da ferramentaria e do estoque de cobre para análise.</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-border">
        <div className="mb-6">
          <h2 className="text-xl font-semibold font-display text-foreground">Configuração do Relatório</h2>
          <p className="text-sm text-muted-foreground mt-1">Selecione o tipo de relatório e aplique os filtros desejados antes de exportar.</p>
        </div>
        
        <div className="space-y-6">
          <div className="form-group">
            <label className="form-label">Selecione o Relatório</label>
            <select className="form-input" value={reportType} onChange={e => setReportType(e.target.value)}>
              <optgroup label="Módulo: Ferramentaria">
                <option value="tools_all">Todas as Ferramentas Cadastradas</option>
                <option value="tools_available">Apenas Ferramentas Disponíveis</option>
                <option value="tools_loaned">Apenas Ferramentas Emprestadas</option>
                <option value="tools_broken">Ferramentas em Manutenção/Danificadas</option>
                <option value="tools_history">Histórico Completo (Auditoria)</option>
              </optgroup>
              <optgroup label="Módulo: Cobre">
                <option value="cobre_estoque">Posição Atual de Estoque (Pedaços)</option>
                <option value="cobre_consumo">Histórico de Consumo (Clientes e Obras)</option>
              </optgroup>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Data Inicial (Filtro para históricos)</label>
              <input type="date" className="form-input" value={dateStart} onChange={e => setDateStart(e.target.value)} disabled={!reportType.includes('history') && !reportType.includes('consumo')} />
            </div>
            <div className="form-group">
              <label className="form-label">Data Final (Filtro para históricos)</label>
              <input type="date" className="form-input" value={dateEnd} onChange={e => setDateEnd(e.target.value)} disabled={!reportType.includes('history') && !reportType.includes('consumo')} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border mt-4">
            <button className="btn btn--outline w-full flex-1 justify-center py-6 text-base" disabled={loading} onClick={() => handleGenerate('pdf')}>
              <Printer size={20} className="mr-3" /> 
              Visualizar / Imprimir PDF
            </button>
            <button className="btn btn--primary w-full flex-1 justify-center py-6 text-base" disabled={loading} onClick={() => handleGenerate('csv')}>
              <FileSpreadsheet size={20} className="mr-3" /> 
              Exportar para Excel (CSV)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
