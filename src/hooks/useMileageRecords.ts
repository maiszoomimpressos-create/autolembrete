import { useMemo, useCallback } from 'react';
import { FuelingRecord } from '@/types/fueling';
import { MileageRecord } from '@/types/mileage';
import { useManualMileageRecordsQuery, useMileageMutations } from '@/integrations/supabase/mileage';

export const useMileageRecords = (fuelingRecords: FuelingRecord[]) => {
  // Busca registros manuais do Supabase
  const { data: manualRecords = [], isLoading: isLoadingManual } = useManualMileageRecordsQuery();
  const { addManualRecord: addManualRecordMutation, isMutating } = useMileageMutations();

  const addManualRecord = useCallback(async (date: string, mileage: number) => {
    await addManualRecordMutation({ date, mileage });
  }, [addManualRecordMutation]);

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
    isLoading: isLoadingManual,
    isMutating,
  };
};