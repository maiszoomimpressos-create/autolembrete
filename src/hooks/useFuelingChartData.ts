import { useMemo } from 'react';
import { FuelingRecord } from '@/types/fueling';

interface EfficiencyDataPoint {
  date: string;
  efficiency: number | null;
}

export const useFuelingChartData = (fuelingRecords: FuelingRecord[]) => {
  const chartData = useMemo(() => {
    // 1. Ordenar por quilometragem
    const sortedRecords = [...fuelingRecords].sort((a, b) => a.mileage - b.mileage);

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
  }, [fuelingRecords]);

  return chartData;
};