export interface MaintenanceAlert {
  id: string;
  type: string;
  status: 'Atrasado' | 'Próximo';
  value: number; // kmRemaining ou daysRemaining
  unit: 'km' | 'dias';
  nextTarget: number | string; // nextMileage ou nextDate
}