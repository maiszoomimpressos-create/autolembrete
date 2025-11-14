import React from 'react';
import { History, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MaintenanceTable from '@/components/MaintenanceTable';
import { MaintenanceRecord } from '@/types/maintenance';
import { useMaintenanceRecords } from '@/hooks/useMaintenanceRecords';

const HistoryPage: React.FC = () => {
  const { records } = useMaintenanceRecords();
  
  // Filtrando apenas os registros concluídos para o histórico
  const historicalRecords: MaintenanceRecord[] = records.filter(r => r.status === 'Concluído');

  // Funções de edição e exclusão vazias, pois o histórico é geralmente somente leitura
  const handleEdit = () => {};
  const handleDelete = () => {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
          <History className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <span>Histórico de Manutenções Concluídas</span>
        </h2>
        <Button variant="outline" className="dark:hover:bg-gray-700">
          <Filter className="w-4 h-4 mr-2" />
          Filtrar
        </Button>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg dark:text-white">Registros Passados</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Reutilizando MaintenanceTable, mas sem funcionalidade de edição/exclusão real aqui */}
          <MaintenanceTable records={historicalRecords} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryPage;