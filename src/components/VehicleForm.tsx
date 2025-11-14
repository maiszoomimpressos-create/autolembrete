import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Car, PlusCircle } from 'lucide-react';
import { showError } from '@/utils/toast';
import { VehicleData } from '@/hooks/useVehicle';

interface VehicleFormProps {
  initialData?: Omit<VehicleData, 'id'>;
  isMutating: boolean;
  onSubmit: (data: Omit<VehicleData, 'id'>) => Promise<void>;
  isNew: boolean;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ initialData, isMutating, onSubmit, isNew }) => {
  const [formData, setFormData] = useState<Omit<VehicleData, 'id'>>({
    model: initialData?.model || '',
    year: initialData?.year || new Date().getFullYear(),
    plate: initialData?.plate || '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        model: initialData.model,
        year: initialData.year,
        plate: initialData.plate,
      });
    }
  }, [initialData]);

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

    onSubmit(formData);
  };

  return (
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
            <Label htmlFor="currentMileage">Quilometragem Atual (km)</Label>
            <Input 
                id="currentMileage" 
                type="text" 
                value="Atualizado no Dashboard" 
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
                disabled
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
                A quilometragem é atualizada automaticamente via Dashboard ou registros.
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
          ) : isNew ? (
            <>
                <PlusCircle className="w-4 h-4 mr-2" />
                Adicionar Novo Veículo
            </>
          ) : (
            'Salvar Detalhes do Veículo'
          )}
        </Button>
    </form>
  );
};

export default VehicleForm;