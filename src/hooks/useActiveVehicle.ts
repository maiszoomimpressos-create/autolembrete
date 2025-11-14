import { useState, useEffect, useMemo, useCallback } from 'react';
import { useVehiclesQuery } from '@/integrations/supabase/vehicle';
import { VehicleData } from '@/types/vehicle';

const VEHICLE_STORAGE_KEY = 'active_vehicle_id';

export const useActiveVehicle = () => {
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useVehiclesQuery();
  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(null);

  // 1. Inicialização: Tenta carregar o ID ativo do localStorage
  useEffect(() => {
    const storedId = localStorage.getItem(VEHICLE_STORAGE_KEY);
    if (storedId) {
      setActiveVehicleId(storedId);
    }
  }, []);

  // 2. Sincronização: Garante que o veículo ativo seja válido e define um padrão
  useEffect(() => {
    if (isLoadingVehicles || vehicles.length === 0) return;

    const activeVehicleExists = vehicles.some(v => v.id === activeVehicleId);

    if (!activeVehicleExists) {
      // Se o ID armazenado não for mais válido ou não existir, define o primeiro veículo como ativo
      const defaultVehicle = vehicles[0];
      setActiveVehicleId(defaultVehicle.id);
      localStorage.setItem(VEHICLE_STORAGE_KEY, defaultVehicle.id);
    }
  }, [vehicles, isLoadingVehicles, activeVehicleId]);

  const activeVehicle = useMemo(() => {
    if (vehicles.length === 0) {
        return null;
    }
    return vehicles.find(v => v.id === activeVehicleId) || vehicles[0];
  }, [vehicles, activeVehicleId]);

  const setActiveVehicle = useCallback((id: string) => {
    if (vehicles.some(v => v.id === id)) {
      setActiveVehicleId(id);
      localStorage.setItem(VEHICLE_STORAGE_KEY, id);
    }
  }, [vehicles]);

  return {
    vehicles,
    activeVehicle,
    activeVehicleId,
    setActiveVehicle,
    isLoadingVehicles,
  };
};