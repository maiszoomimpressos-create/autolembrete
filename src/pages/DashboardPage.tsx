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

  // Determina o alerta de repetição mais urgente (se não houver um registro ativo)
  const mostUrgentAlert: MaintenanceAlert | null = useMemo(() => {
    const allAlerts = [...mileageAlerts, ...dateAlerts];
    if (allAlerts.length === 0) return null;

    // Prioridade: Atrasado (KM) > Atrasado (Data) > Próximo (KM) > Próximo (Data)
    allAlerts.sort((a, b) => {
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

    return allAlerts[0];
  }, [mileageAlerts, dateAlerts]);
  
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
    // Navega para a página de manutenção e abre o modal de edição (simulado)
    navigate('/maintenance', { state: { editRecordId: record.id } });
  };
  
  const handleAlertClick = (alert: MaintenanceAlert) => {
    // Encontra o registro original para edição
    const originalRecord = maintenanceRecords.find(r => r.id === alert.id.split('-')[0]);
    
    if (originalRecord) {
        // Se for um alerta de repetição, sugerimos criar um novo registro baseado no antigo
        // Mas para simplificar, vamos apenas abrir o formulário de edição do registro original
        // para que o usuário possa criar um novo a partir dele ou marcar como concluído.
        
        // Para o propósito de demonstração, vamos apenas navegar para a página de manutenção.
        // Em uma aplicação real, você passaria o ID para abrir o modal.
        navigate('/maintenance');
    }
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
                          ? `Atrasado por ${alert.value.toLocaleString('pt-BR')} km` 
                          : `Próximo em ${alert.value.toLocaleString('pt-BR')} km`}
                      </span>
                    </li>
                  ))}
                  
                  {/* Alertas de Data */}
                  {dateAlerts.map(alert => (
                    <li 
                      key={alert.id} 
                      className={`flex items-center ${alert.status === 'Atrasado' ? 'text-red-600' : 'text-yellow-600'}`}
                    >
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {alert.type}: {alert.status === 'Atrasado' 
                          ? `Vencido há ${alert.value} dias (Data: ${new Date(alert.nextTarget as string).toLocaleDateString('pt-BR')})` 
                          : `Vence em ${alert.value} dias (Data: ${new Date(alert.nextTarget as string).toLocaleDateString('pt-BR')})`}
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
                  {pendingCount === 0 && mileageAlerts.length === 0 && dateAlerts.length === 0 && !nextMaintenance && (
                    <li className="flex items-center text-green-500">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Seu veículo está em dia!
                    </li>
                  )}
                </ul>
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