import { useCallback } from 'react';
import { FuelingRecord } from '@/types/fueling';
import { useFuelingRecordsQuery, useFuelingMutations } from '@/integrations/supabase/fueling';

// Este hook agora é um wrapper que usa react-query para buscar e mutar dados no Supabase.
export const useFuelingRecords = () => {
  const { data: records = [], isLoading, error } = useFuelingRecordsQuery();
  const { addRecord, updateRecord, deleteRecord, isMutating } = useFuelingMutations();

  const addOrUpdateRecord = useCallback(async (data: Omit<FuelingRecord, 'id'>, id?: string) => {
    if (id) {
      // Edição
      await updateRecord({ ...data, id } as FuelingRecord);
    } else {
      // Adição
      await addRecord(data);
    }
  }, [addRecord, updateRecord]);

  const handleDeleteRecord = useCallback(async (id: string) => {
    await deleteRecord(id);
  }, [deleteRecord]);

  return {
    records,
    isLoading,
    error,
    addOrUpdateRecord,
    deleteRecord: handleDeleteRecord,
    isMutating,
  };
};