export interface MaintenanceRecord {
  id: string;
  date: string;
  mileage: number;
  type: 'Troca de Óleo' | 'Revisão Geral' | 'Pneus' | 'Freios' | 'Outro';
  customType?: string; // Novo campo para especificar o nome quando type é 'Outro'
  description: string;
  cost: number;
  status: 'Concluído' | 'Pendente' | 'Agendado';
}