import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Calendar, AlertTriangle, CheckCircle, Gauge } from 'lucide-react';
import { MaintenanceRecord } from '@/types/maintenance';
import { MaintenanceAlert } from '@/types/alert';
import { cn } from '@/lib/utils';

interface UpcomingMaintenanceCardProps {
  record: MaintenanceRecord | null;
  fallbackAlert: MaintenanceAlert | null; // Novo prop para alertas de repetição (KM/Data)
  onEdit: (record: MaintenanceRecord) => void;
  onAlertClick: (alert: MaintenanceAlert) => void; // Novo prop para lidar com cliques em alertas
}

const UpcomingMaintenanceCard: React.FC<UpcomingMaintenanceCardProps> = ({ record, fallbackAlert, onEdit, onAlertClick }) => {
  
  // Se houver um registro ativo (Pendente/Agendado), priorizamos ele
  if (record) {
    const isPending = record.status === 'Pendente';
    const isScheduled = record.status === 'Agendado';
    const isOverdue = isScheduled && new Date(record.date) < new Date();

    let borderColorClass = 'border-blue-500';
    let icon = <Wrench className="w-5 h-5 text-blue-500" />;
    let actionLabel = 'Ver Detalhes';

    if (isPending || isOverdue) {
      borderColorClass = 'border-red-500';
      icon = <AlertTriangle className="w-5 h-5 text-red-500" />;
      actionLabel = 'Resolver Agora';
    } else if (isScheduled) {
      borderColorClass = 'border-yellow-500';
      icon = <Calendar className="w-5 h-5 text-yellow-500" />;
      actionLabel = 'Confirmar';
    }

    return (
      <Card className={cn("dark:bg-gray-800 dark:border-gray-700 border-l-4", borderColorClass)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {isPending ? 'Atenção Urgente' : isOverdue ? 'Agendamento Atrasado' : 'Próximo Agendamento'}
          </CardTitle>
          {icon}
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-lg font-bold text-gray-900 dark:text-white truncate">{record.type}</div>
          <p className="text-sm text-muted-foreground">
            {isPending ? `KM: ${record.mileage.toLocaleString('pt-BR')} km` : `Data: ${record.date}`}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2 dark:hover:bg-gray-700"
            onClick={() => onEdit(record)}
          >
            {actionLabel}
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Se não houver registro ativo, verificamos o alerta de repetição mais urgente
  if (fallbackAlert) {
    const isOverdue = fallbackAlert.status === 'Atrasado';
    const isKmAlert = fallbackAlert.unit === 'km';
    
    const borderColorClass = isOverdue ? 'border-red-500' : 'border-yellow-500';
    const Icon = isKmAlert ? Gauge : Calendar;
    const titleText = isOverdue ? 'Repetição Atrasada' : 'Repetição Próxima';
    const descriptionText = isKmAlert 
        ? `Próximo KM: ${fallbackAlert.nextTarget.toLocaleString('pt-BR')} km`
        : `Próxima Data: ${fallbackAlert.nextTarget}`;
    const actionLabel = isOverdue ? 'Registrar Agora' : 'Ver Alerta';

    return (
      <Card className={cn("dark:bg-gray-800 dark:border-gray-700 border-l-4", borderColorClass)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {titleText} ({fallbackAlert.type})
          </CardTitle>
          <Icon className={cn("w-5 h-5", isOverdue ? 'text-red-500' : 'text-yellow-500')} />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-lg font-bold text-gray-900 dark:text-white truncate">
            {fallbackAlert.type}
          </div>
          <p className="text-sm text-muted-foreground">
            {descriptionText}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2 dark:hover:bg-gray-700"
            onClick={() => onAlertClick(fallbackAlert)}
          >
            {actionLabel}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Caso não haja nada ativo ou alerta de repetição
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 border-l-4 border-green-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Próxima Manutenção
        </CardTitle>
        <CheckCircle className="w-5 h-5 text-green-500" />
      </CardHeader>
      <CardContent>
        <div className="text-lg font-bold text-gray-900 dark:text-white">Tudo em dia!</div>
        <p className="text-xs text-muted-foreground mt-1">Nenhuma manutenção pendente ou agendada no momento.</p>
      </CardContent>
    </Card>
  );
};

export default UpcomingMaintenanceCard;