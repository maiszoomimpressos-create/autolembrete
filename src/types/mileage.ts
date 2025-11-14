export interface MileageRecord {
  id: string;
  date: string;
  mileage: number;
  source: 'Manual' | 'Fueling';
  vehicleId: string; // Novo campo
}

// Tipo para inserção no Supabase (snake_case)
export interface MileageRecordInsert {
  user_id: string;
  vehicle_id: string; // Novo campo
  date: string;
  mileage: number;
  source: 'Manual'; // Sempre 'Manual' para inserções diretas
}