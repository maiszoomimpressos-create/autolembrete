import { useCallback } from 'react';
import { MaintenanceRecord } from '@/types/maintenance';
import { useMaintenanceRecordsQuery, useMaintenanceMutations } from '@/integrations/supabase/maintenance';
import { showSuccess } from '@/utils/toast'; // Importando showSuccess

// Este hook agora é um wrapper que usa react-query para buscar e mutar dados no Supabase.
export const useMaintenanceRecords = () => {
  const { data: records = [], isLoading, error } = useMaintenanceRecordsQuery();
  const { addRecord, updateRecord, deleteRecord, isMutating } = useMaintenanceMutations();

  const addOrUpdateRecord = useCallback(async (data: Omit<MaintenanceRecord, 'id'>, id?: string) => {
    // Recalcula nextMileage com base no intervalo antes de salvar
    let finalNextMileage: number | undefined = data.nextMileage;
    if (data.nextMileageInterval && data.nextMileageInterval > 0) {
        finalNextMileage = data.mileage + data.nextMileageInterval;
    }
    
    const recordToSave: Omit<MaintenanceRecord, 'id'> = {
        ...data,
        nextMileage: finalNextMileage,
    };

    if (id) {
      // Edição
      await updateRecord({ ...recordToSave, id } as MaintenanceRecord);
      showSuccess('Manutenção atualizada com sucesso!');
    } else {
      // Adição
      await addRecord(recordToSave);
      showSuccess('Nova manutenção adicionada!');
    }
  }, [addRecord, updateRecord]);

  const handleDeleteRecord = useCallback(async (id: string) => {
    await deleteRecord(id);
    showSuccess('Registro de manutenção deletado.');
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