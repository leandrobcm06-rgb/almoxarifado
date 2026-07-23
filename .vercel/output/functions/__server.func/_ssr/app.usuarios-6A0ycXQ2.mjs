import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as supabase } from "./client-DLaKby2r.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { H as Check } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.usuarios-6A0ycXQ2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
var ROLES = [
	"admin",
	"gestor",
	"conferente",
	"contador"
];
function Page() {
	const qc = useQueryClient();
	const { data: profiles } = useQuery({
		queryKey: ["profiles"],
		queryFn: async () => (await supabase.from("profiles").select("*").order("nome")).data ?? []
	});
	const { data: roles } = useQuery({
		queryKey: ["all-roles"],
		queryFn: async () => (await supabase.from("user_roles").select("*")).data ?? []
	});
	const toggleRole = useMutation({
		mutationFn: async ({ userId, role, on }) => {
			if (on) {
				const { error } = await supabase.from("user_roles").insert({
					user_id: userId,
					role
				});
				if (error) throw error;
			} else {
				const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
				if (error) throw error;
			}
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["all-roles"] }),
		onError: (e) => toast.error(e.message)
	});
	const userRoles = (userId) => (roles ?? []).filter((r) => r.user_id === userId).map((r) => r.role);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-semibold",
			children: "Usuários e funções"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Marque as funções de cada usuário."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Nome" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Email" }),
				ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "text-center capitalize",
					children: r
				}, r))
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: profiles?.map((p) => {
				const has = userRoles(p.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.nome }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-muted-foreground text-sm",
						children: p.email
					}),
					ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
							checked: has.includes(r),
							onCheckedChange: (v) => toggleRole.mutate({
								userId: p.id,
								role: r,
								on: Boolean(v)
							})
						})
					}, r))
				] }, p.id);
			}) })] })
		}) })]
	});
}
//#endregion
export { Page as component };
