import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/_authenticated/app/ferramentas/")({
  head: () => ({ meta: [{ title: "Dashboard Ferramentaria | Almoxarifado" }] }),
  component: ToolsDashboard,
});

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

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
  const [toolsByCondition, setToolsByCondition] = useState<any[]>([]);

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

          // Condition Chart
          const condMap = tools.reduce((acc, t) => {
            acc[t.condition] = (acc[t.condition] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          setToolsByCondition(Object.entries(condMap).map(([name, value]) => ({ name, value })));
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

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Carregando dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Ferramentaria</h1>
        <p className="text-muted-foreground">Visão geral do controle de ferramentas e empréstimos.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cadastrado</CardTitle>
            <Hammer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTools}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
            <Wrench className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableTools}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emprestadas</CardTitle>
            <HardHat className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{loanedTools}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manutenção</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{maintenanceTools}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Danificadas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{damagedTools}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Histórico Mensal */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Empréstimos por Mês</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={loansByMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="emprestimos" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ferramentas por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col items-center justify-center">
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-muted-foreground text-sm">Sem dados</div>
            )}
          </CardContent>
        </Card>

        {/* Mais Emprestadas */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Ferramentas Mais Emprestadas</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mostLoaned} layout="vertical" margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Últimos Empréstimos */}
        <Card>
          <CardHeader>
            <CardTitle>Últimos Empréstimos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLoans.length === 0 ? (
                <div className="text-sm text-muted-foreground">Nenhum empréstimo recente.</div>
              ) : (
                recentLoans.map(loan => (
                  <div key={loan.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{loan.tool?.name || "Ferramenta apagada"}</p>
                      <p className="text-xs text-muted-foreground">{loan.employee}</p>
                    </div>
                    <div className="text-right">
                      <p>{format(new Date(loan.created_at), "dd/MM")}</p>
                      <p className={`text-xs ${loan.status === 'ativo' ? 'text-blue-500' : 'text-green-500'}`}>
                        {loan.status === 'ativo' ? 'Emprestada' : 'Devolvida'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
