import React, { useMemo } from 'react';
import { AlertTriangle, Loader2, Wrench, Calendar, Gauge, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMaintenanceRecords } from '@/hooks/useMaintenanceRecords';
import { useFuelingRecords } from '@/hooks/useFuelingRecords';
import { useMileageRecords } from '@/hooks/useMileageRecords';
import { useMileageAlerts } from '@/hooks/useMileageAlerts';
import { useDateAlerts } from '@/hooks/useDateAlerts';
import AlertItem from '@/components/AlertItem';
import { MaintenanceAlert } from '@/types/alert';
import { MaintenanceRecord } from '@/types/maintenance';
import { cn } from '@/lib/utils';

const AlertsPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Dados de Manutenção e KM
  const { records: maintenanceRecords, isLoading: isLoadingMaintenance } = useMaintenanceRecords();
  const { records: fuelingRecords } = useFuelingRecords();
  const { currentMileage, isLoading: isLoadingMileage } = useMileageRecords(fuelingRecords);
  
  // Alertas de Repetição (KM/Data)
  const { alerts: mileageAlerts } = useMileageAlerts(maintenanceRecords, currentMileage);
  const { alerts: dateAlerts } = useDateAlerts(maintenanceRecords);

  // Alertas de Status (Pendente/Agendado Atrasado)
  const statusAlerts = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    return maintenanceRecords
      .filter(r => r.status === 'Pendente' || (r.status === 'Agendado' && r.date < today))
      .map(r => {
        const isOverdue = r.status === 'Agendado' && r.date < today;
        const typeName = r.type === 'Outro' && r.customType ? r.customType : r.type;
        
        return {
          id: r.id + '-status',
          type: typeName,
          status: isOverdue ? 'Atrasado' : 'Pendente',
          value: 0, // Não aplicável para status
          unit: 'dias', // Não aplicável para status
          nextTarget: r.date,
          record: r, // Referência ao registro original
        };
      });
  }, [maintenanceRecords]);

  // Combina todos os alertas
  const allAlerts = useMemo(() => {
    const repetitionAlerts = [...mileageAlerts, ...dateAlerts];
    
    // Mapeia alertas de repetição para incluir uma referência nula ao registro
    const mappedRepetitionAlerts = repetitionAlerts.map(alert => ({
        ...alert,
        record: null as MaintenanceRecord | null,
    }));
    
    // Combina alertas de status e repetição
    const combined = [...statusAlerts, ...mappedRepetitionAlerts];
    
    // Ordenação: Pendente/Atrasado (Status) > Atrasado (Repetição) > Próximo (Repetição)
    combined.sort((a, b) => {
        const isAStatus = !!a.record;
        const isBStatus = !!b.record;
        
        // 1. Status Pendente/Atrasado (mais urgente)
        if (isAStatus && !isBStatus) return -1;
        if (!isAStatus && isBStatus) return 1;
        
        // 2. Repetição Atrasado vs Próximo
        if (a.status === 'Atrasado' && b.status !== 'Atrasado') return -1;
        if (a.status !== 'Atrasado' && b.status === 'Atrasado') return 1;
        
        // 3. Repetição KM vs Data (KM é geralmente mais crítico)
        if (a.unit === 'km' && b.unit === 'dias') return -1;
        if (a.unit === 'dias' && b.unit === 'km') return 1;

        // 4. Dentro da mesma categoria, o mais urgente
        if (a.status === 'Atrasado') return b.value - a.value;
        return a.value - b.value;
    });
    
    return combined;
  }, [mileageAlerts, dateAlerts, statusAlerts]);
  
  const handleAlertClick = (alert: MaintenanceAlert & { record: MaintenanceRecord | null }) => {
    if (alert.record) {
        // Se for um alerta de status (Pendente/Atrasado), navegamos para edição
        navigate('/maintenance', { state: { editRecordId: alert.record.id } });
    } else {
        // Se for um alerta de repetição (KM/Data), navegamos para criação
        navigate('/maintenance', { state: { createFromAlert: alert } });
    }
  };

  if (isLoadingMaintenance || isLoadingMileage) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600 dark:text-red-400" />
        <p className="mt-4 dark:text-white">Carregando alertas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
        <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
        <span>Central de Alertas de Manutenção</span>
      </h2>
      
      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl dark:text-white">Ações Pendentes ({allAlerts.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {allAlerts.length === 0 ? (
            <div className="text-center py-12 text-green-500 dark:text-green-400 bg-green-50/50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg font-semibold">Parabéns! Seu veículo está em dia.</p>
              <p>Nenhum alerta de manutenção pendente ou próximo.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {allAlerts.map((alert) => {
                const isStatusAlert = !!alert.record;
                
                if (isStatusAlert) {
                    // Renderiza Alerta de Status (Pendente/Atrasado)
                    const isOverdue = alert.status === 'Atrasado';
                    const Icon = isOverdue ? Calendar : Wrench;
                    const colorClass = isOverdue ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400';
                    const bgColorClass = isOverdue ? 'bg-red-50/50 dark:bg-red-900/10' : 'bg-orange-50/50 dark:bg-orange-900/10';
                    const description = isOverdue 
                        ? `Agendamento de ${alert.nextTarget} está atrasado.`
                        : `Status: Pendente de execução.`;
                        
                    return (
                        <button
                            key={alert.id}
                            onClick={() => handleAlertClick(alert)}
                            className={cn(
                                "w-full flex items-center justify-between p-3 rounded-lg border transition-colors hover:shadow-md",
                                bgColorClass,
                                isOverdue ? 'border-red-200 dark:border-red-900' : 'border-orange-200 dark:border-orange-900'
                            )}
                        >
                            <div className="flex items-center space-x-3">
                                <Icon className={cn("w-5 h-5 flex-shrink-0", colorClass)} />
                                <div>
                                    <p className={cn("text-sm font-semibold truncate", colorClass)}>
                                        {alert.type} ({alert.status})
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        {description}
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs text-blue-500 dark:text-blue-400">
                                {isOverdue ? 'Atualizar' : 'Ver Detalhes'}
                            </Button>
                        </button>
                    );
                } else {
                    // Renderiza Alerta de Repetição (KM/Data)
                    return (
                        <AlertItem 
                            key={alert.id} 
                            alert={alert} 
                            onClick={() => handleAlertClick(alert)} 
                        />
                    );
                }
              })}
            </div>
          )}
          
          <div className="pt-4 border-t dark:border-gray-800 flex justify-end">
            <Button onClick={() => navigate('/maintenance')} variant="secondary">
                <Wrench className="w-4 h-4 mr-2" />
                Ir para Manutenções
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsPage;