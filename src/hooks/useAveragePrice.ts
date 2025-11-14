import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/SessionContextProvider';
import { showError } from '@/utils/toast';

interface AveragePriceParams {
  fuelType: string;
  stationName?: string;
}

const fetchAveragePrice = async ({ fuelType, stationName }: AveragePriceParams): Promise<number | null> => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !sessionData.session) {
    throw new Error('User not authenticated for Edge Function call.');
  }
  
  // O nome da Edge Function é 'get-average-price'
  const { data, error } = await supabase.functions.invoke('get-average-price', {
    body: { fuelType, stationName },
    headers: {
      Authorization: `Bearer ${sessionData.session.access_token}`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
  
  if (data.error) {
      throw new Error(data.error);
  }

  return data.averagePrice;
};

export const useAveragePriceQuery = (params: AveragePriceParams, enabled: boolean) => {
  const { user } = useSession();
  
  return useQuery<number | null, Error>({
    queryKey: ['average_price', params.fuelType, params.stationName],
    queryFn: () => fetchAveragePrice(params),
    enabled: enabled && !!user && !!params.fuelType,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
        // Não mostramos erro para o usuário, apenas logamos, pois é uma função de sugestão
        console.error("Erro ao buscar preço médio:", error.message);
    }
  });
};