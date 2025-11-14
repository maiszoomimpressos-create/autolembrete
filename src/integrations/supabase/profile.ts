import { supabase } from '@/integrations/supabase/client';
import { ProfileData, ProfileUpdate } from '@/types/profile';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { showError, showSuccess } from '@/utils/toast';

const PROFILE_KEY = 'profile';

// --- Helpers de Conversão ---

const fromDb = (record: any): ProfileData => ({
  id: record.id,
  firstName: record.first_name,
  lastName: record.last_name,
  avatarUrl: record.avatar_url,
});

const toDbUpdate = (record: Omit<ProfileData, 'id'>): ProfileUpdate => ({
  first_name: record.firstName,
  last_name: record.lastName,
  avatar_url: record.avatarUrl,
});

// --- Funções de Busca ---

const fetchProfile = async (userId: string): Promise<ProfileData | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
    throw new Error(error.message);
  }
  
  return data ? fromDb(data) : null;
};

// --- Hooks de Query e Mutação ---

export const useProfileQuery = () => {
  const { user } = useSession();
  const userId = user?.id;

  return useQuery<ProfileData | null, Error>({
    queryKey: [PROFILE_KEY, userId],
    queryFn: () => {
      if (!userId) return Promise.resolve(null);
      return fetchProfile(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useProfileMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const userId = user?.id;

  const invalidateQuery = () => {
    queryClient.invalidateQueries({ queryKey: [PROFILE_KEY, userId] });
  };

  const updateProfileMutation = useMutation<ProfileData, Error, Omit<ProfileData, 'id'>>({
    mutationFn: async (profileData) => {
      if (!userId) throw new Error('User not authenticated.');
      
      const dbUpdate = toDbUpdate(profileData);
      
      const { data, error } = await supabase
        .from('profiles')
        .update(dbUpdate)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return fromDb(data);
    },
    onSuccess: () => {
        invalidateQuery();
        showSuccess('Perfil atualizado com sucesso!');
    },
    onError: (error) => showError(`Erro ao atualizar perfil: ${error.message}`),
  });

  return {
    updateProfile: updateProfileMutation.mutateAsync,
    isMutating: updateProfileMutation.isPending,
  };
};