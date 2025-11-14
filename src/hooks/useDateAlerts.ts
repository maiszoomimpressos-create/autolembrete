import { useMemo } from 'react';
import { MaintenanceRecord } from '@/types/maintenance';
import { MaintenanceAlert } from '@/types/alert';

const ALERT_THRESHOLD_DAYS = 30; // Alerta se estiver a 30 dias ou menos

export const useDateAlerts = (
  maintenanceRecords: MaintenanceRecord[]
) => {
  const alerts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normaliza para comparação de data

    const dateAlerts: MaintenanceAlert[] = [];

    maintenanceRecords.forEach(r => {
      if (r.status === 'Concluído' && r.nextDate) {
        const nextDate = new Date(r.nextDate);
        nextDate.setHours(0, 0, 0, 0);

        const typeName = r.type === 'Outro' && r.customType ? r.customType : r.type;
        
        const diffTime = nextDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          // Atrasado
          dateAlerts.push({
            id: r.id + '-date',
            type: typeName,
            nextTarget: r.nextDate,
            status: 'Atrasado',
            value: Math.abs(diffDays),
            unit: 'dias',
          });
        } else if (diffDays <= ALERT_THRESHOLD_DAYS) {
          // Próximo
          dateAlerts.push({
            id: r.id + '-date',
            type: typeName,
            nextTarget: r.nextDate,
            status: 'Próximo',
            value: diffDays,
            unit: 'dias',
          });
        }
      }
    });

    // Ordenar: Atrasados primeiro, depois Próximos (pelo menor dias restante)
    dateAlerts.sort((a, b) => {
        if (a.status === 'Atrasado' && b.status !== 'Atrasado') return -1;
        if (a.status !== 'Atrasado' && b.status === 'Atrasado') return 1;
        
        // Se ambos são atrasados, o que passou mais tempo (maior value) vem primeiro
        if (a.status === 'Atrasado' && b.status === 'Atrasado') return b.value - a.value;

        // Se ambos são próximos, o que está mais perto (menor value) vem primeiro
        return a.value - b.value;
    });

    return {
      alerts: dateAlerts,
    };
  }, [maintenanceRecords]);

  return alerts;
};