export interface MileageRecord {
  id: string;
  date: string;
  mileage: number;
  source: 'Manual' | 'Fueling';
}

// Tipo para inserção no Supabase (snake_case)
export interface MileageRecordInsert {
  user_id: string;
  date: string;
  mileage: number;
  source: 'Manual'; // Sempre 'Manual' para inserções diretas
}