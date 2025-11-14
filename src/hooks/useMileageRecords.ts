import { useMemo, useState, useCallback } from 'react';
import { FuelingRecord } from '@/types/fueling';
import { MileageRecord } from '@/types/mileage';

// Simulação de registros manuais iniciais
const initialManualRecords: MileageRecord[] = [
  { id: 'm1', date: '2024-07-25', mileage: 45600, source: 'Manual' },
];

export const useMileageRecords = (fuelingRecords: FuelingRecord[]) => {
  const [manualRecords, setManualRecords] = useState<MileageRecord[]>(initialManualRecords);

  const addManualRecord = useCallback((date: string, mileage: number) => {
    const newRecord: MileageRecord = {
      id: Date.now().toString(),
      date,
      mileage,
      source: 'Manual',
    };
    setManualRecords(prev => [newRecord, ...prev]);
  }, []);

  const allMileageRecords = useMemo(() => {
    // Converter FuelingRecords para MileageRecords
    const fuelingMileageRecords: MileageRecord[] = fuelingRecords.map(f => ({
      id: f.id,
      date: f.date,
      mileage: f.mileage,
      source: 'Fueling',
    }));

    // Combinar e ordenar todos os registros (mais recente primeiro)
    const combinedRecords = [...manualRecords, ...fuelingMileageRecords];
    
    combinedRecords.sort((a, b) => {
      // Ordenar por data (mais recente primeiro)
      const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateComparison !== 0) return dateComparison;
      
      // Se as datas forem iguais, ordenar por KM (maior KM primeiro)
      return b.mileage - a.mileage;
    });

    return combinedRecords;
  }, [manualRecords, fuelingRecords]);

  const currentMileage = useMemo(() => {
    return allMileageRecords.length > 0 ? allMileageRecords[0].mileage : 0;
  }, [allMileageRecords]);

  return {
    allMileageRecords,
    currentMileage,
    addManualRecord,
  };
};