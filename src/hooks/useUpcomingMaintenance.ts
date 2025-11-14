import { useMemo } from 'react';
import { MaintenanceRecord } from '@/types/maintenance';

export const useUpcomingMaintenance = (records: MaintenanceRecord[]) => {
  const upcomingRecord = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];

    // 1. Filtrar registros que não estão concluídos
    const relevantRecords = records.filter(r => r.status !== 'Concluído');

    if (relevantRecords.length === 0) {
      return null;
    }

    // 2. Priorizar registros pendentes (urgentes)
    const pendingRecords = relevantRecords.filter(r => r.status === 'Pendente');
    if (pendingRecords.length > 0) {
      // Se houver pendentes, pegamos o mais antigo (que deveria ter sido feito primeiro)
      return pendingRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    }

    // 3. Se não houver pendentes, procurar o agendado mais próximo no futuro
    const scheduledRecords = relevantRecords.filter(r => r.status === 'Agendado' && r.date >= today);
    if (scheduledRecords.length > 0) {
      // Pegamos o agendado com a data mais próxima
      return scheduledRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    }

    // 4. Se houver registros agendados no passado que não foram marcados como concluídos (atrasados)
    const overdueRecords = relevantRecords.filter(r => r.status === 'Agendado' && r.date < today);
    if (overdueRecords.length > 0) {
        // Pegamos o mais antigo
        return overdueRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    }

    return null;
  }, [records]);

  return upcomingRecord;
};