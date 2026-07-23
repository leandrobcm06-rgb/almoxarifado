import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as supabase } from "./client-DLaKby2r.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { O as FileSpreadsheet, p as Printer } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as format } from "../_libs/date-fns.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.ferramentas.relatorios-Cnaf21FX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReportsView() {
	const [reportType, setReportType] = (0, import_react.useState)("tools_all");
	const [dateStart, setDateStart] = (0, import_react.useState)("");
	const [dateEnd, setDateEnd] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const exportCSV = (filename, headers, data) => {
		const csvContent = [headers.join(";"), ...data.map((row) => headers.map((field) => {
			let val = row[field];
			if (val === null || val === void 0) val = "";
			val = val.toString().replace(/"/g, "\"\"");
			return `"${val}"`;
		}).join(";"))].join("\n");
		const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${filename}_${format(/* @__PURE__ */ new Date(), "dd-MM-yyyy")}.csv`;
		link.click();
		URL.revokeObjectURL(url);
	};
	const handleGenerate = async (formatType) => {
		setLoading(true);
		try {
			if (reportType.startsWith("tools_")) await generateToolsReport(formatType);
			else if (reportType.startsWith("cobre_")) await generateCopperReport(formatType);
		} catch (error) {
			toast.error("Erro ao gerar relatório: " + error.message);
		} finally {
			setLoading(false);
		}
	};
	const generateToolsReport = async (formatType) => {
		if (reportType === "tools_all" || reportType === "tools_available" || reportType === "tools_loaned" || reportType === "tools_broken") {
			let query = supabase.from("tools").select("*");
			if (reportType === "tools_available") query = query.eq("status", "disponivel");
			if (reportType === "tools_loaned") query = query.eq("status", "emprestada");
			if (reportType === "tools_broken") query = query.in("status", ["danificada", "manutencao"]);
			const { data, error } = await query;
			if (error) throw error;
			if (!data || data.length === 0) return toast.info("Nenhum dado encontrado para este filtro.");
			if (formatType === "csv") exportCSV("Relatorio_Ferramentas", [
				"id",
				"name",
				"category",
				"brand",
				"patrimony_number",
				"status",
				"condition",
				"value",
				"created_at"
			], data);
			else printView("Relatório de Ferramentas", data, [
				"Nome",
				"Categoria",
				"Patrimônio",
				"Status",
				"Estado"
			], [
				"name",
				"category",
				"patrimony_number",
				"status",
				"condition"
			]);
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
			const flatData = data.map((d) => ({
				data: format(new Date(d.created_at), "dd/MM/yyyy HH:mm"),
				tipo: d.type,
				ferramenta: d.tool?.name,
				funcionario: d.employee || "",
				cliente: d.client || "",
				pco: d.pco || "",
				estado: d.condition || ""
			}));
			if (formatType === "csv") exportCSV("Auditoria_Ferramentas", [
				"data",
				"tipo",
				"ferramenta",
				"funcionario",
				"cliente",
				"pco",
				"estado"
			], flatData);
			else printView("Auditoria de Ferramentaria", flatData, [
				"Data",
				"Tipo",
				"Ferramenta",
				"Funcionário",
				"Cliente",
				"Estado"
			], [
				"data",
				"tipo",
				"ferramenta",
				"funcionario",
				"cliente",
				"estado"
			]);
		}
	};
	const generateCopperReport = async (formatType) => {
		if (reportType === "cobre_estoque") {
			const { data, error } = await supabase.from("copper_pieces").select("*, bar:copper_bars(name, auxiliary_code)").eq("status", "disponivel");
			if (error) throw error;
			if (!data || data.length === 0) return toast.info("Nenhum dado encontrado.");
			const flatData = data.map((d) => ({
				barra: d.bar?.name,
				codigo: d.bar?.auxiliary_code,
				comprimento_m: (d.current_length_mm / 1e3).toFixed(2),
				status: d.status
			}));
			if (formatType === "csv") exportCSV("Estoque_Cobre", [
				"barra",
				"codigo",
				"comprimento_m",
				"status"
			], flatData);
			else printView("Estoque de Cobre Atual", flatData, [
				"Barra Matriz",
				"Cód. Auxiliar",
				"Comprimento (m)",
				"Status"
			], [
				"barra",
				"codigo",
				"comprimento_m",
				"status"
			]);
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
			const flatData = data.map((d) => ({
				data: format(new Date(d.created_at), "dd/MM/yyyy"),
				barra: d.bar?.name,
				saida_m: (d.length_mm / 1e3).toFixed(2),
				cliente: d.client,
				pco: d.pco,
				responsavel: d.responsible
			}));
			if (formatType === "csv") exportCSV("Consumo_Cobre", [
				"data",
				"barra",
				"saida_m",
				"cliente",
				"pco",
				"responsavel"
			], flatData);
			else printView("Consumo de Cobre", flatData, [
				"Data",
				"Barra",
				"Saída (m)",
				"Cliente",
				"PCO",
				"Responsável"
			], [
				"data",
				"barra",
				"saida_m",
				"cliente",
				"pco",
				"responsavel"
			]);
		}
	};
	const printView = (title, data, colTitles, colKeys) => {
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
          <p>Gerado em: ${format(/* @__PURE__ */ new Date(), "dd/MM/yyyy 'às' HH:mm")}</p>
          <table>
            <thead>
              <tr>${colTitles.map((t) => `<th>${t}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${data.map((row) => `
                <tr>
                  ${colKeys.map((k) => `<td>${row[k] || "-"}</td>`).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;
		const printWindow = window.open("", "_blank");
		if (printWindow) {
			printWindow.document.write(html);
			printWindow.document.close();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-4xl mx-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-3xl font-bold tracking-tight",
			children: "Central de Relatórios"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "Exporte dados da ferramentaria e do estoque de cobre para análise."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Configuração do Relatório" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Selecione o tipo de relatório e aplique os filtros desejados antes de exportar." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Selecione o Relatório" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: reportType,
						onValueChange: setReportType,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione..." }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
								label: "Módulo: Ferramentaria",
								className: "p-1 font-semibold text-muted-foreground text-xs mt-2 mb-1",
								children: "FERRAMENTARIA"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "tools_all",
								children: "Todas as Ferramentas Cadastradas"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "tools_available",
								children: "Apenas Ferramentas Disponíveis"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "tools_loaned",
								children: "Apenas Ferramentas Emprestadas"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "tools_broken",
								children: "Ferramentas em Manutenção/Danificadas"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "tools_history",
								children: "Histórico Completo (Auditoria)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
								label: "Módulo: Cobre",
								className: "p-1 font-semibold text-muted-foreground text-xs mt-4 mb-1 border-t",
								children: "BARRAS DE COBRE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "cobre_estoque",
								children: "Posição Atual de Estoque (Pedaços)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "cobre_consumo",
								children: "Histórico de Consumo (Clientes e Obras)"
							})
						] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Data Inicial (Filtro para históricos)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: dateStart,
							onChange: (e) => setDateStart(e.target.value),
							disabled: !reportType.includes("history") && !reportType.includes("consumo")
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Data Final (Filtro para históricos)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: dateEnd,
							onChange: (e) => setDateEnd(e.target.value),
							disabled: !reportType.includes("history") && !reportType.includes("consumo")
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-4 pt-4 border-t",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full flex-1",
						size: "lg",
						disabled: loading,
						onClick: () => handleGenerate("csv"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-5 w-5 mr-2" }), "Exportar para Excel (CSV)"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full flex-1",
						size: "lg",
						variant: "outline",
						disabled: loading,
						onClick: () => handleGenerate("pdf"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-5 w-5 mr-2" }), "Gerar PDF (Imprimir)"]
					})]
				})
			]
		})] })]
	});
}
//#endregion
export { ReportsView as component };
