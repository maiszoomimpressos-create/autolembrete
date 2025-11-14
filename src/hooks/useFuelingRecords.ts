import { useState, useCallback } from 'react';
import { FuelingRecord } from '@/types/fueling';

// Dados simulados iniciais (fonte única de verdade)
const initialRecords: FuelingRecord[] = [
  { id: 'f1', date: '2024-07-20', mileage: 45500, fuelType: 'Gasolina Comum', volumeLiters: 40.5, costPerLiter: 5.50, totalCost: 222.75, station: 'Posto Ipiranga' },
  { id: 'f2', date: '2024-07-10', mileage: 45000, fuelType: 'Etanol', volumeLiters: 35.0, costPerLiter: 3.80, totalCost: 133.00, station: 'Posto Shell' },
  { id: 'f3', date: '2024-06-25', mileage: 44500, fuelType: 'Gasolina Aditivada', volumeLiters: 42.0, costPerLiter: 6.00, totalCost: 252.00, station: 'Posto BR' },
  { id: 'f4', date: '2024-06-01', mileage: 44000, fuelType: 'Gasolina Comum', volumeLiters: 38.0, costPerLiter: 5.60, totalCost: 212.80, station: 'Posto Ale' },
  { id: 'f5', date: '2024-05-15', mileage: 43500, fuelType: 'Gasolina Comum', volumeLiters: 45.0, costPerLiter: 5.40, totalCost: 243.00, station: 'Posto Ale' },
];

export const useFuelingRecords = () => {
  const [records, setRecords] = useState<FuelingRecord[]>(initialRecords);

  const addOrUpdateRecord = useCallback((data: Omit<FuelingRecord, 'id'>, id?: string) => {
    if (id) {
      // Edição
      setRecords(prev => prev.map(r => r.id === id ? { ...data, id } : r));
    } else {
      // Adição
      const newRecord: FuelingRecord = {
        ...data,
        id: Date.now().toString(),
      };
      // Adiciona no início para aparecer primeiro na tabela
      setRecords(prev => [newRecord, ...prev]);
    }
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  }, []);

  return {
    records,
    addOrUpdateRecord,
    deleteRecord,
  };
};