import { useState, useCallback } from 'react';
import { MaintenanceRecord } from '@/types/maintenance';

// Dados simulados iniciais (fonte única de verdade para manutenção)
const initialRecords: MaintenanceRecord[] = [
  { 
    id: '1', 
    date: '2024-07-01', 
    mileage: 45200, 
    type: 'Troca de Óleo', 
    description: 'Óleo 5W-30 sintético e filtro de óleo.', 
    cost: 350.00, 
    status: 'Concluído',
    nextMileageInterval: 10000, // Próxima troca em 10.000 km
    nextMileage: 55200, // 45200 + 10000
    nextDate: '2025-01-01', // Próxima troca em 6 meses
  },
  { 
    id: '2', 
    date: '2024-06-15', 
    mileage: 44500, 
    type: 'Pneus', 
    description: 'Rodízio e balanceamento dos 4 pneus.', 
    cost: 120.00, 
    status: 'Concluído',
    nextMileageInterval: 5000, // Próximo rodízio em 5.000 km
    nextMileage: 49500, // 44500 + 5000
  },
  { id: '3', date: '2024-08-20', mileage: 50000, type: 'Revisão Geral', description: 'Revisão completa de 50.000 km.', cost: 0, status: 'Agendado' },
  { id: '4', date: '2024-07-25', mileage: 46000, type: 'Freios', description: 'Troca de pastilhas dianteiras.', cost: 480.50, status: 'Pendente' },
];

export const useMaintenanceRecords = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>(initialRecords);

  const addOrUpdateRecord = useCallback((data: Omit<MaintenanceRecord, 'id'>, id?: string) => {
    // Recalcula nextMileage com base no intervalo antes de salvar
    let finalNextMileage: number | undefined = data.nextMileage;
    if (data.nextMileageInterval && data.nextMileageInterval > 0) {
        finalNextMileage = data.mileage + data.nextMileageInterval;
    }

    const recordToSave: MaintenanceRecord = {
        ...data,
        nextMileage: finalNextMileage,
        id: id || Date.now().toString(),
    };

    if (id) {
      // Edição
      setRecords(prev => prev.map(r => r.id === id ? recordToSave : r));
    } else {
      // Adição
      // Adiciona no início para aparecer primeiro na tabela
      setRecords(prev => [recordToSave, ...prev]);
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