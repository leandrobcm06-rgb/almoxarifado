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
import { M as Download, h as Paperclip, q as ArrowLeftRight, w as HardHat } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, r as DialogFooter, t as Dialog } from "./dialog-DnAIRT37.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as format } from "../_libs/date-fns.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.ferramentas.emprestimos-By-hGrsP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FerramentasEmprestimos() {
	const [loans, setLoans] = (0, import_react.useState)([]);
	const [availableTools, setAvailableTools] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [isAddOpen, setIsAddOpen] = (0, import_react.useState)(false);
	const [isReturnOpen, setIsReturnOpen] = (0, import_react.useState)(false);
	const [selectedLoanToReturn, setSelectedLoanToReturn] = (0, import_react.useState)(null);
	const [viewReceipt, setViewReceipt] = (0, import_react.useState)(null);
	const [selectedToolId, setSelectedToolId] = (0, import_react.useState)("");
	const [employee, setEmployee] = (0, import_react.useState)("");
	const [client, setClient] = (0, import_react.useState)("");
	const [pco, setPco] = (0, import_react.useState)("");
	const [expectedReturnDate, setExpectedReturnDate] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [receiptFile, setReceiptFile] = (0, import_react.useState)(null);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [returnCondition, setReturnCondition] = (0, import_react.useState)("boa");
	const [returnNotes, setReturnNotes] = (0, import_react.useState)("");
	async function loadData() {
		setLoading(true);
		try {
			const { data: loansData, error: loansError } = await supabase.from("tool_loans").select(`*, tool:tools(name, patrimony_number)`).order("loan_date", { ascending: false });
			if (loansError) throw loansError;
			setLoans(loansData || []);
			const { data: toolsData, error: toolsError } = await supabase.from("tools").select("id, name, patrimony_number").eq("status", "disponivel");
			if (toolsError) throw toolsError;
			setAvailableTools(toolsData || []);
		} catch (error) {
			toast.error("Erro ao carregar empréstimos: " + error.message);
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	const handleRegisterLoan = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			if (!selectedToolId) throw new Error("Selecione uma ferramenta");
			let proof_image_url = null;
			if (receiptFile) {
				const fileExt = receiptFile.name.split(".").pop();
				const fileName = `${Date.now()}.${fileExt}`;
				const { error: uploadError } = await supabase.storage.from("loan-receipts").upload(fileName, receiptFile);
				if (uploadError) throw uploadError;
				const { data: { publicUrl } } = supabase.storage.from("loan-receipts").getPublicUrl(fileName);
				proof_image_url = publicUrl;
			}
			const { error: loanError, data: newLoan } = await supabase.from("tool_loans").insert({
				tool_id: selectedToolId,
				employee,
				client,
				pco,
				expected_return_date: expectedReturnDate || null,
				notes,
				proof_image_url
			}).select().single();
			if (loanError) throw loanError;
			const { error: toolUpdateError } = await supabase.from("tools").update({ status: "emprestada" }).eq("id", selectedToolId);
			if (toolUpdateError) throw toolUpdateError;
			await supabase.from("tool_movements").insert({
				tool_id: selectedToolId,
				type: "emprestimo",
				employee,
				client,
				pco
			});
			toast.success("Empréstimo registrado com sucesso!");
			setIsAddOpen(false);
			setSelectedToolId("");
			setEmployee("");
			setClient("");
			setPco("");
			setExpectedReturnDate("");
			setNotes("");
			setReceiptFile(null);
			loadData();
		} catch (error) {
			toast.error("Erro ao registrar: " + error.message);
		} finally {
			setSubmitting(false);
		}
	};
	const handleReturnTool = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			if (!selectedLoanToReturn) return;
			const { error: loanError } = await supabase.from("tool_loans").update({
				status: "devolvido",
				actual_return_date: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", selectedLoanToReturn.id);
			if (loanError) throw loanError;
			const newStatus = returnCondition === "danificada" || returnCondition === "manutencao" ? returnCondition : "disponivel";
			const { error: toolUpdateError } = await supabase.from("tools").update({
				status: newStatus,
				condition: returnCondition
			}).eq("id", selectedLoanToReturn.tool_id);
			if (toolUpdateError) throw toolUpdateError;
			await supabase.from("tool_movements").insert({
				tool_id: selectedLoanToReturn.tool_id,
				type: "devolucao",
				employee: selectedLoanToReturn.employee,
				client: selectedLoanToReturn.client,
				pco: selectedLoanToReturn.pco,
				condition: returnCondition
			});
			toast.success("Devolução registrada com sucesso!");
			setIsReturnOpen(false);
			setSelectedLoanToReturn(null);
			setReturnCondition("boa");
			setReturnNotes("");
			loadData();
		} catch (error) {
			toast.error("Erro ao registrar devolução: " + error.message);
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold tracking-tight",
					children: "Empréstimos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "Controle de ferramentas com colaboradores e obras."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open: isAddOpen,
					onOpenChange: setIsAddOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardHat, { className: "h-4 w-4 mr-2" }), " Novo Empréstimo"] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
						className: "max-w-xl max-h-[90vh] overflow-y-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Registrar Saída de Ferramenta" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleRegisterLoan,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Ferramenta" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										required: true,
										value: selectedToolId,
										onValueChange: setSelectedToolId,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione uma ferramenta disponível..." }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [availableTools.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: t.id,
											children: [
												t.name,
												" ",
												t.patrimony_number ? `(${t.patrimony_number})` : ""
											]
										}, t.id)), availableTools.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "none",
											disabled: true,
											children: "Nenhuma ferramenta disponível"
										})] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Funcionário" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										placeholder: "Nome de quem retirou a ferramenta",
										value: employee,
										onChange: (e) => setEmployee(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Cliente / Empresa" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Ex: ABC Construções",
											value: client,
											onChange: (e) => setClient(e.target.value)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PCO (Obra)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Ex: 12345",
											value: pco,
											onChange: (e) => setPco(e.target.value)
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Data Prevista p/ Devolução (Opcional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: expectedReturnDate,
										onChange: (e) => setExpectedReturnDate(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Comprovante Assinado (Opcional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "file",
										accept: "image/*,application/pdf",
										onChange: (e) => setReceiptFile(e.target.files?.[0] || null)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Observações" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										placeholder: "Qualquer detalhe extra...",
										value: notes,
										onChange: (e) => setNotes(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setIsAddOpen(false),
									children: "Cancelar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: submitting || availableTools.length === 0,
									children: submitting ? "Registrando..." : "Registrar"
								})] })
							]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "pt-6",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center p-8 text-muted-foreground",
					children: "Carregando histórico..."
				}) : loans.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center p-8 border border-dashed rounded-lg text-muted-foreground",
					children: "Nenhum empréstimo registrado."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-md border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Data" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Ferramenta" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Funcionário / Obra" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Previsão Volta" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Comprovante" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Ação"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: loans.map((loan) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium whitespace-nowrap",
							children: format(new Date(loan.loan_date), "dd/MM/yyyy HH:mm")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [loan.tool?.name, loan.tool?.patrimony_number && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs text-muted-foreground",
							children: loan.tool.patrimony_number
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: loan.employee
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: loan.client ? `${loan.client} (PCO: ${loan.pco || "-"})` : "-"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: loan.expected_return_date ? format(new Date(loan.expected_return_date), "dd/MM/yyyy") : "-" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: loan.proof_image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => setViewReceipt(loan.proof_image_url),
							title: "Ver Comprovante",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-4 w-4 text-blue-500" })
						}) : "-" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: loan.status === "ativo" ? "secondary" : "outline",
							children: loan.status === "ativo" ? "Emprestada" : "Devolvida"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							className: "text-right",
							children: [loan.status === "ativo" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => {
									setSelectedLoanToReturn(loan);
									setIsReturnOpen(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "h-4 w-4 mr-2" }), " Devolver"]
							}), loan.status === "devolvido" && loan.actual_return_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground whitespace-nowrap",
								children: ["Voltou em ", format(new Date(loan.actual_return_date), "dd/MM/yy")]
							})]
						})
					] }, loan.id)) })] })
				})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isReturnOpen,
				onOpenChange: setIsReturnOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Registrar Devolução" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleReturnTool,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Ferramenta Sendo Devolvida" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-muted rounded-md text-sm font-medium",
								children: [
									selectedLoanToReturn?.tool?.name,
									" - ",
									selectedLoanToReturn?.employee
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Estado de Conservação ao Retornar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: returnCondition,
								onValueChange: setReturnCondition,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "boa",
										children: "Boa (Pronta para uso)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "regular",
										children: "Regular"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "ruim",
										children: "Ruim"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "manutencao",
										children: "Necessita Manutenção (Indisponibilizar)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "danificada",
										children: "Danificada (Indisponibilizar)"
									})
								] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Observações na Devolução" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								placeholder: "Peça quebrada, atraso justificado, etc...",
								value: returnNotes,
								onChange: (e) => setReturnNotes(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setIsReturnOpen(false),
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: submitting,
							children: submitting ? "Processando..." : "Confirmar Devolução"
						})] })
					]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!viewReceipt,
				onOpenChange: () => setViewReceipt(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Comprovante de Empréstimo" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center p-4 bg-muted rounded-md overflow-hidden min-h-[300px]",
							children: viewReceipt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: viewReceipt,
								alt: "Comprovante",
								className: "max-h-[70vh] object-contain"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: viewReceipt || "#",
							target: "_blank",
							rel: "noopener noreferrer",
							download: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4 mr-2" }), " Baixar Original"]
							})
						}) })
					]
				})
			})
		]
	});
}
//#endregion
export { FerramentasEmprestimos as component };
