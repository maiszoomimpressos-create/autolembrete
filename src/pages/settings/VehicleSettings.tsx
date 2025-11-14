import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useVehicle, VehicleData } from '@/hooks/useVehicle';
import { showError } from '@/utils/toast';
import { Loader2, Car, PlusCircle, Trash2 } from 'lucide-react';
import VehicleForm from '@/components/VehicleForm'; // Importando o novo componente

type Mode = 'edit' | 'add';

const VehicleSettings: React.FC = () => {
  const { vehicle: activeVehicle, updateVehicle, removeVehicle, isLoading, isMutating, vehicles } = useVehicle();
  
  // Se não houver veículo ativo, forçamos o modo 'add'
  const initialMode: Mode = activeVehicle.id === '' ? 'add' : 'edit';
  const [mode, setMode] = useState<Mode>(initialMode);

  useEffect(() => {
    // Se o veículo ativo mudar (ex: após a criação), voltamos para o modo 'edit'
    if (activeVehicle.id !== '' && mode === 'add') {
        setMode('edit');
    }
    // Se o veículo ativo for removido e a lista ficar vazia, forçamos 'add'
    if (activeVehicle.id === '' && vehicles.length === 0) {
        setMode('add');
    }
  }, [activeVehicle.id, vehicles.length]);
  
  const handleUpdateVehicle = useCallback(async (data: Omit<VehicleData, 'id'>) => {
    // Se estiver no modo 'add', o vehicleId será undefined, resultando em INSERT no hook
    // Se estiver no modo 'edit', o hook usa o activeVehicle.id para UPDATE
    await updateVehicle(data);
    // O useEffect acima deve capturar a mudança e reverter para 'edit' se for uma criação bem-sucedida.
  }, [updateVehicle]);

  const handleRemoveVehicle = () => {
    if (window.confirm('Tem certeza que deseja remover este veículo? Esta ação é permanente e removerá todos os registros de manutenção e abastecimento associados.')) {
        removeVehicle();
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
        <p className="ml-2 dark:text-white">Carregando configurações do veículo...</p>
      </div>
    );
  }

  const isEditingActive = mode === 'edit' && activeVehicle.id !== '';
  const isAddingNew = mode === 'add';

  return (
    <Card className="shadow-none border-none dark:bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl dark:text-white">Configurações do Veículo</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Gerencie os detalhes do seu veículo principal e adicione novos veículos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        
        {/* Botões de Modo */}
        <div className="flex space-x-4">
            {activeVehicle.id !== '' && (
                <Button 
                    variant={isEditingActive ? 'default' : 'outline'}
                    onClick={() => setMode('edit')}
                    className={isEditingActive ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white' : 'dark:hover:bg-gray-700'}
                    disabled={isMutating}
                >
                    <Car className="w-4 h-4 mr-2" />
                    Editar Veículo Ativo
                </Button>
            )}
            <Button 
                variant={isAddingNew ? 'default' : 'outline'}
                onClick={() => setMode('add')}
                className={isAddingNew ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white' : 'dark:hover:bg-gray-700'}
                disabled={isMutating}
            >
                <PlusCircle className="w-4 h-4 mr-2" />
                Adicionar Novo
            </Button>
        </div>
        
        <Separator className="dark:bg-gray-700" />

        {/* Formulário de Edição */}
        {isEditingActive && (
            <div className="space-y-4">
                <h3 className="text-xl font-semibold dark:text-white">
                    Editando: {activeVehicle.model} ({activeVehicle.plate})
                </h3>
                <VehicleForm
                    initialData={activeVehicle}
                    isMutating={isMutating}
                    onSubmit={handleUpdateVehicle}
                    isNew={false}
                />
                
                <Separator className="dark:bg-gray-700" />
        
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Remover Veículo</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Esta ação é permanente e removerá todos os registros de manutenção e abastecimento associados a este veículo.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleRemoveVehicle}
                    disabled={isMutating}
                  >
                    {isMutating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remover Veículo
                        </>
                    )}
                  </Button>
                </div>
            </div>
        )}
        
        {/* Formulário de Adição */}
        {isAddingNew && (
            <div className="space-y-4">
                <h3 className="text-xl font-semibold dark:text-white">
                    {activeVehicle.id === '' ? 'Cadastrar Primeiro Veículo' : 'Adicionar Novo Veículo'}
                </h3>
                <VehicleForm
                    initialData={undefined} // Passa undefined para resetar o formulário
                    isMutating={isMutating}
                    onSubmit={handleUpdateVehicle}
                    isNew={true}
                />
            </div>
        )}
        
      </CardContent>
    </Card>
  );
};

export default VehicleSettings;