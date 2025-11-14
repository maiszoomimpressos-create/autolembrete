import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FuelingRecord } from '@/types/fueling';
import { Plus, Trash2, Car, Gauge, Fuel } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

// Tipo auxiliar para o estado do formulário de viagem
interface TripRecord {
  date: string;
  mileage: number;
  fuelType: FuelingRecord['fuelType'];
  volumeLiters: number;
  costPerLiter: number;
  totalCost: number;
  station: string;
}

interface TripFuelingFormProps {
  onSubmit: (data: Omit<FuelingRecord, 'id'>) => void;
  onCancel: () => void;
}

const TripFuelingForm: React.FC<TripFuelingFormProps> = ({ onSubmit, onCancel }) => {
  const [tripRecords, setTripRecords] = useState<TripRecord[]>([
    // Começa com um registro vazio
    {
      date: new Date().toISOString().split('T')[0],
      mileage: 0,
      fuelType: 'Gasolina Comum',
      volumeLiters: 0,
      costPerLiter: 0,
      totalCost: 0,
      station: '',
    },
  ]);

  const handleAddRecord = () => {
    setTripRecords(prev => [
      ...prev,
      {
        date: new Date().toISOString().split('T')[0],
        mileage: 0,
        fuelType: 'Gasolina Comum',
        volumeLiters: 0,
        costPerLiter: 0,
        totalCost: 0,
        station: '',
      },
    ]);
  };

  const handleRemoveRecord = (index: number) => {
    if (tripRecords.length > 1) {
      setTripRecords(prev => prev.filter((_, i) => i !== index));
    } else {
      showError("Pelo menos um registro de abastecimento é necessário.");
    }
  };

  const calculateTotalCost = (liters: number, costPerL: number) => {
    return parseFloat((liters * costPerL).toFixed(2));
  };

  const handleChange = (index: number, id: keyof TripRecord, value: string | number) => {
    setTripRecords(prev => {
      const newRecords = [...prev];
      let record = newRecords[index];

      if (id === 'mileage') {
        record.mileage = parseInt(value as string) || 0;
      } else if (id === 'volumeLiters' || id === 'costPerLiter') {
        const liters = id === 'volumeLiters' ? parseFloat(value as string) || 0 : record.volumeLiters;
        const costPerL = id === 'costPerLiter' ? parseFloat(value as string) || 0 : record.costPerLiter;
        
        record.volumeLiters = liters;
        record.costPerLiter = costPerL;
        record.totalCost = calculateTotalCost(liters, costPerL);
      } else if (id === 'totalCost') {
        const total = parseFloat(value as string) || 0;
        const liters = record.volumeLiters;
        
        record.totalCost = total;
        if (liters > 0) {
          record.costPerLiter = parseFloat((total / liters).toFixed(2));
        }
      } else if (id === 'fuelType' || id === 'station' || id === 'date') {
        (record as any)[id] = value;
      }

      return newRecords;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    const isValid = tripRecords.every(r => r.mileage > 0 && r.volumeLiters > 0 && r.totalCost > 0);
    if (!isValid) {
      showError("Por favor, preencha todos os campos obrigatórios (KM, Litros, Custo Total) para todos os abastecimentos.");
      return;
    }

    // Submete cada registro individualmente
    tripRecords.forEach(record => {
      onSubmit(record);
    });

    showSuccess(`Viagem registrada! ${tripRecords.length} abastecimentos adicionados.`);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Adicione todos os abastecimentos realizados durante a sua viagem. Eles serão registrados individualmente.
      </p>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {tripRecords.map((record, index) => (
          <Card key={index} className="dark:bg-gray-800 dark:border-gray-700 relative p-4">
            <CardHeader className="p-0 mb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base dark:text-white">
                Abastecimento #{index + 1}
              </CardTitle>
              {tripRecords.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  type="button"
                  onClick={() => handleRemoveRecord(index)}
                  className="text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0 grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor={`date-${index}`}>Data</Label>
                <Input
                  id={`date-${index}`}
                  type="date"
                  value={record.date}
                  onChange={(e) => handleChange(index, 'date', e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`mileage-${index}`}>KM</Label>
                <Input
                  id={`mileage-${index}`}
                  type="number"
                  value={record.mileage}
                  onChange={(e) => handleChange(index, 'mileage', e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`station-${index}`}>Posto</Label>
                <Input
                  id={`station-${index}`}
                  type="text"
                  value={record.station}
                  onChange={(e) => handleChange(index, 'station', e.target.value)}
                  placeholder="Nome do posto"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor={`fuelType-${index}`}>Combustível</Label>
                <Select
                  value={record.fuelType}
                  onValueChange={(value) => handleChange(index, 'fuelType', value as FuelingRecord['fuelType'])}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    {['Gasolina Comum', 'Gasolina Aditivada', 'Etanol', 'Diesel'].map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`volumeLiters-${index}`}>Litros</Label>
                <Input
                  id={`volumeLiters-${index}`}
                  type="number"
                  step="0.01"
                  value={record.volumeLiters}
                  onChange={(e) => handleChange(index, 'volumeLiters', e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`costPerLiter-${index}`}>Custo/L (R$)</Label>
                <Input
                  id={`costPerLiter-${index}`}
                  type="number"
                  step="0.01"
                  value={record.costPerLiter}
                  onChange={(e) => handleChange(index, 'costPerLiter', e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor={`totalCost-${index}`}>Custo Total (R$)</Label>
                <Input
                  id={`totalCost-${index}`}
                  type="number"
                  step="0.01"
                  value={record.totalCost}
                  onChange={(e) => handleChange(index, 'totalCost', e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button 
        type="button" 
        variant="outline" 
        onClick={handleAddRecord} 
        className="w-full dark:hover:bg-gray-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Outro Abastecimento
      </Button>

      <Button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
        Registrar Viagem ({tripRecords.length} Abastecimentos)
      </Button>
    </form>
  );
};

export default TripFuelingForm;