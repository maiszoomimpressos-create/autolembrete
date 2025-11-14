import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Settings } from 'lucide-react';

const ServiceTypesPage: React.FC = () => {
  return (
    <Card className="shadow-none border-none dark:bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl dark:text-white flex items-center space-x-2">
            <Wrench className="w-6 h-6 text-red-600 dark:text-red-400" />
            <span>Cadastrar Tipos de Serviço</span>
        </CardTitle>
        <CardDescription className="dark:text-gray-400">
          Gerencie os tipos de manutenção personalizados que aparecem no formulário de Manutenção.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex items-center justify-center h-48 bg-gray-50 border border-dashed rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <Settings className="w-6 h-6 mx-auto mb-2" />
            <p>Funcionalidade de CRUD para tipos de serviço será implementada aqui.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceTypesPage;