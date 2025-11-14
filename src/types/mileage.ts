export interface MileageRecord {
  id: string;
  date: string;
  mileage: number;
  source: 'Manual' | 'Fueling';
}