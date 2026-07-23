import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as supabase } from "./client-DLaKby2r.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { d as Save, i as Upload, k as FileDown, s as Trash2 } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { r as parseExcelFile, t as exportToExcel } from "./export-utils-Br7mJ8Y_.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as format } from "../_libs/date-fns.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.estoque-BwMnocuC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function pick(row, keys) {
	const norm = (s) => s.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
	const map = {};
	for (const k of Object.keys(row)) map[norm(k)] = row[k];
	for (const k of keys) {
		const v = map[norm(k)];
		if (v !== void 0 && v !== null && v !== "") return v;
	}
}
function Page() {
	const qc = useQueryClient();
	const [snapshotDate, setSnapshotDate] = (0, import_react.useState)(format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"));
	const [pending, setPending] = (0, import_react.useState)([]);
	const [activeCnpj, setActiveCnpj] = (0, import_react.useState)("");
	const { data: companies } = useQuery({
		queryKey: ["companies"],
		queryFn: async () => (await supabase.from("companies").select("*").eq("ativo", true).order("nome")).data ?? []
	});
	const { data: snapshots } = useQuery({
		queryKey: ["snapshots"],
		queryFn: async () => (await supabase.from("stock_snapshots").select("*, profiles(nome)").order("snapshot_date", { ascending: false }).limit(50)).data ?? []
	});
	const handleFile = async (file, companyId) => {
		if (!companyId) return toast.error("Selecione a empresa antes");
		try {
			const rows = await parseExcelFile(file);
			const parsed = [];
			for (const r of rows) {
				const codigo = String(pick(r, [
					"codauxiliar",
					"cod_auxiliar",
					"auxiliar",
					"codigo",
					"codreferencia",
					"cod_referencia",
					"referencia",
					"cod"
				]) ?? "").trim();
				const qtyRaw = pick(r, [
					"quantidadesistema",
					"quantidade_sistema",
					"qtdsistema",
					"sistema",
					"qty",
					"quantidade",
					"saldo",
					"estoque",
					"qtd",
					"fisico"
				]);
				const qty = Number(String(qtyRaw ?? "").toString().replace(",", "."));
				if (!codigo || isNaN(qty)) continue;
				parsed.push({
					codigo,
					descricao: String(pick(r, [
						"produto",
						"descricao",
						"nome",
						"descricaoproduto"
					]) ?? ""),
					cod_auxiliar: codigo,
					fabricante: pick(r, ["fabricante", "marca"]) ? String(pick(r, ["fabricante", "marca"])) : void 0,
					localizacao: pick(r, [
						"localizacao",
						"local",
						"endereco"
					]) ? String(pick(r, [
						"localizacao",
						"local",
						"endereco"
					])) : void 0,
					qty,
					company_id: companyId
				});
			}
			if (parsed.length === 0) return toast.error("Nenhuma linha reconhecida. Verifique se a planilha tem colunas Cod. Auxiliar, Produto, Fabricante, Localizacao e Quantidade sistema.");
			const map = /* @__PURE__ */ new Map();
			for (const p of parsed) {
				const key = `${p.company_id}|${p.codigo}`;
				const ex = map.get(key);
				if (ex) ex.qty += p.qty;
				else map.set(key, { ...p });
			}
			setPending((prev) => {
				return [...prev.filter((r) => r.company_id !== companyId), ...Array.from(map.values())];
			});
			toast.success(`${map.size} linhas carregadas para revisão`);
		} catch (e) {
			toast.error(e.message);
		}
	};
	const confirm = useMutation({
		mutationFn: async () => {
			if (pending.length === 0) throw new Error("Nada para confirmar");
			const codes = Array.from(new Set(pending.map((r) => r.codigo)));
			const { data: prods } = await supabase.from("products").select("id, codigo").in("codigo", codes);
			const productMap = new Map((prods ?? []).map((p) => [p.codigo, p.id]));
			const missing = codes.filter((c) => !productMap.has(c));
			if (missing.length > 0) {
				const toCreate = missing.map((c) => {
					const sample = pending.find((p) => p.codigo === c);
					return {
						codigo: c,
						descricao: sample?.descricao || c,
						unidade: "UN",
						cod_auxiliar: sample?.cod_auxiliar ?? null,
						fabricante: sample?.fabricante ?? null,
						localizacao: sample?.localizacao ?? null
					};
				});
				const { data: created, error } = await supabase.from("products").insert(toCreate).select("id, codigo");
				if (error) throw error;
				for (const p of created ?? []) productMap.set(p.codigo, p.id);
			}
			const { data: snap, error: snapErr } = await supabase.from("stock_snapshots").insert({
				snapshot_date: snapshotDate,
				status: "confirmado",
				confirmed_at: (/* @__PURE__ */ new Date()).toISOString()
			}).select().single();
			if (snapErr) throw snapErr;
			const itemsMap = /* @__PURE__ */ new Map();
			for (const r of pending) {
				const pid = productMap.get(r.codigo);
				const key = `${r.company_id}|${pid}`;
				const ex = itemsMap.get(key);
				if (ex) ex.qty += r.qty;
				else itemsMap.set(key, {
					snapshot_id: snap.id,
					product_id: pid,
					company_id: r.company_id,
					qty: r.qty
				});
			}
			const items = Array.from(itemsMap.values());
			for (let i = 0; i < items.length; i += 500) {
				const chunk = items.slice(i, i + 500);
				const { error } = await supabase.from("stock_snapshot_items").insert(chunk);
				if (error) throw error;
			}
			return snap.id;
		},
		onSuccess: () => {
			toast.success("Estoque confirmado");
			setPending([]);
			qc.invalidateQueries({ queryKey: ["snapshots"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const groupedByCompany = (companies ?? []).map((c) => ({
		company: c,
		count: pending.filter((r) => r.company_id === c.id).length
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold",
				children: "Importação do estoque diário"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					"Uma planilha por CNPJ. O sistema reconhece colunas: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "COD. REFERENCIA" }),
					", ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "NOME" }),
					", ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "SISTEMA" }),
					" (saldo) e, opcionalmente, ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "COD. AUXILIAR" }),
					", ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "FABRICANTE" }),
					", ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "LOCALIZAÇÃO" }),
					"."
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Nova importação" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Data do snapshot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: snapshotDate,
						onChange: (e) => setSnapshotDate(e.target.value)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Empresa (selecione, depois carregue o arquivo)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: activeCnpj,
								onValueChange: setActiveCnpj,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Escolha o CNPJ" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: companies?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: c.id,
									children: [
										c.nome,
										" — ",
										c.cnpj
									]
								}, c.id)) })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: `inline-flex items-center gap-2 px-4 h-9 rounded-md text-sm font-medium cursor-pointer ${activeCnpj ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										className: "hidden",
										accept: ".xlsx,.xls",
										disabled: !activeCnpj,
										onChange: (e) => {
											const f = e.target.files?.[0];
											if (f) handleFile(f, activeCnpj);
											e.currentTarget.value = "";
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }),
									"Carregar planilha"
								]
							})]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2 text-sm",
					children: groupedByCompany.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: g.count > 0 ? "default" : "outline",
						children: [
							g.company.nome,
							": ",
							g.count,
							" itens"
						]
					}, g.company.id))
				})]
			})] }),
			pending.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "flex flex-row items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { children: [
					"Revisão (",
					pending.length,
					" linhas)"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => exportToExcel(pending, "estoque-revisao"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "h-4 w-4 mr-2" }), "Excel"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => setPending([]),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 mr-2" }), "Limpar"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => confirm.mutate(),
							disabled: confirm.isPending,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4 mr-2" }), "Confirmar"]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-[400px] overflow-y-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Empresa" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Código" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Descrição" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Qtd"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: pending.slice(0, 300).map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-xs",
							children: companies?.find((c) => c.id === r.company_id)?.nome
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-mono text-xs",
							children: r.codigo
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-sm",
							children: r.descricao
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: r.qty
						})
					] }, i)) })] })
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Histórico de snapshots" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Data" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Criado por" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Confirmado em" })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: snapshots?.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: format(/* @__PURE__ */ new Date(s.snapshot_date + "T00:00"), "dd/MM/yyyy") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: s.status === "confirmado" ? "default" : "secondary",
						children: s.status
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-sm",
						children: s.profiles?.nome ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-sm text-muted-foreground",
						children: s.confirmed_at ? format(new Date(s.confirmed_at), "dd/MM/yyyy HH:mm") : "—"
					})
				] }, s.id)) })] })
			})] })
		]
	});
}
//#endregion
export { Page as component };
