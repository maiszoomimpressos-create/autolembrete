import { useState, useCallback, useEffect } from 'react';
import { useVehicleQuery } from '@/integrations/supabase/vehicle';
import { useSession } from '@/components/SessionContextProvider';

const ACTIVE_VEHICLE_KEY = 'active_vehicle_id';

export const useActiveVehicle = () => {
  const { user } = useSession();
  const { data: vehicles, isLoading: isLoadingVehicles } = useVehicleQuery();
  
  // Estado local para o ID do veículo ativo
  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(null);

  // 1. Inicialização: Tenta carregar do localStorage ou define o primeiro veículo
  useEffect(() => {
    if (isLoadingVehicles || !vehicles || vehicles.length === 0) {
      setActiveVehicleId(null);
      return;
    }

    const storedId = localStorage.getItem(ACTIVE_VEHICLE_KEY);
    const vehicleExists = vehicles.some(v => v.id === storedId);

    if (storedId && vehicleExists) {
      setActiveVehicleId(storedId);
    } else {
      // Se não houver ID armazenado ou o ID for inválido, define o primeiro veículo como ativo
      const firstVehicleId = vehicles[0].id;
      localStorage.setItem(ACTIVE_VEHICLE_KEY, firstVehicleId);
      setActiveVehicleId(firstVehicleId);
    }
  }, [vehicles, isLoadingVehicles]);

  // 2. Função para definir o veículo ativo
  const setActiveVehicle = useCallback((id: string) => {
    if (vehicles?.some(v => v.id === id)) {
      localStorage.setItem(ACTIVE_VEHICLE_KEY, id);
      setActiveVehicleId(id);
    }
  }, [vehicles]);
  
  // 3. Limpar o estado se o usuário sair
  useEffect(() => {
      if (!user) {
          localStorage.removeItem(ACTIVE_VEHICLE_KEY);
          setActiveVehicleId(null);
      }
  }, [user]);

  return {
    activeVehicleId,
    setActiveVehicle,
    isLoadingActiveVehicle: isLoadingVehicles,
  };
};