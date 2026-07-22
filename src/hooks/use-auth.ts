import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "gestor" | "conferente" | "contador";

export interface AuthState {
  user: User | null;
  roles: AppRole[];
  loading: boolean;
}

export function useAuth(): AuthState & {
  hasRole: (r: AppRole) => boolean;
  hasAnyRole: (r: AppRole[]) => boolean;
  signOut: () => Promise<void>;
} {
  const [state, setState] = useState<AuthState>({ user: null, roles: [], loading: true });

  useEffect(() => {
    let mounted = true;

    const loadRoles = async (userId: string): Promise<AppRole[]> => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
      return (data ?? []).map((r) => r.role as AppRole);
    };

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user ?? null;
      const roles = user ? await loadRoles(user.id) : [];
      if (mounted) setState({ user, roles, loading: false });
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED" && event !== "INITIAL_SESSION") return;
      const user = session?.user ?? null;
      if (!user) {
        if (mounted) setState({ user: null, roles: [], loading: false });
        return;
      }
      setTimeout(async () => {
        const roles = await loadRoles(user.id);
        if (mounted) setState({ user, roles, loading: false });
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
    },
  };
}
