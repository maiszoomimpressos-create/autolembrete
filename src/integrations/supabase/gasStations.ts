import { supabase } from '@/integrations/supabase/client';
import { GasStation, GasStationInsert } from '@/types/gasStation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError, showSuccess } from '@/utils/toast';

const GAS_STATIONS_KEY = 'gas_stations';

// --- Helpers de Conversão ---

const fromDb = (record: any): GasStation => ({
  id: record.id,
  name: record.name,
  city: record.city,
  state: record.state,
});

// --- Funções de Busca ---

const fetchGasStations = async (): Promise<GasStation[]> => {
  const { data, error } = await supabase
    .from('gas_stations')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data.map(fromDb);
};

// --- Hooks de Query e Mutação ---

export const useGasStationsQuery = () => {
  const { user } = useSession();
  const userId = user?.id;

  return useQuery<GasStation[], Error>({
    queryKey: [GAS_STATIONS_KEY], // Não depende do userId, pois é leitura pública
    queryFn: fetchGasStations,
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useGasStationMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const userId = user?.id;

  const invalidateQuery = () => {
    queryClient.invalidateQueries({ queryKey: [GAS_STATIONS_KEY] });
  };

  const addStationMutation = useMutation<GasStation, Error, Omit<GasStation, 'id'>>({
    mutationFn: async (stationData) => {
      if (!userId) throw new Error('User not authenticated.');
      
      const dbInsert: GasStationInsert = {
          name: stationData.name,
          city: stationData.city || null,
          state: stationData.state || null,
          added_by: userId,
      };
      
      const { data, error } = await supabase
        .from('gas_stations')
        .insert(dbInsert)
        .select()
        .single();

      if (error) {
          // Tratar erro de unicidade
          if (error.code === '23505') {
              throw new Error('Este posto já foi cadastrado nesta cidade/estado.');
          }
          throw new Error(error.message);
      }
      return fromDb(data);
    },
    onSuccess: (newStation) => {
        invalidateQuery();
        showSuccess(`Posto "${newStation.name}" adicionado com sucesso!`);
    },
    onError: (error) => showError(`Erro ao adicionar posto: ${error.message}`),
  });

  return {
    addStation: addStationMutation.mutateAsync,
    isMutating: addStationMutation.isPending,
  };
};