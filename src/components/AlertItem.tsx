import React from 'react';
import { MaintenanceAlert } from '@/types/alert';
import { AlertTriangle, Calendar, Gauge, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertItemProps {
  alert: MaintenanceAlert;
  onClick: (alert: MaintenanceAlert) => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, onClick }) => {
  const isOverdue = alert.status === 'Atrasado';
  const isKmAlert = alert.unit === 'km';
  
  const Icon = isKmAlert ? Gauge : Calendar;
  
  const colorClass = isOverdue ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400';
  const bgColorClass = isOverdue ? 'bg-red-50/50 dark:bg-red-900/10' : 'bg-yellow-50/50 dark:bg-yellow-900/10';
  
  const valueText = isKmAlert
    ? `${alert.value.toLocaleString('pt-BR')} km`
    : `${alert.value} dias`;
    
  const description = isOverdue
    ? `Vencido há ${valueText}`
    : `Próximo em ${valueText}`;
    
  const targetText = isKmAlert
    ? `Target: ${alert.nextTarget.toLocaleString('pt-BR')} km`
    : `Target: ${new Date(alert.nextTarget as string).toLocaleDateString('pt-BR')}`;

  return (
    <button
      onClick={() => onClick(alert)}
      className={cn(
        "w-full flex items-center justify-between p-3 rounded-lg border transition-colors hover:shadow-md",
        bgColorClass,
        isOverdue ? 'border-red-200 dark:border-red-900' : 'border-yellow-200 dark:border-yellow-900'
      )}
    >
      <div className="flex items-center space-x-3">
        <Icon className={cn("w-5 h-5 flex-shrink-0", colorClass)} />
        <div>
          <p className={cn("text-sm font-semibold truncate", colorClass)}>
            {alert.type}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </button>
  );
};

export default AlertItem;