export interface MaintenanceRecord {
  id: string;
  date: string;
  mileage: number;
  type: 'Troca de Óleo' | 'Revisão Geral' | 'Pneus' | 'Freios' | 'Outro';
  customType?: string;
  description: string;
  cost: number;
  status: 'Concluído' | 'Pendente' | 'Agendado';
  nextMileage?: number; // KM no qual a próxima manutenção deve ser realizada
  nextDate?: string; // Data na qual a próxima manutenção deve ser realizada
}