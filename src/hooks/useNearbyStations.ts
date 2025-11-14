import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/SessionContextProvider';
import { GasStation } from '@/types/gasStation';

export interface NearbyStation extends GasStation {
  distance: number; // Distância em km
  averagePrice: number | null;
  recordCount: number; // Quantidade de registros usados para calcular o preço
}

interface NearbyStationsParams {
  userLat: number;
  userLng: number;
  fuelType: string;
}

const fetchNearbyStations = async (params: NearbyStationsParams): Promise<NearbyStation[]> => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !sessionData.session) {
    throw new Error('User not authenticated for Edge Function call.');
  }
  
  const { data, error } = await supabase.functions.invoke('get-nearby-stations', {
    body: params,
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

  return data.stations || [];
};

export const useNearbyStationsQuery = (params: NearbyStationsParams, enabled: boolean) => {
  const { user } = useSession();
  
  return useQuery<NearbyStation[], Error>({
    queryKey: ['nearby_stations', params.userLat, params.userLng, params.fuelType],
    queryFn: () => fetchNearbyStations(params),
    enabled: enabled && !!user && !!params.fuelType && !!params.userLat && !!params.userLng,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};