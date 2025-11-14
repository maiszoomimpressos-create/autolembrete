import React from 'react';
import { History, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MaintenanceTable from '@/components/MaintenanceTable';
import { MaintenanceRecord } from '@/types/maintenance';

// Dados simulados (filtrando apenas os concluídos para o histórico)
const historicalRecords: MaintenanceRecord[] = [
  { id: '1', date: '2024-07-01', mileage: 45200, type: 'Troca de Óleo', description: 'Óleo 5W-30 sintético e filtro de óleo.', cost: 350.00, status: 'Concluído' },
  { id: '2', date: '2024-06-15', mileage: 44500, type: 'Pneus', description: 'Rodízio e balanceamento dos 4 pneus.', cost: 120.00, status: 'Concluído' },
  { id: '5', date: '2023-12-01', mileage: 30000, type: 'Revisão Geral', description: 'Revisão de 30.000 km, troca de velas e correias.', cost: 1800.00, status: 'Concluído' },
];

const HistoryPage: React.FC = () => {
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