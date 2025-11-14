import React, { useMemo } from 'react';
import MetricCard from '@/components/MetricCard';
import VehicleSummary from '@/components/VehicleSummary';
import MonthlySpendingChart from '@/components/MonthlySpendingChart';
import FuelEfficiencyChart from '@/components/FuelEfficiencyChart';
import { DollarSign, Clock, TrendingUp, AlertTriangle, Gauge, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFuelingMetrics } from '@/hooks/useFuelingMetrics';
import { useFuelingRecords } from '@/hooks/useFuelingRecords';
import { useMaintenanceRecords } from '@/hooks/useMaintenanceRecords';
import { useMaintenanceMetrics } from '@/hooks/useMaintenanceMetrics';
import { useMileageAlerts } from '@/hooks/useMileageAlerts';
import { useMileageRecords } from '@/hooks/useMileageRecords';
import { useLastMaintenanceDate } from '@/hooks/useLastMaintenanceDate';
import { useDateAlerts } from '@/hooks/useDateAlerts';
import UpcomingMaintenanceCard from '@/components/UpcomingMaintenanceCard';
import AlertItem from '@/components/AlertItem';
import { MaintenanceAlert } from '@/types/alert';
import { useNavigate } from 'react-router-dom';
import { MaintenanceRecord } from '@/types/maintenance';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Dados de Abastecimento
  const { records: fuelingRecords, isLoading: isLoadingFueling } = useFuelingRecords();
  const { averageEfficiency } = useFuelingMetrics(fuelingRecords);

  // Dados de KM (Combina abastecimentos e entradas manuais)
  const { currentMileage, isLoading: isLoadingMileage } = useMileageRecords(fuelingRecords);

  // Dados de Manutenção
  const { records: maintenanceRecords, isLoading: isLoadingMaintenance } = useMaintenanceRecords();
  const { totalCost, pendingCount, nextMaintenance } = useMaintenanceMetrics(maintenanceRecords);
  const lastServiceDate = useLastMaintenanceDate(maintenanceRecords);
  
  // Alertas de Repetição (Manutenções Concluídas que precisam ser refeitas)
  const { alerts: mileageAlerts } = useMileageAlerts(maintenanceRecords, currentMileage);
  const { alerts: dateAlerts } = useDateAlerts(maintenanceRecords);

  // Combina e ordena todos os alertas de repetição
  const allRepetitionAlerts = useMemo(() => {
    const all = [...mileageAlerts, ...dateAlerts];
    
    // Ordenação complexa para priorizar o mais urgente
    all.sort((a, b) => {
      // 1. Atrasado vs Próximo
      if (a.status === 'Atrasado' && b.status !== 'Atrasado') return -1;
      if (a.status !== 'Atrasado' && b.status === 'Atrasado') return 1;

      // 2. KM vs Data (KM é geralmente mais crítico)
      if (a.unit === 'km' && b.unit === 'dias') return -1;
      if (a.unit === 'dias' && b.unit === 'km') return 1;

      // 3. Dentro da mesma categoria, o mais urgente (maior valor se atrasado, menor valor se próximo)
      if (a.status === 'Atrasado') return b.value - a.value;
      return a.value - b.value;
    });
    return all;
  }, [mileageAlerts, dateAlerts]);
  
  const mostUrgentAlert: MaintenanceAlert | null = allRepetitionAlerts.length > 0 ? allRepetitionAlerts[0] : null;
  
  const efficiencyValue = averageEfficiency !== null 
    ? `${averageEfficiency} km/l` 
    : 'N/A';
  
  const efficiencyDescription = averageEfficiency !== null
    ? 'Baseado nos últimos abastecimentos'
    : 'Adicione mais abastecimentos para calcular';

    
  const handleEditMaintenance = (record: MaintenanceRecord) => {
    // Navega para a página de manutenção e abre o modal de edição
    navigate('/maintenance', { state: { editRecordId: record.id } });
  };
  
  const handleAlertClick = (alert: MaintenanceAlert) => {
    // Navega para a página de manutenção e passa o objeto de alerta para pré-preencher a CRIAÇÃO de um novo registro
    navigate('/maintenance', { state: { createFromAlert: alert } });
  };

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
        {/* Card 1: Próxima Manutenção (Substituído pelo UpcomingMaintenanceCard) */}
        <UpcomingMaintenanceCard 
            record={nextMaintenance} // Prioriza Agendado/Pendente
            fallbackAlert={nextMaintenance ? null : mostUrgentAlert} // Usa alerta de repetição se não houver agendamento/pendente
            onEdit={handleEditMaintenance} 
            onAlertClick={handleAlertClick}
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

      {/* Seção de Gráficos e Alertas (Agora 2 colunas em desktop) */}
      <div className="grid gap-4 lg:grid-cols-3">
        
        {/* Coluna de Alertas (Agora ocupa 1 coluna) */}
        <div className="lg:col-span-1 space-y-4">
            <Card className="bg-white p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-semibold dark:text-white">Alertas de Repetição</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                {/* Alertas de Manutenção Pendente (Status) - Mantido aqui para visibilidade */}
                {pendingCount > 0 && (
                  <button 
                    onClick={() => navigate('/maintenance')}
                    className="w-full flex items-center p-3 rounded-lg border border-red-200 bg-red-50/50 text-red-600 font-semibold transition-colors hover:shadow-md dark:bg-red-900/10 dark:border-red-900 dark:text-red-400"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                    Você tem {pendingCount} manutenções pendentes (status).
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                )}

                {/* Alertas de Repetição (KM e Data) */}
                {allRepetitionAlerts.map(alert => (
                  <AlertItem key={alert.id} alert={alert} onClick={handleAlertClick} />
                ))}
                
                {/* Placeholder de sucesso */}
                {pendingCount === 0 && allRepetitionAlerts.length === 0 && (
                  <div className="flex items-center text-green-500 p-3 border border-green-200 bg-green-50/50 dark:bg-green-900/10 dark:border-green-900 rounded-lg">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Nenhum alerta de repetição ativo.
                  </div>
                )}
              </CardContent>
            </Card>
        </div>
        
        {/* Coluna de Gráficos (Agora ocupa 2 colunas) */}
        <div className="lg:col-span-2 grid gap-4 md:grid-cols-2">
          <MonthlySpendingChart />
          <FuelEfficiencyChart fuelingRecords={fuelingRecords} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;