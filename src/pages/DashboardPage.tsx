import React, { useMemo } from 'react';
import MetricCard from '@/components/MetricCard';
import VehicleSummary from '@/components/VehicleSummary';
import MonthlySpendingChart from '@/components/MonthlySpendingChart';
import FuelEfficiencyChart from '@/components/FuelEfficiencyChart';
import MileageInputForm from '@/components/MileageInputForm';
import { DollarSign, Clock, TrendingUp, AlertTriangle, Gauge, Calendar } from 'lucide-react';
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
import AlertItem from '@/components/AlertItem'; // Novo Import
import { MaintenanceAlert } from '@/types/alert';
import { useNavigate } from 'react-router-dom';
import { MaintenanceRecord } from '@/types/maintenance';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Dados de Abastecimento
  const { records: fuelingRecords } = useFuelingRecords();
  const { averageEfficiency } = useFuelingMetrics(fuelingRecords);

  // Dados de KM (Combina abastecimentos e entradas manuais)
  const { currentMileage, addManualRecord } = useMileageRecords(fuelingRecords);

  // Dados de Manutenção
  const { records: maintenanceRecords, addOrUpdateRecord } = useMaintenanceRecords();
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

  const nextMaintenanceValue = nextMaintenance 
    ? `${nextMaintenance.mileage.toLocaleString('pt-BR')} km`
    : 'Nenhuma agendada';
    
  const nextMaintenanceDescription = nextMaintenance
    ? `${nextMaintenance.type} em ${new Date(nextMaintenance.date).toLocaleDateString('pt-BR')}`
    : 'Adicione um agendamento';
    
  const handleEditMaintenance = (record: MaintenanceRecord) => {
    // Navega para a página de manutenção e abre o modal de edição
    navigate('/maintenance', { state: { editRecordId: record.id } });
  };
  
  const handleAlertClick = (alert: MaintenanceAlert) => {
    // O ID do registro original é a primeira parte do ID do alerta (ex: 'f1-mileage' -> 'f1')
    const originalRecordId = alert.id.split('-')[0];
    
    // Navega para a página de manutenção e passa o ID para abrir o modal de edição
    navigate('/maintenance', { state: { editRecordId: originalRecordId } });
  };


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

      {/* Seção de Gráficos e Input de KM */}
      <div className="grid gap-4 lg:grid-cols-3">
        
        {/* Coluna de Input de KM e Alertas */}
        <div className="lg:col-span-1 space-y-4">
            <MileageInputForm 
                currentMileage={currentMileage} 
                onSubmit={addManualRecord} 
            />
            
            <Card className="bg-white p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-semibold dark:text-white">Alertas e Lembretes</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                {/* Alerta de KM Atual */}
                {currentMileage > 0 && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <Gauge className="w-4 h-4 mr-2" />
                    KM Atual Estimado: {currentMileage.toLocaleString('pt-BR')} km
                  </div>
                )}

                {/* Alertas de Manutenção Pendente (Status) */}
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
                {pendingCount === 0 && allRepetitionAlerts.length === 0 && !nextMaintenance && (
                  <div className="flex items-center text-green-500 p-3 border border-green-200 bg-green-50/50 rounded-lg dark:bg-green-900/10 dark:border-green-900">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Seu veículo está em dia!
                  </div>
                )}
              </CardContent>
            </Card>
        </div>
        
        {/* Coluna de Gráficos */}
        <div className="lg:col-span-2 grid gap-4 md:grid-cols-2">
          <MonthlySpendingChart />
          <FuelEfficiencyChart fuelingRecords={fuelingRecords} />
        </div>
      </div>
      
      {/* Cartão de Próxima Manutenção (Atualizado para usar o alerta mais urgente como fallback) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <UpcomingMaintenanceCard 
            record={nextMaintenance} // Mantém o foco em Agendado/Pendente
            fallbackAlert={nextMaintenance ? null : mostUrgentAlert} // Usa alerta de repetição se não houver agendamento/pendente
            onEdit={handleEditMaintenance} 
            onAlertClick={handleAlertClick}
          />
        </div>
        {/* Placeholder para outras métricas ou filtros */}
        <div className="md:col-span-2 flex items-center justify-center bg-gray-50 border border-dashed rounded-lg dark:bg-gray-800 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Espaço para filtros ou estatísticas rápidas de manutenção.
            </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;