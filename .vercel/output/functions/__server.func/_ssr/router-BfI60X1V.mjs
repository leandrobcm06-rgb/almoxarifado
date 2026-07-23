import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { T as redirect, c as lazyRouteComponent, d as Link, l as createFileRoute, n as Scripts, o as createRouter, p as useRouter, r as HeadContent, s as Outlet, u as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as supabase } from "./client-DLaKby2r.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$28 } from "./app.contagens._id-eDAjKNv9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BfI60X1V.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-D3zDEOEB.css";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Página não encontrada"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
						children: "Voltar ao início"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "Algo deu errado"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Tente novamente ou volte ao início."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
						children: "Tentar novamente"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent",
						children: "Início"
					})]
				})
			]
		})
	});
}
var Route$27 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Almoxarifado | Controle de Estoque" },
			{
				name: "description",
				content: "Sistema de controle de contagens de estoque e ajustes de divergências para almoxarifado multiempresa."
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		className: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$27.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => sub.subscription.unsubscribe();
	}, [queryClient, router]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			richColors: true,
			position: "top-right"
		})]
	});
}
var $$splitComponentImporter$25 = () => import("./auth-CTDhzb53.mjs");
var Route$26 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Entrar | Almoxarifado" }] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./route-BDGmWN8b.mjs");
var Route$25 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var Route$24 = createFileRoute("/")({ beforeLoad: () => {
	throw redirect({ to: "/app" });
} });
var $$splitComponentImporter$23 = () => import("./app-C3j8DF9j.mjs");
var Route$23 = createFileRoute("/_authenticated/app")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("./app.index-3I2FkQUi.mjs");
var Route$22 = createFileRoute("/_authenticated/app/")({
	head: () => ({ meta: [{ title: "Dashboard | Almoxarifado" }] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./app.usuarios-6A0ycXQ2.mjs");
var Route$21 = createFileRoute("/_authenticated/app/usuarios")({
	head: () => ({ meta: [{ title: "Usuários | Almoxarifado" }] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./app.produtos-DIRncLbs.mjs");
var Route$20 = createFileRoute("/_authenticated/app/produtos")({
	head: () => ({ meta: [{ title: "Produtos | Almoxarifado" }] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./app.estoque-BwMnocuC.mjs");
var Route$19 = createFileRoute("/_authenticated/app/estoque")({
	head: () => ({ meta: [{ title: "Estoque | Almoxarifado" }] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./app.empresas-BJx_cSi0.mjs");
var Route$18 = createFileRoute("/_authenticated/app/empresas")({
	head: () => ({ meta: [{ title: "Empresas | Almoxarifado" }] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./app.divergencias-B-XqRvYY.mjs");
var Route$17 = createFileRoute("/_authenticated/app/divergencias")({
	head: () => ({ meta: [{ title: "Divergências | Almoxarifado" }] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./app.contagens-BjJkzcEM.mjs");
var Route$16 = createFileRoute("/_authenticated/app/contagens")({
	head: () => ({ meta: [{ title: "Contagens | Almoxarifado" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./app.ajustes-BwY6WNdc.mjs");
var Route$15 = createFileRoute("/_authenticated/app/ajustes")({
	head: () => ({ meta: [{ title: "Ajustes | Almoxarifado" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./app.ferramentas.index-eEy1UcLh.mjs");
var Route$14 = createFileRoute("/_authenticated/app/ferramentas/")({
	head: () => ({ meta: [{ title: "Dashboard Ferramentaria | Almoxarifado" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./app.cobre.index-4gsyPtv2.mjs");
var Route$13 = createFileRoute("/_authenticated/app/cobre/")({
	head: () => ({ meta: [{ title: "Dashboard Barras de Cobre | Almoxarifado" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./app.ferramentas.relatorios-Cnaf21FX.mjs");
var Route$12 = createFileRoute("/_authenticated/app/ferramentas/relatorios")({
	head: () => ({ meta: [{ title: "Relatórios | Ferramentaria e Cobre" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./app.ferramentas.pesquisa-CM1YKpjg.mjs");
var Route$11 = createFileRoute("/_authenticated/app/ferramentas/pesquisa")({
	head: () => ({ meta: [{ title: "Pesquisa Rápida | Ferramentaria" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./app.ferramentas.lista-BDb0ekBY.mjs");
var Route$10 = createFileRoute("/_authenticated/app/ferramentas/lista")({
	head: () => ({ meta: [{ title: "Cadastro de Ferramentas | Almoxarifado" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./app.ferramentas.historico-OuMik6HO.mjs");
var Route$9 = createFileRoute("/_authenticated/app/ferramentas/historico")({
	head: () => ({ meta: [{ title: "Histórico de Movimentações | Ferramentaria" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./app.ferramentas.emprestimos-By-hGrsP.mjs");
var Route$8 = createFileRoute("/_authenticated/app/ferramentas/emprestimos")({
	head: () => ({ meta: [{ title: "Empréstimos | Ferramentaria" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./app.cobre.saida-rqYGR_5J.mjs");
var Route$7 = createFileRoute("/_authenticated/app/cobre/saida")({
	head: () => ({ meta: [{ title: "Saída de Cobre | Almoxarifado" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./app.cobre.relatorios-B-ej5h6z.mjs");
var Route$6 = createFileRoute("/_authenticated/app/cobre/relatorios")({
	head: () => ({ meta: [{ title: "Relatórios de Cobre | Almoxarifado" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./app.cobre.pesquisa-7y6KlWn9.mjs");
var Route$5 = createFileRoute("/_authenticated/app/cobre/pesquisa")({
	head: () => ({ meta: [{ title: "Pesquisa Rápida Cobre | Almoxarifado" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./app.cobre.pedacos-RS70S4Np.mjs");
var Route$4 = createFileRoute("/_authenticated/app/cobre/pedacos")({
	head: () => ({ meta: [{ title: "Pedaços de Cobre | Almoxarifado" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./app.cobre.movimentacoes-DEqvx2KW.mjs");
var Route$3 = createFileRoute("/_authenticated/app/cobre/movimentacoes")({
	head: () => ({ meta: [{ title: "Movimentações de Cobre | Almoxarifado" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./app.cobre.historico-BfX7NtS0.mjs");
var Route$2 = createFileRoute("/_authenticated/app/cobre/historico")({
	head: () => ({ meta: [{ title: "Histórico de Cobre | Almoxarifado" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./app.cobre.devolucao-CoaLUtWE.mjs");
var Route$1 = createFileRoute("/_authenticated/app/cobre/devolucao")({
	head: () => ({ meta: [{ title: "Devolução de Cobre | Almoxarifado" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./app.cobre.barras-DrEXZJp5.mjs");
var Route = createFileRoute("/_authenticated/app/cobre/barras")({
	head: () => ({ meta: [{ title: "Barras de Cobre | Almoxarifado" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var AuthRoute = Route$26.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$27
});
var AuthenticatedRouteRoute = Route$25.update({
	id: "/_authenticated",
	getParentRoute: () => Route$27
});
var IndexRoute = Route$24.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$27
});
var AuthenticatedAppRoute = Route$23.update({
	id: "/app",
	path: "/app",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppIndexRoute = Route$22.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppUsuariosRoute = Route$21.update({
	id: "/usuarios",
	path: "/usuarios",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppProdutosRoute = Route$20.update({
	id: "/produtos",
	path: "/produtos",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppEstoqueRoute = Route$19.update({
	id: "/estoque",
	path: "/estoque",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppEmpresasRoute = Route$18.update({
	id: "/empresas",
	path: "/empresas",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppDivergenciasRoute = Route$17.update({
	id: "/divergencias",
	path: "/divergencias",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppContagensRoute = Route$16.update({
	id: "/contagens",
	path: "/contagens",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppAjustesRoute = Route$15.update({
	id: "/ajustes",
	path: "/ajustes",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppFerramentasIndexRoute = Route$14.update({
	id: "/ferramentas/",
	path: "/ferramentas/",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppCobreIndexRoute = Route$13.update({
	id: "/cobre/",
	path: "/cobre/",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppFerramentasRelatoriosRoute = Route$12.update({
	id: "/ferramentas/relatorios",
	path: "/ferramentas/relatorios",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppFerramentasPesquisaRoute = Route$11.update({
	id: "/ferramentas/pesquisa",
	path: "/ferramentas/pesquisa",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppFerramentasListaRoute = Route$10.update({
	id: "/ferramentas/lista",
	path: "/ferramentas/lista",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppFerramentasHistoricoRoute = Route$9.update({
	id: "/ferramentas/historico",
	path: "/ferramentas/historico",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppFerramentasEmprestimosRoute = Route$8.update({
	id: "/ferramentas/emprestimos",
	path: "/ferramentas/emprestimos",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppContagensIdRoute = Route$28.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AuthenticatedAppContagensRoute
});
var AuthenticatedAppCobreSaidaRoute = Route$7.update({
	id: "/cobre/saida",
	path: "/cobre/saida",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppCobreRelatoriosRoute = Route$6.update({
	id: "/cobre/relatorios",
	path: "/cobre/relatorios",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppCobrePesquisaRoute = Route$5.update({
	id: "/cobre/pesquisa",
	path: "/cobre/pesquisa",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppCobrePedacosRoute = Route$4.update({
	id: "/cobre/pedacos",
	path: "/cobre/pedacos",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppCobreMovimentacoesRoute = Route$3.update({
	id: "/cobre/movimentacoes",
	path: "/cobre/movimentacoes",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppCobreHistoricoRoute = Route$2.update({
	id: "/cobre/historico",
	path: "/cobre/historico",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppCobreDevolucaoRoute = Route$1.update({
	id: "/cobre/devolucao",
	path: "/cobre/devolucao",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppCobreBarrasRoute = Route.update({
	id: "/cobre/barras",
	path: "/cobre/barras",
	getParentRoute: () => AuthenticatedAppRoute
});
var AuthenticatedAppContagensRouteChildren = { AuthenticatedAppContagensIdRoute };
var AuthenticatedAppRouteChildren = {
	AuthenticatedAppAjustesRoute,
	AuthenticatedAppContagensRoute: AuthenticatedAppContagensRoute._addFileChildren(AuthenticatedAppContagensRouteChildren),
	AuthenticatedAppDivergenciasRoute,
	AuthenticatedAppEmpresasRoute,
	AuthenticatedAppEstoqueRoute,
	AuthenticatedAppProdutosRoute,
	AuthenticatedAppUsuariosRoute,
	AuthenticatedAppIndexRoute,
	AuthenticatedAppCobreBarrasRoute,
	AuthenticatedAppCobreDevolucaoRoute,
	AuthenticatedAppCobreHistoricoRoute,
	AuthenticatedAppCobreMovimentacoesRoute,
	AuthenticatedAppCobrePedacosRoute,
	AuthenticatedAppCobrePesquisaRoute,
	AuthenticatedAppCobreRelatoriosRoute,
	AuthenticatedAppCobreSaidaRoute,
	AuthenticatedAppFerramentasEmprestimosRoute,
	AuthenticatedAppFerramentasHistoricoRoute,
	AuthenticatedAppFerramentasListaRoute,
	AuthenticatedAppFerramentasPesquisaRoute,
	AuthenticatedAppFerramentasRelatoriosRoute,
	AuthenticatedAppCobreIndexRoute,
	AuthenticatedAppFerramentasIndexRoute
};
var AuthenticatedRouteRouteChildren = { AuthenticatedAppRoute: AuthenticatedAppRoute._addFileChildren(AuthenticatedAppRouteChildren) };
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute
};
var routeTree = Route$27._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
