import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Monitor, Archive, AlertTriangle, ArrowRightLeft, CheckCircle2, DollarSign } from "lucide-react";
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
import Skeleton from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/app/patrimonios/")({
  head: () => ({ meta: [{ title: "Dashboard Patrimônios | BCM Stock" }] }),
  component: Dashboard,
});

const calculateDepreciation = (asset: any) => {
  if (!asset.acquisition_date || !asset.initial_value || !asset.category) return null;
  
  const start = new Date(asset.acquisition_date);
  const now = new Date();
  const years = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  
  if (years < 0) return { depreciatedValue: asset.initial_value, percentage: 0, initialValue: asset.initial_value };
  
  let rate = 0;
  switch (asset.category) {
    case "Eletrônicos": rate = 0.20; break;
    case "Ferramentas elétricas": rate = 0.20; break;
    case "Ferramentas hidráulicas portáteis": rate = 0.20; break;
    case "Ferramentas manuais": rate = 0.10; break;
    case "Equipamentos hidráulicos industriais": rate = 0.10; break;
    case "Móveis": rate = 0.10; break;
    default: rate = 0;
  }
  
  let depreciationPercentage = years * rate;
  if (depreciationPercentage > 1) depreciationPercentage = 1;
  
  const depreciatedValue = asset.initial_value * (1 - depreciationPercentage);
  return {
    depreciatedValue,
    percentage: depreciationPercentage,
    initialValue: asset.initial_value
  };
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

// Cores corporativas premium ajustadas para os gráficos
const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#6366f1'];

function Dashboard() {
  const [loading, setLoading] = useState(true);
  
  const [total, setTotal] = useState(0);
  const [ativos, setAtivos] = useState(0);
  const [inativos, setInativos] = useState(0);
  const [disponiveis, setDisponiveis] = useState(0);
  const [emprestados, setEmprestados] = useState(0);
  const [estadoRuim, setEstadoRuim] = useState(0);
  
  const [emprestimosAbertos, setEmprestimosAbertos] = useState(0);
  const [emprestimosAtrasados, setEmprestimosAtrasados] = useState(0);
  
  const [totalInitialValue, setTotalInitialValue] = useState(0);
  const [totalDepreciatedValue, setTotalDepreciatedValue] = useState(0);
  
  const [recentAssets, setRecentAssets] = useState<any[]>([]);
  const [recentLoans, setRecentLoans] = useState<any[]>([]);
  
  const [assetsByCondition, setAssetsByCondition] = useState<any[]>([]);
  const [assetsByBrand, setAssetsByBrand] = useState<any[]>([]);
  const [assetsByLocation, setAssetsByLocation] = useState<any[]>([]);
  const [loansByMonth, setLoansByMonth] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: assets } = await supabase.from("assets").select("*");
        if (assets) {
          setTotal(assets.length);
          setAtivos(assets.filter(a => a.is_active).length);
          setInativos(assets.filter(a => !a.is_active).length);
          setDisponiveis(assets.filter(a => a.is_active && a.status === 'disponivel').length);
          setEmprestados(assets.filter(a => a.is_active && a.status === 'emprestado').length);
          setEstadoRuim(assets.filter(a => a.condition === 'Ruim').length);
          
          let initVal = 0;
          let depVal = 0;
          assets.forEach(a => {
            if (a.is_active && a.initial_value) {
              initVal += Number(a.initial_value);
              const dep = calculateDepreciation(a);
              if (dep) {
                depVal += dep.depreciatedValue;
              } else {
                depVal += Number(a.initial_value);
              }
            }
          });
          setTotalInitialValue(initVal);
          setTotalDepreciatedValue(depVal);
          
          setRecentAssets([...assets].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5));

          const condMap = assets.reduce((acc, a) => { acc[a.condition] = (acc[a.condition] || 0) + 1; return acc; }, {} as Record<string, number>);
          setAssetsByCondition(Object.entries(condMap).map(([name, value]) => ({ name, value })));

          const brandMap = assets.reduce((acc, a) => { if (a.brand) acc[a.brand] = (acc[a.brand] || 0) + 1; return acc; }, {} as Record<string, number>);
          setAssetsByBrand(Object.entries(brandMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5));

          const locMap = assets.reduce((acc, a) => { if (a.location) acc[a.location] = (acc[a.location] || 0) + 1; return acc; }, {} as Record<string, number>);
          setAssetsByLocation(Object.entries(locMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5));
        }

        const { data: loans } = await supabase.from("asset_loans").select("*, asset:assets(description, asset_number)").order("created_at", { ascending: false });
        if (loans) {
          setEmprestimosAbertos(loans.filter(l => l.status === 'em aberto' || l.status === 'atrasado').length);
          setEmprestimosAtrasados(loans.filter(l => l.status === 'atrasado' || (l.status === 'em aberto' && new Date(l.expected_return_date) < new Date())).length);
          setRecentLoans(loans.slice(0, 5));

          const monthsData = [];
          for (let i = 5; i >= 0; i--) {
            const date = subMonths(new Date(), i);
            const start = startOfMonth(date);
            const end = endOfMonth(date);
            const count = loans.filter(l => {
              const d = new Date(l.loan_date);
              return d >= start && d <= end;
            }).length;
            monthsData.push({ name: format(date, "MMM", { locale: ptBR }), Empréstimos: count });
          }
          setLoansByMonth(monthsData);
        }
      } catch (err) {
        console.error("Error fetching patrimonios data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div className="page-title-area">
            <Skeleton height="40px" width="250px" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {Array(5).fill(0).map((_, i) => <Skeleton key={i} height="120px" width="100%" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {Array(3).fill(0).map((_, i) => <Skeleton key={i} height="320px" width="100%" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Dashboard de Patrimônios</h1>
            <p className="page-subtitle">Visão geral e indicadores dos bens patrimoniais.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <div className="glass-panel p-5 rounded-xl border border-border flex flex-col justify-between">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground font-display">Valor Total (Ativos)</h3>
            <div className="h-8 w-8 rounded-full bg-success-bg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-success" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground font-display">{formatCurrency(totalDepreciatedValue)}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Inicial: <span className="line-through">{formatCurrency(totalInitialValue)}</span></p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-border flex flex-col justify-between">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground font-display">Total Cadastrado</h3>
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <Monitor className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground font-display">{total}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">{ativos} ativos, {inativos} inativos</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-border flex flex-col justify-between">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground font-display">Disponíveis</h3>
            <div className="h-8 w-8 rounded-full bg-success-bg flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-success" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground font-display">{disponiveis}</div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-border flex flex-col justify-between">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground font-display">Emprestados</h3>
            <div className="h-8 w-8 rounded-full bg-primary-bg flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground font-display">{emprestados}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">{emprestimosAtrasados} atrasados</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-border flex flex-col justify-between">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-muted-foreground font-display">Estado Ruim</h3>
            <div className="h-8 w-8 rounded-full bg-danger-bg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-danger" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground font-display">{estadoRuim}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Requerem atenção</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <div className="glass-panel p-5 rounded-xl border border-border col-span-1 flex flex-col">
          <h3 className="text-base font-semibold font-display text-foreground mb-4">Por Estado de Conservação</h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={assetsByCondition} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={2} dataKey="value" stroke="none">
                  {assetsByCondition.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 text-xs mt-2">
              {assetsByCondition.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5 font-medium text-muted-foreground">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {entry.name}: <span className="text-foreground">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-border col-span-1 flex flex-col">
          <h3 className="text-base font-semibold font-display text-foreground mb-4">Top Marcas</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetsByBrand} layout="vertical" margin={{ left: -20, right: 10, top: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px' }}
                  itemStyle={{ color: 'var(--primary)' }}
                  cursor={{ fill: 'var(--bg-hover)' }}
                />
                <Bar dataKey="value" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-border col-span-1 flex flex-col">
          <h3 className="text-base font-semibold font-display text-foreground mb-4">Evolução de Empréstimos</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={loansByMonth} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" opacity={0.5} />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 }} allowDecimals={false} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '13px' }}
                />
                <Line type="monotone" dataKey="Empréstimos" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'var(--bg-paper)' }} activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'none' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <div className="glass-panel p-0 rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/20">
            <h3 className="text-base font-semibold font-display text-foreground">Últimos Patrimônios Cadastrados</h3>
          </div>
          <div className="p-0">
            <div className="flex flex-col">
              {recentAssets.map(a => (
                <div key={a.id} className="flex justify-between items-center p-4 border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                  <div>
                    <div className="font-medium text-foreground text-sm">{a.description}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 font-mono">{a.asset_number} • {a.brand || 'Sem marca'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1">{new Date(a.created_at).toLocaleDateString()}</div>
                    <Badge variant="outline" className={a.status === 'disponivel' ? 'bg-success-bg text-success border-success-border' : ''}>
                      {a.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {recentAssets.length === 0 && <div className="text-sm text-muted-foreground p-6 text-center italic">Nenhum cadastrado ainda.</div>}
            </div>
          </div>
        </div>
        
        <div className="glass-panel p-0 rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/20">
            <h3 className="text-base font-semibold font-display text-foreground">Últimos Empréstimos</h3>
          </div>
          <div className="p-0">
            <div className="flex flex-col">
              {recentLoans.map(l => (
                <div key={l.id} className="flex justify-between items-center p-4 border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                  <div>
                    <div className="font-medium text-foreground text-sm">{l.asset?.description}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Para: <span className="font-medium text-foreground">{l.withdrawn_by}</span></div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1">Devolução: {new Date(l.expected_return_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</div>
                    <Badge variant={l.status === 'atrasado' ? 'destructive' : l.status === 'em aberto' ? 'default' : 'secondary'} 
                           className={l.status === 'em aberto' ? 'bg-primary/20 text-primary border-primary/30' : ''}>
                      {l.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {recentLoans.length === 0 && <div className="text-sm text-muted-foreground p-6 text-center italic">Nenhum empréstimo registrado.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
