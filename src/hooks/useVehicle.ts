import { useState, useCallback } from 'react';

export interface VehicleData {
  model: string;
  year: number;
  plate: string;
  currentMileage: number; // Mantido aqui para consistência, mas será sobrescrito pelo useMileageRecords
  lastService: string;
}

const initialVehicleData: VehicleData = {
  model: "Toyota Corolla",
  year: 2020,
  plate: "ABC-1234",
  currentMileage: 45200,
  lastService: "2024-05-10",
};

export const useVehicle = () => {
  const [vehicle, setVehicle] = useState<VehicleData>(initialVehicleData);

  const updateVehicle = useCallback((data: Partial<VehicleData>) => {
    setVehicle(prev => ({ ...prev, ...data }));
  }, []);

  const removeVehicle = useCallback(() => {
    // Simula a remoção do veículo
    setVehicle({
      model: '',
      year: 0,
      plate: '',
      currentMileage: 0,
      lastService: '',
    });
  }, []);

  return {
    vehicle,
    updateVehicle,
    removeVehicle,
  };
};