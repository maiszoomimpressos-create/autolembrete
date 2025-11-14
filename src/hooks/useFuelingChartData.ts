import { useMemo } from 'react';
import { FuelingRecord } from '@/types/fueling';

interface EfficiencyDataPoint {
  date: string;
  efficiency: number | null;
}

// Dados simulados iniciais (copiados de useFuelingMetrics para consistência)
const initialFuelingRecords: FuelingRecord[] = [
  { id: 'f1', date: '2024-07-20', mileage: 45500, fuelType: 'Gasolina Comum', volumeLiters: 40.5, costPerLiter: 5.50, totalCost: 222.75, station: 'Posto Ipiranga' },
  { id: 'f2', date: '2024-07-10', mileage: 45000, fuelType: 'Etanol', volumeLiters: 35.0, costPerLiter: 3.80, totalCost: 133.00, station: 'Posto Shell' },
  { id: 'f3', date: '2024-06-25', mileage: 44500, fuelType: 'Gasolina Aditivada', volumeLiters: 42.0, costPerLiter: 6.00, totalCost: 252.00, station: 'Posto BR' },
  { id: 'f4', date: '2024-06-01', mileage: 44000, fuelType: 'Gasolina Comum', volumeLiters: 38.0, costPerLiter: 5.60, totalCost: 212.80, station: 'Posto Ale' },
  { id: 'f5', date: '2024-05-15', mileage: 43500, fuelType: 'Gasolina Comum', volumeLiters: 45.0, costPerLiter: 5.40, totalCost: 243.00, station: 'Posto Ale' },
];

export const useFuelingChartData = () => {
  const chartData = useMemo(() => {
    // 1. Ordenar por quilometragem
    const sortedRecords = [...initialFuelingRecords].sort((a, b) => a.mileage - b.mileage);

    const data: EfficiencyDataPoint[] = [];

    // 2. Calcular a eficiência para cada abastecimento (a partir do segundo)
    for (let i = 1; i < sortedRecords.length; i++) {
      const current = sortedRecords[i];
      const previous = sortedRecords[i - 1];

      const distance = current.mileage - previous.mileage;
      const volume = current.volumeLiters;

      let efficiency: number | null = null;
      if (distance > 0 && volume > 0) {
        efficiency = parseFloat((distance / volume).toFixed(1));
      }

      // Usamos a data do abastecimento atual para plotar o ponto
      data.push({
        date: current.date,
        efficiency: efficiency,
      });
    }

    return data;
  }, []);

  return chartData;
};