import { useMemo } from 'react';
import { FuelingRecord } from '@/types/fueling';

// Função de cálculo de eficiência (km/l)
const calculateAverageEfficiency = (records: FuelingRecord[]): number | null => {
  // Ordena os registros por quilometragem para garantir a ordem correta
  const sortedRecords = [...records].sort((a, b) => a.mileage - b.mileage);

  if (sortedRecords.length < 2) {
    return null; // Não é possível calcular sem pelo menos dois registros
  }

  // Calcula a eficiência para cada intervalo entre abastecimentos
  const efficiencies: number[] = [];

  // Começamos do segundo registro (i=1) para calcular a distância percorrida desde o anterior (i-1)
  for (let i = 1; i < sortedRecords.length; i++) {
    const current = sortedRecords[i];
    const previous = sortedRecords[i - 1];

    const distance = current.mileage - previous.mileage;
    const volume = current.volumeLiters; // O volume abastecido no ponto atual

    if (distance > 0 && volume > 0) {
      efficiencies.push(distance / volume);
    }
  }

  if (efficiencies.length === 0) {
    return null;
  }

  const average = efficiencies.reduce((sum, eff) => sum + eff, 0) / efficiencies.length;
  return parseFloat(average.toFixed(1));
};

export const useFuelingMetrics = (fuelingRecords: FuelingRecord[]) => {
  const averageEfficiency = useMemo(() => {
    return calculateAverageEfficiency(fuelingRecords);
  }, [fuelingRecords]);

  return {
    averageEfficiency,
    fuelingRecords,
  };
};