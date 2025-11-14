import React, { useState, useEffect } from 'react';
import { Map, Fuel, Loader2, LocateFixed, TrendingDown, TrendingUp, DollarSign, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { showError } from '@/utils/toast';
import { useNearbyStationsQuery, NearbyStation } from '@/hooks/useNearbyStations';
import { FuelingRecord } from '@/types/fueling';
import { Badge } from '@/components/ui/badge';
import NearbyStationsMap from '@/components/NearbyStationsMap'; // Importação do mapa

// Tipos de combustível disponíveis
const FUEL_TYPES: FuelingRecord['fuelType'][] = ['Gasolina Comum', 'Gasolina Aditivada', 'Etanol', 'Diesel'];

const PriceComparisonPage: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [errorLocation, setErrorLocation] = useState<string | null>(null);
  const [selectedFuelType, setSelectedFuelType] = useState<FuelingRecord['fuelType']>(FUEL_TYPES[0]);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setErrorLocation('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setIsLoadingLocation(true);
    setErrorLocation(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoadingLocation(false);
      },
      (err) => {
        console.error(err);
        setErrorLocation('Permissão de localização negada ou erro ao obter a localização.');
        setIsLoadingLocation(false);
        showError('Não foi possível obter sua localização. Verifique as permissões do navegador.');
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    // Tenta obter a localização ao carregar a página
    getUserLocation();
  }, []);
  
  // Hook para buscar postos próximos
  const { data: nearbyStations = [], isLoading: isLoadingStations } = useNearbyStationsQuery(
    {
      userLat: userLocation?.lat || 0,
      userLng: userLocation?.lng || 0,
      fuelType: selectedFuelType,
    },
    !!userLocation && !!selectedFuelType // Habilita a query apenas se tiver localização e tipo de combustível
  );
  
  // Calcula o preço mais baixo e mais alto entre os postos encontrados
  const priceMetrics = React.useMemo(() => {
    const validPrices = nearbyStations
      .map(s => s.averagePrice)
      .filter((price): price is number => price !== null && price > 0);
      
    if (validPrices.length === 0) {
        return { lowest: null, highest: null };
    }
    
    return {
        lowest: Math.min(...validPrices),
        highest: Math.max(...validPrices),
    };
  }, [nearbyStations]);

  const renderStationList = () => {
    if (!userLocation) {
      return (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 border border-dashed rounded-lg dark:border-gray-700">
          <LocateFixed className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-semibold">Aguardando sua localização...</p>
          <p className="text-sm mt-2">Permita o acesso à geolocalização para ver os postos próximos.</p>
        </div>
      );
    }
      
    if (isLoadingStations) {
      return (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
          <p className="mt-4">Buscando postos próximos e preços médios...</p>
        </div>
      );
    }
    
    if (nearbyStations.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 border border-dashed rounded-lg dark:border-gray-700">
          <Fuel className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-semibold">Nenhum posto encontrado num raio de 5 km.</p>
          <p className="text-sm mt-2">Tente mudar o tipo de combustível ou adicione mais registros de abastecimento na sua região.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {/* Cartões de Métrica de Preço */}
        <div className="grid grid-cols-2 gap-4">
            <Card className="dark:bg-gray-900 dark:border-gray-700">
                <CardHeader className="p-3 pb-0">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Preço Mais Baixo</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                    <div className="text-xl font-bold text-green-600 dark:text-green-400 flex items-center">
                        <TrendingDown className="w-5 h-5 mr-1" />
                        {priceMetrics.lowest !== null 
                            ? priceMetrics.lowest.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                            : 'N/A'}
                    </div>
                </CardContent>
            </Card>
            <Card className="dark:bg-gray-900 dark:border-gray-700">
                <CardHeader className="p-3 pb-0">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Preço Mais Alto</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                    <div className="text-xl font-bold text-red-600 dark:text-red-400 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-1" />
                        {priceMetrics.highest !== null 
                            ? priceMetrics.highest.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                            : 'N/A'}
                    </div>
                </CardContent>
            </Card>
        </div>
        
        {/* Lista de Postos */}
        <div className="space-y-3">
            {nearbyStations.map((station) => {
                const isLowest = station.averagePrice === priceMetrics.lowest && station.averagePrice !== null;
                const isHighest = station.averagePrice === priceMetrics.highest && station.averagePrice !== null;
                
                return (
                    <div 
                        key={station.id} 
                        className={`p-4 border rounded-lg shadow-sm transition-all ${isLowest ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : isHighest ? 'border-red-500 bg-red-50/50 dark:bg-red-900/10' : 'dark:bg-gray-900 dark:border-gray-700'}`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-lg font-semibold dark:text-white">{station.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {station.city} - {station.state} ({station.distance.toFixed(1)} km)
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">
                                    {station.averagePrice !== null 
                                        ? station.averagePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                                        : 'N/A'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {station.recordCount > 0 ? `Média de ${station.recordCount} registros` : 'Sem dados recentes'}
                                </p>
                            </div>
                        </div>
                        {isLowest && <Badge className="mt-2 bg-green-600 hover:bg-green-700">Melhor Preço</Badge>}
                        {isHighest && <Badge variant="destructive" className="mt-2">Preço Mais Alto</Badge>}
                    </div>
                );
            })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
        <Map className="w-7 h-7 text-blue-600 dark:text-blue-400" />
        <span>Comparação de Preços de Combustível</span>
      </h2>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl dark:text-white flex items-center space-x-2">
            <Fuel className="w-5 h-5 text-blue-500" />
            <span>Configuração de Busca</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tipo de Combustível */}
            <div className="space-y-2">
                <Label htmlFor="fuelType" className="dark:text-gray-300">Combustível</Label>
                <Select
                  value={selectedFuelType}
                  onValueChange={(value) => setSelectedFuelType(value as FuelingRecord['fuelType'])}
                >
                  <SelectTrigger className="dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    {FUEL_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
            
            {/* Localização */}
            <div className="space-y-2">
                <Label htmlFor="location" className="dark:text-gray-300">Localização Atual</Label>
                <Button 
                    onClick={getUserLocation}
                    variant="outline"
                    className="w-full dark:hover:bg-gray-700"
                    disabled={isLoadingLocation}
                >
                    {isLoadingLocation ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : userLocation ? (
                        <Check className="w-4 h-4 mr-2 text-green-500" />
                    ) : (
                        <LocateFixed className="w-4 h-4 mr-2" />
                    )}
                    {userLocation ? 'Localização Obtida' : 'Obter Minha Localização'}
                </Button>
                {errorLocation && (
                    <p className="text-xs text-red-500">{errorLocation}</p>
                )}
            </div>
        </CardContent>
      </Card>
      
      {/* Mapa de Postos Próximos */}
      {userLocation && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
                <CardTitle className="text-xl dark:text-white">Visualização no Mapa</CardTitle>
            </CardHeader>
            <CardContent>
                <NearbyStationsMap 
                    stations={nearbyStations} 
                    userLocation={userLocation} 
                    isLoading={isLoadingStations}
                />
            </CardContent>
        </Card>
      )}

      {/* Lista de Postos Próximos */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl dark:text-white flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span>Resultados (Raio de 5 km)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStationList()}
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceComparisonPage;