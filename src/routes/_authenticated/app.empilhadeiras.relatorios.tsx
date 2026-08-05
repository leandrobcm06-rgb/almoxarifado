import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { FileDown, Printer, FileSpreadsheet } from 'lucide-react';
import EmptyState from '@/components/UI/EmptyState';

export const Route = createFileRoute('/_authenticated/app/empilhadeiras/relatorios')({
  component: EmpilhadeirasRelatorios,
});

function EmpilhadeirasRelatorios() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  
  // Filters
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [companyId, setCompanyId] = useState('todos');
  const [companies, setCompanies] = useState<any[]>([]);
  const [reportType, setReportType] = useState('completo');

  useEffect(() => {
    supabase.from('forklift_companies').select('*').then(({data}) => {
      if (data) setCompanies(data);
    });
  }, []);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      let query = supabase
        .from('forklift_usages')
        .select(`
          *,
          company:forklift_companies(name),
          client:forklift_clients(name),
          pco:forklift_pcos(name),
          service:forklift_services(name),
          user:profiles(nome)
        `)
        .order('date', { ascending: false });

      if (dateStart) query = query.gte('date', dateStart);
      if (dateEnd) query = query.lte('date', dateEnd);
      if (companyId !== 'todos') query = query.eq('company_id', companyId);

      const res = await query;
      if (res.error) throw res.error;
      setData(res.data || []);
      
      if (res.data?.length === 0) {
        toast.info('Nenhum dado encontrado no período.');
      } else {
        toast.success(`Relatório gerado com ${res.data?.length} registros.`);
      }
    } catch (err: any) {
      toast.error('Erro ao gerar relatório', { description: err.message });
    } finally {
      setLoading(false);
    }
  }

  const exportCSV = () => {
    if (data.length === 0) return;
    const header = ["Data", "Mês", "Empresa", "Tarefa", "Cliente", "PCO", "Início", "Término", "Horas", "Status Pg"];
    const rows = data.map(d => [
      d.date,
      format(new Date(d.date + 'T00:00:00'), 'MM/yyyy'),
      d.company?.name || '',
      d.service?.name || d.service_other || '',
      d.client?.name || d.client_other || '',
      d.pco?.name || d.pco_other || '',
      d.start_time,
      d.end_time,
      d.total_hours,
      d.status_payment
    ]);
    const csvContent = [header, ...rows].map(e => e.join(";")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_empilhadeiras_${format(new Date(), 'ddMMyyyy')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header print:hidden">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Relatórios</h1>
            <p className="page-subtitle">Geração de relatórios de horas e utilizações</p>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 space-y-6">
        <div className="glass-panel p-6 rounded-xl border print:hidden">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Filtros do Relatório</h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="space-y-2">
                <Label>Data Inicial</Label>
                <Input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <Label>Data Final</Label>
                <Input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Empresa</Label>
                <Select value={companyId} onValueChange={setCompanyId}>
                  <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Relatório</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completo">Completo (Detalhado)</SelectItem>
                    <SelectItem value="consolidado" disabled>Consolidado por Empresa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
            <div className="flex justify-end gap-2 pt-4">
              {data.length > 0 && (
                <>
                  <Button type="button" variant="outline" onClick={handlePrint}><Printer className="h-4 w-4 mr-2" /> Imprimir</Button>
                  <Button type="button" variant="outline" onClick={exportCSV}><FileDown className="h-4 w-4 mr-2" /> Exportar CSV</Button>
                </>
              )}
              <Button type="submit" disabled={loading}><FileSpreadsheet className="h-4 w-4 mr-2" /> Gerar</Button>
            </div>
          </form>
        </div>

        {data.length > 0 && (
          <div className="glass-panel p-6 rounded-xl border bg-white print:border-none print:shadow-none print:p-0">
            <div className="hidden print:block mb-6 text-center">
              <h1 className="text-2xl font-bold">Relatório de Utilização de Empilhadeiras</h1>
              <p className="text-muted-foreground">
                Período: {dateStart ? format(new Date(dateStart + 'T00:00:00'), 'dd/MM/yyyy') : 'Início'} a {dateEnd ? format(new Date(dateEnd + 'T00:00:00'), 'dd/MM/yyyy') : 'Hoje'}
              </p>
            </div>
            
            <div className="table-responsive">
              <table className="table table--hover w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-semibold py-2">Data</th>
                    <th className="text-left font-semibold py-2">Empresa</th>
                    <th className="text-left font-semibold py-2">Tarefa</th>
                    <th className="text-left font-semibold py-2">Cliente / PCO</th>
                    <th className="text-center font-semibold py-2">Início</th>
                    <th className="text-center font-semibold py-2">Fim</th>
                    <th className="text-center font-semibold py-2">Horas</th>
                    <th className="text-center font-semibold py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((d, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2">{format(new Date(d.date + 'T00:00:00'), 'dd/MM/yyyy')}</td>
                      <td className="py-2 font-medium">{d.company?.name}</td>
                      <td className="py-2">{d.service?.name || d.service_other}</td>
                      <td className="py-2">
                        {d.client?.name || d.client_other || '-'} <br/>
                        <span className="text-xs text-muted-foreground">{d.pco?.name || d.pco_other}</span>
                      </td>
                      <td className="py-2 text-center">{d.start_time.substring(0,5)}</td>
                      <td className="py-2 text-center">{d.end_time.substring(0,5)}</td>
                      <td className="py-2 text-center font-bold text-primary">{d.total_hours}</td>
                      <td className="py-2 text-center">{d.status_payment}</td>
                    </tr>
                  ))}
                  <tr className="bg-muted/30">
                    <td colSpan={6} className="text-right font-bold py-3 pr-4">TOTAL GERAL DE HORAS:</td>
                    <td className="text-center font-bold text-lg text-primary py-3">
                      {data.reduce((acc, curr) => acc + Number(curr.total_hours), 0).toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
