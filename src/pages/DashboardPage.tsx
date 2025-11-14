import React, { useMemo } from 'react';
import MetricCard from '@/components/MetricCard';
import VehicleSummary from '@/components/VehicleSummary';
import MonthlySpendingChart from '@/components/MonthlySpendingChart';
import FuelEfficiencyChart from '@/components/FuelEfficiencyChart';
import MileageInputForm from '@/components/MileageInputForm';
import { DollarSign, Clock, TrendingUp, AlertTriangle, Gauge, Calendar, Loader2 } from 'lucide-react';
import { useFuelingMetrics } from '@/hooks/useFuelingMetrics';
import { useFuelingRecords } from '@/hooks/useFuelingRecords';
import { useMaintenanceRecords } from '@/hooks/useMaintenanceRecords';
import { useMaintenanceMetrics } from '@/hooks/useMaintenanceMetrics';
import { useMileageRecords } from '@/hooks/useMileageRecords';
import { useLastMaintenanceDate } from '@/hooks/useLastMaintenanceDate';
import { useMileageAlerts } from '@/hooks/useMileageAlerts'; // Novo Import
import { useDateAlerts } from '@/hooks/useDateAlerts'; // Novo Import

const DashboardPage: React.FC = () => {
  // Dados de Abastecimento
  const { records: fuelingRecords, isLoading: isLoadingFueling } = useFuelingRecords();
  const { averageEfficiency } = useFuelingMetrics(fuelingRecords);

  // Dados de KM (Combina abastecimentos e entradas manuais)
  const { currentMileage, addManualRecord, isLoading: isLoadingMileage } = useMileageRecords(fuelingRecords);

  // Dados de Manutenção
  const { records: maintenanceRecords, isLoading: isLoadingMaintenance } = useMaintenanceRecords();
  const { totalCost, pendingCount, nextMaintenance } = useMaintenanceMetrics(maintenanceRecords);
  const lastServiceDate = useLastMaintenanceDate(maintenanceRecords);
  
  // Dados de Alerta
  const { alerts: mileageAlerts } = useMileageAlerts(maintenanceRecords, currentMileage);
  const { alerts: dateAlerts } = useDateAlerts(maintenanceRecords);
  
  // Encontra o alerta de repetição mais urgente (KM ou Data)
  const mostUrgentAlert = useMemo(() => {
    const allAlerts = [...mileageAlerts, ...dateAlerts];
    if (allAlerts.length === 0) return null;
    
    // O primeiro item na lista combinada e ordenada é o mais urgente
    return allAlerts.sort((a, b) => {
        if (a.status === 'Atrasado' && b.status !== 'Atrasado') return -1;
        if (a.status !== 'Atrasado' && b.status === 'Atrasado') return 1;
        
        // Se ambos são atrasados, o que passou mais tempo (maior value) vem primeiro
        if (a.status === 'Atrasado' && b.status === 'Atrasado') return b.value - a.value;

        // Se ambos são próximos, o que está mais perto (menor value) vem primeiro
        return a.value - b.value;
    })[0];
  }, [mileageAlerts, dateAlerts]);

  // Lógica para o Card de Próxima Manutenção
  let nextMaintenanceValue: string;
  let nextMaintenanceDescription: string;
  let nextMaintenanceIcon = Clock;
  let nextMaintenanceColorClass = "text-yellow-600 dark:text-yellow-400";

  if (nextMaintenance) {
    // Prioriza manutenção agendada/pendente
    nextMaintenanceValue = nextMaintenance.mileage.toLocaleString('pt-BR') + ' km';
    nextMaintenanceDescription = `${nextMaintenance.type} em ${new Date(nextMaintenance.date).toLocaleDateString('pt-BR')}`;
    if (nextMaintenance.status === 'Pendente' || (nextMaintenance.status === 'Agendado' && new Date(nextMaintenance.date) < new Date())) {
        nextMaintenanceColorClass = "text-red-600 dark:text-red-400";
        nextMaintenanceIcon = AlertTriangle;
    }
  } else if (mostUrgentAlert) {
    // Usa o alerta de repetição mais urgente
    const target = mostUrgentAlert.unit === 'km' 
        ? `${mostUrgentAlert.nextTarget.toLocaleString('pt-BR')} km`
        : new Date(mostUrgentAlert.nextTarget as string).toLocaleDateString('pt-BR');
        
    nextMaintenanceValue = mostUrgentAlert.type;
    nextMaintenanceDescription = `${mostUrgentAlert.status === 'Atrasado' ? 'Vencido' : 'Próximo'} (${mostUrgentAlert.unit === 'km' ? 'KM' : 'Data'}): ${target}`;
    nextMaintenanceIcon = mostUrgentAlert.status === 'Atrasado' ? AlertTriangle : Clock;
    nextMaintenanceColorClass = mostUrgentAlert.status === 'Atrasado' ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400";
  } else {
    // Nenhum alerta ou agendamento
    nextMaintenanceValue = 'Tudo em dia!';
    nextMaintenanceDescription = 'Nenhuma manutenção pendente ou próxima.';
    nextMaintenanceIcon = Clock;
    nextMaintenanceColorClass = "text-green-600 dark:text-green-400";
  }
  
  const efficiencyValue = averageEfficiency !== null 
    ? `${averageEfficiency} km/l` 
    : 'N/A';
  
  const efficiencyDescription = averageEfficiency !== null
    ? 'Baseado nos últimos abastecimentos'
    : 'Adicione mais abastecimentos para calcular';

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
        {/* Card 1: Próxima Manutenção (Agora usa alertas de repetição como fallback) */}
        <MetricCard
          title="Próxima Manutenção"
          value={nextMaintenanceValue}
          description={nextMaintenanceDescription}
          icon={nextMaintenanceIcon}
          colorClass={nextMaintenanceColorClass}
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