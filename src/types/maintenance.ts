export interface MaintenanceRecord {
  id: string;
  date: string;
  mileage: number;
  type: string; // Alterado para string para suportar tipos personalizados
  customType?: string;
  description: string;
  cost: number;
  status: 'Concluído' | 'Pendente' | 'Agendado';
  nextMileage?: number; // next_mileage
  nextMileageInterval?: number; // next_mileage_interval
  nextDate?: string; // next_date
  vehicleId: string; // Novo campo
}

// Tipo para inserção no Supabase (snake_case)
export interface MaintenanceRecordInsert {
  user_id: string;
  vehicle_id: string; // Novo campo
  date: string;
  mileage: number;
  type: string;
  custom_type?: string;
  description: string;
  cost: number;
  status: string;
  next_mileage?: number;
  next_mileage_interval?: number;
  next_date?: string;
}