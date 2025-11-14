import { supabase } from '@/integrations/supabase/client';
import { MileageRecord, MileageRecordInsert } from '@/types/mileage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError } from '@/utils/toast';
import { useVehicle } from '@/hooks/useVehicle'; // Importando useVehicle

const MILEAGE_RECORDS_KEY = 'mileage_records';

// --- Helpers de Conversão ---

// Converte do formato do DB (snake_case) para o formato do Frontend (camelCase)
const fromDb = (record: any): MileageRecord => ({
  id: record.id,
  date: record.date,
  mileage: record.mileage,
  source: record.source as 'Manual',
  vehicleId: record.vehicle_id, // Novo campo
});

// Converte para o formato de Inserção do DB (snake_case)
const toDbInsert = (date: string, mileage: number, userId: string, vehicleId: string): MileageRecordInsert => ({
  user_id: userId,
  vehicle_id: vehicleId, // Novo campo
  date: date,
  mileage: mileage,
  source: 'Manual',
});

// --- Funções de Busca ---

const fetchManualMileageRecords = async (userId: string, vehicleId: string): Promise<MileageRecord[]> => {
  const { data, error } = await supabase
    .from('mileage_records')
    .select('*')
    .eq('user_id', userId)
    .eq('vehicle_id', vehicleId) // Filtrando por veículo
    .order('date', { ascending: false })
    .order('mileage', { ascending: false }); // Ordena por data e depois por KM

  if (error) {
    throw new Error(error.message);
  }
  return data.map(fromDb);
};

// --- Hooks de Query e Mutação ---

export const useManualMileageRecordsQuery = () => {
  const { user } = useSession();
  const { vehicle } = useVehicle(); // Obtém o veículo ativo
  const userId = user?.id;
  const vehicleId = vehicle.id;

  return useQuery<MileageRecord[], Error>({
    queryKey: [MILEAGE_RECORDS_KEY, userId, vehicleId], // Adiciona vehicleId à chave
    queryFn: () => {
      if (!userId || !vehicleId) return Promise.resolve([]);
      return fetchManualMileageRecords(userId, vehicleId);
    },
    enabled: !!userId && !!vehicleId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useMileageMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const { vehicle } = useVehicle(); // Obtém o veículo ativo
  const userId = user?.id;
  const vehicleId = vehicle.id;

  const invalidateQuery = () => {
    queryClient.invalidateQueries({ queryKey: [MILEAGE_RECORDS_KEY, userId, vehicleId] });
    // Também invalida queries de abastecimento e manutenção, pois o KM atual pode afetá-las
    queryClient.invalidateQueries({ queryKey: ['fueling_records', userId, vehicleId] });
    queryClient.invalidateQueries({ queryKey: ['maintenance_records', userId, vehicleId] });
  };

  const addRecordMutation = useMutation<MileageRecord, Error, { date: string, mileage: number }>({
    mutationFn: async ({ date, mileage }) => {
      if (!userId || !vehicleId) throw new Error('User or Vehicle not authenticated/selected.');
      const dbRecord = toDbInsert(date, mileage, userId, vehicleId);
      
      const { data, error } = await supabase
        .from('mileage_records')
        .insert(dbRecord)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return fromDb(data);
    },
    onSuccess: invalidateQuery,
    onError: (error) => showError(`Erro ao adicionar KM: ${error.message}`),
  });

  return {
    addManualRecord: addRecordMutation.mutateAsync,
    isMutating: addRecordMutation.isPending,
  };
};