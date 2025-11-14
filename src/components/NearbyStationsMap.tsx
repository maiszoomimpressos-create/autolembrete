import React, { useMemo, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, LoadScript, InfoWindow } from '@react-google-maps/api';
import { NearbyStation } from '@/hooks/useNearbyStations';
import { Loader2, Fuel } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NearbyStationsMapProps {
  stations: NearbyStation[];
  userLocation: { lat: number; lng: number };
  isLoading: boolean;
  selectedStationId: string | null; // Novo prop
}

// Define as bibliotecas que o Google Maps deve carregar (opcional, mas bom para o futuro)
const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];

const NearbyStationsMap: React.FC<NearbyStationsMapProps> = ({ stations, userLocation, isLoading, selectedStationId }) => {
  const [activeMarker, setActiveMarker] = React.useState<string | null>(null);
  const [map, setMap] = React.useState<google.maps.GoogleMap | null>(null);
  
  // Memoiza o centro do mapa para evitar recargas desnecessárias
  const center = useMemo(() => userLocation, [userLocation]);

  // Efeito para centralizar o mapa e abrir o InfoWindow quando um posto é selecionado externamente
  useEffect(() => {
    if (selectedStationId) {
      const station = stations.find(s => s.id === selectedStationId);
      if (station && station.latitude && station.longitude && map) {
        const position = { lat: station.latitude, lng: station.longitude };
        map.panTo(position);
        map.setZoom(15); // Zoom in para o posto
        setActiveMarker(selectedStationId);
      }
    }
  }, [selectedStationId, stations, map]);

  // Estilos do container do mapa
  const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem',
  };
  
  // Obtém a chave da API do Google Maps
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
      return (
          <div className="text-center py-12 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/10 dark:border-red-900">
              <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                  Chave da API do Google Maps Ausente
              </p>
              <p className="text-sm mt-2 text-red-500 dark:text-red-300">
                  Por favor, preencha a variável VITE_GOOGLE_MAPS_API_KEY no arquivo .env.
              </p>
          </div>
      );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13} // Zoom padrão para ver postos em um raio de 5km
        onLoad={setMap} // Salva a instância do mapa
        options={{
            disableDefaultUI: true,
            zoomControl: true,
            styles: [
                // Estilo simples para o mapa (pode ser customizado para dark mode)
                {
                    featureType: "poi",
                    stylers: [{ visibility: "off" }]
                },
                {
                    featureType: "transit",
                    stylers: [{ visibility: "off" }]
                }
            ]
        }}
      >
        {/* Marcador da Localização do Usuário */}
        <Marker 
            position={userLocation} 
            icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#3b82f6", // blue-500
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#ffffff",
            }}
            title="Sua Localização"
        />

        {/* Marcadores dos Postos de Gasolina */}
        {stations.map((station) => {
          if (!station.latitude || !station.longitude) return null;
          
          const position = { lat: station.latitude, lng: station.longitude };
          
          const isLowest = station.averagePrice !== null && stations.every(s => s.averagePrice === null || s.averagePrice >= station.averagePrice);
          
          return (
            <Marker
              key={station.id}
              position={position}
              onClick={() => setActiveMarker(station.id)}
              icon={{
                // Usando um ícone de pino padrão do Google Maps
                path: google.maps.SymbolPath.PIN, 
                scale: 0, // Define a escala como 0 para usar o ícone padrão do pino
                fillColor: isLowest ? "#10b981" : "#f59e0b", // green-500 ou amber-500
                fillOpacity: 1,
                strokeWeight: 0,
                labelOrigin: new google.maps.Point(0, -10), // Ajusta a origem do label
              }}
              label={{
                  text: '⛽', // Ícone de bomba de gasolina como label
                  fontSize: '18px',
                  color: isLowest ? "#10b981" : "#f59e0b",
              }}
            >
              {(activeMarker === station.id || selectedStationId === station.id) && (
                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                  <div className="p-2 max-w-xs dark:text-gray-900">
                    <h3 className="font-bold text-base">{station.name}</h3>
                    <p className="text-sm text-gray-600">{station.city} - {station.state}</p>
                    <p className="text-xs text-gray-500 mt-1">Distância: {station.distance.toFixed(1)} km</p>
                    <p className={cn("text-md font-semibold mt-1", isLowest ? 'text-green-600' : 'text-gray-800')}>
                        Preço Médio: {station.averagePrice !== null 
                            ? station.averagePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                            : 'Sem dados'}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          );
        })}
        
        {/* Indicador de Carregamento */}
        {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 z-10">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
            </div>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default NearbyStationsMap;