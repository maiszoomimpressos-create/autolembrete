import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useFuelingRecords } from '@/hooks/useFuelingRecords';
import { useMileageRecords } from '@/hooks/useMileageRecords';
import MileageInputForm from './MileageInputForm';
import { Gauge } from 'lucide-react';

interface MileageInputDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const MileageInputDialog: React.FC<MileageInputDialogProps> = ({ isOpen, onOpenChange }) => {
  const { records: fuelingRecords } = useFuelingRecords();
  const { currentMileage, addManualRecord } = useMileageRecords(fuelingRecords);

  const handleSubmit = async (date: string, mileage: number) => {
    await addManualRecord(date, mileage);
    onOpenChange(false);
  };

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
          <MileageInputForm 
            currentMileage={currentMileage} 
            onSubmit={handleSubmit} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MileageInputDialog;