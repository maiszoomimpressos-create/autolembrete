import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useServiceTypesQuery, useServiceTypeMutations, ServiceType } from '@/integrations/supabase/serviceTypes';
import { showError } from '@/utils/toast';

const ServiceTypesPage: React.FC = () => {
  const { data: serviceTypes = [], isLoading } = useServiceTypesQuery();
  const { addType, deleteType, isMutating } = useServiceTypeMutations();
  
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDescription, setNewTypeDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddType = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newTypeName.trim();

    if (!name) {
      showError('O nome do tipo de serviço é obrigatório.');
      return;
    }
    
    setIsAdding(true);
    try {
        await addType({ name, description: newTypeDescription || null });
        setNewTypeName('');
        setNewTypeDescription('');
    } catch (error) {
        // Erro já tratado no hook
    } finally {
        setIsAdding(false);
    }
  };

  const handleDeleteType = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja remover o tipo de serviço: ${name}?`)) {
      await deleteType(id);
    }
  };

  return (
    <Card className="shadow-none border-none dark:bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl dark:text-white flex items-center space-x-2">
            <Wrench className="w-6 h-6 text-red-600 dark:text-red-400" />
            <span>Cadastrar Tipos de Serviço</span>
        </CardTitle>
        <CardDescription className="dark:text-gray-400">
          Gerencie os tipos de manutenção personalizados que podem ser selecionados no formulário de Manutenção.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        
        {/* Adicionar Novo Tipo */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl dark:text-white">Adicionar Novo Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddType} className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Serviço</Label>
                  <Input
                    id="name"
                    type="text"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    placeholder="Ex: Troca de Bateria"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (Opcional)</Label>
                  <Input
                    id="description"
                    type="text"
                    value={newTypeDescription}
                    onChange={(e) => setNewTypeDescription(e.target.value)}
                    placeholder="Ex: Baterias de 60Ah ou superior"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                disabled={isAdding || isMutating}
              >
                {isAdding ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <PlusCircle className="w-4 h-4 mr-2" />
                )}
                Adicionar Tipo de Serviço
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Tipos de Serviço */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl dark:text-white">Tipos de Serviço Personalizados</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-md border dark:border-gray-700 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-1/3">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-2/3">Descrição</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-[100px]">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                  {isLoading ? (
                      <tr>
                          <td colSpan={3} className="text-center py-8 text-gray-500 dark:text-gray-400">
                              <Loader2 className="w-5 h-5 mx-auto animate-spin" />
                              Carregando tipos de serviço...
                          </td>
                      </tr>
                  ) : serviceTypes.length === 0 ? (
                      <tr>
                          <td colSpan={3} className="text-center py-8 text-gray-500 dark:text-gray-400">
                              Nenhum tipo de serviço personalizado adicionado.
                          </td>
                      </tr>
                  ) : (
                      serviceTypes.map((type) => (
                          <tr key={type.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                                  {type.name}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                  {type.description || 'Nenhuma descrição fornecida.'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => handleDeleteType(type.id, type.name)}
                                      className="text-red-500 hover:bg-red-500/10"
                                      disabled={isMutating}
                                  >
                                      <Trash2 className="w-4 h-4" />
                                  </Button>
                              </td>
                          </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default ServiceTypesPage;