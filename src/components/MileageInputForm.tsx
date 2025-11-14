import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from '@/components/ui/card';
import { Gauge } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface MileageInputFormProps {
  currentMileage: number;
  onSubmit: (date: string, mileage: number) => void;
}

const MileageInputForm: React.FC<MileageInputFormProps> = ({ currentMileage, onSubmit }) => {
  const [mileage, setMileage] = useState<number>(currentMileage);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  React.useEffect(() => {
    setMileage(currentMileage);
  }, [currentMileage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mileage <= currentMileage) {
      showError(`O novo KM (${mileage.toLocaleString('pt-BR')}) deve ser maior que o KM atual registrado (${currentMileage.toLocaleString('pt-BR')}).`);
      return;
    }
    
    if (mileage <= 0) {
        showError("A quilometragem deve ser um valor positivo.");
        return;
    }

    onSubmit(date, mileage);
    showSuccess(`Quilometragem atualizada para ${mileage.toLocaleString('pt-BR')} km.`);
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-4 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2 text-lg font-semibold dark:text-white">
            <Gauge className="w-5 h-5 text-blue-500" />
            <span>Registrar KM Atual</span>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mileage">Quilometragem (KM)</Label>
            <Input
              id="mileage"
              type="number"
              value={mileage}
              onChange={(e) => setMileage(parseInt(e.target.value) || 0)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
              min={currentMileage + 1}
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
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
            Atualizar KM
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MileageInputForm;