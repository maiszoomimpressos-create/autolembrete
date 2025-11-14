import { useMemo } from 'react';
import { MaintenanceRecord } from '@/types/maintenance';

export const useLastMaintenanceDate = (records: MaintenanceRecord[]): string | null => {
  const lastMaintenanceDate = useMemo(() => {
    const completedRecords = records.filter(r => r.status === 'Concluído');

    if (completedRecords.length === 0) {
      return null;
    }

    // Ordena por data (mais recente primeiro)
    completedRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return completedRecords[0].date;
  }, [records]);

  return lastMaintenanceDate;
};