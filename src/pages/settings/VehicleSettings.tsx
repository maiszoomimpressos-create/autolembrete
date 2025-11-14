import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useVehicle, VehicleData } from '@/hooks/useVehicle';
import { showSuccess, showError } from '@/utils/toast';

const VehicleSettings: React.FC = () => {
  const { vehicle, updateVehicle, removeVehicle } = useVehicle();
  const [formData, setFormData] = useState<Omit<VehicleData, 'currentMileage' | 'lastService'>>({
    model: vehicle.model,
    year: vehicle.year,
    plate: vehicle.plate,
  });
  const [mileageInput, setMileageInput] = useState(vehicle.currentMileage);

  useEffect(() => {
    setFormData({
      model: vehicle.model,
      year: vehicle.year,
      plate: vehicle.plate,
    });
    setMileageInput(vehicle.currentMileage);
  }, [vehicle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'mileage') {
      setMileageInput(parseInt(value) || 0);
    } else if (id === 'year') {
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

    updateVehicle({
        ...formData,
        currentMileage: mileageInput,
    });
    showSuccess('Detalhes do veículo salvos com sucesso!');
  };
  
  const handleRemoveVehicle = () => {
    if (window.confirm('Tem certeza que deseja remover este veículo? Esta ação é permanente.')) {
        removeVehicle();
        showSuccess('Veículo removido com sucesso.');
    }
  };

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
              <div className="space-y-2">
                <Label htmlFor="mileage">Quilometragem Atual (km)</Label>
                <Input 
                    id="mileage" 
                    type="number" 
                    value={mileageInput} 
                    onChange={handleChange} 
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
                    disabled // Desabilitado, pois o KM deve ser atualizado via Dashboard/Abastecimento
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    A quilometragem é atualizada automaticamente via Dashboard ou registros de abastecimento.
                </p>
              </div>
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
              Salvar Detalhes do Veículo
            </Button>
        </form>
        
        <Separator className="dark:bg-gray-700" />

        <div className="space-y-2">
          <h3 className="text-lg font-semibold dark:text-white">Remover Veículo</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Esta ação é permanente e removerá todos os registros de manutenção associados.
          </p>
          <Button variant="destructive" onClick={handleRemoveVehicle}>
            Remover Veículo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleSettings;