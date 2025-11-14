import React from 'react';
import MetricCard from '@/components/MetricCard';
import VehicleSummary from '@/components/VehicleSummary';
import MonthlySpendingChart from '@/components/MonthlySpendingChart';
import FuelEfficiencyChart from '@/components/FuelEfficiencyChart';
import { DollarSign, Clock, TrendingUp, AlertTriangle, Gauge } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFuelingMetrics } from '@/hooks/useFuelingMetrics';
import { useFuelingRecords } from '@/hooks/useFuelingRecords';
import { useMaintenanceRecords } from '@/hooks/useMaintenanceRecords';
import { useMaintenanceMetrics } from '@/hooks/useMaintenanceMetrics';
import { useMileageAlerts } from '@/hooks/useMileageAlerts'; // Novo Import

const DashboardPage: React.FC = () => {
  // Dados de Abastecimento
  const { records: fuelingRecords } = useFuelingRecords();
  const { averageEfficiency } = useFuelingMetrics(fuelingRecords);

  // Dados de Manutenção
  const { records: maintenanceRecords } = useMaintenanceRecords();
  const { totalCost, pendingCount, nextMaintenance } = useMaintenanceMetrics(maintenanceRecords);
  
  // Alertas de KM
  const { currentMileage, alerts: mileageAlerts } = useMileageAlerts(maintenanceRecords, fuelingRecords);

  const efficiencyValue = averageEfficiency !== null 
    ? `${averageEfficiency} km/l` 
    : 'N/A';
  
  const efficiencyDescription = averageEfficiency !== null
    ? 'Baseado nos últimos abastecimentos'
    : 'Adicione mais abastecimentos para calcular';

  const nextMaintenanceValue = nextMaintenance 
    ? `${nextMaintenance.mileage.toLocaleString('pt-BR')} km`
    : 'Nenhuma agendada';
    
  const nextMaintenanceDescription = nextMaintenance
    ? `${nextMaintenance.type} em ${new Date(nextMaintenance.date).toLocaleDateString('pt-BR')}`
    : 'Adicione um agendamento';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
      
      {/* Resumo do Veículo */}
      <VehicleSummary />

      {/* Cartões de Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Próxima Manutenção"
          value={nextMaintenanceValue}
          description={nextMaintenanceDescription}
          icon={Clock}
          colorClass="text-yellow-600 dark:text-yellow-400"
        />
        <MetricCard
          title="Gastos Totais (Ano)"
          value={totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          description="Custo total de manutenções concluídas"
          icon={DollarSign}
          colorClass="text-green-600 dark:text-green-400"
        />
        <MetricCard
          title="Manutenções Pendentes"
          value={pendingCount}
          description={pendingCount > 0 ? `${pendingCount} itens precisam de atenção` : 'Tudo em dia!'}
          icon={AlertTriangle}
          colorClass={pendingCount > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}
        />
        <MetricCard
          title="Eficiência Média"
          value={efficiencyValue}
          description={efficiencyDescription}
          icon={TrendingUp}
          colorClass="text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* Seção de Gráficos */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-4 md:grid-cols-2">
          <MonthlySpendingChart />
          {/* Passando os registros para o gráfico */}
          <FuelEfficiencyChart fuelingRecords={fuelingRecords} />
        </div>
        
        {/* Alertas e Lembretes */}
        <Card className="bg-white p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 lg:col-span-1">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-semibold dark:text-white">Alertas e Lembretes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="space-y-3 text-sm dark:text-gray-300">
              {/* Alerta de KM Atual */}
              {currentMileage > 0 && (
                <li className="flex items-center text-gray-600 dark:text-gray-400">
                  <Gauge className="w-4 h-4 mr-2" />
                  KM Atual Estimado: {currentMileage.toLocaleString('pt-BR')} km
                </li>
              )}

              {/* Alertas de Manutenção Pendente (Status) */}
              {pendingCount > 0 && (
                <li className="flex items-center text-red-500 font-semibold">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Você tem {pendingCount} manutenções pendentes (status).
                </li>
              )}

              {/* Alertas de KM */}
              {mileageAlerts.map(alert => (
                <li 
                  key={alert.id} 
                  className={`flex items-center ${alert.status === 'Atrasado' ? 'text-red-600' : 'text-yellow-600'}`}
                >
                  <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">
                    {alert.type}: {alert.status === 'Atrasado' 
                      ? `Atrasado por ${alert.kmRemaining.toLocaleString('pt-BR')} km` 
                      : `Próximo em ${alert.kmRemaining.toLocaleString('pt-BR')} km`}
                  </span>
                </li>
              ))}

              {/* Alerta de Próxima Manutenção (Data) */}
              {nextMaintenance && (
                <li className="flex items-center text-yellow-500">
                  <Clock className="w-4 h-4 mr-2" />
                  Próxima Manutenção Agendada: {nextMaintenance.type}
                </li>
              )}
              
              {/* Placeholder de sucesso */}
              {pendingCount === 0 && mileageAlerts.length === 0 && !nextMaintenance && (
                <li className="flex items-center text-green-500">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Seu veículo está em dia!
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;