import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useVehicle, VehicleData } from '@/hooks/useVehicle';
import { useActiveVehicle } from '@/hooks/useActiveVehicle'; // Novo Import
import { showSuccess, showError } from '@/utils/toast';
import { Loader2, Car, Check, PlusCircle } from 'lucide-react';
import { useMileageRecords } from '@/hooks/useMileageRecords';
import { useFuelingRecords } from '@/hooks/useFuelingRecords';
import { cn } from '@/lib/utils';

// Tipo para o estado local do formulário (apenas campos editáveis)
type VehicleFormState = Omit<VehicleData, 'id'>;

const VehicleSettings: React.FC = () => {
  const { vehicle: activeVehicle, vehicles, updateVehicle, removeVehicle, isLoading: isLoadingVehicle } = useVehicle();
  const { setActiveVehicle } = useActiveVehicle(); // Para mudar o veículo ativo
  
  // Hooks para gerenciar KM
  const { records: fuelingRecords } = useFuelingRecords();
  const { currentMileage, addManualRecord, isMutating: isMileageMutating } = useMileageRecords(fuelingRecords);
  
  const isMutating = isLoadingVehicle || isMileageMutating;
  const isNewVehicle = activeVehicle.id === '';
  const hasMultipleVehicles = vehicles.length > 1;

  const [formData, setFormData] = useState<VehicleFormState>({
    model: activeVehicle.model,
    year: activeVehicle.year,
    plate: activeVehicle.plate,
  });
  const [initialMileage, setInitialMileage] = useState<number>(0);
  const [isAddingNew, setIsAddingNew] = useState(false); // Estado para o formulário de adição

  useEffect(() => {
    // Atualiza o formulário quando o veículo ativo muda
    setFormData({
      model: activeVehicle.model,
      year: activeVehicle.year,
      plate: activeVehicle.plate,
    });
    // Reseta o KM inicial se estivermos editando um veículo existente
    setInitialMileage(0);
  }, [activeVehicle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    if (id === 'year') {
      setFormData(prev => ({ ...prev, year: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };
  
  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInitialMileage(parseInt(e.target.value) || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.model || !formData.plate || formData.year <= 1900) {
        showError("Por favor, preencha todos os campos obrigatórios do veículo.");
        return;
    }
    
    const isCreating = isAddingNew || isNewVehicle;

    if (isCreating && initialMileage <= 0) {
        showError("Por favor, insira a quilometragem inicial do veículo.");
        return;
    }

    // 1. Atualiza/Insere o veículo
    const vehicleId = isCreating ? undefined : activeVehicle.id;
    await updateVehicle(formData);
    
    // 2. Se for um novo veículo e tivermos um KM inicial, registramos o KM
    if (isCreating && initialMileage > 0) {
        const today = new Date().toISOString().split('T')[0];
        // Nota: O addManualRecord usará o veículo ativo. Se for um novo veículo,
        // o useVehicle já terá atualizado o activeVehicle para o recém-criado após a mutação.
        await addManualRecord(today, initialMileage);
        showSuccess(`Quilometragem inicial (${initialMileage.toLocaleString('pt-BR')} km) registrada.`);
    }
    
    setIsAddingNew(false);
  };
  
  const handleRemoveVehicle = () => {
    if (vehicles.length <= 1) {
        showError("Você não pode remover o único veículo cadastrado.");
        return;
    }
    if (window.confirm(`Tem certeza que deseja remover o veículo ${activeVehicle.model} (${activeVehicle.plate})? Esta ação é permanente e removerá todos os registros de manutenção e abastecimento associados.`)) {
        removeVehicle();
    }
  };
  
  const handleStartAddNew = () => {
      setIsAddingNew(true);
      setFormData({ model: '', year: new Date().getFullYear(), plate: '' });
      setInitialMileage(0);
  };
  
  const handleCancelAddNew = () => {
      setIsAddingNew(false);
      // Volta para o veículo ativo atual
      setFormData({
        model: activeVehicle.model,
        year: activeVehicle.year,
        plate: activeVehicle.plate,
      });
  };
  
  const handleSelectVehicle = (id: string) => {
      setActiveVehicle(id);
      setIsAddingNew(false); // Sai do modo de adição se estiver nele
  };

  if (isLoadingVehicle && vehicles.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
        <p className="ml-2 dark:text-white">Carregando configurações do veículo...</p>
      </div>
    );
  }
  
  const isEditingExisting = activeVehicle.id !== '' && !isAddingNew;
  const isCreating = isAddingNew || isNewVehicle;

  return (
    <Card className="shadow-none border-none dark:bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl dark:text-white">Configurações do Veículo</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Gerencie os detalhes dos seus veículos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        
        {/* Seletor de Veículo Ativo */}
        {vehicles.length > 0 && (
            <div className="space-y-4 p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h3 className="text-lg font-semibold dark:text-white">Veículo Ativo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {vehicles.map(v => (
                        <Button
                            key={v.id}
                            variant={v.id === activeVehicle.id && !isAddingNew ? 'default' : 'outline'}
                            onClick={() => handleSelectVehicle(v.id)}
                            className={cn(
                                "justify-start",
                                v.id === activeVehicle.id && !isAddingNew
                                    ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                                    : "dark:hover:bg-gray-700 dark:text-gray-300"
                            )}
                        >
                            <Car className="w-4 h-4 mr-2" />
                            {v.model} ({v.plate})
                            {v.id === activeVehicle.id && !isAddingNew && <Check className="w-4 h-4 ml-auto" />}
                        </Button>
                    ))}
                </div>
                <Separator className="dark:bg-gray-700" />
                <Button 
                    variant="outline" 
                    onClick={handleStartAddNew}
                    className="w-full dark:hover:bg-gray-700"
                    disabled={isMutating}
                >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Adicionar Novo Veículo
                </Button>
            </div>
        )}
        
        <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
                <CardTitle className="text-xl dark:text-white">
                    {isCreating ? 'Adicionar Novo Veículo' : `Editar ${activeVehicle.model}`}
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                    {isCreating ? 'Insira os detalhes do novo veículo.' : 'Atualize as informações do veículo ativo.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="model">Modelo</Label>
                        <Input 
                            id="model" 
                            value={formData.model} 
                            onChange={handleChange} 
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                            required
                            disabled={isMutating}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year">Ano</Label>
                        <Input 
                            id="year" 
                            type="number" 
                            value={formData.year} 
                            onChange={handleChange} 
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                            required
                            disabled={isMutating}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="plate">Placa</Label>
                        <Input 
                            id="plate" 
                            value={formData.plate} 
                            onChange={handleChange} 
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                            required
                            disabled={isMutating}
                        />
                      </div>
                      
                      {/* Campo de Quilometragem Condicional */}
                      <div className="space-y-2">
                        <Label htmlFor="currentMileage">Quilometragem Atual (km)</Label>
                        {isCreating ? (
                            <>
                                <Input 
                                    id="initialMileage" 
                                    type="number" 
                                    value={initialMileage} 
                                    onChange={handleMileageChange} 
                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                    placeholder="KM atual do veículo"
                                    required
                                    min={0}
                                    disabled={isMutating}
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Insira o KM atual do seu veículo. Este será o primeiro registro.
                                </p>
                            </>
                        ) : (
                            <>
                                <Input 
                                    id="currentMileage" 
                                    type="text" 
                                    value={currentMileage.toLocaleString('pt-BR')} 
                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                    disabled
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    A quilometragem é atualizada no Dashboard ou via registros de abastecimento.
                                </p>
                            </>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-4">
                        <Button 
                            type="submit" 
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                            disabled={isMutating}
                        >
                          {isMutating ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            isCreating ? 'Adicionar Veículo' : 'Salvar Detalhes'
                          )}
                        </Button>
                        {isAddingNew && (
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={handleCancelAddNew}
                                disabled={isMutating}
                            >
                                Cancelar
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
        
        {isEditingExisting && (
            <>
                <Separator className="dark:bg-gray-700" />
        
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold dark:text-white">Remover Veículo</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Esta ação é permanente e removerá todos os registros de manutenção, abastecimento e quilometragem associados a este veículo.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleRemoveVehicle}
                    disabled={isMutating || vehicles.length <= 1}
                  >
                    {isMutating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        `Remover ${activeVehicle.model}`
                    )}
                  </Button>
                  {vehicles.length <= 1 && (
                      <p className="text-xs text-red-500">Você deve manter pelo menos um veículo cadastrado.</p>
                  )}
                </div>
            </>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleSettings;