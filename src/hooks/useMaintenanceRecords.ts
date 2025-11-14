import { useState, useCallback } from 'react';
import { MaintenanceRecord } from '@/types/maintenance';

// Dados simulados iniciais (fonte única de verdade para manutenção)
const initialRecords: MaintenanceRecord[] = [
  { id: '1', date: '2024-07-01', mileage: 45200, type: 'Troca de Óleo', description: 'Óleo 5W-30 sintético e filtro de óleo.', cost: 350.00, status: 'Concluído' },
  { id: '2', date: '2024-06-15', mileage: 44500, type: 'Pneus', description: 'Rodízio e balanceamento dos 4 pneus.', cost: 120.00, status: 'Concluído' },
  { id: '3', date: '2024-08-20', mileage: 50000, type: 'Revisão Geral', description: 'Revisão completa de 50.000 km.', cost: 0, status: 'Agendado' },
  { id: '4', date: '2024-07-25', mileage: 46000, type: 'Freios', description: 'Troca de pastilhas dianteiras.', cost: 480.50, status: 'Pendente' },
];

export const useMaintenanceRecords = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>(initialRecords);

  const addOrUpdateRecord = useCallback((data: Omit<MaintenanceRecord, 'id'>, id?: string) => {
    if (id) {
      // Edição
      setRecords(prev => prev.map(r => r.id === id ? { ...data, id } : r));
    } else {
      // Adição
      const newRecord: MaintenanceRecord = {
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