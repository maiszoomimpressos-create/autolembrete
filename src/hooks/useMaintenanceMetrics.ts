import { useMemo } from 'react';
import { MaintenanceRecord } from '@/types/maintenance';

export const useMaintenanceMetrics = (records: MaintenanceRecord[]) => {
  const metrics = useMemo(() => {
    const totalCost = records
      .filter(r => r.status === 'Concluído')
      .reduce((sum, r) => sum + r.cost, 0);

    const pendingCount = records.filter(r => r.status === 'Pendente').length;
    const scheduledCount = records.filter(r => r.status === 'Agendado').length;
    
    // Encontrar a próxima manutenção agendada (a mais próxima no futuro)
    const today = new Date().toISOString().split('T')[0];
    const nextMaintenance = records
      .filter(r => r.status === 'Agendado' && r.date >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

    return {
      totalCost: totalCost,
      pendingCount: pendingCount,
      scheduledCount: scheduledCount,
      nextMaintenance: nextMaintenance,
    };
  }, [records]);

  return metrics;
};