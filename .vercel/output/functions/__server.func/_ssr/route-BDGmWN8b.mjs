import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as Link, f as useNavigate, i as useRouterState, s as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as supabase } from "./client-DLaKby2r.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { G as Bell, O as FileSpreadsheet, P as ClipboardList, V as ChevronDown, W as Building2, _ as Package2, a as TriangleAlert, n as Wrench, r as Users, t as X, v as Menu, w as HardHat, x as LayoutDashboard, y as LogOut, z as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { i as DropdownMenuTrigger, n as DropdownMenuContent, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-NQwLQ7z6.mjs";
import { t as useAuth } from "./use-auth-qSs-MqmX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-BDGmWN8b.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NotificationsBadge() {
	const [notifications, setNotifications] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		async function loadNotifications() {
			try {
				const newNotifications = [];
				const today = (/* @__PURE__ */ new Date()).toISOString();
				const { data: delayedLoans } = await supabase.from("tool_loans").select("*, tool:tools(name)").eq("status", "ativo").lt("expected_return_date", today);
				if (delayedLoans && delayedLoans.length > 0) delayedLoans.forEach((loan) => {
					newNotifications.push({
						id: `loan-${loan.id}`,
						type: "atraso",
						title: "Devolução Atrasada",
						message: `A ferramenta ${loan.tool?.name} não foi devolvida por ${loan.employee}.`,
						link: "/app/ferramentas/emprestimos",
						icon: HardHat,
						color: "text-red-500"
					});
				});
				const { data: brokenTools } = await supabase.from("tools").select("*").in("status", ["manutencao", "danificada"]);
				if (brokenTools && brokenTools.length > 0) brokenTools.forEach((tool) => {
					newNotifications.push({
						id: `tool-${tool.id}`,
						type: "manutencao",
						title: "Ferramenta Inoperante",
						message: `${tool.name} está ${tool.status}.`,
						link: "/app/ferramentas/lista",
						icon: Wrench,
						color: "text-orange-500"
					});
				});
				const { data: bars } = await supabase.from("copper_bars").select("*, pieces:copper_pieces(current_length_mm, status)");
				if (bars) bars.forEach((bar) => {
					const totalMm = bar.pieces.filter((p) => p.status === "disponivel").reduce((acc, p) => acc + Number(p.current_length_mm), 0);
					if (totalMm === 0) newNotifications.push({
						id: `bar-zero-${bar.id}`,
						type: "cobre-zero",
						title: "Cobre Esgotado",
						message: `A barra ${bar.name} não possui saldo disponível.`,
						link: "/app/cobre/barras",
						icon: Package2,
						color: "text-red-500"
					});
					else if (totalMm < 1e3) newNotifications.push({
						id: `bar-low-${bar.id}`,
						type: "cobre-baixo",
						title: "Cobre Acabando",
						message: `A barra ${bar.name} está com saldo baixo (${(totalMm / 1e3).toFixed(2)} m).`,
						link: "/app/cobre/barras",
						icon: Package2,
						color: "text-orange-500"
					});
				});
				setNotifications(newNotifications);
			} catch (error) {
				console.error("Erro ao carregar notificações", error);
			} finally {
				setLoading(false);
			}
		}
		loadNotifications();
		const interval = setInterval(loadNotifications, 3e5);
		return () => clearInterval(interval);
	}, []);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "ghost",
		size: "icon",
		className: "relative",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5 opacity-50" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "ghost",
			size: "icon",
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5" }), notifications.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: "absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-red-500 text-white border-2 border-background",
				children: notifications.length > 9 ? "9+" : notifications.length
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		className: "w-80 max-h-96 overflow-y-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between px-4 py-2 border-b",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold",
				children: "Notificações"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "secondary",
				children: notifications.length
			})]
		}), notifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-4 text-center text-sm text-muted-foreground",
			children: "Tudo certo por aqui! Nenhuma pendência."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-2",
			children: notifications.map((notif) => {
				const Icon = notif.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
					asChild: true,
					className: "p-3 cursor-pointer items-start gap-3 border-b last:border-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: notif.link,
						className: "flex w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-5 w-5 mt-0.5 shrink-0 ${notif.color}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium leading-none",
								children: notif.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground line-clamp-2",
								children: notif.message
							})]
						})]
					})
				}, notif.id);
			})
		})]
	})] });
}
var CONTAGENS_NAV = [
	{
		to: "/app",
		label: "Dashboard",
		icon: LayoutDashboard,
		roles: [
			"admin",
			"gestor",
			"conferente",
			"contador"
		]
	},
	{
		to: "/app/contagens",
		label: "Nova Contagem",
		icon: ClipboardList,
		roles: [
			"admin",
			"gestor",
			"conferente",
			"contador"
		]
	},
	{
		to: "/app/estoque",
		label: "Estoque (Importar)",
		icon: FileSpreadsheet,
		roles: [
			"admin",
			"gestor",
			"conferente"
		]
	},
	{
		to: "/app/divergencias",
		label: "Divergências",
		icon: TriangleAlert,
		roles: [
			"admin",
			"gestor",
			"conferente"
		]
	},
	{
		to: "/app/produtos",
		label: "Produtos",
		icon: Package2,
		roles: [
			"admin",
			"gestor",
			"conferente"
		]
	}
];
var COBRE_NAV = [
	{
		to: "/app/cobre",
		label: "Dashboard",
		icon: LayoutDashboard,
		roles: [
			"admin",
			"gestor",
			"conferente"
		]
	},
	{
		to: "/app/cobre/barras",
		label: "Barras",
		icon: Package2,
		roles: [
			"admin",
			"gestor",
			"conferente"
		]
	},
	{
		to: "/app/cobre/pedacos",
		label: "Pedaços",
		icon: FileSpreadsheet,
		roles: [
			"admin",
			"gestor",
			"conferente"
		]
	},
	{
		to: "/app/cobre/saida",
		label: "Saída de Material",
		icon: TriangleAlert,
		roles: [
			"admin",
			"gestor",
			"conferente"
		]
	},
	{
		to: "/app/cobre/devolucao",
		label: "Devolução",
		icon: ClipboardList,
		roles: [
			"admin",
			"gestor",
			"conferente"
		]
	},
	{
		to: "/app/cobre/historico",
		label: "Histórico",
		icon: LayoutDashboard,
		roles: [
			"admin",
			"gestor",
			"conferente",
			"contador"
		]
	},
	{
		to: "/app/cobre/relatorios",
		label: "Relatórios",
		icon: FileSpreadsheet,
		roles: [
			"admin",
			"gestor",
			"conferente"
		]
	},
	{
		to: "/app/cobre/pesquisa",
		label: "Pesquisa",
		icon: Users,
		roles: [
			"admin",
			"gestor",
			"conferente",
			"contador"
		]
	}
];
var FERRAMENTAS_NAV = [
	{
		to: "/app/ferramentas",
		label: "Dashboard",
		icon: LayoutDashboard,
		roles: [
			"admin",
			"gestor",
			"conferente"
		]
	},
	{
		to: "/app/ferramentas/lista",
		label: "Ferramentas",
		icon: Wrench,
		roles: [
			"admin",
			"gestor",
			"conferente"
		]
	},
	{
		to: "/app/ferramentas/emprestimos",
		label: "Empréstimos",
		icon: HardHat,
		roles: [
			"admin",
			"gestor",
			"conferente"
		]
	},
	{
		to: "/app/ferramentas/historico",
		label: "Histórico",
		icon: ClipboardList,
		roles: [
			"admin",
			"gestor",
			"conferente"
		]
	},
	{
		to: "/app/ferramentas/relatorios",
		label: "Relatórios",
		icon: FileSpreadsheet,
		roles: [
			"admin",
			"gestor",
			"conferente"
		]
	},
	{
		to: "/app/ferramentas/pesquisa",
		label: "Pesquisa",
		icon: Users,
		roles: [
			"admin",
			"gestor",
			"conferente"
		]
	}
];
var MAIN_NAV = [{
	to: "/app/empresas",
	label: "Empresas (CNPJ)",
	icon: Building2,
	roles: ["admin"]
}, {
	to: "/app/usuarios",
	label: "Usuários",
	icon: Users,
	roles: ["admin"]
}];
function AuthedLayout() {
	const { user, roles, hasAnyRole, signOut, loading } = useAuth();
	const navigate = useNavigate();
	const [open, setOpen] = (0, import_react.useState)(false);
	const path = useRouterState({ select: (s) => s.location.pathname });
	const contagensItems = CONTAGENS_NAV.filter((n) => hasAnyRole(n.roles));
	const cobreItems = COBRE_NAV.filter((n) => hasAnyRole(n.roles));
	const ferramentasItems = FERRAMENTAS_NAV.filter((n) => hasAnyRole(n.roles));
	const mainItems = MAIN_NAV.filter((n) => hasAnyRole(n.roles));
	const isContagensActive = contagensItems.some((item) => path === item.to || item.to !== "/app" && path.startsWith(item.to));
	const isCobreActive = path.startsWith("/app/cobre");
	const isFerramentasActive = path.startsWith("/app/ferramentas");
	const [contagensOpen, setContagensOpen] = (0, import_react.useState)(isContagensActive);
	const [cobreOpen, setCobreOpen] = (0, import_react.useState)(isCobreActive);
	const [ferramentasOpen, setFerramentasOpen] = (0, import_react.useState)(isFerramentasActive);
	(0, import_react.useEffect)(() => {
		if (isContagensActive) setContagensOpen(true);
	}, [isContagensActive]);
	(0, import_react.useEffect)(() => {
		if (isCobreActive) setCobreOpen(true);
	}, [isCobreActive]);
	(0, import_react.useEffect)(() => {
		if (isFerramentasActive) setFerramentasOpen(true);
	}, [isFerramentasActive]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center text-muted-foreground",
		children: "Carregando..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex bg-muted/30",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: cn("fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground border-r flex flex-col transition-transform", open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-b flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/logo.jpg",
							alt: "BCM",
							className: "h-9 w-9 rounded object-contain bg-white/5 p-1 shrink-0"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold truncate",
								children: "Almoxarifado"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground truncate",
								children: "BCM · Controle de estoque"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setOpen(false),
						className: "lg:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "flex-1 p-2 space-y-1 overflow-y-auto",
					children: [
						contagensItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setContagensOpen(!contagensOpen),
								className: cn("w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors", isContagensActive ? "text-sidebar-foreground" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: cn("h-4 w-4", isContagensActive && "text-primary") }), " Contagens"]
								}), contagensOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("overflow-hidden transition-all duration-200 ease-in-out", contagensOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pl-9 space-y-1 pt-1",
									children: contagensItems.map((item) => {
										const active = path === item.to || item.to !== "/app" && path.startsWith(item.to);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: item.to,
											onClick: () => setOpen(false),
											className: cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"),
											children: item.label
										}, item.to);
									})
								})
							})]
						}),
						cobreItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setCobreOpen(!cobreOpen),
								className: cn("w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors", isCobreActive ? "text-sidebar-foreground" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package2, { className: cn("h-4 w-4", isCobreActive && "text-primary") }), " Barras de Cobre"]
								}), cobreOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("overflow-hidden transition-all duration-200 ease-in-out", cobreOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pl-9 space-y-1 pt-1",
									children: cobreItems.map((item) => {
										const active = path === item.to || item.to !== "/app/cobre" && path.startsWith(item.to);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: item.to,
											onClick: () => setOpen(false),
											className: cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"),
											children: item.label
										}, item.to);
									})
								})
							})]
						}),
						ferramentasItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setFerramentasOpen(!ferramentasOpen),
								className: cn("w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors", isFerramentasActive ? "text-sidebar-foreground" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: cn("h-4 w-4", isFerramentasActive && "text-primary") }), " Ferramentaria"]
								}), ferramentasOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("overflow-hidden transition-all duration-200 ease-in-out", ferramentasOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pl-9 space-y-1 pt-1",
									children: ferramentasItems.map((item) => {
										const active = path === item.to || item.to !== "/app/ferramentas" && path.startsWith(item.to);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: item.to,
											onClick: () => setOpen(false),
											className: cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"),
											children: item.label
										}, item.to);
									})
								})
							})]
						}),
						mainItems.map((item) => {
							const Icon = item.icon;
							const active = path === item.to || item.to !== "/app" && path.startsWith(item.to);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								onClick: () => setOpen(false),
								className: cn("flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors", active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-4 w-4", active && "text-primary") }),
									" ",
									item.label
								]
							}, item.to);
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 border-t space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium truncate",
								children: user?.email
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted-foreground",
								children: roles.join(", ") || "sem função"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden lg:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsBadge, {})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						className: "w-full",
						onClick: async () => {
							await signOut();
							navigate({ to: "/auth" });
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4 mr-2" }), " Sair"]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "lg:hidden border-b bg-background p-3 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setOpen(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: "Almoxarifado"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsBadge, {})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 p-4 lg:p-8 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			})]
		})]
	});
}
//#endregion
export { AuthedLayout as component };
