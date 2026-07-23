import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as supabase } from "./client-DLaKby2r.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { t as useAuth } from "./use-auth-qSs-MqmX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.cobre.saida-rqYGR_5J.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CopperExit() {
	const { user } = useAuth();
	const [pieces, setPieces] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [selectedPieceId, setSelectedPieceId] = (0, import_react.useState)("");
	const [cutLength, setCutLength] = (0, import_react.useState)("");
	const [client, setClient] = (0, import_react.useState)("");
	const [pco, setPco] = (0, import_react.useState)("");
	const [responsible, setResponsible] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	async function loadAvailablePieces() {
		try {
			const { data, error } = await supabase.from("copper_pieces").select("*, bar:copper_bars(name, auxiliary_code)").eq("status", "disponivel").order("created_at", { ascending: false });
			if (error) throw error;
			setPieces(data || []);
		} catch (error) {
			toast.error("Erro ao carregar pedaços disponíveis: " + error.message);
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadAvailablePieces();
	}, []);
	const handleRegisterExit = async (e) => {
		e.preventDefault();
		const piece = pieces.find((p) => p.id === selectedPieceId);
		if (!piece) return toast.error("Selecione um pedaço.");
		const cut = Number(cutLength) * 1e3;
		if (cut <= 0) return toast.error("O tamanho do corte deve ser maior que zero.");
		if (cut > piece.current_length_mm) return toast.error("O corte não pode ser maior que o tamanho disponível no pedaço selecionado.");
		setSubmitting(true);
		try {
			const newLength = piece.current_length_mm - cut;
			const newStatus = newLength === 0 ? "encerrado" : "disponivel";
			const { error: pieceError } = await supabase.from("copper_pieces").update({
				current_length_mm: newLength,
				status: newStatus
			}).eq("id", piece.id);
			if (pieceError) throw pieceError;
			const { error: movError } = await supabase.from("copper_movements").insert({
				piece_id: piece.id,
				bar_id: piece.bar_id,
				type: "saida",
				length_mm: cut,
				client,
				pco,
				responsible,
				notes
			});
			if (movError) throw movError;
			toast.success("Saída de material registrada com sucesso!");
			setSelectedPieceId("");
			setCutLength("");
			setClient("");
			setPco("");
			setResponsible("");
			setNotes("");
			loadAvailablePieces();
		} catch (error) {
			toast.error("Erro ao registrar saída: " + error.message);
		} finally {
			setSubmitting(false);
		}
	};
	const selectedPiece = pieces.find((p) => p.id === selectedPieceId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-3xl mx-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-3xl font-bold tracking-tight",
			children: "Saída de Material (Corte)"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "Registre um corte para retirar material de um pedaço existente."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "pt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleRegisterExit,
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-medium border-b pb-2",
								children: "Material de Origem"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pedaço a ser cortado" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										disabled: loading,
										value: selectedPieceId,
										onValueChange: setSelectedPieceId,
										required: true,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione uma barra/pedaço disponível..." }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: pieces.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: p.id,
											children: [
												p.bar?.name,
												" (",
												p.bar?.auxiliary_code,
												") - Restante: ",
												(p.current_length_mm / 1e3).toFixed(2),
												" m"
											]
										}, p.id)) })]
									}),
									selectedPiece && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											"Corte máximo permitido: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [(selectedPiece.current_length_mm / 1e3).toFixed(2), " m"] }),
											". Se você cortar o total, o pedaço será encerrado automaticamente."
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tamanho do Corte Retirado (m)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									step: "0.01",
									required: true,
									min: "0.01",
									max: selectedPiece ? selectedPiece.current_length_mm / 1e3 : void 0,
									value: cutLength,
									onChange: (e) => setCutLength(e.target.value)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-medium border-b pb-2",
								children: "Destino e Responsável"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Cliente" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										placeholder: "Ex: Nome da Empresa",
										value: client,
										onChange: (e) => setClient(e.target.value)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PCO (Obra)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										placeholder: "Ex: 123456",
										value: pco,
										onChange: (e) => setPco(e.target.value)
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Responsável pela retirada" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									placeholder: "Nome do funcionário ou solicitante",
									value: responsible,
									onChange: (e) => setResponsible(e.target.value)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4 pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Observações Adicionais" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								placeholder: "Detalhes adicionais sobre a saída (opcional)",
								value: notes,
								onChange: (e) => setNotes(e.target.value)
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						size: "lg",
						disabled: submitting || loading,
						children: submitting ? "Registrando..." : "Registrar Saída"
					})
				]
			})
		}) })]
	});
}
//#endregion
export { CopperExit as component };
