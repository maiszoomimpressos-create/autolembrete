import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError, showSuccess } from '@/utils/toast';

export interface ServiceType {
  id: string;
  name: string;
  description: string | null;
}

const SERVICE_TYPES_KEY = 'service_types';

// --- Helpers de Conversão ---

const fromDb = (record: any): ServiceType => ({
  id: record.id,
  name: record.name,
  description: record.description,
});

// --- Funções de Busca ---

const fetchServiceTypes = async (): Promise<ServiceType[]> => {
  const { data, error } = await supabase
    .from('service_types')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data.map(fromDb);
};

// --- Hooks de Query e Mutação ---

export const useServiceTypesQuery = () => {
  const { user } = useSession();
  const userId = user?.id;

  return useQuery<ServiceType[], Error>({
    queryKey: [SERVICE_TYPES_KEY, userId],
    queryFn: fetchServiceTypes,
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useServiceTypeMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const userId = user?.id;

  const invalidateQuery = () => {
    queryClient.invalidateQueries({ queryKey: [SERVICE_TYPES_KEY, userId] });
  };

  const addTypeMutation = useMutation<ServiceType, Error, Omit<ServiceType, 'id'>>({
    mutationFn: async (typeData) => {
      if (!userId) throw new Error('User not authenticated.');
      
      const { data, error } = await supabase
        .from('service_types')
        .insert({ name: typeData.name, description: typeData.description })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return fromDb(data);
    },
    onSuccess: () => {
        invalidateQuery();
        showSuccess('Tipo de serviço adicionado com sucesso!');
    },
    onError: (error) => showError(`Erro ao adicionar tipo de serviço: ${error.message}`),
  });

  const deleteTypeMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (!userId) throw new Error('User not authenticated.');
      
      const { error } = await supabase
        .from('service_types')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
        invalidateQuery();
        showSuccess('Tipo de serviço removido com sucesso.');
    },
    onError: (error) => showError(`Erro ao remover tipo de serviço: ${error.message}`),
  });

  return {
    addType: addTypeMutation.mutateAsync,
    deleteType: deleteTypeMutation.mutateAsync,
    isMutating: addTypeMutation.isPending || deleteTypeMutation.isPending,
  };
};