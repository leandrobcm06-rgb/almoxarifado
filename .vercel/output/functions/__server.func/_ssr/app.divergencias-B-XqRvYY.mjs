import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as supabase } from "./client-DLaKby2r.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { D as FileText, f as RefreshCw, k as FileDown } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as exportToPDF, t as exportToExcel } from "./export-utils-Br7mJ8Y_.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as format } from "../_libs/date-fns.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.divergencias-B-XqRvYY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const qc = useQueryClient();
	const [countId, setCountId] = (0, import_react.useState)("");
	const { data: counts } = useQuery({
		queryKey: ["counts-finalized"],
		queryFn: async () => (await supabase.from("counts").select("id, nome, status, snapshot_id").eq("status", "finalizada").order("created_at", { ascending: false })).data ?? []
	});
	const { data: reports } = useQuery({
		queryKey: ["divergence-reports"],
		queryFn: async () => (await supabase.from("divergence_reports").select("*, counts(nome)").order("gerado_em", { ascending: false })).data ?? []
	});
	const generate = useMutation({
		mutationFn: async () => {
			const count = counts?.find((c) => c.id === countId);
			if (!count || !count.snapshot_id) throw new Error("Selecione uma contagem finalizada com snapshot");
			const { data: rounds } = await supabase.from("count_rounds").select("id").eq("count_id", count.id);
			const roundIds = (rounds ?? []).map((r) => r.id);
			const { data: items } = await supabase.from("count_items").select("product_id, qty_contada, round_id").in("round_id", roundIds);
			const totalPerProduct = /* @__PURE__ */ new Map();
			for (const it of items ?? []) {
				const e = totalPerProduct.get(it.product_id) ?? {
					sum: 0,
					n: 0
				};
				e.sum += Number(it.qty_contada);
				e.n++;
				totalPerProduct.set(it.product_id, e);
			}
			const { data: snapItems } = await supabase.from("stock_snapshot_items").select("product_id, company_id, qty").eq("snapshot_id", count.snapshot_id);
			const perProductCnpjSaldos = /* @__PURE__ */ new Map();
			for (const si of snapItems ?? []) {
				const m = perProductCnpjSaldos.get(si.product_id) ?? /* @__PURE__ */ new Map();
				m.set(si.company_id, Number(si.qty));
				perProductCnpjSaldos.set(si.product_id, m);
			}
			const { data: rep, error } = await supabase.from("divergence_reports").insert({
				count_id: count.id,
				snapshot_id: count.snapshot_id
			}).select().single();
			if (error) throw error;
			const allProducts = new Set([...totalPerProduct.keys(), ...perProductCnpjSaldos.keys()]);
			const divItems = [];
			for (const pid of allProducts) {
				const contado = totalPerProduct.has(pid) ? totalPerProduct.get(pid).sum / totalPerProduct.get(pid).n : 0;
				const cnpjMap = perProductCnpjSaldos.get(pid) ?? /* @__PURE__ */ new Map();
				const totalSistema = Array.from(cnpjMap.values()).reduce((a, b) => a + b, 0);
				const diferenca = contado - totalSistema;
				if (diferenca === 0 && contado === 0) continue;
				if (cnpjMap.size === 0) divItems.push({
					report_id: rep.id,
					product_id: pid,
					company_id: null,
					saldo_sistema: 0,
					qty_contada: contado,
					diferenca,
					ajuste_sugerido: diferenca
				});
				else for (const [cnpjId, saldo] of cnpjMap.entries()) {
					const proporcao = totalSistema === 0 ? 1 / cnpjMap.size : saldo / totalSistema;
					const ajusteCnpj = Number((diferenca * proporcao).toFixed(3));
					divItems.push({
						report_id: rep.id,
						product_id: pid,
						company_id: cnpjId,
						saldo_sistema: saldo,
						qty_contada: contado * proporcao,
						diferenca: ajusteCnpj,
						ajuste_sugerido: ajusteCnpj
					});
				}
			}
			const valid = divItems.filter((d) => d.company_id);
			for (let i = 0; i < valid.length; i += 500) {
				const chunk = valid.slice(i, i + 500);
				const { error: ie } = await supabase.from("divergence_items").insert(chunk);
				if (ie) throw ie;
			}
			return rep.id;
		},
		onSuccess: () => {
			toast.success("Relatório gerado");
			qc.invalidateQueries({ queryKey: ["divergence-reports"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold",
				children: "Divergências"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Gere o relatório a partir de uma contagem finalizada."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Novo relatório" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3 items-end flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 min-w-[240px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: countId,
						onValueChange: setCountId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Contagem finalizada" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: counts?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: c.id,
							children: c.nome
						}, c.id)) })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => generate.mutate(),
					disabled: !countId || generate.isPending,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 mr-2" }), "Gerar relatório"]
				})]
			}) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Relatórios" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-0",
				children: [reports?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6 text-center text-muted-foreground text-sm",
					children: "Nenhum relatório ainda."
				}), reports?.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportSection, { report: r }, r.id))]
			})] })
		]
	});
}
function ReportSection({ report }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const { data: items } = useQuery({
		queryKey: ["div-items", report.id],
		enabled: open,
		queryFn: async () => (await supabase.from("divergence_items").select("*, products(codigo, descricao), companies(nome)").eq("report_id", report.id).order("diferenca", { ascending: false })).data ?? []
	});
	const [filter, setFilter] = (0, import_react.useState)("todos");
	const filtered = (0, import_react.useMemo)(() => {
		if (!items) return [];
		if (filter === "todos") return items;
		return items.filter((i) => i.status === filter);
	}, [items, filter]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-b last:border-b-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-3 flex items-center justify-between hover:bg-accent cursor-pointer",
			onClick: () => setOpen((v) => !v),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-medium",
				children: report.counts?.nome
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs text-muted-foreground",
				children: ["Gerado em ", format(new Date(report.gerado_em), "dd/MM/yyyy HH:mm")]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "outline",
				children: open ? "fechar" : "abrir"
			})]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-3 space-y-3 bg-muted/30",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: filter,
						onValueChange: setFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-48",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "todos",
								children: "Todos"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "pendente",
								children: "Pendente"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "em_andamento",
								children: "Em andamento"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "ajustado",
								children: "Ajustado"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "ignorado",
								children: "Ignorado"
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => exportToExcel(filtered.map((i) => ({
							codigo: i.products?.codigo,
							descricao: i.products?.descricao,
							empresa: i.companies?.nome,
							saldo_sistema: i.saldo_sistema,
							qtd_contada: i.qty_contada,
							diferenca: i.diferenca,
							ajuste_sugerido: i.ajuste_sugerido,
							status: i.status
						})), `divergencias-${report.id.slice(0, 6)}`),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "h-4 w-4 mr-2" }), "Excel"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => exportToPDF("Divergências", [
							"Código",
							"Descrição",
							"Empresa",
							"Sistema",
							"Contado",
							"Dif.",
							"Ajuste",
							"Status"
						], filtered.map((i) => [
							i.products?.codigo,
							i.products?.descricao,
							i.companies?.nome,
							i.saldo_sistema,
							i.qty_contada,
							i.diferenca,
							i.ajuste_sugerido,
							i.status
						]), `divergencias-${report.id.slice(0, 6)}`, "landscape"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 mr-2" }), "PDF"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Código" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Descrição" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Empresa" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "text-right",
					children: "Sistema"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "text-right",
					children: "Contado"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "text-right",
					children: "Diferença"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "text-right",
					children: "Ajuste"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" })
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filtered.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "font-mono text-xs",
					children: i.products?.codigo
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-sm",
					children: i.products?.descricao
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-sm",
					children: i.companies?.nome
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right",
					children: Number(i.saldo_sistema).toFixed(2)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right",
					children: Number(i.qty_contada).toFixed(2)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: `text-right font-medium ${Number(i.diferenca) < 0 ? "text-destructive" : Number(i.diferenca) > 0 ? "text-green-600" : ""}`,
					children: Number(i.diferenca).toFixed(2)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right",
					children: Number(i.ajuste_sugerido).toFixed(2)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					className: "text-xs",
					children: i.status
				}) })
			] }, i.id)) })] })]
		})]
	});
}
//#endregion
export { Page as component };
