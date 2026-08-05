import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Clock, CalendarDays, TrendingUp, Users, Building2, HardHat } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Skeleton from '@/components/UI/Skeleton';

export const Route = createFileRoute('/_authenticated/app/empilhadeiras/')({
  component: EmpilhadeirasDashboard,
});

function EmpilhadeirasDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    totalUses: 0,
    hoursToday: 0,
    hoursMonth: 0,
    hoursYear: 0,
    avgHours: 0,
    topCompany: '-',
    lastEntry: '-',
  });

  const [charts, setCharts] = useState<any>({
    hoursByMonth: [],
    hoursByCompany: [],
    usesByCompany: [],
  });

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        // Load usages
        const { data: usages, error } = await supabase
          .from('forklift_usages')
          .select('*, company:forklift_companies(name), client:forklift_clients(name)');

        if (error) throw error;
        if (!usages) return;

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let totalHours = 0;
        let hToday = 0;
        let hMonth = 0;
        let hYear = 0;

        const companyHours: Record<string, number> = {};
        const companyUses: Record<string, number> = {};
        const monthHours: Record<string, number> = {};

        // Process data
        usages.forEach(u => {
          const h = Number(u.total_hours);
          totalHours += h;
          
          if (u.date === todayStr) hToday += h;
          
          const uDate = new Date(u.date);
          if (uDate.getMonth() === currentMonth && uDate.getFullYear() === currentYear) {
            hMonth += h;
          }
          if (uDate.getFullYear() === currentYear) {
            hYear += h;
          }

          const compName = u.company?.name || 'Desconhecida';
          companyHours[compName] = (companyHours[compName] || 0) + h;
          companyUses[compName] = (companyUses[compName] || 0) + 1;

          const monthKey = uDate.toLocaleString('default', { month: 'short' });
          monthHours[monthKey] = (monthHours[monthKey] || 0) + h;
        });

        // Top company
        let topC = '-';
        let maxU = 0;
        Object.entries(companyUses).forEach(([c, u]) => {
          if (u > maxU) { maxU = u; topC = c; }
        });

        setStats({
          totalUses: usages.length,
          hoursToday: hToday.toFixed(2),
          hoursMonth: hMonth.toFixed(2),
          hoursYear: hYear.toFixed(2),
          avgHours: usages.length ? (totalHours / usages.length).toFixed(2) : 0,
          topCompany: topC,
          lastEntry: usages.length > 0 ? new Date(usages[usages.length - 1].created_at).toLocaleDateString() : '-',
        });

        setCharts({
          hoursByMonth: Object.entries(monthHours).map(([m, h]) => ({ name: m, horas: Number(h.toFixed(2)) })),
          hoursByCompany: Object.entries(companyHours).map(([c, h]) => ({ name: c, horas: Number(h.toFixed(2)) })),
          usesByCompany: Object.entries(companyUses).map(([c, u]) => ({ name: c, usos: u })),
        });

      } catch (err) {
        console.error('Erro ao carregar dashboard de empilhadeiras', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#a855f7'];

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Dashboard de Empilhadeiras</h1>
            <p className="page-subtitle">Visão geral do uso de equipamentos de movimentação</p>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilizações</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton height="30px" /> : (
                <div className="text-2xl font-bold font-display">{stats.totalUses}</div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horas Hoje</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton height="30px" /> : (
                <div className="text-2xl font-bold font-display">{stats.hoursToday}h</div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horas Mês</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton height="30px" /> : (
                <div className="text-2xl font-bold font-display">{stats.hoursMonth}h</div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horas Ano</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton height="30px" /> : (
                <div className="text-2xl font-bold font-display">{stats.hoursYear}h</div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média p/ Uso</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton height="30px" /> : (
                <div className="text-2xl font-bold font-display">{stats.avgHours}h</div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mais Utilizou</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton height="30px" /> : (
                <div className="text-lg font-bold font-display truncate" title={stats.topCompany}>{stats.topCompany}</div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Último Reg.</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton height="30px" /> : (
                <div className="text-lg font-bold font-display">{stats.lastEntry}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Horas por Mês</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {loading ? <Skeleton height="100%" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.hoursByMonth}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border)', borderRadius: '8px'}} />
                    <Bar dataKey="horas" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Utilizações por Empresa</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {loading ? <Skeleton height="100%" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.usesByCompany}
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="usos"
                    >
                      {charts.usesByCompany.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border)', borderRadius: '8px'}} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Resumo Suprimentos */}
        <Card className="glass-panel bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <HardHat className="h-5 w-5" /> Resumo para Informar ao Suprimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton height="100px" /> : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {charts.hoursByCompany.map((c: any, idx: number) => (
                  <div key={idx} className="flex flex-col gap-1 p-4 rounded-lg bg-background/50 border">
                    <span className="text-sm text-muted-foreground font-medium">{c.name}</span>
                    <span className="text-2xl font-bold">{c.horas} <span className="text-sm font-normal text-muted-foreground">horas totais</span></span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
