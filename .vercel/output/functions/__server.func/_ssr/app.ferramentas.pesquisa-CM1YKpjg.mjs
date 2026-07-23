import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as supabase } from "./client-DLaKby2r.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { A as ExternalLink, D as FileText, l as Search } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.ferramentas.pesquisa-CM1YKpjg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ToolsSearch() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [results, setResults] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [hasSearched, setHasSearched] = (0, import_react.useState)(false);
	const handleSearch = async (e) => {
		e.preventDefault();
		if (!query.trim()) return toast.error("Digite algo para pesquisar.");
		setLoading(true);
		setHasSearched(true);
		try {
			const searchTerm = `%${query}%`;
			const { data: toolsData, error: toolsError } = await supabase.from("tools").select("*").or(`name.ilike.${searchTerm},patrimony_number.ilike.${searchTerm},category.ilike.${searchTerm},brand.ilike.${searchTerm}`);
			if (toolsError) throw toolsError;
			const { data: loansData, error: loansError } = await supabase.from("tool_loans").select("*, tool:tools(*)").eq("status", "ativo").or(`client.ilike.${searchTerm},employee.ilike.${searchTerm}`);
			if (loansError) throw loansError;
			const toolMap = /* @__PURE__ */ new Map();
			if (toolsData && toolsData.length > 0) {
				const toolIds = toolsData.map((t) => t.id);
				const { data: activeLoans } = await supabase.from("tool_loans").select("*").eq("status", "ativo").in("tool_id", toolIds);
				toolsData.forEach((t) => {
					const loan = activeLoans?.find((l) => l.tool_id === t.id);
					toolMap.set(t.id, {
						...t,
						active_loan: loan
					});
				});
			}
			if (loansData) loansData.forEach((l) => {
				if (l.tool && !toolMap.has(l.tool.id)) toolMap.set(l.tool.id, {
					...l.tool,
					active_loan: l
				});
			});
			setResults(Array.from(toolMap.values()));
		} catch (error) {
			console.error("Erro na pesquisa:", error);
			toast.error("Erro ao realizar pesquisa.");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-6xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Pesquisa Omnichannel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Encontre ferramentas rapidamente por qualquer atributo, funcionário ou cliente."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "pt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSearch,
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Digite o nome, patrimônio, categoria, marca, funcionário ou cliente...",
							className: "pl-10 h-12 text-lg w-full shadow-sm",
							value: query,
							onChange: (e) => setQuery(e.target.value)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "lg",
						className: "h-12 px-8",
						disabled: loading,
						children: loading ? "Buscando..." : "Pesquisar"
					})]
				})
			}) }),
			hasSearched && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Resultados da Pesquisa" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center p-8 text-muted-foreground",
				children: "Procurando..."
			}) : results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center p-8 border border-dashed rounded-lg text-muted-foreground",
				children: [
					"Nenhum resultado encontrado para \"",
					query,
					"\"."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border rounded-md overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Nome / Patrimônio" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Categoria / Marca" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Estado" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Situação" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Último Empréstimo (Atual)" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Ações Rápidas"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: results.map((tool) => {
					const loan = tool.active_loan;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							className: "font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-base",
								children: tool.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground font-mono",
								children: tool.patrimony_number || "S/N"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: tool.category }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: tool.brand
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "capitalize",
							children: tool.condition
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: tool.status === "disponivel" ? "default" : tool.status === "emprestada" ? "secondary" : "destructive",
							children: tool.status.toUpperCase()
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: loan ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: loan.employee
								}),
								loan.client && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground block text-xs",
									children: [
										loan.client,
										" ",
										loan.pco ? `(PCO: ${loan.pco})` : ""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground block mt-1",
									children: ["Desde: ", format(new Date(loan.loan_date), "dd/MM/yy")]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground text-sm",
							children: "-"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: `/app/ferramentas/lista`,
									search: { q: tool.name },
									title: "Abrir no Cadastro",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: `/app/ferramentas/historico`,
									search: { q: tool.name },
									title: "Ver Histórico",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" })
									})
								})]
							})
						})
					] }, tool.id);
				}) })] })
			}) })] })
		]
	});
}
//#endregion
export { ToolsSearch as component };
