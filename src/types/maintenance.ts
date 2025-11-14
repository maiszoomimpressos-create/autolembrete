export interface MaintenanceRecord {
  id: string;
  date: string;
  mileage: number;
  type: 'Troca de Óleo' | 'Revisão Geral' | 'Pneus' | 'Freios' | 'Outro';
  description: string;
  cost: number;
  status: 'Concluído' | 'Pendente' | 'Agendado';
}