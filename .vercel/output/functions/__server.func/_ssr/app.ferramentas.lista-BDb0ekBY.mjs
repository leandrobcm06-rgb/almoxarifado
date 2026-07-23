import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as supabase } from "./client-DLaKby2r.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { C as Info, U as Camera, c as SquarePen, l as Search, m as Plus, s as Trash2 } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, r as DialogFooter, t as Dialog } from "./dialog-DnAIRT37.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.ferramentas.lista-BDb0ekBY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ToolsList() {
	const [tools, setTools] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [isAddOpen, setIsAddOpen] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [editingTool, setEditingTool] = (0, import_react.useState)(null);
	const [viewingTool, setViewingTool] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("");
	const [brand, setBrand] = (0, import_react.useState)("");
	const [model, setModel] = (0, import_react.useState)("");
	const [specifications, setSpecifications] = (0, import_react.useState)("");
	const [patrimonyNumber, setPatrimonyNumber] = (0, import_react.useState)("");
	const [serialNumber, setSerialNumber] = (0, import_react.useState)("");
	const [condition, setCondition] = (0, import_react.useState)("nova");
	const [acquisitionDate, setAcquisitionDate] = (0, import_react.useState)("");
	const [value, setValue] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [photoFile, setPhotoFile] = (0, import_react.useState)(null);
	async function loadTools() {
		setLoading(true);
		try {
			const { data, error } = await supabase.from("tools").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			setTools(data || []);
		} catch (error) {
			toast.error("Erro ao carregar ferramentas: " + error.message);
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadTools();
	}, []);
	const resetForm = () => {
		setName("");
		setCategory("");
		setBrand("");
		setModel("");
		setSpecifications("");
		setPatrimonyNumber("");
		setSerialNumber("");
		setCondition("nova");
		setAcquisitionDate("");
		setValue("");
		setNotes("");
		setPhotoFile(null);
		setEditingTool(null);
	};
	const handleEditClick = (tool) => {
		setEditingTool(tool);
		setName(tool.name);
		setCategory(tool.category);
		setBrand(tool.brand);
		setModel(tool.model || "");
		setSpecifications(tool.specifications || "");
		setPatrimonyNumber(tool.patrimony_number || "");
		setSerialNumber(tool.serial_number || "");
		setCondition(tool.condition);
		setAcquisitionDate(tool.acquisition_date || "");
		setValue(tool.value?.toString() || "");
		setNotes(tool.notes || "");
		setIsAddOpen(true);
	};
	const handleDelete = async (id, status) => {
		if (status === "emprestada") return toast.error("Não é possível excluir uma ferramenta emprestada.");
		if (!confirm("Tem certeza que deseja excluir esta ferramenta?")) return;
		try {
			const { error } = await supabase.from("tools").delete().eq("id", id);
			if (error) throw error;
			toast.success("Ferramenta excluída com sucesso.");
			loadTools();
		} catch (error) {
			toast.error("Erro ao excluir: " + error.message);
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			let photo_url = editingTool?.photo_url || null;
			if (photoFile) {
				const fileExt = photoFile.name.split(".").pop();
				const fileName = `${Date.now()}.${fileExt}`;
				const { error: uploadError, data: uploadData } = await supabase.storage.from("tool-photos").upload(fileName, photoFile);
				if (uploadError) throw uploadError;
				const { data: { publicUrl } } = supabase.storage.from("tool-photos").getPublicUrl(fileName);
				photo_url = publicUrl;
			}
			const payload = {
				name,
				category,
				brand,
				model,
				specifications,
				patrimony_number: patrimonyNumber,
				serial_number: serialNumber,
				condition,
				acquisition_date: acquisitionDate || null,
				value: value ? Number(value) : null,
				notes,
				photo_url,
				...editingTool ? {} : { status: condition === "danificada" ? "danificada" : condition === "manutencao" ? "manutencao" : "disponivel" }
			};
			if (editingTool) {
				const { error } = await supabase.from("tools").update(payload).eq("id", editingTool.id);
				if (error) throw error;
				toast.success("Ferramenta atualizada!");
			} else {
				const { data, error } = await supabase.from("tools").insert([payload]).select().single();
				if (error) throw error;
				await supabase.from("tool_movements").insert({
					tool_id: data.id,
					type: "cadastro",
					condition
				});
				toast.success("Ferramenta cadastrada!");
			}
			setIsAddOpen(false);
			resetForm();
			loadTools();
		} catch (error) {
			toast.error("Erro ao salvar: " + error.message);
		} finally {
			setSubmitting(false);
		}
	};
	const filteredTools = tools.filter((t) => t.name?.toLowerCase().includes(search.toLowerCase()) || t.category?.toLowerCase().includes(search.toLowerCase()) || t.patrimony_number?.toLowerCase().includes(search.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold tracking-tight",
					children: "Acervo de Ferramentas"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "Gerencie todas as ferramentas da empresa."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open: isAddOpen,
					onOpenChange: (v) => {
						if (!v) resetForm();
						setIsAddOpen(v);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-2" }), " Nova Ferramenta"] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
						className: "max-w-2xl max-h-[90vh] overflow-y-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editingTool ? "Editar Ferramenta" : "Cadastrar Nova Ferramenta" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nome (obrigatório)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												required: true,
												value: name,
												onChange: (e) => setName(e.target.value)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Categoria (obrigatório)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												required: true,
												placeholder: "Ex: Elétrica, Manual...",
												value: category,
												onChange: (e) => setCategory(e.target.value)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Marca (obrigatório)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												required: true,
												value: brand,
												onChange: (e) => setBrand(e.target.value)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Modelo (obrigatório)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												required: true,
												value: model,
												onChange: (e) => setModel(e.target.value)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Número de Patrimônio" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: patrimonyNumber,
												onChange: (e) => setPatrimonyNumber(e.target.value)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Número de Série" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: serialNumber,
												onChange: (e) => setSerialNumber(e.target.value)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Estado de Conservação" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: condition,
												onValueChange: setCondition,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "nova",
														children: "Nova"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "boa",
														children: "Boa"
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
														children: "Em Manutenção"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "danificada",
														children: "Danificada"
													})
												] })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Data de Aquisição (obrigatório)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "date",
												required: true,
												value: acquisitionDate,
												onChange: (e) => setAcquisitionDate(e.target.value)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Valor da Ferramenta (obrigatório)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												step: "0.01",
												required: true,
												value,
												onChange: (e) => setValue(e.target.value)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Foto da Ferramenta" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "file",
												accept: "image/*",
												onChange: (e) => setPhotoFile(e.target.files?.[0] || null)
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Especificações Técnicas (obrigatório)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										required: true,
										rows: 3,
										value: specifications,
										onChange: (e) => setSpecifications(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Observações Gerais" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 2,
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
									disabled: submitting,
									children: submitting ? "Salvando..." : "Salvar Ferramenta"
								})] })
							]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Pesquisar por nome, categoria ou patrimônio...",
					className: "pl-9 w-full md:w-[400px]",
					value: search,
					onChange: (e) => setSearch(e.target.value)
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center p-8 text-muted-foreground",
				children: "Carregando ferramentas..."
			}) : filteredTools.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center p-8 border border-dashed rounded-lg text-muted-foreground",
				children: "Nenhuma ferramenta encontrada."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
				children: filteredTools.map((tool) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-video w-full bg-muted flex items-center justify-center overflow-hidden",
						children: tool.photo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: tool.photo_url,
							alt: tool.name,
							className: "w-full h-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-10 w-10 text-muted-foreground/50" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-start mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-lg leading-tight",
									children: tool.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: tool.brand
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: tool.status === "disponivel" ? "default" : tool.status === "emprestada" ? "secondary" : "destructive",
									children: tool.status.toUpperCase()
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-y-1 text-sm mt-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted-foreground",
										children: "Categoria:"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-right truncate",
										title: tool.category,
										children: tool.category
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted-foreground",
										children: "Patrimônio:"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-right truncate",
										children: tool.patrimony_number || "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted-foreground",
										children: "Estado:"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-right capitalize",
										children: tool.condition
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2 mt-4 pt-4 border-t",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "flex-1",
										onClick: () => setViewingTool(tool),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4 mr-1" }), " Detalhes"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => handleEditClick(tool),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										className: "text-red-500 hover:text-red-600",
										onClick: () => handleDelete(tool.id, tool.status),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})
								]
							})
						]
					})]
				}, tool.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!viewingTool,
				onOpenChange: () => setViewingTool(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Detalhes da Ferramenta" }) }), viewingTool && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							viewingTool.photo_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full h-64 rounded-md overflow-hidden bg-black flex justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: viewingTool.photo_url,
									alt: viewingTool.name,
									className: "object-contain h-full"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "block text-muted-foreground",
											children: "Nome"
										}),
										" ",
										viewingTool.name
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "block text-muted-foreground",
											children: "Categoria"
										}),
										" ",
										viewingTool.category
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "block text-muted-foreground",
											children: "Marca"
										}),
										" ",
										viewingTool.brand
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "block text-muted-foreground",
											children: "Modelo"
										}),
										" ",
										viewingTool.model
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "block text-muted-foreground",
											children: "Nº Patrimônio"
										}),
										" ",
										viewingTool.patrimony_number || "-"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "block text-muted-foreground",
											children: "Nº Série"
										}),
										" ",
										viewingTool.serial_number || "-"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "block text-muted-foreground",
											children: "Situação"
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: viewingTool.status })
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "block text-muted-foreground",
											children: "Estado Físico"
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "capitalize",
											children: viewingTool.condition
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "block text-muted-foreground",
											children: "Data Aquisição"
										}),
										" ",
										viewingTool.acquisition_date || "-"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "block text-muted-foreground",
											children: "Valor Estimado"
										}),
										" ",
										viewingTool.value ? `R$ ${viewingTool.value}` : "-"
									] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "block text-muted-foreground",
									children: "Especificações"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "whitespace-pre-wrap",
									children: viewingTool.specifications
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "block text-muted-foreground",
									children: "Observações"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "whitespace-pre-wrap",
									children: viewingTool.notes || "-"
								})]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { ToolsList as component };
