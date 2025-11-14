import { useCallback, useMemo } from 'react';
import { useVehicleQuery, useVehicleMutations } from '@/integrations/supabase/vehicle';
import { showError } from '@/utils/toast';

export interface VehicleData {
  id: string;
  model: string;
  year: number;
  plate: string;
}

// Dados padrão para quando não há veículo registrado
const defaultVehicleData: VehicleData = {
    id: '',
    model: "Veículo Não Registrado",
    year: new Date().getFullYear(),
    plate: "N/A",
};

export const useVehicle = () => {
  const { data: vehicleData, isLoading } = useVehicleQuery();
  const { upsertVehicle, deleteVehicle, isMutating } = useVehicleMutations();

  // Combina os dados do Supabase com os valores padrão se não houver registro
  const vehicle = useMemo(() => {
    if (vehicleData) {
        return vehicleData;
    }
    return defaultVehicleData;
  }, [vehicleData]);

  const updateVehicle = useCallback(async (data: Omit<VehicleData, 'id'>) => {
    try {
        // Se o veículo já existe, passamos o ID para a mutação
        const vehicleId = vehicleData?.id;
        await upsertVehicle({ ...data, vehicleId });
    } catch (e) {
        // Erro já tratado na mutação
    }
  }, [upsertVehicle, vehicleData]);

  const removeVehicle = useCallback(async () => {
    if (!vehicleData?.id) {
        showError("Nenhum veículo para remover.");
        return;
    }
    try {
        await deleteVehicle(vehicleData.id);
    } catch (e) {
        // Erro já tratado na mutação
    }
  }, [deleteVehicle, vehicleData]);

  return {
    vehicle,
    isLoading,
    isMutating,
    updateVehicle,
    removeVehicle,
  };
};