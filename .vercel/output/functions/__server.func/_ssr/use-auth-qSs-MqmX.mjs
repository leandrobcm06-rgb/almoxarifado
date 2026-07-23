import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as supabase } from "./client-DLaKby2r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-auth-qSs-MqmX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useAuth() {
	const [state, setState] = (0, import_react.useState)({
		user: null,
		roles: [],
		loading: true
	});
	(0, import_react.useEffect)(() => {
		let mounted = true;
		const loadRoles = async (userId) => {
			const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
			return (data ?? []).map((r) => r.role);
		};
		const init = async () => {
			const { data } = await supabase.auth.getSession();
			const user = data.session?.user ?? null;
			const roles = user ? await loadRoles(user.id) : [];
			if (mounted) setState({
				user,
				roles,
				loading: false
			});
		};
		init();
		const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED" && event !== "INITIAL_SESSION") return;
			const user = session?.user ?? null;
			if (!user) {
				if (mounted) setState({
					user: null,
					roles: [],
					loading: false
				});
				return;
			}
			setTimeout(async () => {
				const roles = await loadRoles(user.id);
				if (mounted) setState({
					user,
					roles,
					loading: false
				});
			}, 0);
		});
		return () => {
			mounted = false;
			sub.subscription.unsubscribe();
		};
	}, []);
	return {
		...state,
		hasRole: (r) => state.roles.includes(r),
		hasAnyRole: (rs) => rs.some((r) => state.roles.includes(r)),
		signOut: async () => {
			await supabase.auth.signOut();
		}
	};
}
//#endregion
export { useAuth as t };
