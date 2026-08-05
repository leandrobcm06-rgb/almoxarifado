import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { format, differenceInMinutes, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import EmptyState from '@/components/UI/EmptyState';
import { PackageX, Pencil, Copy, Trash2, Search, FileDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const Route = createFileRoute('/_authenticated/app/empilhadeiras/lancamentos')({
  component: EmpilhadeirasLancamentos,
});

function EmpilhadeirasLancamentos() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [pcos, setPcos] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [form, setForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '',
    endTime: '',
    totalHours: '0.00',
    companyId: '',
    serviceId: '',
    serviceOther: '',
    clientId: '',
    clientOther: '',
    pcoId: '',
    pcoOther: '',
    observations: '',
  });

  useEffect(() => {
    loadData();
    loadAuxiliaries();
  }, []);

  async function loadAuxiliaries() {
    const [comp, cli, pco, serv] = await Promise.all([
      supabase.from('forklift_companies').select('*').eq('active', true),
      supabase.from('forklift_clients').select('*').eq('active', true),
      supabase.from('forklift_pcos').select('*').eq('active', true),
      supabase.from('forklift_services').select('*').eq('active', true),
    ]);
    if (comp.data) setCompanies(comp.data);
    if (cli.data) setClients(cli.data);
    if (pco.data) setPcos(pco.data);
    if (serv.data) setServices(serv.data);
  }

  async function loadData() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('forklift_usages')
        .select(`
          *,
          company:forklift_companies(name),
          client:forklift_clients(name),
          pco:forklift_pcos(name),
          service:forklift_services(name),
          user:profiles(nome)
        `)
        .order('date', { ascending: false })
        .order('start_time', { ascending: false });
        
      if (error) throw error;
      setData(data || []);
    } catch (err: any) {
      toast.error('Erro ao carregar lançamentos', { description: err.message });
    } finally {
      setLoading(false);
    }
  }

  const calcTotalHours = (start: string, end: string) => {
    if (!start || !end) return '0.00';
    try {
      const today = new Date();
      let d1 = parse(start, 'HH:mm', today);
      let d2 = parse(end, 'HH:mm', today);
      
      if (d2 < d1) {
        // Assume next day
        d2 = new Date(d2.getTime() + 24 * 60 * 60 * 1000);
      }
      
      const diffMins = differenceInMinutes(d2, d1);
      const diffHours = diffMins / 60;
      return diffHours.toFixed(2);
    } catch (e) {
      return '0.00';
    }
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const newForm = { ...form, [field]: value };
    newForm.totalHours = calcTotalHours(newForm.startTime, newForm.endTime);
    setForm(newForm);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.companyId) return toast.error('Selecione uma empresa.');
    if (!form.startTime || !form.endTime) return toast.error('Informe horário de início e término.');

    try {
      setLoading(true);
      const { error } = await supabase.from('forklift_usages').insert({
        company_id: form.companyId,
        service_id: form.serviceId === 'outros' ? null : (form.serviceId || null),
        service_other: form.serviceId === 'outros' ? form.serviceOther : null,
        client_id: form.clientId === 'outros' ? null : (form.clientId || null),
        client_other: form.clientId === 'outros' ? form.clientOther : null,
        pco_id: form.pcoId === 'outros' ? null : (form.pcoId || null),
        pco_other: form.pcoId === 'outros' ? form.pcoOther : null,
        date: form.date,
        start_time: form.startTime,
        end_time: form.endTime,
        total_hours: Number(form.totalHours),
        observations: form.observations,
        user_id: user?.id
      });
      if (error) throw error;
      toast.success('Lançamento registrado com sucesso!');
      
      // Reset
      setForm({ ...form, startTime: '', endTime: '', totalHours: '0.00', observations: '' });
      loadData();
    } catch (err: any) {
      toast.error('Erro ao salvar', { description: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(id: string, status: string) {
    try {
      const { error } = await supabase.from('forklift_usages').update({ status_payment: status }).eq('id', id);
      if (error) throw error;
      toast.success('Status alterado!');
      loadData();
    } catch (err: any) {
      toast.error('Erro ao alterar status', { description: err.message });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente excluir este lançamento?')) return;
    try {
      const { error } = await supabase.from('forklift_usages').delete().eq('id', id);
      if (error) throw error;
      toast.success('Excluído com sucesso');
      loadData();
    } catch (err: any) {
      toast.error('Erro ao excluir', { description: err.message });
    }
  }

  const formatMonth = (dateStr: string) => {
    return format(new Date(dateStr + 'T00:00:00'), 'MMMM/yyyy', { locale: ptBR }).toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Pago': return 'bg-green-100 text-green-700 border-green-200';
      case 'Faturado': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const filteredData = data.filter(d => {
    const search = searchTerm.toLowerCase();
    const taskStr = d.service?.name || d.service_other || '';
    const cliStr = d.client?.name || d.client_other || '';
    const pcoStr = d.pco?.name || d.pco_other || '';
    const compStr = d.company?.name || '';
    const obsStr = d.observations || '';
    return taskStr.toLowerCase().includes(search) || 
           cliStr.toLowerCase().includes(search) || 
           pcoStr.toLowerCase().includes(search) || 
           compStr.toLowerCase().includes(search) || 
           obsStr.toLowerCase().includes(search);
  });

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Lançamentos</h1>
            <p className="page-subtitle">Registro de utilização de empilhadeiras</p>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 space-y-6">
        {/* Form */}
        <div className="glass-panel p-6 rounded-xl border">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Novo Lançamento</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="space-y-2">
                <Label>Data *</Label>
                <Input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
              </div>
              
              <div className="space-y-2">
                <Label>Mês Referência</Label>
                <Input type="text" readOnly disabled value={formatMonth(form.date)} className="bg-muted/50 font-medium" />
              </div>

              <div className="space-y-2">
                <Label>Hora Início *</Label>
                <Input type="time" required value={form.startTime} onChange={e => handleTimeChange('startTime', e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Hora Término *</Label>
                <Input type="time" required value={form.endTime} onChange={e => handleTimeChange('endTime', e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Total de Horas</Label>
                <Input type="text" readOnly disabled value={form.totalHours} className="bg-muted/50 font-bold text-lg" />
              </div>

              <div className="space-y-2">
                <Label>Empresa Fornecedora *</Label>
                <Select value={form.companyId} onValueChange={v => setForm({...form, companyId: v})}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tarefa Realizada</Label>
                <Select value={form.serviceId} onValueChange={v => setForm({...form, serviceId: v})}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {services.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    <SelectItem value="outros">Outro...</SelectItem>
                  </SelectContent>
                </Select>
                {form.serviceId === 'outros' && (
                  <Input placeholder="Descreva a tarefa..." value={form.serviceOther} onChange={e => setForm({...form, serviceOther: e.target.value})} className="mt-2" />
                )}
              </div>

              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select value={form.clientId} onValueChange={v => setForm({...form, clientId: v})}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    <SelectItem value="outros">Outro (Digitar manualmente)</SelectItem>
                  </SelectContent>
                </Select>
                {form.clientId === 'outros' && (
                  <Input placeholder="Nome do cliente..." value={form.clientOther} onChange={e => setForm({...form, clientOther: e.target.value})} className="mt-2" />
                )}
              </div>

              <div className="space-y-2">
                <Label>PCO (Obra)</Label>
                <Select value={form.pcoId} onValueChange={v => setForm({...form, pcoId: v})}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {pcos.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    <SelectItem value="outros">Outro (Digitar manualmente)</SelectItem>
                  </SelectContent>
                </Select>
                {form.pcoId === 'outros' && (
                  <Input placeholder="Nome/Número do PCO..." value={form.pcoOther} onChange={e => setForm({...form, pcoOther: e.target.value})} className="mt-2" />
                )}
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label>Observações</Label>
                <Textarea placeholder="Detalhes opcionais..." value={form.observations} onChange={e => setForm({...form, observations: e.target.value})} />
              </div>

            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>LANÇAR</Button>
            </div>
          </form>
        </div>

        {/* Table area */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Relação de Utilizações</h2>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Pesquisar..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline"><FileDown className="h-4 w-4 mr-2" /> Exportar</Button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table--hover">
              <thead>
                <tr>
                  <th className="glass-header">Data</th>
                  <th className="glass-header">Empresa</th>
                  <th className="glass-header">Tarefa</th>
                  <th className="glass-header">Cliente</th>
                  <th className="glass-header">PCO</th>
                  <th className="glass-header text-center">Início</th>
                  <th className="glass-header text-center">Fim</th>
                  <th className="glass-header text-center">Total (H)</th>
                  <th className="glass-header text-center">Status Pg</th>
                  <th className="glass-header" style={{ width: 80 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8">
                      <EmptyState icon={PackageX} title="Nenhum lançamento" description="Não há registros encontrados." />
                    </td>
                  </tr>
                ) : (
                  filteredData.map(item => (
                    <tr key={item.id}>
                      <td className="whitespace-nowrap">
                        {format(new Date(item.date + 'T00:00:00'), 'dd/MM/yyyy')}
                        <div className="text-xs text-muted-foreground">{formatMonth(item.date)}</div>
                      </td>
                      <td className="font-medium">{item.company?.name}</td>
                      <td>{item.service?.name || item.service_other || '-'}</td>
                      <td>{item.client?.name || item.client_other || '-'}</td>
                      <td>{item.pco?.name || item.pco_other || '-'}</td>
                      <td className="text-center">{item.start_time.substring(0,5)}</td>
                      <td className="text-center">{item.end_time.substring(0,5)}</td>
                      <td className="text-center font-bold text-primary">{Number(item.total_hours).toFixed(2)}</td>
                      <td className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(item.status_payment)}`}>
                              {item.status_payment}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => changeStatus(item.id, 'Pendente')}>Pendente</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => changeStatus(item.id, 'Faturado')}>Faturado</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => changeStatus(item.id, 'Pago')}>Pago</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setForm({...form, ...item, companyId: item.company_id, startTime: item.start_time, endTime: item.end_time, totalHours: item.total_hours.toString()})}>
                              <Pencil className="h-4 w-4 mr-2" /> Preencher Form
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(item.id)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
