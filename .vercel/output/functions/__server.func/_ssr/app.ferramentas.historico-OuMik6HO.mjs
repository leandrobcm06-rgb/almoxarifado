import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as supabase } from "./client-DLaKby2r.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { E as FunnelX, J as ArrowDownRight, K as ArrowUpRight, g as PackagePlus } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as format } from "../_libs/date-fns.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.ferramentas.historico-OuMik6HO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ToolsHistory() {
	const [movements, setMovements] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [filterTool, setFilterTool] = (0, import_react.useState)("");
	const [filterEmployee, setFilterEmployee] = (0, import_react.useState)("");
	const [filterClient, setFilterClient] = (0, import_react.useState)("");
	const [filterType, setFilterType] = (0, import_react.useState)("all");
	const [filterDateStart, setFilterDateStart] = (0, import_react.useState)("");
	const [filterDateEnd, setFilterDateEnd] = (0, import_react.useState)("");
	async function loadMovements() {
		setLoading(true);
		try {
			let query = supabase.from("tool_movements").select("*, tool:tools(name, patrimony_number)").order("created_at", { ascending: false });
			if (filterType !== "all") query = query.eq("type", filterType);
			if (filterEmployee) query = query.ilike("employee", `%${filterEmployee}%`);
			if (filterClient) query = query.or(`client.ilike.%${filterClient}%,pco.ilike.%${filterClient}%`);
			if (filterDateStart) query = query.gte("created_at", new Date(filterDateStart).toISOString());
			if (filterDateEnd) {
				const end = new Date(filterDateEnd);
				end.setDate(end.getDate() + 1);
				query = query.lt("created_at", end.toISOString());
			}
			const { data, error } = await query;
			if (error) throw error;
			let results = data || [];
			if (filterTool) results = results.filter((m) => m.tool?.name.toLowerCase().includes(filterTool.toLowerCase()) || m.tool?.patrimony_number?.toLowerCase().includes(filterTool.toLowerCase()));
			setMovements(results);
		} catch (error) {
			console.error("Erro ao carregar histórico:", error);
			toast.error("Erro ao carregar auditoria.");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadMovements();
	}, [
		filterType,
		filterDateStart,
		filterDateEnd
	]);
	const handleSearchClick = (e) => {
		e.preventDefault();
		loadMovements();
	};
	const clearFilters = () => {
		setFilterTool("");
		setFilterEmployee("");
		setFilterClient("");
		setFilterType("all");
		setFilterDateStart("");
		setFilterDateEnd("");
		setTimeout(loadMovements, 0);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Auditoria e Histórico"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Registro permanente de todas as movimentações da ferramentaria."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
				className: "pb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Filtros de Pesquisa" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSearchClick,
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2 lg:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Buscar Ferramenta ou Patrimônio...",
								value: filterTool,
								onChange: (e) => setFilterTool(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2 lg:col-span-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Funcionário...",
								value: filterEmployee,
								onChange: (e) => setFilterEmployee(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2 lg:col-span-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Cliente ou PCO...",
								value: filterClient,
								onChange: (e) => setFilterClient(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 lg:col-span-2 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: filterDateStart,
								onChange: (e) => setFilterDateStart(e.target.value),
								title: "Data Inicial"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: filterDateEnd,
								onChange: (e) => setFilterDateEnd(e.target.value),
								title: "Data Final"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-4 items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-[200px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: filterType,
							onValueChange: (v) => setFilterType(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Tipo de Movimento" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "Todas as Movimentações"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "cadastro",
									children: "Cadastro Inicial"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "emprestimo",
									children: "Empréstimos"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "devolucao",
									children: "Devoluções"
								})
							] })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "ghost",
							onClick: clearFilters,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FunnelX, { className: "h-4 w-4 mr-2" }), " Limpar"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Pesquisar"
						})]
					})]
				})]
			}) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "pt-6",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center p-8 text-muted-foreground",
					children: "Carregando histórico..."
				}) : movements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center p-8 border border-dashed rounded-lg text-muted-foreground",
					children: "Nenhuma movimentação encontrada para os filtros selecionados."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border rounded-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Data/Hora" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Tipo" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Ferramenta" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Funcionário" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Cliente / PCO" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Estado da Ferramenta" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: movements.map((mov) => {
						const isSaida = mov.type === "emprestimo";
						const isCadastro = mov.type === "cadastro";
						const isDevolucao = mov.type === "devolucao";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "whitespace-nowrap",
								children: format(new Date(mov.created_at), "dd/MM/yyyy HH:mm")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: isSaida ? "destructive" : isDevolucao ? "default" : "secondary",
								className: "flex w-fit items-center gap-1",
								children: [
									isSaida && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3 w-3" }),
									isDevolucao && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "h-3 w-3" }),
									isCadastro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackagePlus, { className: "h-3 w-3" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "capitalize",
										children: mov.type
									})
								]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
								className: "font-medium",
								children: [
									mov.tool?.name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground font-normal text-xs",
										children: [
											"(",
											mov.tool?.patrimony_number || "S/N",
											")"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: mov.employee || "-" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: mov.client || mov.pco ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: mov.client || "-"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: ["PCO: ", mov.pco || "-"]
							})] }) : "-" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: mov.condition ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `capitalize font-medium ${mov.condition === "danificada" || mov.condition === "ruim" ? "text-red-500" : mov.condition === "manutencao" ? "text-orange-500" : "text-green-500"}`,
								children: mov.condition
							}) : "-" })
						] }, mov.id);
					}) })] })
				})
			}) })
		]
	});
}
//#endregion
export { ToolsHistory as component };
