import { supabase } from '@/integrations/supabase/client';
import { VehicleData, VehicleDataInsert } from '@/types/vehicle';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError, showSuccess } from '@/utils/toast';

const VEHICLE_KEY = 'vehicle';

// --- Helpers de Conversão ---

const fromDb = (record: any): VehicleData => ({
  id: record.id,
  model: record.model,
  year: record.year,
  plate: record.plate,
});

const toDbInsert = (record: Omit<VehicleData, 'id'>, userId: string): VehicleDataInsert => ({
  user_id: userId,
  model: record.model,
  year: record.year,
  plate: record.plate,
});

// --- Funções de Busca ---

// Agora busca TODOS os veículos do usuário
const fetchVehicles = async (userId: string): Promise<VehicleData[]> => {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  
  return data ? data.map(fromDb) : [];
};

// --- Hooks de Query e Mutação ---

export const useVehicleQuery = () => {
  const { user } = useSession();
  const userId = user?.id;

  // Retorna uma lista de VehicleData
  return useQuery<VehicleData[], Error>({
    queryKey: [VEHICLE_KEY, userId],
    queryFn: () => {
      if (!userId) return Promise.resolve([]);
      return fetchVehicles(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useVehicleMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const userId = user?.id;

  const invalidateQuery = () => {
    queryClient.invalidateQueries({ queryKey: [VEHICLE_KEY, userId] });
  };

  const upsertVehicleMutation = useMutation<VehicleData, Error, Omit<VehicleData, 'id'> & { vehicleId?: string }>({
    mutationFn: async (record) => {
      if (!userId) throw new Error('User not authenticated.');
      
      const dbRecord = toDbInsert(record, userId);
      
      let data;
      let error;
      
      if (record.vehicleId) {
        // Atualiza
        ({ data, error } = await supabase
          .from('vehicles')
          .update(dbRecord)
          .eq('id', record.vehicleId)
          .select()
          .single());
      } else {
        // Insere
        ({ data, error } = await supabase
          .from('vehicles')
          .insert(dbRecord)
          .select()
          .single());
      }
          
      if (error) throw new Error(error.message);
      return fromDb(data);
    },
    onSuccess: (newVehicle) => {
        invalidateQuery();
        showSuccess('Detalhes do veículo salvos com sucesso!');
        // Se for uma nova inserção, precisamos garantir que ele se torne o veículo ativo
        if (!newVehicle.id) {
            queryClient.setQueryData([VEHICLE_KEY, userId], (oldData: VehicleData[] = []) => {
                if (!oldData.some(v => v.id === newVehicle.id)) {
                    return [...oldData, newVehicle];
                }
                return oldData;
            });
        }
    },
    onError: (error) => showError(`Erro ao salvar veículo: ${error.message}`),
  });
  
  const deleteVehicleMutation = useMutation<void, Error, string>({
    mutationFn: async (vehicleId) => {
      if (!userId) throw new Error('User not authenticated.');
      
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId)
        .eq('user_id', userId);

      if (error) throw new Error(error.message);
    },
    onSuccess: invalidateQuery,
    onError: (error) => showError(`Erro ao remover veículo: ${error.message}`),
  });

  return {
    upsertVehicle: upsertVehicleMutation.mutateAsync,
    deleteVehicle: deleteVehicleMutation.mutateAsync,
    isMutating: upsertVehicleMutation.isPending || deleteVehicleMutation.isPending,
  };
};