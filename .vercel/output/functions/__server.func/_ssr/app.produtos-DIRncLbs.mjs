import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as supabase } from "./client-DLaKby2r.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { D as FileText, i as Upload, k as FileDown, m as Plus } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, t as Dialog } from "./dialog-DnAIRT37.mjs";
import { n as exportToPDF, r as parseExcelFile, t as exportToExcel } from "./export-utils-Br7mJ8Y_.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.produtos-DIRncLbs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const qc = useQueryClient();
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [codigo, setCodigo] = (0, import_react.useState)("");
	const [descricao, setDescricao] = (0, import_react.useState)("");
	const [unidade, setUnidade] = (0, import_react.useState)("UN");
	const { data, isLoading } = useQuery({
		queryKey: ["products"],
		queryFn: async () => (await supabase.from("products").select("*").order("codigo").limit(2e3)).data ?? []
	});
	const { data: totals } = useQuery({
		queryKey: ["product-totals"],
		queryFn: async () => {
			const { data: snap } = await supabase.from("stock_snapshots").select("id").eq("status", "confirmado").order("snapshot_date", { ascending: false }).limit(1).maybeSingle();
			if (!snap) return /* @__PURE__ */ new Map();
			const map = /* @__PURE__ */ new Map();
			const pageSize = 1e3;
			for (let from = 0;; from += pageSize) {
				const { data: rows, error } = await supabase.from("stock_snapshot_items").select("product_id, qty").eq("snapshot_id", snap.id).range(from, from + pageSize - 1);
				if (error) throw error;
				for (const r of rows ?? []) map.set(r.product_id, (map.get(r.product_id) ?? 0) + Number(r.qty));
				if (!rows || rows.length < pageSize) break;
			}
			return map;
		}
	});
	const filtered = (0, import_react.useMemo)(() => {
		if (!q) return data ?? [];
		const s = q.toLowerCase();
		return (data ?? []).filter((p) => p.codigo.toLowerCase().includes(s) || p.descricao.toLowerCase().includes(s));
	}, [data, q]);
	const create = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("products").insert({
				codigo,
				descricao,
				unidade
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Produto criado");
			setOpen(false);
			setCodigo("");
			setDescricao("");
			qc.invalidateQueries({ queryKey: ["products"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const importExcel = useMutation({
		mutationFn: async (file) => {
			const products = (await parseExcelFile(file)).map((r) => ({
				codigo: String(r.codigo ?? r.Codigo ?? r.código ?? r.Código ?? r.CODIGO ?? "").trim(),
				descricao: String(r.descricao ?? r.Descricao ?? r.descrição ?? r.Descrição ?? r.DESCRICAO ?? "").trim(),
				unidade: String(r.unidade ?? r.Unidade ?? r.UN ?? "UN").trim() || "UN"
			})).filter((p) => p.codigo && p.descricao);
			if (products.length === 0) throw new Error("Planilha vazia ou sem colunas codigo/descricao");
			const { error } = await supabase.from("products").upsert(products, { onConflict: "codigo" });
			if (error) throw error;
			return products.length;
		},
		onSuccess: (n) => {
			toast.success(`${n} produtos importados`);
			qc.invalidateQueries({ queryKey: ["products"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold",
					children: "Produtos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Catálogo de itens do almoxarifado."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							className: "hidden",
							accept: ".xlsx,.xls",
							onChange: (e) => e.target.files?.[0] && importExcel.mutate(e.target.files[0])
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4 mr-2" }), "Importar Excel"] })
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => exportToExcel(filtered, "produtos"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "h-4 w-4 mr-2" }), "Excel"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => exportToPDF("Produtos", [
								"Código",
								"Descrição",
								"UN"
							], filtered.map((p) => [
								p.codigo,
								p.descricao,
								p.unidade
							]), "produtos"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 mr-2" }), "PDF"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
							open,
							onOpenChange: setOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-2" }), "Novo"] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Novo produto" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Código" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: codigo,
										onChange: (e) => setCodigo(e.target.value)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Descrição" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: descricao,
										onChange: (e) => setDescricao(e.target.value)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Unidade" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: unidade,
										onChange: (e) => setUnidade(e.target.value)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => create.mutate(),
										disabled: !codigo || !descricao,
										className: "w-full",
										children: "Salvar"
									})
								]
							})] })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Buscar por código ou descrição...",
				value: q,
				onChange: (e) => setQ(e.target.value),
				className: "max-w-md"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Código" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Descrição" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Qtd total"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 3,
					className: "text-center py-6 text-muted-foreground",
					children: "Carregando..."
				}) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 3,
					className: "text-center py-6 text-muted-foreground",
					children: "Nenhum produto. Importe uma planilha (colunas: codigo, descricao, unidade)."
				}) }) : filtered.slice(0, 500).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-mono text-xs",
						children: p.codigo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.descricao }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right tabular-nums",
						children: totals?.get(p.id) ?? 0
					})
				] }, p.id)) })] }), filtered.length > 500 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 text-xs text-muted-foreground text-center",
					children: [
						"Mostrando 500 de ",
						filtered.length,
						". Refine a busca."
					]
				})]
			}) })
		]
	});
}
//#endregion
export { Page as component };
