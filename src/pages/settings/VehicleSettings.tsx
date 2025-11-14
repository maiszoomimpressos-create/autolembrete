import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useVehicle, VehicleData } from '@/hooks/useVehicle';
import { showSuccess, showError } from '@/utils/toast';
import { Loader2 } from 'lucide-react';

// Tipo para o estado local do formulário (apenas campos editáveis)
type VehicleFormState = Omit<VehicleData, 'id'>;

const VehicleSettings: React.FC = () => {
  const { vehicle, updateVehicle, removeVehicle, isLoading, isMutating } = useVehicle();
  
  const [formData, setFormData] = useState<VehicleFormState>({
    model: vehicle.model,
    year: vehicle.year,
    plate: vehicle.plate,
  });

  useEffect(() => {
    // Atualiza o formulário quando os dados do veículo mudam (ex: após o carregamento inicial)
    setFormData({
      model: vehicle.model,
      year: vehicle.year,
      plate: vehicle.plate,
    });
  }, [vehicle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    if (id === 'year') {
      setFormData(prev => ({ ...prev, year: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.model || !formData.plate || formData.year <= 1900) {
        showError("Por favor, preencha todos os campos obrigatórios do veículo.");
        return;
    }

    // O hook useVehicle agora lida com a persistência
    updateVehicle(formData);
  };
  
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

  return (
    <Card className="shadow-none border-none dark:bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl dark:text-white">Configurações do Veículo</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Gerencie os detalhes do seu veículo principal.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">Modelo</Label>
                <Input 
                    id="model" 
                    value={formData.model} 
                    onChange={handleChange} 
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
                    required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Ano</Label>
                <Input 
                    id="year" 
                    type="number" 
                    value={formData.year} 
                    onChange={handleChange} 
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
                    required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plate">Placa</Label>
                <Input 
                    id="plate" 
                    value={formData.plate} 
                    onChange={handleChange} 
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
                    required
                />
              </div>
              {/* Campo de KM removido, pois é gerenciado pelo useMileageRecords */}
              <div className="space-y-2">
                <Label htmlFor="currentMileage">Quilometragem Atual (km)</Label>
                <Input 
                    id="currentMileage" 
                    type="text" 
                    value="Atualizado no Dashboard" 
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
                    disabled
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    A quilometragem é atualizada automaticamente via Dashboard ou registros de abastecimento.
                </p>
              </div>
            </div>
            <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                disabled={isMutating}
            >
              {isMutating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                'Salvar Detalhes do Veículo'
              )}
            </Button>
        </form>
        
        {vehicle.id !== '' && (
            <>
                <Separator className="dark:bg-gray-700" />
        
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold dark:text-white">Remover Veículo</h3>
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
                        'Remover Veículo'
                    )}
                  </Button>
                </div>
            </>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleSettings;