import { supabase } from '@/integrations/supabase/client';
import { FuelingRecord, FuelingRecordInsert } from '@/types/fueling';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError } from '@/utils/toast';
import { useVehicle } from '@/hooks/useVehicle'; // Importando useVehicle para obter o ID ativo

const FUELING_RECORDS_KEY = 'fueling_records';

// --- Helpers de Conversão ---

// Converte do formato do DB (snake_case) para o formato do Frontend (camelCase)
const fromDb = (record: any): FuelingRecord => ({
  id: record.id,
  date: record.date,
  mileage: record.mileage,
  fuelType: record.fuel_type,
  volumeLiters: parseFloat(record.volume_liters),
  costPerLiter: parseFloat(record.cost_per_liter),
  totalCost: parseFloat(record.total_cost),
  station: record.station,
  vehicleId: record.vehicle_id, // Novo campo
});

// Converte do formato do Frontend (camelCase) para o formato de Inserção/Atualização do DB (snake_case)
const toDbInsert = (record: Omit<FuelingRecord, 'id'>, userId: string, vehicleId: string): FuelingRecordInsert => ({
  user_id: userId,
  vehicle_id: vehicleId, // Novo campo
  date: record.date,
  mileage: record.mileage,
  fuel_type: record.fuelType,
  volume_liters: record.volumeLiters,
  cost_per_liter: record.costPerLiter,
  total_cost: record.totalCost,
  station: record.station,
});

// --- Funções de Busca ---

const fetchFuelingRecords = async (userId: string, vehicleId: string): Promise<FuelingRecord[]> => {
  const { data, error } = await supabase
    .from('fueling_records')
    .select('*')
    .eq('user_id', userId)
    .eq('vehicle_id', vehicleId) // Filtrando por veículo
    .order('mileage', { ascending: false }) // Ordena por KM para facilitar o cálculo de eficiência
    .order('date', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data.map(fromDb);
};

// --- Hooks de Query e Mutação ---

export const useFuelingRecordsQuery = () => {
  const { user } = useSession();
  const { vehicle } = useVehicle(); // Obtém o veículo ativo
  const userId = user?.id;
  const vehicleId = vehicle.id;

  return useQuery<FuelingRecord[], Error>({
    queryKey: [FUELING_RECORDS_KEY, userId, vehicleId], // Adiciona vehicleId à chave
    queryFn: () => {
      if (!userId || !vehicleId) return Promise.resolve([]);
      return fetchFuelingRecords(userId, vehicleId);
    },
    enabled: !!userId && !!vehicleId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useFuelingMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const { vehicle } = useVehicle(); // Obtém o veículo ativo
  const userId = user?.id;
  const vehicleId = vehicle.id;

  const invalidateQuery = () => {
    queryClient.invalidateQueries({ queryKey: [FUELING_RECORDS_KEY, userId, vehicleId] });
  };

  const addRecordMutation = useMutation<FuelingRecord, Error, Omit<FuelingRecord, 'id'>>({
    mutationFn: async (record) => {
      if (!userId || !vehicleId) throw new Error('User or Vehicle not authenticated/selected.');
      const dbRecord = toDbInsert(record, userId, vehicleId);
      
      const { data, error } = await supabase
        .from('fueling_records')
        .insert(dbRecord)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return fromDb(data);
    },
    onSuccess: invalidateQuery,
    onError: (error) => showError(`Erro ao adicionar abastecimento: ${error.message}`),
  });

  const updateRecordMutation = useMutation<FuelingRecord, Error, FuelingRecord>({
    mutationFn: async (record) => {
      if (!userId || !vehicleId) throw new Error('User or Vehicle not authenticated/selected.');
      // Note: toDbInsert é usado aqui, mas precisamos garantir que o ID do veículo seja mantido
      const dbRecord = {
          ...toDbInsert(record, userId, vehicleId),
          vehicle_id: vehicleId, // Garante que o vehicle_id está no update payload
      };
      
      const { data, error } = await supabase
        .from('fueling_records')
        .update(dbRecord)
        .eq('id', record.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return fromDb(data);
    },
    onSuccess: invalidateQuery,
    onError: (error) => showError(`Erro ao atualizar abastecimento: ${error.message}`),
  });

  const deleteRecordMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (!userId || !vehicleId) throw new Error('User or Vehicle not authenticated/selected.');
      
      const { error } = await supabase
        .from('fueling_records')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .eq('vehicle_id', vehicleId); // Segurança extra

      if (error) throw new Error(error.message);
    },
    onSuccess: invalidateQuery,
    onError: (error) => showError(`Erro ao deletar abastecimento: ${error.message}`),
  });

  return {
    addRecord: addRecordMutation.mutateAsync,
    updateRecord: updateRecordMutation.mutateAsync,
    deleteRecord: deleteRecordMutation.mutateAsync,
    isMutating: addRecordMutation.isPending || updateRecordMutation.isPending || deleteRecordMutation.isPending,
  };
};