import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as supabase } from "./client-DLaKby2r.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { u as Scissors } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, r as DialogFooter, t as Dialog } from "./dialog-DnAIRT37.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as format } from "../_libs/date-fns.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.cobre.movimentacoes-DEqvx2KW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CobreMovimentacoes() {
	const [movements, setMovements] = (0, import_react.useState)([]);
	const [availablePieces, setAvailablePieces] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [isAddOpen, setIsAddOpen] = (0, import_react.useState)(false);
	const [type, setType] = (0, import_react.useState)("saida");
	const [selectedPieceId, setSelectedPieceId] = (0, import_react.useState)("");
	const [lengthM, setLengthM] = (0, import_react.useState)("");
	const [clientName, setClientName] = (0, import_react.useState)("");
	const [pco, setPco] = (0, import_react.useState)("");
	const [userRequesting, setUserRequesting] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	async function loadData() {
		setLoading(true);
		try {
			const { data: movs, error: movsError } = await supabase.from("copper_movements").select(`
          *,
          piece:copper_pieces(id, bar:copper_bars(name, auxiliary_code))
        `).order("created_at", { ascending: false });
			if (movsError) throw movsError;
			setMovements(movs || []);
			const { data: pieces, error: piecesError } = await supabase.from("copper_pieces").select(`
          id, current_length_mm, status,
          bar:copper_bars(name, auxiliary_code)
        `).eq("status", "disponivel");
			if (piecesError) throw piecesError;
			setAvailablePieces(pieces || []);
		} catch (error) {
			toast.error("Erro ao carregar movimentações: " + error.message);
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	const handleRegisterMovement = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			const piece = availablePieces.find((p) => p.id === selectedPieceId);
			if (!piece && type === "saida") throw new Error("Selecione um pedaço válido");
			const lengthNum = Number(lengthM);
			if (type === "saida") {
				if (lengthNum * 1e3 > piece.current_length_mm) throw new Error(`Não há comprimento suficiente. O pedaço tem apenas ${(piece.current_length_mm / 1e3).toFixed(2)} m.`);
				const { error: movError } = await supabase.from("copper_movements").insert({
					piece_id: selectedPieceId,
					type: "saida",
					length_mm: Math.round(lengthNum * 1e3),
					client_name: clientName,
					pco,
					user_requesting: userRequesting
				});
				if (movError) throw movError;
				const newLength = piece.current_length_mm - Math.round(lengthNum * 1e3);
				const newStatus = newLength <= 0 ? "esgotado" : "disponivel";
				const { error: pieceError } = await supabase.from("copper_pieces").update({
					current_length_mm: newLength,
					status: newStatus
				}).eq("id", selectedPieceId);
				if (pieceError) throw pieceError;
			} else throw new Error("Devolução direta requer seleção da barra original. Funcionalidade em desenvolvimento.");
			toast.success("Movimentação registrada com sucesso!");
			setIsAddOpen(false);
			setLengthM("");
			setClientName("");
			setPco("");
			setUserRequesting("");
			loadData();
		} catch (error) {
			toast.error("Erro: " + error.message);
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Histórico de Movimentações"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Registre saídas e cortes do estoque de cobre."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open: isAddOpen,
				onOpenChange: setIsAddOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scissors, { className: "h-4 w-4 mr-2" }), " Registrar Saída"] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Registrar Saída (Corte)" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleRegisterMovement,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pedaço a ser cortado" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: selectedPieceId,
								onValueChange: setSelectedPieceId,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione um pedaço disponível..." }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: availablePieces.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: p.id,
									children: [
										p.bar?.name,
										" (",
										p.bar?.auxiliary_code,
										") - ",
										(p.current_length_mm / 1e3).toFixed(2),
										" m disp."
									]
								}, p.id)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tamanho do Corte (m)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									required: true,
									min: "0.01",
									step: "0.01",
									placeholder: "Ex: 0.5",
									value: lengthM,
									onChange: (e) => setLengthM(e.target.value)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PCO (Obra)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Ex: PCO-1234",
									value: pco,
									onChange: (e) => setPco(e.target.value)
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Cliente" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								placeholder: "Nome do cliente",
								value: clientName,
								onChange: (e) => setClientName(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Solicitante" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								placeholder: "Quem solicitou o material",
								value: userRequesting,
								onChange: (e) => setUserRequesting(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setIsAddOpen(false),
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: submitting,
							children: submitting ? "Registrando..." : "Registrar Saída"
						})] })
					]
				})] })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Histórico de Cortes e Saídas" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Data" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Barra Origem" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Tamanho Cortado" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Cliente" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "PCO" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Solicitante" })
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			colSpan: 6,
			className: "text-center py-8 text-muted-foreground",
			children: "Carregando..."
		}) }) : movements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			colSpan: 6,
			className: "text-center py-8 text-muted-foreground",
			children: "Nenhuma movimentação registrada."
		}) }) : movements.map((mov) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "whitespace-nowrap",
				children: format(new Date(mov.created_at), "dd/MM/yyyy HH:mm")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
				className: "font-medium",
				children: [
					mov.piece?.bar?.name,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground text-xs",
						children: [
							"(",
							mov.piece?.bar?.auxiliary_code,
							")"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "destructive",
				children: [
					"-",
					((mov.length_mm || 0) / 1e3).toFixed(2),
					" m"
				]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: mov.client_name }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: mov.pco || "-" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: mov.user_requesting })
		] }, mov.id)) })] }) })] })]
	});
}
//#endregion
export { CobreMovimentacoes as component };
