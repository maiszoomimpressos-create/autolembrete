import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gauge, Loader2, Car } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { useMileageRecords } from '@/hooks/useMileageRecords';
import { useFuelingRecords } from '@/hooks/useFuelingRecords';
import { useVehicle } from '@/hooks/useVehicle';

interface MileageInputDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const MileageInputDialog: React.FC<MileageInputDialogProps> = ({ isOpen, onOpenChange }) => {
  const { records: fuelingRecords } = useFuelingRecords();
  const { currentMileage, addManualRecord, isMutating } = useMileageRecords(fuelingRecords);
  const { vehicle, isLoading: isLoadingVehicle } = useVehicle();
  
  const [mileage, setMileage] = useState<number>(currentMileage);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Atualiza o KM no formulário quando o KM atual muda (após o carregamento ou mutação)
    setMileage(currentMileage);
  }, [currentMileage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mileage <= currentMileage) {
      showError(`O novo KM (${mileage.toLocaleString('pt-BR')}) deve ser maior que o KM atual registrado (${currentMileage.toLocaleString('pt-BR')}).`);
      return;
    }
    
    if (mileage <= 0) {
        showError("A quilometragem deve ser um valor positivo.");
        return;
    }

    try {
        await addManualRecord(date, mileage);
        showSuccess(`Quilometragem atualizada para ${mileage.toLocaleString('pt-BR')} km.`);
        onOpenChange(false);
    } catch (e) {
        // Erro já tratado no hook
    }
  };
  
  const isLoading = isMutating || isLoadingVehicle;
  
  const vehicleName = vehicle.id ? `${vehicle.model} (${vehicle.plate})` : 'Nenhum Veículo Cadastrado';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Gauge className="w-5 h-5 text-blue-500" />
            <span>Registrar Quilometragem</span>
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Atualize o odômetro do seu veículo principal.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md dark:bg-gray-800 border dark:border-gray-700">
            <Car className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium dark:text-white">{vehicleName}</span>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          <div className="space-y-2">
            <Label htmlFor="mileage">Nova Quilometragem (KM)</Label>
            <Input
              id="mileage"
              type="number"
              value={mileage}
              onChange={(e) => setMileage(parseInt(e.target.value) || 0)}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
              min={currentMileage + 1}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">KM atual registrado: {currentMileage.toLocaleString('pt-BR')} km</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Data do Registro</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            disabled={isLoading}
          >
            {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                'Atualizar KM'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MileageInputDialog;