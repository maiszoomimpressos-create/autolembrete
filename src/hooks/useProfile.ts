import { useMemo } from 'react';
import { useProfileQuery, useProfileMutations } from '@/integrations/supabase/profile';
import { ProfileData } from '@/types/profile';
import { useSession } from '@/components/SessionContextProvider';

// Dados padrão para o perfil
const defaultProfileData: ProfileData = {
    id: '',
    firstName: null,
    lastName: null,
    avatarUrl: null,
};

export const useProfile = () => {
  const { user } = useSession();
  const { data: profileData, isLoading } = useProfileQuery();
  const { updateProfile, isMutating } = useProfileMutations();

  // Combina dados do Supabase com o email do Auth e valores padrão
  const profile = useMemo(() => {
    const baseProfile = profileData || defaultProfileData;
    
    // Adiciona o email do Auth para fácil acesso
    return {
        ...baseProfile,
        email: user?.email || '',
    };
  }, [profileData, user]);

  return {
    profile,
    isLoading,
    isMutating,
    updateProfile,
  };
};