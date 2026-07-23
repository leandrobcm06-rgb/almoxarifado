import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as supabase } from "./client-DLaKby2r.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { O as FileSpreadsheet, P as ClipboardList, a as TriangleAlert, n as Wrench } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as format } from "../_libs/date-fns.mjs";
import { t as useAuth } from "./use-auth-qSs-MqmX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.index-3I2FkQUi.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const { roles } = useAuth();
	const { data } = useQuery({
		queryKey: ["dashboard-stats"],
		queryFn: async () => {
			const [counts, divs, snap, adjPend] = await Promise.all([
				supabase.from("counts").select("id", {
					count: "exact",
					head: true
				}).in("status", [
					"rascunho",
					"em_contagem",
					"aguardando_revisao"
				]),
				supabase.from("divergence_items").select("id", {
					count: "exact",
					head: true
				}).eq("status", "pendente"),
				supabase.from("stock_snapshots").select("snapshot_date, status").eq("status", "confirmado").order("snapshot_date", { ascending: false }).limit(1).maybeSingle(),
				supabase.from("divergence_items").select("id", {
					count: "exact",
					head: true
				}).eq("status", "em_andamento")
			]);
			return {
				contagensAbertas: counts.count ?? 0,
				divergenciasPendentes: divs.count ?? 0,
				ajustesEmAndamento: adjPend.count ?? 0,
				ultimoSnapshot: snap.data?.snapshot_date ?? null
			};
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold",
				children: "Dashboard"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Visão geral do almoxarifado"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, {}),
						label: "Contagens em aberto",
						value: data?.contagensAbertas ?? "-"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {}),
						label: "Divergências pendentes",
						value: data?.divergenciasPendentes ?? "-"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, {}),
						label: "Ajustes em andamento",
						value: data?.ajustesEmAndamento ?? "-"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, {}),
						label: "Último estoque",
						value: data?.ultimoSnapshot ? format(/* @__PURE__ */ new Date(data.ultimoSnapshot + "T00:00"), "dd/MM/yyyy") : "—"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Suas funções" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: roles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-muted-foreground",
					children: "Nenhuma função atribuída. Peça a um administrador."
				}) : roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "px-2 py-1 rounded bg-secondary text-xs font-medium",
					children: r
				}, r))
			}) })] })
		]
	});
}
function Stat({ icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-4 flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xl font-semibold",
			children: value
		})] })]
	}) });
}
//#endregion
export { Dashboard as component };
