import React from 'react';
import MetricCard from '@/components/MetricCard';
import VehicleSummary from '@/components/VehicleSummary';
import { DollarSign, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

const DashboardPage: React.FC = () => {
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
          value="12.5 km/l"
          description="Baseado nos últimos 3 abastecimentos"
          icon={TrendingUp}
          colorClass="text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* Seção de Alertas e Gráficos (Placeholder) */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 dark:text-white">Gráfico de Gastos Mensais</h3>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Gráfico de Recharts será implementado aqui.
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 dark:text-white">Alertas e Lembretes</h3>
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
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;