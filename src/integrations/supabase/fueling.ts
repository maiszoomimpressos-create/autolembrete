import { supabase } from '@/integrations/supabase/client';
import { FuelingRecord, FuelingRecordInsert } from '@/types/fueling';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError } from '@/utils/toast';

const FUELING_RECORDS_KEY = 'fueling_records';
const MILEAGE_RECORDS_KEY = 'mileage_records'; // Adicionado

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
  vehicleId: record.vehicle_id, // Adicionado
});

// Converte do formato do Frontend (camelCase) para o formato de Inserção/Atualização do DB (snake_case)
const toDbInsert = (record: Omit<FuelingRecord, 'id'>, userId: string): FuelingRecordInsert => ({
  user_id: userId,
  date: record.date,
  mileage: record.mileage,
  fuel_type: record.fuelType,
  volume_liters: record.volumeLiters,
  cost_per_liter: record.costPerLiter,
  total_cost: record.totalCost,
  station: record.station,
  vehicle_id: record.vehicleId, // Adicionado
});

// --- Funções de Busca ---

const fetchFuelingRecords = async (userId: string): Promise<FuelingRecord[]> => {
  const { data, error } = await supabase
    .from('fueling_records')
    .select('*')
    .eq('user_id', userId)
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
  const userId = user?.id;

  return useQuery<FuelingRecord[], Error>({
    queryKey: [FUELING_RECORDS_KEY, userId],
    queryFn: () => {
      if (!userId) return Promise.resolve([]);
      return fetchFuelingRecords(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useFuelingMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const userId = user?.id;

  const invalidateQuery = () => {
    queryClient.invalidateQueries({ queryKey: [FUELING_RECORDS_KEY, userId] });
    // Invalida queries de quilometragem para recalcular o KM atual
    queryClient.invalidateQueries({ queryKey: [MILEAGE_RECORDS_KEY, userId] });
  };

  const addRecordMutation = useMutation<FuelingRecord, Error, Omit<FuelingRecord, 'id'>>({
    mutationFn: async (record) => {
      if (!userId) throw new Error('User not authenticated.');
      const dbRecord = toDbInsert(record, userId);
      
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
      if (!userId) throw new Error('User not authenticated.');
      const dbRecord = toDbInsert(record, userId);
      
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
      if (!userId) throw new Error('User not authenticated.');
      
      const { error } = await supabase
        .from('fueling_records')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

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