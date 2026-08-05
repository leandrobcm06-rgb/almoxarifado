import { createFileRoute, Outlet, redirect, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Package2, Building2, Users, FileSpreadsheet,
  ClipboardList, AlertTriangle, Wrench, LogOut, Menu, X, ChevronDown, ChevronRight, HardHat, Settings
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Monitor, Archive, ArrowRightLeft, Truck } from "lucide-react";


export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthedLayout,
});

import { NotificationsBadge } from "@/components/notifications-badge";

import { ShieldAlert } from "lucide-react";

const CONTAGENS_NAV = [
  { to: "/app/contagens", label: "Nova Contagem", icon: ClipboardList, roles: ["admin", "gestor", "conferente", "contador"] },
  { to: "/app/divergencias", label: "Divergências", icon: AlertTriangle, roles: ["admin", "gestor", "conferente"] },
] as const;

const COBRE_NAV = [
  { to: "/app/cobre", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "gestor", "conferente"] },
  { to: "/app/cobre/barras", label: "Barras", icon: Package2, roles: ["admin", "gestor", "conferente"] },
  { to: "/app/cobre/pedacos", label: "Pedaços", icon: FileSpreadsheet, roles: ["admin", "gestor", "conferente"] },
  { to: "/app/cobre/saida", label: "Saída de Material", icon: AlertTriangle, roles: ["admin", "gestor", "conferente"] },
  { to: "/app/cobre/devolucao", label: "Devolução", icon: ClipboardList, roles: ["admin", "gestor", "conferente"] },
  { to: "/app/cobre/historico", label: "Histórico", icon: LayoutDashboard, roles: ["admin", "gestor", "conferente", "contador"] },
  { to: "/app/cobre/relatorios", label: "Relatórios", icon: FileSpreadsheet, roles: ["admin", "gestor", "conferente"] },
  { to: "/app/cobre/pesquisa", label: "Pesquisa", icon: Users, roles: ["admin", "gestor", "conferente", "contador"] },
] as const;

const FERRAMENTAS_NAV = [
  { to: "/app/ferramentas", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "gestor", "conferente"] },
  { to: "/app/ferramentas/lista", label: "Ferramentas", icon: Wrench, roles: ["admin", "gestor", "conferente"] },
  { to: "/app/ferramentas/localizacoes", label: "Localizações", icon: Building2, roles: ["admin", "gestor", "conferente"] },
  { to: "/app/ferramentas/emprestimos", label: "Empréstimos", icon: HardHat, roles: ["admin", "gestor", "conferente"] },
  { to: "/app/ferramentas/historico", label: "Histórico", icon: ClipboardList, roles: ["admin", "gestor", "conferente"] },
  { to: "/app/ferramentas/relatorios", label: "Relatórios", icon: FileSpreadsheet, roles: ["admin", "gestor", "conferente"] },
  { to: "/app/ferramentas/pesquisa", label: "Pesquisa", icon: Users, roles: ["admin", "gestor", "conferente"] },
] as const;

const MAIN_NAV = [
  { to: "/app/empresas", label: "Empresas (CNPJ)", icon: Building2, roles: ["admin"] },
  { to: "/app/usuarios", label: "Usuários", icon: Users, roles: ["admin"] },
  { to: "/app/auditoria", label: "Auditoria", icon: ShieldAlert, roles: ["admin"] },
] as const;

const PATRIMONIOS_NAV = [
  { to: "/app/patrimonios", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "gestor"] },
  { to: "/app/patrimonios/lista", label: "Patrimônios", icon: Monitor, roles: ["admin", "gestor"] },
  { to: "/app/patrimonios/emprestimos", label: "Empréstimos", icon: ArrowRightLeft, roles: ["admin", "gestor"] },
  { to: "/app/patrimonios/inativos", label: "Inativos", icon: Archive, roles: ["admin", "gestor"] },
  { to: "/app/patrimonios/relatorios", label: "Relatórios", icon: FileSpreadsheet, roles: ["admin", "gestor"] },
] as const;

const EMPILHADEIRAS_NAV = [
  { to: "/app/empilhadeiras", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "gestor", "conferente"] },
  { to: "/app/empilhadeiras/lancamentos", label: "Lançamentos", icon: ClipboardList, roles: ["admin", "gestor", "conferente"] },
  { to: "/app/empilhadeiras/cadastros", label: "Cadastros Aux.", icon: Building2, roles: ["admin", "gestor"] },
  { to: "/app/empilhadeiras/relatorios", label: "Relatórios", icon: FileSpreadsheet, roles: ["admin", "gestor", "conferente"] },
] as const;

function AuthedLayout() {
  const { user, roles, hasAnyRole, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  const contagensItems = CONTAGENS_NAV.filter((n) => hasAnyRole(n.roles as any));
  const cobreItems = COBRE_NAV.filter((n) => hasAnyRole(n.roles as any));
  const ferramentasItems = FERRAMENTAS_NAV.filter((n) => hasAnyRole(n.roles as any));
  const patrimoniosItems = PATRIMONIOS_NAV.filter((n) => hasAnyRole(n.roles as any));
  const empilhadeirasItems = EMPILHADEIRAS_NAV.filter((n) => hasAnyRole(n.roles as any));
  const mainItems = MAIN_NAV.filter((n) => hasAnyRole(n.roles as any));

  const isContagensActive = contagensItems.some(item => path === item.to || (item.to !== "/app" && path.startsWith(item.to)));
  const isCobreActive = path.startsWith("/app/cobre");
  const isFerramentasActive = path.startsWith("/app/ferramentas");
  const isPatrimoniosActive = path.startsWith("/app/patrimonios");
  const isEmpilhadeirasActive = path.startsWith("/app/empilhadeiras");
  const isConfiguracoesActive = mainItems.some(item => path === item.to || path.startsWith(item.to));
  
  const [contagensOpen, setContagensOpen] = useState(isContagensActive);
  const [cobreOpen, setCobreOpen] = useState(isCobreActive);
  const [ferramentasOpen, setFerramentasOpen] = useState(isFerramentasActive);
  const [patrimoniosOpen, setPatrimoniosOpen] = useState(isPatrimoniosActive);
  const [empilhadeirasOpen, setEmpilhadeirasOpen] = useState(isEmpilhadeirasActive);
  const [configuracoesOpen, setConfiguracoesOpen] = useState(isConfiguracoesActive);

  useEffect(() => {
    if (isContagensActive) setContagensOpen(true);
  }, [isContagensActive]);

  useEffect(() => {
    if (isCobreActive) setCobreOpen(true);
  }, [isCobreActive]);

  useEffect(() => {
    if (isFerramentasActive) setFerramentasOpen(true);
  }, [isFerramentasActive]);

  useEffect(() => {
    if (isPatrimoniosActive) setPatrimoniosOpen(true);
  }, [isPatrimoniosActive]);

  useEffect(() => {
    if (isEmpilhadeirasActive) setEmpilhadeirasOpen(true);
  }, [isEmpilhadeirasActive]);

  useEffect(() => {
    if (isConfiguracoesActive) setConfiguracoesOpen(true);
  }, [isConfiguracoesActive]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground border-r flex flex-col transition-transform",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-4 border-b flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img src="/Logo.jpeg" alt="BCM" className="h-16 w-auto max-w-[120px] rounded object-contain shrink-0" />
            <div className="min-w-0">
              <div className="text-xl font-bold font-display tracking-tight truncate">BCM Stock</div>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden"><X className="h-5 w-5" /></button>
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          <Link
            to="/app"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-4",
              path === "/app" ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <LayoutDashboard className={cn("h-4 w-4", path === "/app" && "text-primary")} /> Boas Vindas
          </Link>

          {contagensItems.length > 0 && (
            <div className="space-y-1 mb-2">
              <button
                onClick={() => setContagensOpen(!contagensOpen)}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isContagensActive ? "text-sidebar-foreground" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <ClipboardList className={cn("h-4 w-4", isContagensActive && "text-primary")} /> Contagens
                </div>
                {contagensOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              
              <div className={cn("overflow-hidden transition-all duration-200 ease-in-out", contagensOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
                <div className="pl-9 space-y-1 pt-1">
                  {contagensItems.map((item) => {
                    const active = path === item.to || (item.to !== "/app" && path.startsWith(item.to));
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                          active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {cobreItems.length > 0 && (
            <div className="space-y-1 mb-2">
              <button
                onClick={() => setCobreOpen(!cobreOpen)}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isCobreActive ? "text-sidebar-foreground" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <Package2 className={cn("h-4 w-4", isCobreActive && "text-primary")} /> Barras de Cobre
                </div>
                {cobreOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              
              <div className={cn("overflow-hidden transition-all duration-200 ease-in-out", cobreOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
                <div className="pl-9 space-y-1 pt-1">
                  {cobreItems.map((item) => {
                    const active = path === item.to || (item.to !== "/app/cobre" && path.startsWith(item.to));
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                          active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {ferramentasItems.length > 0 && (
            <div className="space-y-1 mb-2">
              <button
                onClick={() => setFerramentasOpen(!ferramentasOpen)}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isFerramentasActive ? "text-sidebar-foreground" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <Wrench className={cn("h-4 w-4", isFerramentasActive && "text-primary")} /> Ferramentaria
                </div>
                {ferramentasOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              
              <div className={cn("overflow-hidden transition-all duration-200 ease-in-out", ferramentasOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
                <div className="pl-9 space-y-1 pt-1">
                  {ferramentasItems.map((item) => {
                    const active = path === item.to || (item.to !== "/app/ferramentas" && path.startsWith(item.to));
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                          active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {patrimoniosItems.length > 0 && (
            <div className="space-y-1 mb-2">
              <button
                onClick={() => setPatrimoniosOpen(!patrimoniosOpen)}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isPatrimoniosActive ? "text-sidebar-foreground" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <Monitor className={cn("h-4 w-4", isPatrimoniosActive && "text-primary")} /> Patrimônios
                </div>
                {patrimoniosOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              
              <div className={cn("overflow-hidden transition-all duration-200 ease-in-out", patrimoniosOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
                <div className="pl-9 space-y-1 pt-1">
                  {patrimoniosItems.map((item) => {
                    const active = path === item.to || (item.to !== "/app/patrimonios" && path.startsWith(item.to));
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                          active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {empilhadeirasItems.length > 0 && (
            <div className="space-y-1 mb-2">
              <button
                onClick={() => setEmpilhadeirasOpen(!empilhadeirasOpen)}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isEmpilhadeirasActive ? "text-sidebar-foreground" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <Truck className={cn("h-4 w-4", isEmpilhadeirasActive && "text-primary")} /> Empilhadeiras
                </div>
                {empilhadeirasOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              
              <div className={cn("overflow-hidden transition-all duration-200 ease-in-out", empilhadeirasOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
                <div className="pl-9 space-y-1 pt-1">
                  {empilhadeirasItems.map((item) => {
                    const active = path === item.to || (item.to !== "/app/empilhadeiras" && path.startsWith(item.to));
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                          active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {mainItems.length > 0 && (
            <div className="space-y-1 mb-2">
              <button
                onClick={() => setConfiguracoesOpen(!configuracoesOpen)}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isConfiguracoesActive ? "text-sidebar-foreground" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <Settings className={cn("h-4 w-4", isConfiguracoesActive && "text-primary")} /> Configurações
                </div>
                {configuracoesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              
              <div className={cn("overflow-hidden transition-all duration-200 ease-in-out", configuracoesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
                <div className="pl-9 space-y-1 pt-1">
                  {mainItems.map((item) => {
                    const active = path === item.to || path.startsWith(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                          active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </nav>
        <div className="p-3 border-t space-y-2">
          <div className="text-xs flex items-center justify-between">
            <div className="min-w-0">
              <div className="font-medium truncate">{user?.email}</div>
              <div className="text-muted-foreground">{roles.join(", ") || "sem função"}</div>
            </div>
            <div className="hidden lg:block">
              <NotificationsBadge />
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={async () => { await signOut(); navigate({ to: "/auth" }); }}>
            <LogOut className="h-4 w-4 mr-2" /> Sair
          </Button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden border-b bg-background p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
            <div className="font-medium">BCM Stock</div>
          </div>
          <NotificationsBadge />
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
