import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import FuelingTable from '@/components/FuelingTable';
import { useFuelingRecords } from '@/hooks/useFuelingRecords';
import { FuelingRecord } from '@/types/fueling';

const FuelingHistoryTab: React.FC = () => {
  const { records } = useFuelingRecords();
  
  // No caso de abastecimento, todos os registros são históricos
  const historicalRecords: FuelingRecord[] = records;

  // Funções de edição e exclusão vazias, pois o histórico é geralmente somente leitura
  const handleEdit = () => {};
  const handleDelete = () => {};

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" className="dark:hover:bg-gray-700">
          <Filter className="w-4 h-4 mr-2" />
          Filtrar Abastecimentos
        </Button>
      </div>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-0">
          <FuelingTable records={historicalRecords} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FuelingHistoryTab;