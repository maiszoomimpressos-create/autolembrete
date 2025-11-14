import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Gauge, Calendar, Edit } from 'lucide-react';

const VehicleSummary: React.FC = () => {
  // Dados simulados do veículo
  const vehicle = {
    name: "Toyota Corolla",
    year: 2020,
    plate: "ABC-1234",
    mileage: 45200,
    lastService: "2024-05-10",
  };

  return (
    <Card className="col-span-full lg:col-span-2 dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold flex items-center space-x-2 dark:text-white">
          <Car className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span>Veículo Principal</span>
        </CardTitle>
        <Button variant="outline" size="sm" className="dark:hover:bg-gray-700">
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Button>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Modelo</p>
          <p className="text-lg font-bold dark:text-white">{vehicle.name} ({vehicle.year})</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Placa</p>
          <p className="text-lg font-bold dark:text-white">{vehicle.plate}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Quilometragem Atual</p>
          <p className="text-lg font-bold flex items-center dark:text-white">
            <Gauge className="w-4 h-4 mr-2 text-blue-500" />
            {vehicle.mileage.toLocaleString('pt-BR')} km
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Última manutenção registrada: {vehicle.lastService}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleSummary;