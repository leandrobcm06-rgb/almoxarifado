import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Wrench, HardHat, AlertTriangle, XCircle, Hammer } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/_authenticated/app/ferramentas/")({
  head: () => ({ meta: [{ title: "Dashboard Ferramentaria | BCM Stock" }] }),
  component: ToolsDashboard,
});

const COLORS = ['#10b981', 'var(--primary)', '#f5a623', '#ef4444', '#b16cf7'];

function ToolsDashboard() {
  const [loading, setLoading] = useState(true);
  
  // Indicators
  const [totalTools, setTotalTools] = useState(0);
  const [availableTools, setAvailableTools] = useState(0);
  const [loanedTools, setLoanedTools] = useState(0);
  const [maintenanceTools, setMaintenanceTools] = useState(0);
  const [damagedTools, setDamagedTools] = useState(0);
  
  const [recentLoans, setRecentLoans] = useState<any[]>([]);
  const [mostLoaned, setMostLoaned] = useState<any[]>([]);
  
  // Charts
  const [loansByMonth, setLoansByMonth] = useState<any[]>([]);
  const [toolsByCategory, setToolsByCategory] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. Fetch Tools
        const { data: tools } = await supabase.from("tools").select("*");
        if (tools) {
          setTotalTools(tools.length);
          setAvailableTools(tools.filter(t => t.status === 'disponivel').length);
          setLoanedTools(tools.filter(t => t.status === 'emprestada').length);
          setMaintenanceTools(tools.filter(t => t.status === 'manutencao').length);
          setDamagedTools(tools.filter(t => t.status === 'danificada').length);

          // Category Chart
          const catMap = tools.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          setToolsByCategory(Object.entries(catMap).map(([name, value]) => ({ name, value })));
        }

        // 2. Fetch Loans
        const { data: loans } = await supabase
          .from("tool_loans")
          .select("*, tool:tools(name)")
          .order("created_at", { ascending: false });

        if (loans) {
          // Recent loans
          setRecentLoans(loans.slice(0, 5));

          // Most loaned tools
          const countMap = loans.reduce((acc, loan) => {
            if (!loan.tool) return acc;
            acc[loan.tool.name] = (acc[loan.tool.name] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          setMostLoaned(
            Object.entries(countMap)
              .map(([name, count]) => ({ name, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5)
          );

          // Loans by month (last 6 months)
          const monthsData = [];
          for (let i = 5; i >= 0; i--) {
            const date = subMonths(new Date(), i);
            const start = startOfMonth(date);
            const end = endOfMonth(date);
            
            const monthLoans = loans.filter(l => {
              const d = new Date(l.created_at);
              return d >= start && d <= end;
            });

            monthsData.push({
              month: format(date, "MMM/yy", { locale: ptBR }),
              emprestimos: monthLoans.length
            });
          }
          setLoansByMonth(monthsData);
        }
      } catch (error) {
        console.error("Erro ao carregar dashboard de ferramentas", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Dashboard de Ferramentaria</h1>
            <p className="page-subtitle">Visão geral do controle de ferramentas e empréstimos.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
        <div className="glass-panel rounded-xl p-5 border border-border">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-foreground">Total Cadastrado</h3>
            <Hammer className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold font-display">{loading ? "..." : totalTools}</div>
          </div>
        </div>
        <div className="glass-panel rounded-xl p-5 border border-border">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-foreground">Disponíveis</h3>
            <Wrench className="h-4 w-4 text-success" />
          </div>
          <div>
            <div className="text-2xl font-bold font-display text-success">{loading ? "..." : availableTools}</div>
          </div>
        </div>
        <div className="glass-panel rounded-xl p-5 border border-border">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-foreground">Emprestadas</h3>
            <HardHat className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold font-display text-primary">{loading ? "..." : loanedTools}</div>
          </div>
        </div>
        <div className="glass-panel rounded-xl p-5 border border-border">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-foreground">Manutenção</h3>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </div>
          <div>
            <div className="text-2xl font-bold font-display text-warning">{loading ? "..." : maintenanceTools}</div>
          </div>
        </div>
        <div className="glass-panel rounded-xl p-5 border border-border">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-foreground">Danificadas</h3>
            <XCircle className="h-4 w-4 text-danger" />
          </div>
          <div>
            <div className="text-2xl font-bold font-display text-danger">{loading ? "..." : damagedTools}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Histórico Mensal */}
        <div className="glass-panel rounded-xl border border-border overflow-hidden lg:col-span-2">
          <div className="p-5 border-b border-border bg-muted/20">
            <h3 className="text-lg font-semibold font-display">Empréstimos por Mês</h3>
          </div>
          <div className="p-5 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={loansByMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis dataKey="month" fontSize={12} stroke="currentColor" opacity={0.6} />
                <YAxis fontSize={12} stroke="currentColor" opacity={0.6} />
                <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border)', boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.5)' }} />
                <Line type="monotone" dataKey="emprestimos" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ferramentas por Categoria */}
        <div className="glass-panel rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/20">
            <h3 className="text-lg font-semibold font-display">Por Categoria</h3>
          </div>
          <div className="p-5 h-[300px] flex flex-col items-center justify-center">
            {toolsByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={toolsByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label
                  >
                    {toolsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border)', boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.5)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-muted-foreground text-sm">Sem dados</div>
            )}
          </div>
        </div>

        {/* Mais Emprestadas */}
        <div className="glass-panel rounded-xl border border-border overflow-hidden lg:col-span-2">
          <div className="p-5 border-b border-border bg-muted/20">
            <h3 className="text-lg font-semibold font-display">Ferramentas Mais Emprestadas</h3>
          </div>
          <div className="p-5 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mostLoaned} layout="vertical" margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.15} />
                <XAxis type="number" fontSize={12} stroke="currentColor" opacity={0.6} />
                <YAxis dataKey="name" type="category" width={100} fontSize={12} stroke="currentColor" opacity={0.6} />
                <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border)', boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.5)' }} />
                <Bar dataKey="count" fill="var(--primary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Últimos Empréstimos */}
        <div className="glass-panel rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/20">
            <h3 className="text-lg font-semibold font-display">Últimos Empréstimos</h3>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {recentLoans.length === 0 ? (
                <div className="text-sm text-muted-foreground">Nenhum empréstimo recente.</div>
              ) : (
                recentLoans.map(loan => (
                  <div key={loan.id} className="flex items-center justify-between text-sm pb-4 border-b border-border-light last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-foreground">{loan.tool?.name || "Ferramenta apagada"}</p>
                      <p className="text-xs text-muted-foreground mt-1">{loan.employee}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">{format(new Date(loan.created_at), "dd/MM")}</p>
                      <p className={`text-xs mt-1 font-medium ${loan.status === 'ativo' ? 'text-primary' : 'text-success'}`}>
                        {loan.status === 'ativo' ? 'Emprestada' : 'Devolvida'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
