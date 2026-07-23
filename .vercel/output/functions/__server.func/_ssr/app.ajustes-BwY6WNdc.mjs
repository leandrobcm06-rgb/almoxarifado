import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as supabase } from "./client-DLaKby2r.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { i as TabsTrigger, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { D as FileText, k as FileDown, n as Wrench } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, t as Dialog } from "./dialog-DnAIRT37.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as exportToPDF, t as exportToExcel } from "./export-utils-Br7mJ8Y_.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.ajustes-BwY6WNdc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const qc = useQueryClient();
	const [status, setStatus] = (0, import_react.useState)("pendente");
	const [search, setSearch] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [obs, setObs] = (0, import_react.useState)("");
	const { data } = useQuery({
		queryKey: ["adjustments", status],
		queryFn: async () => (await supabase.from("divergence_items").select("*, products(codigo, descricao), companies(nome), divergence_reports(counts(nome))").eq("status", status).order("updated_at", { ascending: false }).limit(500)).data ?? []
	});
	const update = useMutation({
		mutationFn: async ({ id, newStatus, observacao }) => {
			const { data: u } = await supabase.auth.getUser();
			const patch = {
				status: newStatus,
				observacao
			};
			if (newStatus === "ajustado") {
				patch.ajustado_por = u.user?.id;
				patch.ajustado_em = (/* @__PURE__ */ new Date()).toISOString();
			}
			const { error } = await supabase.from("divergence_items").update(patch).eq("id", id);
			if (error) throw error;
			await supabase.from("audit_log").insert({
				user_id: u.user?.id,
				acao: `divergencia.${newStatus}`,
				entidade: "divergence_item",
				entidade_id: id,
				dados: patch
			});
		},
		onSuccess: () => {
			toast.success("Ajuste atualizado");
			setEditing(null);
			setObs("");
			qc.invalidateQueries({ queryKey: ["adjustments"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const filtered = (data ?? []).filter((d) => {
		if (!search) return true;
		const s = search.toLowerCase();
		return d.products?.codigo?.toLowerCase().includes(s) || d.products?.descricao?.toLowerCase().includes(s);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold",
					children: "Gestão de ajustes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Fluxo: pendente → em andamento → ajustado."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => exportToExcel(filtered.map((i) => ({
							codigo: i.products?.codigo,
							descricao: i.products?.descricao,
							empresa: i.companies?.nome,
							ajuste: i.ajuste_sugerido,
							status: i.status,
							observacao: i.observacao
						})), `ajustes-${status}`),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "h-4 w-4 mr-2" }), "Excel"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => exportToPDF("Ajustes — " + status, [
							"Código",
							"Descrição",
							"Empresa",
							"Ajuste",
							"Obs."
						], filtered.map((i) => [
							i.products?.codigo,
							i.products?.descricao,
							i.companies?.nome,
							i.ajuste_sugerido,
							i.observacao ?? ""
						]), `ajustes-${status}`, "landscape"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 mr-2" }), "PDF"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
				value: status,
				onValueChange: (v) => setStatus(v),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "pendente",
						children: "Pendentes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "em_andamento",
						children: "Em andamento"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "ajustado",
						children: "Ajustados"
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Buscar por código ou descrição...",
				value: search,
				onChange: (e) => setSearch(e.target.value),
				className: "max-w-md"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Código" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Descrição" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Empresa" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Ajuste"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Atualizado" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [filtered.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-mono text-xs",
						children: d.products?.codigo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-sm",
						children: d.products?.descricao
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-sm",
						children: d.companies?.nome
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: `text-right font-medium ${Number(d.ajuste_sugerido) < 0 ? "text-destructive" : "text-green-600"}`,
						children: Number(d.ajuste_sugerido).toFixed(3)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-xs text-muted-foreground",
						children: format(new Date(d.updated_at), "dd/MM HH:mm")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => {
							setEditing(d);
							setObs(d.observacao ?? "");
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-4 w-4" })
					}) })
				] }, d.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 6,
					className: "text-center text-muted-foreground py-6",
					children: "Nenhum item."
				}) })] })] })
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editing,
				onOpenChange: (v) => {
					if (!v) setEditing(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Atualizar ajuste" }) }), editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Produto:"
									}),
									" ",
									editing.products?.codigo,
									" — ",
									editing.products?.descricao
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Empresa:"
									}),
									" ",
									editing.companies?.nome
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Ajuste sugerido:"
									}),
									" ",
									Number(editing.ajuste_sugerido).toFixed(3)
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Status atual:"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: editing.status })
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Observação" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: obs,
							onChange: (e) => setObs(e.target.value),
							placeholder: "Detalhes do ajuste no ERP, motivo, etc."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 justify-end",
							children: [
								editing.status !== "em_andamento" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => update.mutate({
										id: editing.id,
										newStatus: "em_andamento",
										observacao: obs
									}),
									children: "Em andamento"
								}),
								editing.status !== "ignorado" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => update.mutate({
										id: editing.id,
										newStatus: "ignorado",
										observacao: obs
									}),
									children: "Ignorar"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => update.mutate({
										id: editing.id,
										newStatus: "ajustado",
										observacao: obs
									}),
									children: "Marcar ajustado"
								})
							]
						})
					]
				})] })
			})
		]
	});
}
//#endregion
export { Page as component };
