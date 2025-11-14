import React, { useMemo } from 'react';
import { Bell, Loader2, AlertTriangle } from 'lucide-react';
import { useMaintenanceRecords } from '@/hooks/useMaintenanceRecords';
import { useFuelingRecords } from '@/hooks/useFuelingRecords';
import { useMileageRecords } from '@/hooks/useMileageRecords';
import { useMileageAlerts } from '@/hooks/useMileageAlerts';
import { useDateAlerts } from '@/hooks/useDateAlerts';
import { MaintenanceAlert } from '@/types/alert';
import AlertItem from '@/components/AlertItem';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { showError } from '@/utils/toast';

const AlertsPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 1. Obter dados base
  const { records: maintenanceRecords, isLoading: isLoadingMaintenance } = useMaintenanceRecords();
  const { records: fuelingRecords } = useFuelingRecords();
  const { currentMileage, isLoading: isLoadingMileage } = useMileageRecords(fuelingRecords);
  
  // 2. Calcular alertas
  const { alerts: mileageAlerts } = useMileageAlerts(maintenanceRecords, currentMileage);
  const { alerts: dateAlerts } = useDateAlerts(maintenanceRecords);
  
  const allAlerts = useMemo(() => {
    const combined = [...mileageAlerts, ...dateAlerts];
    
    // Ordenar: Atrasados primeiro, depois Próximos (pelo menor valor restante)
    combined.sort((a, b) => {
        if (a.status === 'Atrasado' && b.status !== 'Atrasado') return -1;
        if (a.status !== 'Atrasado' && b.status === 'Atrasado') return 1;
        
        // Se ambos são atrasados, o que passou mais tempo (maior value) vem primeiro
        if (a.status === 'Atrasado' && b.status === 'Atrasado') return b.value - a.value;

        // Se ambos são próximos, o que está mais perto (menor value) vem primeiro
        return a.value - b.value;
    });
    
    return combined;
  }, [mileageAlerts, dateAlerts]);
  
  const isLoading = isLoadingMaintenance || isLoadingMileage;

  const handleAlertClick = (alert: MaintenanceAlert) => {
    // Redireciona para a página de manutenção, onde o usuário pode editar o registro original
    showError(`Alerta de ${alert.type}. Por favor, encontre o registro original na página de Manutenções para registrar a conclusão.`);
    navigate('/maintenance');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
        <p className="mt-4 dark:text-white">Calculando alertas de manutenção...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
        <Bell className="w-7 h-7 text-red-600 dark:text-red-400" />
        <span>Alertas de Manutenção ({allAlerts.length})</span>
      </h2>
      
      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <CardContent className="p-4 space-y-3">
          {allAlerts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p className="text-lg font-semibold">Nenhum alerta ativo.</p>
              <p>Seu veículo está em dia com as manutenções agendadas e de repetição.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {allAlerts.map(alert => (
                <AlertItem key={alert.id} alert={alert} onClick={handleAlertClick} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsPage;