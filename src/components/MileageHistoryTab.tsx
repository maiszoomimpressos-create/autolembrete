import React from 'react';
import { Filter, Gauge, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFuelingRecords } from '@/hooks/useFuelingRecords';
import { useMileageRecords } from '@/hooks/useMileageRecords';
import MileageHistoryTable from './MileageHistoryTable';

const MileageHistoryTab: React.FC = () => {
  // Precisamos dos registros de abastecimento para o hook de KM
  const { records: fuelingRecords, isLoading: isLoadingFueling } = useFuelingRecords();
  const { allMileageRecords, isLoading: isLoadingManual } = useMileageRecords(fuelingRecords);
  
  const isLoading = isLoadingFueling || isLoadingManual;

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
        <p className="mt-4">Carregando histórico de quilometragem...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" className="dark:hover:bg-gray-700">
          <Filter className="w-4 h-4 mr-2" />
          Filtrar Registros
        </Button>
      </div>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-0">
          <MileageHistoryTable records={allMileageRecords} />
        </CardContent>
      </Card>
    </div>
  );
};

export default MileageHistoryTab;