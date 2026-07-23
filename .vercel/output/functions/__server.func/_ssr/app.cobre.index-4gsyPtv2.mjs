import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as supabase } from "./client-DLaKby2r.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { L as CircleCheck, N as Clock, S as Layers, _ as Package2, o as TrendingDown, q as ArrowLeftRight, r as Users, w as HardHat } from "../_libs/lucide-react.mjs";
import { i as startOfMonth, n as subMonths, r as format, t as ptBR } from "../_libs/date-fns.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as BarChart, o as Line, p as Legend, r as LineChart, s as CartesianGrid, t as PieChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.cobre.index-4gsyPtv2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"#0088FE",
	"#00C49F",
	"#FFBB28",
	"#FF8042",
	"#8884D8",
	"#82CA9D"
];
function CobreDashboard() {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [stats, setStats] = (0, import_react.useState)({
		totalBarras: 0,
		estoqueTotalMm: 0,
		totalPedacos: 0,
		saidasMes: 0,
		devolucoesMes: 0,
		topCliente: "-",
		topPco: "-",
		ultimaMovimentacao: "-"
	});
	const [charts, setCharts] = (0, import_react.useState)({
		consumoPorMes: [],
		consumoPorCliente: [],
		consumoPorPco: [],
		entradasXSaidas: [],
		estoquePorBarra: []
	});
	(0, import_react.useEffect)(() => {
		async function loadData() {
			try {
				const currentMonthStart = startOfMonth(/* @__PURE__ */ new Date()).toISOString();
				const [{ count: countBarras }, { data: pieces }, { data: recentMovements }, { data: allMovements }, { data: bars }] = await Promise.all([
					supabase.from("copper_bars").select("*", {
						count: "exact",
						head: true
					}),
					supabase.from("copper_pieces").select("current_length_mm, bar_id, status").eq("status", "disponivel"),
					supabase.from("copper_movements").select("type, length_mm, created_at, client, pco").gte("created_at", currentMonthStart),
					supabase.from("copper_movements").select("type, length_mm, created_at, client, pco").gte("created_at", subMonths(/* @__PURE__ */ new Date(), 6).toISOString()),
					supabase.from("copper_bars").select("id, name")
				]);
				let estoqueTotalMm = 0;
				let totalPedacos = pieces?.length || 0;
				pieces?.forEach((p) => {
					estoqueTotalMm += Number(p.current_length_mm);
				});
				let saidasMes = 0;
				let devolucoesMes = 0;
				recentMovements?.forEach((m) => {
					if (m.type === "saida") saidasMes++;
					if (m.type === "devolucao") devolucoesMes++;
				});
				const clientUsage = {};
				const pcoUsage = {};
				allMovements?.forEach((m) => {
					if (m.type === "saida" && m.client) clientUsage[m.client] = (clientUsage[m.client] || 0) + Number(m.length_mm);
					if (m.type === "saida" && m.pco) pcoUsage[m.pco] = (pcoUsage[m.pco] || 0) + Number(m.length_mm);
				});
				const topCliente = Object.entries(clientUsage).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
				const topPco = Object.entries(pcoUsage).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
				let ultimaMovimentacao = "-";
				if (allMovements && allMovements.length > 0) {
					const lastMov = [...allMovements].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
					ultimaMovimentacao = format(new Date(lastMov.created_at), "dd/MM/yyyy HH:mm");
				}
				setStats({
					totalBarras: countBarras || 0,
					estoqueTotalMm,
					totalPedacos,
					saidasMes,
					devolucoesMes,
					topCliente,
					topPco,
					ultimaMovimentacao
				});
				const monthMap = {};
				const entVSaiMap = {};
				allMovements?.forEach((m) => {
					const monthKey = format(new Date(m.created_at), "MMM/yy", { locale: ptBR });
					if (!entVSaiMap[monthKey]) entVSaiMap[monthKey] = {
						Entradas: 0,
						Saídas: 0
					};
					if (m.type === "saida") {
						monthMap[monthKey] = (monthMap[monthKey] || 0) + Number(m.length_mm);
						entVSaiMap[monthKey].Saídas += 1;
					} else if (m.type === "devolucao") entVSaiMap[monthKey].Entradas += 1;
				});
				const consumoPorMes = Object.entries(monthMap).map(([name, consumo]) => ({
					name,
					consumo
				}));
				const entradasXSaidas = Object.entries(entVSaiMap).map(([name, data]) => ({
					name,
					...data
				}));
				const consumoPorCliente = Object.entries(clientUsage).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({
					name,
					value
				}));
				const consumoPorPco = Object.entries(pcoUsage).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({
					name,
					value
				}));
				const barraMap = {};
				pieces?.forEach((p) => {
					const barName = bars?.find((b) => b.id === p.bar_id)?.name || "Desconhecida";
					barraMap[barName] = (barraMap[barName] || 0) + Number(p.current_length_mm);
				});
				setCharts({
					consumoPorMes,
					consumoPorCliente,
					consumoPorPco,
					entradasXSaidas,
					estoquePorBarra: Object.entries(barraMap).map(([name, value]) => ({
						name,
						value
					}))
				});
			} catch (error) {
				console.error("Erro ao carregar dashboard de cobre:", error);
			} finally {
				setLoading(false);
			}
		}
		loadData();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold tracking-tight",
					children: "Dashboard de Cobre"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between space-y-0 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium",
							children: "Total de Barras"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 text-muted-foreground" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold",
						children: loading ? "..." : stats.totalBarras
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Matrizes cadastradas"
					})] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between space-y-0 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium",
							children: "Estoque Total (m)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package2, { className: "h-4 w-4 text-muted-foreground" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-2xl font-bold",
						children: [loading ? "..." : (stats.estoqueTotalMm / 1e3).toLocaleString(void 0, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						}), " m"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Soma de todos pedaços"
					})] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between space-y-0 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium",
							children: "Pedaços Disponíveis"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-muted-foreground" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold",
						children: loading ? "..." : stats.totalPedacos
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Em estoque"
					})] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between space-y-0 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium",
							children: "Saídas no Mês"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-4 w-4 text-muted-foreground" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold",
						children: loading ? "..." : stats.saidasMes
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Cortes registrados"
					})] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between space-y-0 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium",
							children: "Devoluções no Mês"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "h-4 w-4 text-muted-foreground" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold",
						children: loading ? "..." : stats.devolucoesMes
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Retornos ao estoque"
					})] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between space-y-0 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium",
							children: "Maior Cliente"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-muted-foreground" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xl font-bold truncate",
						children: loading ? "..." : stats.topCliente
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Com mais retiradas"
					})] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between space-y-0 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium",
							children: "Maior PCO (Obra)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardHat, { className: "h-4 w-4 text-muted-foreground" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xl font-bold truncate",
						children: loading ? "..." : stats.topPco
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Destino mais frequente"
					})] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between space-y-0 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium",
							children: "Última Movimentação"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-muted-foreground" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-lg font-bold",
						children: loading ? "..." : stats.ultimaMovimentacao
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Data/Hora"
					})] })] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Consumo por Mês (m)" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "h-[250px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: charts.consumoPorMes,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										vertical: false,
										opacity: .3
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										fontSize: 12
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										fontSize: 12,
										tickFormatter: (val) => (val / 1e3).toFixed(1)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										cursor: { fill: "transparent" },
										formatter: (value) => [`${(value / 1e3).toFixed(2)} m`, "Consumo"],
										contentStyle: {
											borderRadius: "8px",
											border: "none",
											boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "consumo",
										fill: "currentColor",
										className: "fill-primary",
										radius: [
											4,
											4,
											0,
											0
										]
									})
								]
							})
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Movimentações (Entradas x Saídas)" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "h-[250px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: charts.entradasXSaidas,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										vertical: false,
										opacity: .3
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										fontSize: 12
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { fontSize: 12 }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										borderRadius: "8px",
										border: "none",
										boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "Saídas",
										stroke: "#ef4444",
										strokeWidth: 2
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "Entradas",
										stroke: "#22c55e",
										strokeWidth: 2
									})
								]
							})
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Top 5 Clientes (Consumo m)" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "h-[250px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
									data: charts.consumoPorCliente,
									cx: "50%",
									cy: "50%",
									innerRadius: 60,
									outerRadius: 80,
									paddingAngle: 5,
									dataKey: "value",
									children: charts.consumoPorCliente.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									formatter: (value) => [`${(value / 1e3).toFixed(2)} m`, "Consumo"],
									contentStyle: {
										borderRadius: "8px",
										border: "none",
										boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {})
							] })
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Estoque Disponível por Barra (m)" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "h-[250px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: charts.estoquePorBarra,
								layout: "vertical",
								margin: { left: 20 },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										horizontal: false,
										opacity: .3
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										type: "number",
										fontSize: 12,
										tickFormatter: (val) => (val / 1e3).toFixed(1)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										dataKey: "name",
										type: "category",
										fontSize: 12,
										width: 100
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										cursor: { fill: "transparent" },
										formatter: (value) => [`${(value / 1e3).toFixed(2)} m`, "Estoque"],
										contentStyle: {
											borderRadius: "8px",
											border: "none",
											boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "value",
										fill: "#8884d8",
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
					})] })
				]
			})
		]
	});
}
//#endregion
export { CobreDashboard as component };
