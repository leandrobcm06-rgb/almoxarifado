import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as supabase } from "./client-DLaKby2r.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { l as Search } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { r as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.cobre.pedacos-RS70S4Np.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CopperPieces() {
	const [pieces, setPieces] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	async function loadPieces() {
		setLoading(true);
		try {
			const { data, error } = await supabase.from("copper_pieces").select("*, bar:copper_bars(name, auxiliary_code)").order("created_at", { ascending: false });
			if (error) throw error;
			setPieces(data || []);
		} catch (error) {
			console.error("Erro ao carregar pedaços:", error);
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadPieces();
	}, []);
	const filteredPieces = pieces.filter((p) => p.bar?.name.toLowerCase().includes(search.toLowerCase()) || p.bar?.auxiliary_code.toLowerCase().includes(search.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold tracking-tight",
					children: "Gerenciamento de Pedaços"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "Visualize todos os pedaços disponíveis ou encerrados em estoque."
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Pesquisar por nome da barra ou código...",
					className: "pl-9 w-full md:w-[350px]",
					value: search,
					onChange: (e) => setSearch(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Pedaços de Cobre" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center p-8 text-muted-foreground",
				children: "Carregando pedaços..."
			}) : filteredPieces.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center p-8 text-muted-foreground",
				children: "Nenhum pedaço encontrado."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border rounded-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Barra Origem" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Comprimento Atual (m)" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Situação" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Data de Cadastro" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Observações" })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filteredPieces.map((piece) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "font-medium",
						children: [piece.bar?.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground ml-2 text-xs",
							children: [
								"(",
								piece.bar?.auxiliary_code,
								")"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [(piece.current_length_mm / 1e3).toFixed(2), " m"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: piece.status === "disponivel" ? "default" : "secondary",
						children: piece.status === "disponivel" ? "Disponível" : "Encerrado"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: format(new Date(piece.created_at), "dd/MM/yyyy HH:mm") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-muted-foreground max-w-[200px] truncate",
						children: piece.notes || "-"
					})
				] }, piece.id)) })] })
			}) })] })
		]
	});
}
//#endregion
export { CopperPieces as component };
