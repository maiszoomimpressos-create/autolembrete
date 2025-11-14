import { useMemo } from 'react';
import { FuelingRecord } from '@/types/fueling';

// Dados simulados iniciais (copiados de FuelingPage para uso no hook)
const initialFuelingRecords: FuelingRecord[] = [
  { id: 'f1', date: '2024-07-20', mileage: 45500, fuelType: 'Gasolina Comum', volumeLiters: 40.5, costPerLiter: 5.50, totalCost: 222.75, station: 'Posto Ipiranga' },
  { id: 'f2', date: '2024-07-10', mileage: 45000, fuelType: 'Etanol', volumeLiters: 35.0, costPerLiter: 3.80, totalCost: 133.00, station: 'Posto Shell' },
  { id: 'f3', date: '2024-06-25', mileage: 44500, fuelType: 'Gasolina Aditivada', volumeLiters: 42.0, costPerLiter: 6.00, totalCost: 252.00, station: 'Posto BR' },
  { id: 'f4', date: '2024-06-01', mileage: 44000, fuelType: 'Gasolina Comum', volumeLiters: 38.0, costPerLiter: 5.60, totalCost: 212.80, station: 'Posto Ale' },
];

// Função de cálculo de eficiência (km/l)
const calculateAverageEfficiency = (records: FuelingRecord[]): number | null => {
  // Ordena os registros por quilometragem para garantir a ordem correta
  const sortedRecords = [...records].sort((a, b) => a.mileage - b.mileage);

  if (sortedRecords.length < 2) {
    return null; // Não é possível calcular sem pelo menos dois registros
  }

  // Para calcular a eficiência, precisamos de:
  // 1. A distância percorrida entre o abastecimento N e N-1 (mileage[N] - mileage[N-1])
  // 2. O volume de combustível abastecido no abastecimento N (volumeLiters[N])
  // A eficiência é calculada como Distância / Volume.

  // Vamos calcular a média das últimas 3 eficiências registradas (requer 4 abastecimentos)
  const efficiencies: number[] = [];
  const recordsToAnalyze = sortedRecords.slice(-4); // Analisa os últimos 4 para obter 3 medições

  for (let i = 1; i < recordsToAnalyze.length; i++) {
    const current = recordsToAnalyze[i];
    const previous = recordsToAnalyze[i - 1];

    const distance = current.mileage - previous.mileage;
    const volume = current.volumeLiters;

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

export const useFuelingMetrics = () => {
  // Em uma aplicação real, você buscaria esses dados de um estado global ou API.
  // Aqui, usamos dados simulados.
  const fuelingRecords = initialFuelingRecords; 

  const averageEfficiency = useMemo(() => {
    return calculateAverageEfficiency(fuelingRecords);
  }, [fuelingRecords]);

  return {
    averageEfficiency,
    fuelingRecords,
  };
};