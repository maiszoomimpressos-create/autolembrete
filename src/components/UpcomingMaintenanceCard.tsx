import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { MaintenanceRecord } from '@/types/maintenance';
import { cn } from '@/lib/utils';

interface UpcomingMaintenanceCardProps {
  record: MaintenanceRecord | null;
  onEdit: (record: MaintenanceRecord) => void;
}

const UpcomingMaintenanceCard: React.FC<UpcomingMaintenanceCardProps> = ({ record, onEdit }) => {
  if (!record) {
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
  }

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
};

export default UpcomingMaintenanceCard;