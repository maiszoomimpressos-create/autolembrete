import React from 'react';
import { History, Wrench, Fuel, Gauge } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MaintenanceHistoryTab from '@/components/MaintenanceHistoryTab';
import FuelingHistoryTab from '@/components/FuelingHistoryTab';
import MileageHistoryTab from '@/components/MileageHistoryTab'; // Novo Import

const HistoryPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
        <History className="w-7 h-7 text-blue-600 dark:text-blue-400" />
        <span>Histórico Completo</span>
      </h2>

      <Tabs defaultValue="maintenance" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 dark:bg-gray-800">
          <TabsTrigger value="maintenance" className="flex items-center space-x-2">
            <Wrench className="w-4 h-4" />
            <span>Manutenções</span>
          </TabsTrigger>
          <TabsTrigger value="fueling" className="flex items-center space-x-2">
            <Fuel className="w-4 h-4" />
            <span>Abastecimentos</span>
          </TabsTrigger>
          <TabsTrigger value="mileage" className="flex items-center space-x-2">
            <Gauge className="w-4 h-4" />
            <span>Quilometragem</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="maintenance" className="mt-4">
          <MaintenanceHistoryTab />
        </TabsContent>
        
        <TabsContent value="fueling" className="mt-4">
          <FuelingHistoryTab />
        </TabsContent>

        <TabsContent value="mileage" className="mt-4">
          <MileageHistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HistoryPage;