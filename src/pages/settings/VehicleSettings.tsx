import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const VehicleSettings: React.FC = () => {
  return (
    <Card className="shadow-none border-none dark:bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl dark:text-white">Configurações do Veículo</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Gerencie os detalhes do seu veículo principal.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="model">Modelo</Label>
            <Input id="model" defaultValue="Toyota Corolla" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Ano</Label>
            <Input id="year" type="number" defaultValue={2020} className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plate">Placa</Label>
            <Input id="plate" defaultValue="ABC-1234" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mileage">Quilometragem Atual (km)</Label>
            <Input id="mileage" type="number" defaultValue={45200} className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
          Salvar Detalhes do Veículo
        </Button>
        
        <Separator className="dark:bg-gray-700" />

        <div className="space-y-2">
          <h3 className="text-lg font-semibold dark:text-white">Remover Veículo</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Esta ação é permanente e removerá todos os registros de manutenção associados.
          </p>
          <Button variant="destructive">
            Remover Veículo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleSettings;