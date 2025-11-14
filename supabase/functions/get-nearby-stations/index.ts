import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Raio de busca em quilômetros (5 km)
const SEARCH_RADIUS_KM = 5; 

// Função Haversine para calcular a distância entre dois pontos (em km)
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  // 1. Autenticação
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response('Unauthorized', { 
      status: 401, 
      headers: corsHeaders 
    })
  }
  
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: { headers: { Authorization: authHeader } },
    }
  )
  
  // 2. Obter parâmetros
  const { userLat, userLng, fuelType } = await req.json();

  if (!userLat || !userLng || !fuelType) {
    return new Response(JSON.stringify({ error: 'Missing required parameters (userLat, userLng, fuelType)' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    // 3. Buscar todos os postos com coordenadas
    const { data: stationsData, error: stationsError } = await supabaseClient
      .from('gas_stations')
      .select('id, name, latitude, longitude, city, state')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    if (stationsError) throw stationsError;

    // 4. Filtrar postos próximos usando Haversine
    const nearbyStations = stationsData
      .map(station => {
        const distance = haversine(userLat, userLng, station.latitude, station.longitude);
        return { ...station, distance };
      })
      .filter(station => station.distance <= SEARCH_RADIUS_KM)
      .sort((a, b) => a.distance - b.distance); // Ordenar por distância

    if (nearbyStations.length === 0) {
        return new Response(JSON.stringify({ stations: [] }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    // 5. Para cada posto próximo, buscar o preço médio recente
    const stationPrices = await Promise.all(nearbyStations.map(async (station) => {
        const { data: fuelingData, error: fuelingError } = await supabaseClient
            .from('fueling_records')
            .select('cost_per_liter')
            .eq('station', station.name)
            .eq('fuel_type', fuelType)
            .order('date', { ascending: false })
            .limit(10); // Limita a 10 registros recentes por posto

        if (fuelingError) {
            console.error(`Error fetching price for ${station.name}:`, fuelingError);
            return { ...station, averagePrice: null, recordCount: 0 };
        }
        
        let averagePrice = null;
        if (fuelingData && fuelingData.length > 0) {
            const totalCost = fuelingData.reduce((sum, record) => sum + parseFloat(record.cost_per_liter), 0);
            averagePrice = parseFloat((totalCost / fuelingData.length).toFixed(2));
        }

        return { 
            ...station, 
            averagePrice, 
            recordCount: fuelingData?.length || 0 
        };
    }));

    // 6. Retornar a lista de postos com preços médios
    return new Response(JSON.stringify({ stations: stationPrices }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching nearby stations:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})