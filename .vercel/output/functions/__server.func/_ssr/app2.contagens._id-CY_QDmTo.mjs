import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as isRedirect, d as Link, p as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as supabase } from "./client-DLaKby2r.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input$1 } from "./input-B8Q2ztVi.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { B as ChevronLeft, L as CircleCheck, U as Camera, b as LoaderCircle, d as Save, k as FileDown } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as exportToPDF, t as exportToExcel } from "./export-utils-Br7mJ8Y_.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useAuth } from "./use-auth-qSs-MqmX.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./esm-B5zcwdrx.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-V5evfO_R.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DKUiPm7z.mjs";
import { t as Route } from "./app.contagens._id-eDAjKNv9.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app2.contagens._id-CY_QDmTo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var Input = objectType({ photoId: stringType().uuid() });
var runOcrOnPhoto = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => Input.parse(d)).handler(createSsrRpc("86f7d60c77271b3d676e77aa30534483ab69198078f4825902745be2b9b3091c"));
function Page() {
	const { id } = Route.useParams();
	const qc = useQueryClient();
	const { hasRole, hasAnyRole } = useAuth();
	const blind = hasRole("contador") && !hasAnyRole([
		"admin",
		"gestor",
		"conferente"
	]);
	const { data: count } = useQuery({
		queryKey: ["count", id],
		queryFn: async () => (await supabase.from("counts").select("*, count_rounds(*)").eq("id", id).single()).data
	});
	const { data: products } = useQuery({
		queryKey: ["products-all"],
		queryFn: async () => (await supabase.from("products").select("id, codigo, descricao, unidade, cod_auxiliar, fabricante, localizacao").order("codigo").limit(5e3)).data ?? []
	});
	const finalize = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("counts").update({
				status: "finalizada",
				finalizado_em: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Contagem finalizada");
			qc.invalidateQueries({ queryKey: ["count", id] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (!count) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-muted-foreground",
		children: "Carregando..."
	});
	const rounds = (count.count_rounds ?? []).sort((a, b) => a.rodada - b.rodada);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/contagens",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-semibold",
						children: count.nome
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 mt-1 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: count.tipo
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: count.status }),
							blind && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: "Modo cego"
							})
						]
					})]
				}),
				count.status !== "finalizada" && !blind && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => finalize.mutate(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 mr-2" }), "Finalizar contagem"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: `r${rounds[0]?.rodada ?? 1}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, { children: rounds.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
				value: `r${r.rodada}`,
				children: ["Rodada ", r.rodada]
			}, r.id)) }), rounds.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: `r${r.rodada}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoundPanel, {
					roundId: r.id,
					countId: id,
					products: products ?? [],
					blind,
					disabled: count.status === "finalizada"
				})
			}, r.id))]
		})]
	});
}
function RoundPanel({ roundId, countId, products, blind, disabled }) {
	const qc = useQueryClient();
	const ocrFn = useServerFn(runOcrOnPhoto);
	const fileRef = (0, import_react.useRef)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const { data: items } = useQuery({
		queryKey: ["round-items", roundId],
		queryFn: async () => (await supabase.from("count_items").select("*, products(codigo, descricao, unidade)").eq("round_id", roundId)).data ?? []
	});
	const { data: photos } = useQuery({
		queryKey: ["round-photos", roundId],
		queryFn: async () => (await supabase.from("count_photos").select("*").eq("round_id", roundId).order("created_at", { ascending: false })).data ?? []
	});
	const itemMap = (0, import_react.useMemo)(() => new Map((items ?? []).map((i) => [i.product_id, i])), [items]);
	const filtered = (products ?? []).filter((p) => {
		if (!search) return true;
		const s = search.toLowerCase();
		return p.codigo.toLowerCase().includes(s) || p.descricao.toLowerCase().includes(s);
	}).slice(0, 200);
	const upsertItem = useMutation({
		mutationFn: async ({ productId, qty }) => {
			const { data: u } = await supabase.auth.getUser();
			const ex = itemMap.get(productId);
			if (ex) {
				const { error } = await supabase.from("count_items").update({
					qty_contada: qty,
					origem: "manual"
				}).eq("id", ex.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("count_items").insert({
					round_id: roundId,
					product_id: productId,
					qty_contada: qty,
					origem: "manual",
					created_by: u.user?.id
				});
				if (error) throw error;
			}
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["round-items", roundId] }),
		onError: (e) => toast.error(e.message)
	});
	const uploadPhoto = useMutation({
		mutationFn: async (file) => {
			const path = `${countId}/${roundId}/${crypto.randomUUID()}-${file.name}`;
			const { error } = await supabase.storage.from("count-photos").upload(path, file);
			if (error) throw error;
			const { data: u } = await supabase.auth.getUser();
			const { data: photo, error: ie } = await supabase.from("count_photos").insert({
				round_id: roundId,
				storage_path: path,
				uploaded_by: u.user?.id,
				ocr_status: "processando"
			}).select().single();
			if (ie) throw ie;
			await ocrFn({ data: { photoId: photo.id } });
			return photo.id;
		},
		onSuccess: () => {
			toast.success("Foto processada — revise abaixo");
			qc.invalidateQueries({ queryKey: ["round-photos", roundId] });
		},
		onError: (e) => toast.error(e.message)
	});
	const applyOcr = useMutation({
		mutationFn: async (photoId) => {
			const result = (photos?.find((p) => p.id === photoId))?.ocr_result;
			if (!result?.items?.length) throw new Error("Sem itens reconhecidos");
			const productByCode = new Map((products ?? []).map((p) => [p.codigo, p.id]));
			const { data: u } = await supabase.auth.getUser();
			const toUpsert = result.items.filter((i) => productByCode.has(i.codigo)).map((i) => ({
				round_id: roundId,
				product_id: productByCode.get(i.codigo),
				qty_contada: i.qty,
				origem: "foto",
				photo_id: photoId,
				created_by: u.user?.id
			}));
			if (toUpsert.length === 0) throw new Error("Nenhum código reconhecido bate com produtos cadastrados");
			const { error } = await supabase.from("count_items").upsert(toUpsert, { onConflict: "round_id,product_id" });
			if (error) throw error;
			return toUpsert.length;
		},
		onSuccess: (n) => {
			toast.success(`${n} itens importados da foto`);
			qc.invalidateQueries({ queryKey: ["round-items", roundId] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "flex flex-row items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Foto + OCR"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				className: "hidden",
				accept: "image/*",
				capture: "environment",
				onChange: (e) => {
					const f = e.target.files?.[0];
					if (f) uploadPhoto.mutate(f);
					e.currentTarget.value = "";
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				disabled: disabled || uploadPhoto.isPending,
				onClick: () => fileRef.current?.click(),
				children: [uploadPhoto.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4 mr-2" }), "Tirar / enviar foto"]
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [photos?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Nenhuma foto. Use o botão acima para fotografar a folha de contagem manuscrita."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: photos?.map((p) => {
				const n = p.ocr_result?.items?.length ?? 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border rounded p-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: p.storage_path.split("/").pop()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								"Status OCR: ",
								p.ocr_status,
								" — ",
								n,
								" itens reconhecidos"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						disabled: p.ocr_status !== "concluido" || n === 0 || disabled,
						onClick: () => applyOcr.mutate(p.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4 mr-2" }), "Revisar e aplicar"]
					})]
				}, p.id);
			})
		})] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "flex flex-row items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "text-base",
				children: [
					"Lançamento manual (",
					items?.length ?? 0,
					" itens contados)"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => exportToExcel((products ?? []).map((p) => ({
						"COD. AUXILIAR": p.cod_auxiliar ?? "",
						"FABRICANTE": p.fabricante ?? "",
						"LOCALIZAÇÃO": p.localizacao ?? "",
						"NOME": p.descricao,
						"FÍSICO": ""
					})), "lista-contagem-em-branco"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "h-4 w-4 mr-2" }), "Excel em branco"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => exportToPDF(`Lista de contagem`, [
						"COD. AUXILIAR",
						"FABRICANTE",
						"LOCALIZAÇÃO",
						"NOME",
						"FÍSICO"
					], (products ?? []).map((p) => [
						p.cod_auxiliar ?? "",
						p.fabricante ?? "",
						p.localizacao ?? "",
						p.descricao,
						""
					]), "lista-contagem", "landscape"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "h-4 w-4 mr-2" }), "PDF para imprimir"]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
				placeholder: "Buscar produto...",
				value: search,
				onChange: (e) => setSearch(e.target.value),
				className: "max-w-md mb-3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[500px] overflow-y-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Código" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Descrição" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-32 text-right",
						children: "Contado"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Origem" })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filtered.map((p) => {
					const item = itemMap.get(p.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-mono text-xs",
							children: p.codigo
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-sm",
							children: p.descricao
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
							type: "number",
							step: "0.001",
							disabled,
							defaultValue: item?.qty_contada ?? "",
							onBlur: (e) => {
								const v = parseFloat(e.target.value);
								if (!isNaN(v) && v !== (item?.qty_contada ?? null)) upsertItem.mutate({
									productId: p.id,
									qty: v
								});
							},
							className: "h-8 text-right"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: item ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-xs",
							children: item.origem
						}) : null })
					] }, p.id);
				}) })] })
			}),
			(products ?? []).length > 200 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-2",
				children: "Mostrando 200 — use a busca."
			})
		] })] })]
	});
}
//#endregion
export { Page as component };
