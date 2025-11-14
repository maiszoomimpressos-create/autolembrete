import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useFuelingRecords } from '@/hooks/useFuelingRecords';
import { useMileageRecords } from '@/hooks/useMileageRecords';
import { Gauge, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { showError, showSuccess } from '@/utils/toast';

interface MileageInputDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const MileageInputDialog: React.FC<MileageInputDialogProps> = ({ isOpen, onOpenChange }) => {
  const { records: fuelingRecords } = useFuelingRecords();
  const { currentMileage, addManualRecord, isMutating } = useMileageRecords(fuelingRecords);

  const [newMileage, setNewMileage] = useState<number>(currentMileage);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Atualiza o estado local do KM quando o KM atual muda (após o carregamento inicial ou mutação)
  React.useEffect(() => {
    setNewMileage(currentMileage);
  }, [currentMileage]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMileage <= currentMileage) {
      showError(`A nova quilometragem (${newMileage.toLocaleString('pt-BR')} km) deve ser maior que a quilometragem atual (${currentMileage.toLocaleString('pt-BR')} km).`);
      return;
    }
    
    if (!date) {
        showError("A data é obrigatória.");
        return;
    }

    try {
        await addManualRecord(date, newMileage);
        showSuccess(`Quilometragem atualizada para ${newMileage.toLocaleString('pt-BR')} km.`);
        onOpenChange(false);
    } catch (error) {
        // Erro tratado no hook
    }
  }, [newMileage, currentMileage, date, addManualRecord, onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Gauge className="w-5 h-5 text-blue-500" />
            <span>Registro Rápido de Quilometragem</span>
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Atualize o odômetro do seu veículo.
          </DialogDescription>
        </DialogHeader>
        <div className="p-0">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-mileage" className="dark:text-gray-300">Quilometragem Atual Registrada</Label>
              <Input
                id="current-mileage"
                type="text"
                value={`${currentMileage.toLocaleString('pt-BR')} km`}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                disabled
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date" className="dark:text-gray-300">Data do Registro</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-mileage" className="dark:text-gray-300">Nova Quilometragem (KM)</Label>
              <Input
                id="new-mileage"
                type="number"
                value={newMileage}
                onChange={(e) => setNewMileage(parseInt(e.target.value) || 0)}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
                min={currentMileage + 1}
              />
              {newMileage > 0 && newMileage <= currentMileage && (
                <p className="text-xs text-red-500">O KM deve ser maior que o KM atual.</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="mt-2 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              disabled={isMutating || newMileage <= currentMileage}
            >
              {isMutating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                'Salvar Nova Quilometragem'
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MileageInputDialog;