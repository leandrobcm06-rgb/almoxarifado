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
//#region node_modules/.nitro/vite/services/ssr/assets/app.cobre.devolucao-CoaLUtWE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CopperReturn() {
	const { user } = useAuth();
	const [bars, setBars] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [selectedBarId, setSelectedBarId] = (0, import_react.useState)("");
	const [returnLength, setReturnLength] = (0, import_react.useState)("");
	const [client, setClient] = (0, import_react.useState)("");
	const [pco, setPco] = (0, import_react.useState)("");
	const [responsible, setResponsible] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	async function loadBars() {
		try {
			const { data, error } = await supabase.from("copper_bars").select("*").order("name", { ascending: true });
			if (error) throw error;
			setBars(data || []);
		} catch (error) {
			toast.error("Erro ao carregar barras matrizes: " + error.message);
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadBars();
	}, []);
	const handleRegisterReturn = async (e) => {
		e.preventDefault();
		const bar = bars.find((b) => b.id === selectedBarId);
		if (!bar) return toast.error("Selecione a barra origem.");
		const length = Number(returnLength) * 1e3;
		if (length <= 0) return toast.error("O tamanho devolvido deve ser maior que zero.");
		setSubmitting(true);
		try {
			const { data: newPiece, error: pieceError } = await supabase.from("copper_pieces").insert({
				bar_id: bar.id,
				current_length_mm: length,
				status: "disponivel",
				notes: "Gerado via devolução"
			}).select().single();
			if (pieceError) throw pieceError;
			const { error: movError } = await supabase.from("copper_movements").insert({
				piece_id: newPiece.id,
				bar_id: bar.id,
				type: "devolucao",
				length_mm: length,
				client,
				pco,
				responsible,
				notes
			});
			if (movError) throw movError;
			toast.success("Devolução registrada com sucesso! Um novo pedaço foi criado no estoque.");
			setSelectedBarId("");
			setReturnLength("");
			setClient("");
			setPco("");
			setResponsible("");
			setNotes("");
		} catch (error) {
			toast.error("Erro ao registrar devolução: " + error.message);
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-3xl mx-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-3xl font-bold tracking-tight",
			children: "Devolução de Material"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "Registre material que sobrou de uma obra e retornou ao estoque."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "pt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleRegisterReturn,
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-medium border-b pb-2",
								children: "Material Devolvido"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Barra Matriz (Referência)" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										disabled: loading,
										value: selectedBarId,
										onValueChange: setSelectedBarId,
										required: true,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione a que tipo de barra este pedaço pertence..." }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: bars.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: b.id,
											children: [
												b.name,
												" (",
												b.auxiliary_code,
												")"
											]
										}, b.id)) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "A devolução criará um NOVO pedaço disponível vinculado a esta barra."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tamanho Devolvido (m)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									step: "0.01",
									required: true,
									min: "0.01",
									value: returnLength,
									onChange: (e) => setReturnLength(e.target.value)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-medium border-b pb-2",
								children: "Origem e Responsável"
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
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Responsável pela devolução" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									placeholder: "Nome do funcionário que devolveu",
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
								placeholder: "Motivo ou detalhes adicionais (opcional)",
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
						children: submitting ? "Registrando..." : "Registrar Devolução"
					})
				]
			})
		}) })]
	});
}
//#endregion
export { CopperReturn as component };
