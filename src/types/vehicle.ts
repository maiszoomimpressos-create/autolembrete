export interface VehicleData {
  id: string;
  model: string;
  year: number;
  plate: string;
}

// Tipo para inserção/atualização no Supabase (snake_case)
export interface VehicleDataInsert {
  user_id: string;
  model: string;
  year: number;
  plate: string;
}