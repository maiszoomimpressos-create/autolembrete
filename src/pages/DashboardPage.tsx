import React from 'react';
import MetricCard from '@/components/MetricCard';
import VehicleSummary from '@/components/VehicleSummary';
import MonthlySpendingChart from '@/components/MonthlySpendingChart';
import { DollarSign, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFuelingMetrics } from '@/hooks/useFuelingMetrics'; // Importando o hook

const DashboardPage: React.FC = () => {
  const { averageEfficiency } = useFuelingMetrics();

  const efficiencyValue = averageEfficiency !== null 
    ? `${averageEfficiency} km/l` 
    : 'N/A';
  
  const efficiencyDescription = averageEfficiency !== null
    ? 'Baseado nos últimos abastecimentos'
    : 'Adicione mais abastecimentos para calcular';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
      
      {/* Resumo do Veículo */}
      <VehicleSummary />

      {/* Cartões de Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Próxima Manutenção"
          value="5.000 km"
          description="Troca de óleo e filtros"
          icon={Clock}
          colorClass="text-yellow-600 dark:text-yellow-400"
        />
        <MetricCard
          title="Gastos Totais (Ano)"
          value="R$ 3.500,00"
          description="Aumento de 12% em relação ao ano passado"
          icon={DollarSign}
          colorClass="text-green-600 dark:text-green-400"
        />
        <MetricCard
          title="Manutenções Pendentes"
          value={2}
          description="Itens críticos que precisam de atenção"
          icon={AlertTriangle}
          colorClass="text-red-600 dark:text-red-400"
        />
        <MetricCard
          title="Eficiência Média"
          value={efficiencyValue}
          description={efficiencyDescription}
          icon={TrendingUp}
          colorClass="text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* Seção de Alertas e Gráficos */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MonthlySpendingChart />
        </div>
        <Card className="bg-white p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-semibold dark:text-white">Alertas e Lembretes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="space-y-3 text-sm dark:text-gray-300">
              <li className="flex items-center text-red-500">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Troca de Pneus (Vencida)
              </li>
              <li className="flex items-center text-yellow-500">
                <Clock className="w-4 h-4 mr-2" />
                Próxima Revisão em 30 dias
              </li>
              <li className="flex items-center text-green-500">
                <TrendingUp className="w-4 h-4 mr-2" />
                IPVA Pago (2024)
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;