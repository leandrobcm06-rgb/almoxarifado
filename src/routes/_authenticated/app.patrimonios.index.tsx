import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

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

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

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

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando indicadores...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Patrimônios</h1>
        <p className="text-sm text-muted-foreground">Visão geral e indicadores dos bens patrimoniais.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Valor Total (Ativos)</CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDepreciatedValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">Inicial: <span className="line-through">{formatCurrency(totalInitialValue)}</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Cadastrado</CardTitle>
            <Monitor className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground mt-1">{ativos} ativos, {inativos} inativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{disponiveis}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Emprestados</CardTitle>
            <ArrowRightLeft className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emprestados}</div>
            <p className="text-xs text-muted-foreground mt-1">{emprestimosAtrasados} atrasados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Estado Ruim</CardTitle>
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadoRuim}</div>
            <p className="text-xs text-muted-foreground mt-1">Requerem atenção</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader><CardTitle className="text-base">Por Estado de Conservação</CardTitle></CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={assetsByCondition} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {assetsByCondition.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              {assetsByCondition.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {entry.name}: {entry.value}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader><CardTitle className="text-base">Top Marcas</CardTitle></CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetsByBrand} layout="vertical" margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader><CardTitle className="text-base">Evolução de Empréstimos</CardTitle></CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={loansByMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="Empréstimos" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Últimos Patrimônios Cadastrados</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAssets.map(a => (
                <div key={a.id} className="flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{a.description}</div>
                    <div className="text-xs text-muted-foreground">{a.asset_number} • {a.brand || 'Sem marca'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs">{new Date(a.created_at).toLocaleDateString()}</div>
                    <div className="text-xs font-semibold text-green-600">{a.status}</div>
                  </div>
                </div>
              ))}
              {recentAssets.length === 0 && <div className="text-sm text-muted-foreground">Nenhum cadastrado ainda.</div>}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle className="text-base">Últimos Empréstimos</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLoans.map(l => (
                <div key={l.id} className="flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{l.asset?.description}</div>
                    <div className="text-xs text-muted-foreground">Para: {l.withdrawn_by}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs">Devolução: {new Date(l.expected_return_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</div>
                    <div className={`text-xs font-semibold ${l.status === 'atrasado' ? 'text-destructive' : l.status === 'em aberto' ? 'text-blue-500' : 'text-green-600'}`}>{l.status}</div>
                  </div>
                </div>
              ))}
              {recentLoans.length === 0 && <div className="text-sm text-muted-foreground">Nenhum empréstimo registrado.</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
