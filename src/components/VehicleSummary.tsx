import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Gauge, Calendar, Edit, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVehicle } from '@/hooks/useVehicle';

interface VehicleSummaryProps {
  currentMileage: number;
  lastServiceDate: string | null;
}

const VehicleSummary: React.FC<VehicleSummaryProps> = ({ currentMileage, lastServiceDate }) => {
  const navigate = useNavigate();
  const { vehicle, isLoading } = useVehicle();

  const handleEditClick = () => {
    navigate('/settings/vehicle');
  };
  
  const formattedLastService = lastServiceDate 
    ? new Date(lastServiceDate).toLocaleDateString('pt-BR')
    : 'N/A';
    
  if (isLoading) {
    return (
      <Card className="col-span-full lg:col-span-2 dark:bg-gray-800 dark:border-gray-700 p-6 flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
        <p className="ml-2 dark:text-white">Carregando veículo...</p>
      </Card>
    );
  }

  return (
    <Card className="col-span-full lg:col-span-2 dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold flex items-center space-x-2 dark:text-white">
          <Car className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span>Veículo Principal</span>
        </CardTitle>
        <Button variant="outline" size="sm" className="dark:hover:bg-gray-700" onClick={handleEditClick}>
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Button>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Modelo</p>
          <p className="text-lg font-bold dark:text-white">{vehicle.model} ({vehicle.year})</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Placa</p>
          <p className="text-lg font-bold dark:text-white">{vehicle.plate}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Quilometragem Atual</p>
          <p className="text-lg font-bold flex items-center dark:text-white">
            <Gauge className="w-4 h-4 mr-2 text-blue-500" />
            {currentMileage.toLocaleString('pt-BR')} km
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Última manutenção registrada: {formattedLastService}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleSummary;