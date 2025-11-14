import React from 'react';
import { Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MaintenanceTable from '@/components/MaintenanceTable';
import { MaintenanceRecord } from '@/types/maintenance';
import { useMaintenanceRecords } from '@/hooks/useMaintenanceRecords';

const MaintenanceHistoryTab: React.FC = () => {
  const { records, isLoading } = useMaintenanceRecords();
  
  // Filtrando apenas os registros concluídos para o histórico
  const historicalRecords: MaintenanceRecord[] = records.filter(r => r.status === 'Concluído');

  // Funções de edição e exclusão vazias, pois o histórico é geralmente somente leitura
  const handleEdit = () => {};
  const handleDelete = () => {};
  const handleComplete = () => {}; // Não deve ser possível completar no histórico

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
        <p className="mt-4">Carregando histórico de manutenções...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" className="dark:hover:bg-gray-700">
          <Filter className="w-4 h-4 mr-2" />
          Filtrar Manutenções
        </Button>
      </div>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-0">
          <MaintenanceTable 
            records={historicalRecords} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onComplete={handleComplete} // Passando função vazia
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceHistoryTab;