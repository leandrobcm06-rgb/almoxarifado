import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, CheckCircle2, TrendingDown, ArrowLeftRight, Activity, Users, HardHat, Clock, Package2 } from "lucide-react";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, 
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";
import { format, startOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/_authenticated/app/cobre/")({
  head: () => ({ meta: [{ title: "Dashboard Barras de Cobre | Almoxarifado" }] }),
  component: CobreDashboard,
});

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

function CobreDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBarras: 0,
    estoqueTotalMm: 0,
    totalPedacos: 0,
    saidasMes: 0,
    devolucoesMes: 0,
    topCliente: "-",
    topPco: "-",
    ultimaMovimentacao: "-",
  });

  const [charts, setCharts] = useState({
    consumoPorMes: [] as any[],
    consumoPorCliente: [] as any[],
    consumoPorPco: [] as any[],
    entradasXSaidas: [] as any[],
    estoquePorBarra: [] as any[],
  });

  useEffect(() => {
    async function loadData() {
      try {
        const currentMonthStart = startOfMonth(new Date()).toISOString();
        
        const [
          { count: countBarras },
          { data: pieces },
          { data: recentMovements },
          { data: allMovements },
          { data: bars }
        ] = await Promise.all([
          supabase.from("copper_bars").select("*", { count: "exact", head: true }),
          supabase.from("copper_pieces").select("current_length_mm, bar_id, status").eq("status", "disponivel"),
          supabase.from("copper_movements").select("type, length_mm, created_at, client, pco").gte("created_at", currentMonthStart),
          supabase.from("copper_movements").select("type, length_mm, created_at, client, pco").gte("created_at", subMonths(new Date(), 6).toISOString()),
          supabase.from("copper_bars").select("id, name")
        ]);

        let estoqueTotalMm = 0;
        let totalPedacos = pieces?.length || 0;
        pieces?.forEach(p => { estoqueTotalMm += Number(p.current_length_mm); });

        let saidasMes = 0;
        let devolucoesMes = 0;
        recentMovements?.forEach(m => {
          if (m.type === 'saida') saidasMes++;
          if (m.type === 'devolucao') devolucoesMes++;
        });

        const clientUsage: Record<string, number> = {};
        const pcoUsage: Record<string, number> = {};
        
        allMovements?.forEach(m => {
          if (m.type === 'saida' && m.client) {
            clientUsage[m.client] = (clientUsage[m.client] || 0) + Number(m.length_mm);
          }
          if (m.type === 'saida' && m.pco) {
            pcoUsage[m.pco] = (pcoUsage[m.pco] || 0) + Number(m.length_mm);
          }
        });

        const topCliente = Object.entries(clientUsage).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
        const topPco = Object.entries(pcoUsage).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

        let ultimaMovimentacao = "-";
        if (allMovements && allMovements.length > 0) {
          const lastMov = [...allMovements].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
          ultimaMovimentacao = format(new Date(lastMov.created_at), "dd/MM/yyyy HH:mm");
        }

        setStats({
          totalBarras: countBarras || 0,
          estoqueTotalMm,
          totalPedacos,
          saidasMes,
          devolucoesMes,
          topCliente,
          topPco,
          ultimaMovimentacao
        });

        const monthMap: Record<string, number> = {};
        const entVSaiMap: Record<string, { Entradas: number, Saídas: number }> = {};
        
        allMovements?.forEach(m => {
          const monthKey = format(new Date(m.created_at), "MMM/yy", { locale: ptBR });
          if (!entVSaiMap[monthKey]) entVSaiMap[monthKey] = { Entradas: 0, Saídas: 0 };
          
          if (m.type === 'saida') {
            monthMap[monthKey] = (monthMap[monthKey] || 0) + Number(m.length_mm);
            entVSaiMap[monthKey].Saídas += 1;
          } else if (m.type === 'devolucao') {
            entVSaiMap[monthKey].Entradas += 1;
          }
        });

        const consumoPorMes = Object.entries(monthMap).map(([name, consumo]) => ({ name, consumo }));
        const entradasXSaidas = Object.entries(entVSaiMap).map(([name, data]) => ({ name, ...data }));
        
        const consumoPorCliente = Object.entries(clientUsage)
          .sort((a, b) => b[1] - a[1]).slice(0, 5)
          .map(([name, value]) => ({ name, value }));

        const consumoPorPco = Object.entries(pcoUsage)
          .sort((a, b) => b[1] - a[1]).slice(0, 5)
          .map(([name, value]) => ({ name, value }));

        const barraMap: Record<string, number> = {};
        pieces?.forEach(p => {
          const barName = bars?.find(b => b.id === p.bar_id)?.name || "Desconhecida";
          barraMap[barName] = (barraMap[barName] || 0) + Number(p.current_length_mm);
        });
        const estoquePorBarra = Object.entries(barraMap).map(([name, value]) => ({ name, value }));

        setCharts({
          consumoPorMes,
          consumoPorCliente,
          consumoPorPco,
          entradasXSaidas,
          estoquePorBarra
        });

      } catch (error) {
        console.error("Erro ao carregar dashboard de cobre:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Cobre</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Barras</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalBarras}</div>
            <p className="text-xs text-muted-foreground">Matrizes cadastradas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Total (m)</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : (stats.estoqueTotalMm / 1000).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} m</div>
            <p className="text-xs text-muted-foreground">Soma de todos pedaços</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedaços Disponíveis</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalPedacos}</div>
            <p className="text-xs text-muted-foreground">Em estoque</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saídas no Mês</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.saidasMes}</div>
            <p className="text-xs text-muted-foreground">Cortes registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devoluções no Mês</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.devolucoesMes}</div>
            <p className="text-xs text-muted-foreground">Retornos ao estoque</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maior Cliente</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate">{loading ? "..." : stats.topCliente}</div>
            <p className="text-xs text-muted-foreground">Com mais retiradas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maior PCO (Obra)</CardTitle>
            <HardHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate">{loading ? "..." : stats.topPco}</div>
            <p className="text-xs text-muted-foreground">Destino mais frequente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Movimentação</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{loading ? "..." : stats.ultimaMovimentacao}</div>
            <p className="text-xs text-muted-foreground">Data/Hora</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Consumo por Mês (m)</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.consumoPorMes}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(val) => (val / 1000).toFixed(1)} />
                <Tooltip cursor={{ fill: "transparent" }} formatter={(value: number) => [`${(value / 1000).toFixed(2)} m`, "Consumo"]} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="consumo" fill="currentColor" className="fill-primary" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movimentações (Entradas x Saídas)</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.entradasXSaidas}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Line type="monotone" dataKey="Saídas" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="Entradas" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Clientes (Consumo m)</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={charts.consumoPorCliente} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {charts.consumoPorCliente.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${(value / 1000).toFixed(2)} m`, "Consumo"]} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estoque Disponível por Barra (m)</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.estoquePorBarra} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                <XAxis type="number" fontSize={12} tickFormatter={(val) => (val / 1000).toFixed(1)} />
                <YAxis dataKey="name" type="category" fontSize={12} width={100} />
                <Tooltip cursor={{ fill: "transparent" }} formatter={(value: number) => [`${(value / 1000).toFixed(2)} m`, "Estoque"]} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
