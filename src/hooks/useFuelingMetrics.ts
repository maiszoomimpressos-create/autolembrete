import { useMemo } from 'react';
import { FuelingRecord } from '@/types/fueling';

// Dados simulados iniciais (para fins de demonstração no Dashboard)
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

export const useFuelingMetrics = () => {
  // Em uma aplicação real, você buscaria esses dados de um estado global ou API.
  const fuelingRecords = initialFuelingRecords; 

  const averageEfficiency = useMemo(() => {
    return calculateAverageEfficiency(fuelingRecords);
  }, [fuelingRecords]);

  return {
    averageEfficiency,
    fuelingRecords,
  };
};