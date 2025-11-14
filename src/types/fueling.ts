export interface FuelingRecord {
  id: string;
  date: string;
  mileage: number;
  fuelType: 'Gasolina Comum' | 'Gasolina Aditivada' | 'Etanol' | 'Diesel'; // fuel_type
  volumeLiters: number; // volume_liters
  costPerLiter: number; // cost_per_liter
  totalCost: number; // total_cost
  station: string;
  vehicleId?: string; // Adicionando vehicleId
}

// Tipo para inserção no Supabase (snake_case)
export interface FuelingRecordInsert {
  user_id: string;
  date: string;
  mileage: number;
  fuel_type: string;
  volume_liters: number;
  cost_per_liter: number;
  total_cost: number;
  station: string;
  vehicle_id?: string; // Adicionando vehicle_id
}