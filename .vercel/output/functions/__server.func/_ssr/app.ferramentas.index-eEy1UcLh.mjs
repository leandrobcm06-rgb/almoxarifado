import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as supabase } from "./client-DLaKby2r.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { I as CircleX, T as Hammer, a as TriangleAlert, n as Wrench, w as HardHat } from "../_libs/lucide-react.mjs";
import { a as endOfMonth, i as startOfMonth, n as subMonths, r as format, t as ptBR } from "../_libs/date-fns.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as BarChart, o as Line, r as LineChart, s as CartesianGrid, t as PieChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.ferramentas.index-eEy1UcLh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"#10b981",
	"#3b82f6",
	"#f59e0b",
	"#ef4444",
	"#8b5cf6"
];
function ToolsDashboard() {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [totalTools, setTotalTools] = (0, import_react.useState)(0);
	const [availableTools, setAvailableTools] = (0, import_react.useState)(0);
	const [loanedTools, setLoanedTools] = (0, import_react.useState)(0);
	const [maintenanceTools, setMaintenanceTools] = (0, import_react.useState)(0);
	const [damagedTools, setDamagedTools] = (0, import_react.useState)(0);
	const [recentLoans, setRecentLoans] = (0, import_react.useState)([]);
	const [mostLoaned, setMostLoaned] = (0, import_react.useState)([]);
	const [loansByMonth, setLoansByMonth] = (0, import_react.useState)([]);
	const [toolsByCategory, setToolsByCategory] = (0, import_react.useState)([]);
	const [toolsByCondition, setToolsByCondition] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		async function fetchDashboardData() {
			try {
				const { data: tools } = await supabase.from("tools").select("*");
				if (tools) {
					setTotalTools(tools.length);
					setAvailableTools(tools.filter((t) => t.status === "disponivel").length);
					setLoanedTools(tools.filter((t) => t.status === "emprestada").length);
					setMaintenanceTools(tools.filter((t) => t.status === "manutencao").length);
					setDamagedTools(tools.filter((t) => t.status === "danificada").length);
					const catMap = tools.reduce((acc, t) => {
						acc[t.category] = (acc[t.category] || 0) + 1;
						return acc;
					}, {});
					setToolsByCategory(Object.entries(catMap).map(([name, value]) => ({
						name,
						value
					})));
					const condMap = tools.reduce((acc, t) => {
						acc[t.condition] = (acc[t.condition] || 0) + 1;
						return acc;
					}, {});
					setToolsByCondition(Object.entries(condMap).map(([name, value]) => ({
						name,
						value
					})));
				}
				const { data: loans } = await supabase.from("tool_loans").select("*, tool:tools(name)").order("created_at", { ascending: false });
				if (loans) {
					setRecentLoans(loans.slice(0, 5));
					const countMap = loans.reduce((acc, loan) => {
						if (!loan.tool) return acc;
						acc[loan.tool.name] = (acc[loan.tool.name] || 0) + 1;
						return acc;
					}, {});
					setMostLoaned(Object.entries(countMap).map(([name, count]) => ({
						name,
						count
					})).sort((a, b) => b.count - a.count).slice(0, 5));
					const monthsData = [];
					for (let i = 5; i >= 0; i--) {
						const date = subMonths(/* @__PURE__ */ new Date(), i);
						const start = startOfMonth(date);
						const end = endOfMonth(date);
						const monthLoans = loans.filter((l) => {
							const d = new Date(l.created_at);
							return d >= start && d <= end;
						});
						monthsData.push({
							month: format(date, "MMM/yy", { locale: ptBR }),
							emprestimos: monthLoans.length
						});
					}
					setLoansByMonth(monthsData);
				}
			} catch (error) {
				console.error("Erro ao carregar dashboard de ferramentas", error);
			} finally {
				setLoading(false);
			}
		}
		fetchDashboardData();
	}, []);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-muted-foreground",
		children: "Carregando dashboard..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Dashboard de Ferramentaria"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Visão geral do controle de ferramentas e empréstimos."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2 lg:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between space-y-0 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium",
							children: "Total Cadastrado"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hammer, { className: "h-4 w-4 text-muted-foreground" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold",
						children: totalTools
					}) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between space-y-0 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium",
							children: "Disponíveis"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-4 w-4 text-green-500" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold text-green-600",
						children: availableTools
					}) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between space-y-0 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium",
							children: "Emprestadas"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardHat, { className: "h-4 w-4 text-blue-500" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold text-blue-600",
						children: loanedTools
					}) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between space-y-0 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium",
							children: "Manutenção"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-orange-500" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold text-orange-600",
						children: maintenanceTools
					}) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between space-y-0 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium",
							children: "Danificadas"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 text-red-500" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold text-red-600",
						children: damagedTools
					}) })] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Empréstimos por Mês" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "h-[300px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
									data: loansByMonth,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											vertical: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, { dataKey: "month" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
											type: "monotone",
											dataKey: "emprestimos",
											stroke: "#3b82f6",
											strokeWidth: 3,
											dot: { r: 4 }
										})
									]
								})
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Por Categoria" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "h-[300px] flex flex-col items-center justify-center",
						children: toolsByCategory.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: toolsByCategory,
								cx: "50%",
								cy: "50%",
								innerRadius: 60,
								outerRadius: 90,
								paddingAngle: 2,
								dataKey: "value",
								nameKey: "name",
								label: true,
								children: toolsByCategory.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {})] })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-muted-foreground text-sm",
							children: "Sem dados"
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "col-span-1 lg:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Ferramentas Mais Emprestadas" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "h-[300px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: mostLoaned,
									layout: "vertical",
									margin: { left: 50 },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											horizontal: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, { type: "number" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											dataKey: "name",
											type: "category",
											width: 100
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "count",
											fill: "#8b5cf6",
											radius: [
												0,
												4,
												4,
												0
											]
										})
									]
								})
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Últimos Empréstimos" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: recentLoans.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: "Nenhum empréstimo recente."
						}) : recentLoans.map((loan) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: loan.tool?.name || "Ferramenta apagada"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: loan.employee
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: format(new Date(loan.created_at), "dd/MM") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-xs ${loan.status === "ativo" ? "text-blue-500" : "text-green-500"}`,
									children: loan.status === "ativo" ? "Emprestada" : "Devolvida"
								})]
							})]
						}, loan.id))
					}) })] })
				]
			})
		]
	});
}
//#endregion
export { ToolsDashboard as component };
