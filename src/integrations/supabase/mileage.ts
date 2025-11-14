import { supabase } from '@/integrations/supabase/client';
import { MileageRecord, MileageRecordInsert } from '@/types/mileage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError, showSuccess } from '@/utils/toast';

const MILEAGE_RECORDS_KEY = 'mileage_records';

// --- Helpers de Conversão ---

// Converte do formato do DB (snake_case) para o formato do Frontend (camelCase)
const fromDb = (record: any): MileageRecord => ({
  id: record.id,
  date: record.date,
  mileage: record.mileage,
  source: record.source as 'Manual',
});

// Converte para o formato de Inserção do DB (snake_case)
const toDbInsert = (date: string, mileage: number, userId: string): MileageRecordInsert => ({
  user_id: userId,
  date: date,
  mileage: mileage,
  source: 'Manual',
});

// --- Funções de Busca ---

const fetchManualMileageRecords = async (userId: string): Promise<MileageRecord[]> => {
  const { data, error } = await supabase
    .from('mileage_records')
    .select('*')
    .eq('user_id', userId)
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
  const userId = user?.id;

  return useQuery<MileageRecord[], Error>({
    queryKey: [MILEAGE_RECORDS_KEY, userId],
    queryFn: () => {
      if (!userId) return Promise.resolve([]);
      return fetchManualMileageRecords(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useMileageMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const userId = user?.id;

  const invalidateQuery = () => {
    queryClient.invalidateQueries({ queryKey: [MILEAGE_RECORDS_KEY, userId] });
    // Também invalida queries de abastecimento e manutenção, pois o KM atual pode afetá-las
    queryClient.invalidateQueries({ queryKey: ['fueling_records', userId] });
    queryClient.invalidateQueries({ queryKey: ['maintenance_records', userId] });
  };

  const addRecordMutation = useMutation<MileageRecord, Error, { date: string, mileage: number }>({
    mutationFn: async ({ date, mileage }) => {
      if (!userId) throw new Error('User not authenticated.');
      const dbRecord = toDbInsert(date, mileage, userId);
      
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
  
  const deleteRecordMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (!userId) throw new Error('User not authenticated.');
      
      const { error } = await supabase
        .from('mileage_records')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
        invalidateQuery();
        showSuccess('Registro de quilometragem manual deletado.');
    },
    onError: (error) => showError(`Erro ao deletar KM: ${error.message}`),
  });

  return {
    addManualRecord: addRecordMutation.mutateAsync,
    deleteManualRecord: deleteRecordMutation.mutateAsync,
    isMutating: addRecordMutation.isPending || deleteRecordMutation.isPending,
  };
};