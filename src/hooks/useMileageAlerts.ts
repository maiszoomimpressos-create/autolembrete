import { useMemo } from 'react';
import { MaintenanceRecord } from '@/types/maintenance';
import { MaintenanceAlert } from '@/types/alert';

const ALERT_THRESHOLD_KM = 1000; // Alerta se estiver a 1000km ou menos

export const useMileageAlerts = (
  maintenanceRecords: MaintenanceRecord[],
  currentMileage: number
) => {
  const alerts = useMemo(() => {
    if (currentMileage === 0) {
      return { alerts: [] };
    }

    // 1. Filtrar manutenções concluídas que possuem um KM de alerta futuro
    const relevantRecords = maintenanceRecords.filter(r => 
      r.status === 'Concluído' && r.nextMileage && r.nextMileage > currentMileage
    );
    
    // 2. Filtrar manutenções atrasadas (KM de alerta já passou)
    const overdueRecords = maintenanceRecords.filter(r => 
      r.status === 'Concluído' && r.nextMileage && r.nextMileage <= currentMileage
    );

    const mileageAlerts: MaintenanceAlert[] = [];

    // Adicionar alertas atrasados
    overdueRecords.forEach(r => {
        const typeName = r.type === 'Outro' && r.customType ? r.customType : r.type;
        mileageAlerts.push({
            id: r.id + '-mileage',
            type: typeName,
            nextTarget: r.nextMileage!,
            status: 'Atrasado',
            value: currentMileage - r.nextMileage!, // Distância que passou
            unit: 'km',
        });
    });

    // Adicionar alertas próximos
    relevantRecords.forEach(r => {
      const kmRemaining = r.nextMileage! - currentMileage;
      const typeName = r.type === 'Outro' && r.customType ? r.customType : r.type;

      if (kmRemaining <= ALERT_THRESHOLD_KM) {
        mileageAlerts.push({
          id: r.id + '-mileage',
          type: typeName,
          nextTarget: r.nextMileage!,
          status: 'Próximo',
          value: kmRemaining,
          unit: 'km',
        });
      }
    });

    // Ordenar: Atrasados primeiro, depois Próximos (pelo menor KM restante)
    mileageAlerts.sort((a, b) => {
        if (a.status === 'Atrasado' && b.status !== 'Atrasado') return -1;
        if (a.status !== 'Atrasado' && b.status === 'Atrasado') return 1;
        
        // Se ambos são atrasados, o que passou mais tempo (maior value) vem primeiro
        if (a.status === 'Atrasado' && b.status === 'Atrasado') return b.value - a.value;

        // Se ambos são próximos, o que está mais perto (menor value) vem primeiro
        return a.value - b.value;
    });

    return {
      alerts: mileageAlerts,
    };
  }, [maintenanceRecords, currentMileage]);

  return alerts;
};