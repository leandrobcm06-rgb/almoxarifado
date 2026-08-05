import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, SwitchCamera } from 'lucide-react';
import EmptyState from '@/components/UI/EmptyState';

export const Route = createFileRoute('/_authenticated/app/empilhadeiras/cadastros')({
  component: EmpilhadeirasCadastros,
});

function CrudTable({ table, title }: { table: string, title: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    loadData();
  }, [table]);

  async function loadData() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from(table).select('*').order('name');
      if (error) throw error;
      setItems(data || []);
    } catch (err: any) {
      toast.error(`Erro ao carregar ${title}`, { description: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const { error } = await supabase.from(table).insert({ name: newName.trim() });
      if (error) throw error;
      toast.success('Cadastrado com sucesso!');
      setNewName('');
      loadData();
    } catch (err: any) {
      toast.error('Erro ao cadastrar', { description: err.message });
    }
  }

  async function toggleActive(id: string, current: boolean) {
    try {
      const { error } = await supabase.from(table).update({ active: !current }).eq('id', id);
      if (error) throw error;
      loadData();
    } catch (err: any) {
      toast.error('Erro ao alterar status', { description: err.message });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir permanentemente este registro? (Só funcionará se não houver vínculos)')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      toast.success('Excluído com sucesso');
      loadData();
    } catch (err: any) {
      toast.error('Não é possível excluir', { description: 'Registro em uso no sistema.' });
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input 
          placeholder={`Novo nome para ${title}...`} 
          value={newName} 
          onChange={e => setNewName(e.target.value)} 
          className="max-w-md"
        />
        <Button type="submit"><Plus className="h-4 w-4 mr-2" /> Adicionar</Button>
      </form>

      <div className="table-responsive max-w-3xl">
        <table className="table table--hover">
          <thead>
            <tr>
              <th className="glass-header">Nome</th>
              <th className="glass-header w-24 text-center">Status</th>
              <th className="glass-header w-32 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4">
                  <EmptyState icon={SwitchCamera} title="Sem registros" description="Nenhum item cadastrado ainda." />
                </td>
              </tr>
            ) : (
              items.map(item => (
                <tr key={item.id} className={item.active ? '' : 'opacity-50 bg-muted/30'}>
                  <td className="font-medium">{item.name}</td>
                  <td className="text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${item.active ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                      {item.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="text-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleActive(item.id, item.active)} title={item.active ? 'Desativar' : 'Ativar'}>
                      <SwitchCamera className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmpilhadeirasCadastros() {
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title">Cadastros Auxiliares</h1>
            <p className="page-subtitle">Gerencie as opções dos menus suspensos das empilhadeiras</p>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8">
        <div className="glass-panel p-6 rounded-xl border min-h-[500px]">
          <Tabs defaultValue="companies" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="companies">Empresas Parceiras</TabsTrigger>
              <TabsTrigger value="clients">Clientes</TabsTrigger>
              <TabsTrigger value="pcos">PCOs (Obras)</TabsTrigger>
              <TabsTrigger value="services">Tarefas/Serviços</TabsTrigger>
            </TabsList>
            
            <TabsContent value="companies">
              <CrudTable table="forklift_companies" title="Empresa Parceira" />
            </TabsContent>
            
            <TabsContent value="clients">
              <CrudTable table="forklift_clients" title="Cliente" />
            </TabsContent>
            
            <TabsContent value="pcos">
              <CrudTable table="forklift_pcos" title="PCO" />
            </TabsContent>

            <TabsContent value="services">
              <CrudTable table="forklift_services" title="Tarefa" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
