import React from 'react';
import MetricCard from '@/components/MetricCard';
import VehicleSummary from '@/components/VehicleSummary';
import MonthlySpendingChart from '@/components/MonthlySpendingChart';
import FuelEfficiencyChart from '@/components/FuelEfficiencyChart';
import MileageInputForm from '@/components/MileageInputForm'; // Novo Import
import { DollarSign, Clock, TrendingUp, AlertTriangle, Gauge, Calendar, Loader2 } from 'lucide-react';
import { useFuelingMetrics } from '@/hooks/useFuelingMetrics';
import { useFuelingRecords } from '@/hooks/useFuelingRecords';
import { useMaintenanceRecords } from '@/hooks/useMaintenanceRecords';
import { useMaintenanceMetrics } from '@/hooks/useMaintenanceMetrics';
import { useMileageRecords } from '@/hooks/useMileageRecords'; // Novo Import
import { useLastMaintenanceDate } from '@/hooks/useLastMaintenanceDate';

const DashboardPage: React.FC = () => {
  // Dados de Abastecimento
  const { records: fuelingRecords, isLoading: isLoadingFueling } = useFuelingRecords();
  const { averageEfficiency } = useFuelingMetrics(fuelingRecords);

  // Dados de KM (Combina abastecimentos e entradas manuais)
  const { currentMileage, addManualRecord, isLoading: isLoadingMileage } = useMileageRecords(fuelingRecords); // Usando o novo hook

  // Dados de Manutenção
  const { records: maintenanceRecords, isLoading: isLoadingMaintenance } = useMaintenanceRecords();
  const { totalCost, pendingCount, nextMaintenance } = useMaintenanceMetrics(maintenanceRecords);
  const lastServiceDate = useLastMaintenanceDate(maintenanceRecords);
  
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

  const isLoadingData = isLoadingFueling || isLoadingMaintenance || isLoadingMileage;

  if (isLoadingData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
        <p className="mt-4 dark:text-white">Carregando dados do veículo...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
      
      {/* Resumo do Veículo */}
      <VehicleSummary 
        currentMileage={currentMileage} 
        lastServiceDate={lastServiceDate}
      />

      {/* Cartões de Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Próxima Manutenção */}
        <MetricCard
          title="Próxima Manutenção"
          value={nextMaintenanceValue}
          description={nextMaintenanceDescription}
          icon={Clock}
          colorClass="text-yellow-600 dark:text-yellow-400"
        />
        
        {/* Card 2: Gastos Totais */}
        <MetricCard
          title="Gastos Totais (Ano)"
          value={totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          description="Custo total de manutenções concluídas"
          icon={DollarSign}
          colorClass="text-green-600 dark:text-green-400"
        />
        
        {/* Card 3: Manutenções Pendentes */}
        <MetricCard
          title="Manutenções Pendentes"
          value={pendingCount}
          description={pendingCount > 0 ? `${pendingCount} itens precisam de atenção` : 'Tudo em dia!'}
          icon={AlertTriangle}
          colorClass={pendingCount > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}
        />
        
        {/* Card 4: Eficiência Média */}
        <MetricCard
          title="Eficiência Média"
          value={efficiencyValue}
          description={efficiencyDescription}
          icon={TrendingUp}
          colorClass="text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* Seção de Gráficos e Input de KM */}
      <div className="grid gap-4 lg:grid-cols-3">
        
        {/* Coluna de Input de KM */}
        <div className="lg:col-span-1">
            <MileageInputForm 
                currentMileage={currentMileage} 
                onSubmit={addManualRecord} 
            />
        </div>
        
        {/* Coluna de Gráficos */}
        <div className="lg:col-span-2 grid gap-4 md:grid-cols-2">
          <MonthlySpendingChart />
          <FuelEfficiencyChart fuelingRecords={fuelingRecords} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;