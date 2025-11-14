import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  // 1. Autenticação (Obrigatória para acessar dados de usuários)
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
  const { fuelType, stationName } = await req.json();

  if (!fuelType) {
    return new Response(JSON.stringify({ error: 'Missing fuelType parameter' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    // 3. Construir a query base
    let query = supabaseClient
      .from('fueling_records')
      .select('cost_per_liter')
      .eq('fuel_type', fuelType)
      .order('date', { ascending: false })
      .limit(50); // Limita aos 50 registros mais recentes para performance

    // 4. Adicionar filtro de posto, se fornecido
    if (stationName) {
      query = query.eq('station', stationName);
    }
    
    // 5. Executar a consulta
    const { data, error } = await query;

    if (error) throw error;

    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ averagePrice: null }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 6. Calcular a média
    const totalCost = data.reduce((sum, record) => sum + parseFloat(record.cost_per_liter), 0);
    const averagePrice = totalCost / data.length;

    return new Response(JSON.stringify({ averagePrice: parseFloat(averagePrice.toFixed(2)) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching average price:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})