export interface FuelingRecord {
  id: string;
  date: string;
  mileage: number;
  fuelType: 'Gasolina Comum' | 'Gasolina Aditivada' | 'Etanol' | 'Diesel';
  volumeLiters: number;
  costPerLiter: number;
  totalCost: number;
  station: string;
}