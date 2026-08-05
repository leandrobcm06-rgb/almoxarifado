import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Layers, CheckCircle2, TrendingDown, ArrowLeftRight, Users, HardHat, Clock, Package2 } from "lucide-react";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, 
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";
import { format, startOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/_authenticated/app/cobre/")({
  head: () => ({ meta: [{ title: "Dashboard Barras de Cobre | BCM Stock" }] }),
  component: CobreDashboard,
});

const COLORS = ['var(--primary)', '#22c993', '#f5a623', '#fb8332', '#b16cf7', '#17c5db'];

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
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Dashboard de Cobre</h1>
            <p className="page-subtitle">Visão geral do estoque e consumo de barras de cobre.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="glass-panel rounded-xl p-5 border border-border">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-foreground">Total de Barras</h3>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold font-display">{loading ? "..." : stats.totalBarras}</div>
            <p className="text-xs text-muted-foreground">Matrizes cadastradas</p>
          </div>
        </div>
        <div className="glass-panel rounded-xl p-5 border border-border">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-foreground">Estoque Total (m)</h3>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold font-display text-primary">{loading ? "..." : (stats.estoqueTotalMm / 1000).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} m</div>
            <p className="text-xs text-muted-foreground">Soma de todos pedaços</p>
          </div>
        </div>
        <div className="glass-panel rounded-xl p-5 border border-border">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-foreground">Pedaços Disponíveis</h3>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold font-display">{loading ? "..." : stats.totalPedacos}</div>
            <p className="text-xs text-muted-foreground">Em estoque livre</p>
          </div>
        </div>
        <div className="glass-panel rounded-xl p-5 border border-border">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-foreground">Saídas no Mês</h3>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold font-display text-danger">{loading ? "..." : stats.saidasMes}</div>
            <p className="text-xs text-muted-foreground">Cortes registrados</p>
          </div>
        </div>
        <div className="glass-panel rounded-xl p-5 border border-border">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-foreground">Devoluções no Mês</h3>
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold font-display text-success">{loading ? "..." : stats.devolucoesMes}</div>
            <p className="text-xs text-muted-foreground">Retornos ao estoque</p>
          </div>
        </div>
        <div className="glass-panel rounded-xl p-5 border border-border">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-foreground">Maior Cliente</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-xl font-bold font-display truncate" title={loading ? "" : stats.topCliente}>{loading ? "..." : stats.topCliente}</div>
            <p className="text-xs text-muted-foreground">Com mais retiradas</p>
          </div>
        </div>
        <div className="glass-panel rounded-xl p-5 border border-border">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-foreground">Maior PCO (Obra)</h3>
            <HardHat className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-xl font-bold font-display truncate" title={loading ? "" : stats.topPco}>{loading ? "..." : stats.topPco}</div>
            <p className="text-xs text-muted-foreground">Destino mais frequente</p>
          </div>
        </div>
        <div className="glass-panel rounded-xl p-5 border border-border">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-foreground">Última Movimentação</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-lg font-bold font-display">{loading ? "..." : stats.ultimaMovimentacao}</div>
            <p className="text-xs text-muted-foreground">Data/Hora</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/20">
            <h3 className="text-lg font-semibold font-display">Consumo por Mês (m)</h3>
          </div>
          <div className="p-5 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.consumoPorMes}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis dataKey="name" fontSize={12} stroke="currentColor" opacity={0.6} />
                <YAxis fontSize={12} stroke="currentColor" opacity={0.6} tickFormatter={(val) => (val / 1000).toFixed(1)} />
                <Tooltip cursor={{ fill: "transparent" }} formatter={(value: number) => [`${(value / 1000).toFixed(2)} m`, "Consumo"]} contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border)', boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.5)' }} />
                <Bar dataKey="consumo" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/20">
            <h3 className="text-lg font-semibold font-display">Movimentações (Entradas x Saídas)</h3>
          </div>
          <div className="p-5 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.entradasXSaidas}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis dataKey="name" fontSize={12} stroke="currentColor" opacity={0.6} />
                <YAxis fontSize={12} stroke="currentColor" opacity={0.6} />
                <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border)', boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.5)' }} />
                <Legend />
                <Line type="monotone" dataKey="Saídas" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Entradas" stroke="#22c993" strokeWidth={2} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/20">
            <h3 className="text-lg font-semibold font-display">Top 5 Clientes (Consumo m)</h3>
          </div>
          <div className="p-5 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={charts.consumoPorCliente} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {charts.consumoPorCliente.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${(value / 1000).toFixed(2)} m`, "Consumo"]} contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border)', boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.5)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/20">
            <h3 className="text-lg font-semibold font-display">Estoque Disponível por Barra (m)</h3>
          </div>
          <div className="p-5 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.estoquePorBarra} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.15} />
                <XAxis type="number" fontSize={12} stroke="currentColor" opacity={0.6} tickFormatter={(val) => (val / 1000).toFixed(1)} />
                <YAxis dataKey="name" type="category" fontSize={12} stroke="currentColor" opacity={0.6} width={100} />
                <Tooltip cursor={{ fill: "transparent" }} formatter={(value: number) => [`${(value / 1000).toFixed(2)} m`, "Estoque"]} contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border)', boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.5)' }} />
                <Bar dataKey="value" fill="var(--primary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
