import { useCallback, useMemo } from 'react';
import { useVehicleMutations } from '@/integrations/supabase/vehicle';
import { showError } from '@/utils/toast';
import { useActiveVehicle } from './useActiveVehicle'; // Novo Import

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
  const { vehicles, activeVehicle, isLoadingVehicles } = useActiveVehicle();
  const { upsertVehicle, deleteVehicle, isMutating } = useVehicleMutations();

  // Combina os dados do Supabase com os valores padrão se não houver registro
  const vehicle = useMemo(() => {
    if (activeVehicle) {
        return activeVehicle;
    }
    return defaultVehicleData;
  }, [activeVehicle]);

  const isLoading = isLoadingVehicles;

  const updateVehicle = useCallback(async (data: Omit<VehicleData, 'id'>) => {
    try {
        // Se o veículo já existe, passamos o ID para a mutação
        const vehicleId = activeVehicle?.id;
        await upsertVehicle({ ...data, vehicleId });
    } catch (e) {
        // Erro já tratado na mutação
    }
  }, [upsertVehicle, activeVehicle]);

  const removeVehicle = useCallback(async () => {
    if (!activeVehicle?.id) {
        showError("Nenhum veículo para remover.");
        return;
    }
    if (vehicles.length > 1) {
        showError("Você deve ter pelo menos um veículo ativo. Por favor, adicione outro veículo antes de remover este.");
        return;
    }
    try {
        await deleteVehicle(activeVehicle.id);
    } catch (e) {
        // Erro já tratado na mutação
    }
  }, [deleteVehicle, activeVehicle, vehicles.length]);

  return {
    vehicle,
    vehicles, // Retorna a lista completa
    isLoading,
    isMutating,
    updateVehicle,
    removeVehicle,
  };
};