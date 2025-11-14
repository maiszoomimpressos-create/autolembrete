import { supabase } from '@/integrations/supabase/client';
import { MaintenanceRecord, MaintenanceRecordInsert } from '@/types/maintenance';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError } from '@/utils/toast';
import { useVehicle } from '@/hooks/useVehicle'; // Importando useVehicle

const MAINTENANCE_RECORDS_KEY = 'maintenance_records';

// --- Helpers de Conversão ---

// Converte do formato do DB (snake_case) para o formato do Frontend (camelCase)
const fromDb = (record: any): MaintenanceRecord => ({
  id: record.id,
  date: record.date,
  mileage: record.mileage,
  type: record.type,
  customType: record.custom_type,
  description: record.description,
  cost: record.cost,
  status: record.status,
  nextMileage: record.next_mileage,
  nextMileageInterval: record.next_mileage_interval,
  nextDate: record.next_date,
  vehicleId: record.vehicle_id, // Novo campo
});

// Converte do formato do Frontend (camelCase) para o formato de Inserção/Atualização do DB (snake_case)
const toDbInsert = (record: Omit<MaintenanceRecord, 'id'>, userId: string, vehicleId: string): MaintenanceRecordInsert => ({
  user_id: userId,
  vehicle_id: vehicleId, // Novo campo
  date: record.date,
  mileage: record.mileage,
  type: record.type,
  custom_type: record.customType,
  description: record.description,
  cost: record.cost,
  status: record.status,
  next_mileage: record.nextMileage,
  next_mileage_interval: record.nextMileageInterval,
  next_date: record.nextDate,
});

// --- Funções de Busca ---

const fetchMaintenanceRecords = async (userId: string, vehicleId: string): Promise<MaintenanceRecord[]> => {
  const { data, error } = await supabase
    .from('maintenance_records')
    .select('*')
    .eq('user_id', userId)
    .eq('vehicle_id', vehicleId) // Filtrando por veículo
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data.map(fromDb);
};

// --- Hooks de Query e Mutação ---

export const useMaintenanceRecordsQuery = () => {
  const { user } = useSession();
  const { vehicle } = useVehicle(); // Obtém o veículo ativo
  const userId = user?.id;
  const vehicleId = vehicle.id;

  return useQuery<MaintenanceRecord[], Error>({
    queryKey: [MAINTENANCE_RECORDS_KEY, userId, vehicleId], // Adiciona vehicleId à chave
    queryFn: () => {
      if (!userId || !vehicleId) return Promise.resolve([]);
      return fetchMaintenanceRecords(userId, vehicleId);
    },
    enabled: !!userId && !!vehicleId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useMaintenanceMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const { vehicle } = useVehicle(); // Obtém o veículo ativo
  const userId = user?.id;
  const vehicleId = vehicle.id;

  const invalidateQuery = () => {
    queryClient.invalidateQueries({ queryKey: [MAINTENANCE_RECORDS_KEY, userId, vehicleId] });
  };

  const addRecordMutation = useMutation<MaintenanceRecord, Error, Omit<MaintenanceRecord, 'id'>>({
    mutationFn: async (record) => {
      if (!userId || !vehicleId) throw new Error('User or Vehicle not authenticated/selected.');
      const dbRecord = toDbInsert(record, userId, vehicleId);
      
      const { data, error } = await supabase
        .from('maintenance_records')
        .insert(dbRecord)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return fromDb(data);
    },
    onSuccess: invalidateQuery,
    onError: (error) => showError(`Erro ao adicionar manutenção: ${error.message}`),
  });

  const updateRecordMutation = useMutation<MaintenanceRecord, Error, MaintenanceRecord>({
    mutationFn: async (record) => {
      if (!userId || !vehicleId) throw new Error('User or Vehicle not authenticated/selected.');
      
      const dbRecord = {
          ...toDbInsert(record, userId, vehicleId),
          vehicle_id: vehicleId, // Garante que o vehicle_id está no update payload
      };
      
      const { data, error } = await supabase
        .from('maintenance_records')
        .update(dbRecord)
        .eq('id', record.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return fromDb(data);
    },
    onSuccess: invalidateQuery,
    onError: (error) => showError(`Erro ao atualizar manutenção: ${error.message}`),
  });

  const deleteRecordMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (!userId || !vehicleId) throw new Error('User or Vehicle not authenticated/selected.');
      
      const { error } = await supabase
        .from('maintenance_records')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .eq('vehicle_id', vehicleId); // Segurança extra

      if (error) throw new Error(error.message);
    },
    onSuccess: invalidateQuery,
    onError: (error) => showError(`Erro ao deletar manutenção: ${error.message}`),
  });

  return {
    addRecord: addRecordMutation.mutateAsync,
    updateRecord: updateRecordMutation.mutateAsync,
    deleteRecord: deleteRecordMutation.mutateAsync,
    isMutating: addRecordMutation.isPending || updateRecordMutation.isPending || deleteRecordMutation.isPending,
  };
};