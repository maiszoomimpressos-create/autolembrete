import { useCallback, useMemo } from 'react';
import { useVehicleQuery, useVehicleMutations } from '@/integrations/supabase/vehicle';
import { showError } from '@/utils/toast';
import { useActiveVehicle } from './useActiveVehicle'; // Importando o novo hook

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
  // useVehicleQuery agora retorna uma lista de veículos
  const { data: vehicles = [], isLoading } = useVehicleQuery();
  const { upsertVehicle, deleteVehicle, isMutating } = useVehicleMutations();
  const { activeVehicleId, setActiveVehicle, isLoadingActiveVehicle } = useActiveVehicle();

  // Encontra o veículo ativo
  const activeVehicle = useMemo(() => {
    if (isLoadingActiveVehicle) return defaultVehicleData;
    
    const foundVehicle = vehicles.find(v => v.id === activeVehicleId);
    
    // Se o veículo ativo não for encontrado (ex: foi deletado ou ID inválido), 
    // tentamos usar o primeiro veículo da lista.
    if (!foundVehicle && vehicles.length > 0) {
        setActiveVehicle(vehicles[0].id);
        return vehicles[0];
    }
    
    return foundVehicle || defaultVehicleData;
  }, [vehicles, activeVehicleId, isLoadingActiveVehicle, setActiveVehicle]);

  const updateVehicle = useCallback(async (data: Omit<VehicleData, 'id'>) => {
    try {
        // Se o veículo ativo tiver um ID, atualizamos. Se não, inserimos.
        const vehicleId = activeVehicle.id !== '' ? activeVehicle.id : undefined;
        await upsertVehicle({ ...data, vehicleId });
    } catch (e) {
        // Erro já tratado na mutação
    }
  }, [upsertVehicle, activeVehicle]);

  const removeVehicle = useCallback(async () => {
    if (activeVehicle.id === '') {
        showError("Nenhum veículo para remover.");
        return;
    }
    try {
        await deleteVehicle(activeVehicle.id);
        // Após remover, o useActiveVehicle cuidará de selecionar o próximo ou limpar o estado.
    } catch (e) {
        // Erro já tratado na mutação
    }
  }, [deleteVehicle, activeVehicle]);

  return {
    vehicle: activeVehicle, // O veículo atualmente ativo
    vehicles, // Lista de todos os veículos
    isLoading: isLoading || isLoadingActiveVehicle,
    isMutating,
    updateVehicle,
    removeVehicle,
    setActiveVehicle, // Expondo a função para mudar o veículo ativo
  };
};