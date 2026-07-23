import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as supabase } from "./client-DLaKby2r.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { E as FunnelX, J as ArrowDownRight, K as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as endOfMonth, i as startOfMonth, n as subMonths, r as format } from "../_libs/date-fns.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.cobre.historico-BfX7NtS0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CopperHistory() {
	const [movements, setMovements] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [filterType, setFilterType] = (0, import_react.useState)("all");
	const [filterPeriod, setFilterPeriod] = (0, import_react.useState)("all");
	async function loadMovements() {
		setLoading(true);
		try {
			let query = supabase.from("copper_movements").select("*, bar:copper_bars(name, auxiliary_code)").order("created_at", { ascending: false });
			if (filterType !== "all") query = query.eq("type", filterType);
			if (filterPeriod === "current") query = query.gte("created_at", startOfMonth(/* @__PURE__ */ new Date()).toISOString()).lte("created_at", endOfMonth(/* @__PURE__ */ new Date()).toISOString());
			else if (filterPeriod === "previous") {
				const prevMonth = subMonths(/* @__PURE__ */ new Date(), 1);
				query = query.gte("created_at", startOfMonth(prevMonth).toISOString()).lte("created_at", endOfMonth(prevMonth).toISOString());
			}
			const { data, error } = await query;
			if (error) throw error;
			setMovements(data || []);
		} catch (error) {
			console.error("Erro ao carregar histórico:", error);
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadMovements();
	}, [filterType, filterPeriod]);
	const clearFilters = () => {
		setFilterType("all");
		setFilterPeriod("all");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-between",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Extrato de Movimentações"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Histórico completo de entradas e saídas de pedaços de cobre."
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
			className: "pb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row gap-4 items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Histórico de Transações" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: filterPeriod,
							onValueChange: (v) => setFilterPeriod(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-[180px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Período" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "Todo o período"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "current",
									children: "Mês Atual"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "previous",
									children: "Mês Anterior"
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: filterType,
							onValueChange: (v) => setFilterType(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-[160px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Tipo" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "Todas"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "saida",
									children: "Saídas (Cortes)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "devolucao",
									children: "Devoluções"
								})
							] })]
						}),
						(filterType !== "all" || filterPeriod !== "all") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							onClick: clearFilters,
							title: "Limpar filtros",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FunnelX, { className: "h-4 w-4" })
						})
					]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Barra Original" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "text-right",
					children: "Movimentação"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Cliente / PCO" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Responsável" })
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: movements.map((mov) => {
				const isSaida = mov.type === "saida";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "whitespace-nowrap",
						children: format(new Date(mov.created_at), "dd/MM/yyyy HH:mm")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: isSaida ? "destructive" : "default",
						className: "flex w-fit items-center gap-1",
						children: [isSaida ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3 w-3" }), isSaida ? "Saída" : "Devolução"]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "font-medium",
						children: [
							mov.bar?.name,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground font-normal text-xs",
								children: [
									"(",
									mov.bar?.auxiliary_code,
									")"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: `text-right font-bold ${isSaida ? "text-red-500" : "text-green-500"}`,
						children: [
							isSaida ? "-" : "+",
							(mov.length_mm / 1e3).toFixed(2),
							" m"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: mov.client || "-"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: ["PCO: ", mov.pco || "-"]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: mov.responsible || "-" })
				] }, mov.id);
			}) })] })
		}) })] })]
	});
}
//#endregion
export { CopperHistory as component };
