import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Wrench, Loader2 } from 'lucide-react';
import MaintenanceTable from '@/components/MaintenanceTable';
import MaintenanceFormDialog from '@/components/MaintenanceFormDialog';
import { MaintenanceRecord } from '@/types/maintenance';
import { showError } from '@/utils/toast';
import { useMaintenanceRecords } from '@/hooks/useMaintenanceRecords';
import UpcomingMaintenanceCard from '@/components/UpcomingMaintenanceCard';
import { useUpcomingMaintenance } from '@/hooks/useUpcomingMaintenance';
import { useMileageRecords } from '@/hooks/useMileageRecords';
import { useFuelingRecords } from '@/hooks/useFuelingRecords';
import { useLocation } from 'react-router-dom';
import { useMileageAlerts } from '@/hooks/useMileageAlerts';
import { useDateAlerts } from '@/hooks/useDateAlerts';
import { MaintenanceAlert } from '@/types/alert';

const MaintenancePage: React.FC = () => {
  const location = useLocation();
  
  const { records: fuelingRecords } = useFuelingRecords();
  const { currentMileage } = useMileageRecords(fuelingRecords);

  const { records, addOrUpdateRecord, deleteRecord, isLoading, isMutating } = useMaintenanceRecords();
  const upcomingRecord = useUpcomingMaintenance(records);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<MaintenanceRecord | null>(null);
  const [alertToCreateFrom, setAlertToCreateFrom] = useState<MaintenanceAlert | null>(null);
  
  // Alertas de Repetição (Manutenções Concluídas que precisam ser refeitas)
  const { alerts: mileageAlerts } = useMileageAlerts(records, currentMileage);
  const { alerts: dateAlerts } = useDateAlerts(records);
  
  // Combina e ordena todos os alertas de repetição (lógica copiada do DashboardPage)
  const allRepetitionAlerts = useMemo(() => {
    const all = [...mileageAlerts, ...dateAlerts];
    
    all.sort((a, b) => {
      if (a.status === 'Atrasado' && b.status !== 'Atrasado') return -1;
      if (a.status !== 'Atrasado' && b.status === 'Atrasado') return 1;
      if (a.unit === 'km' && b.unit === 'dias') return -1;
      if (a.unit === 'dias' && b.unit === 'km') return 1;
      if (a.status === 'Atrasado') return b.value - a.value;
      return a.value - b.value;
    });
    return all;
  }, [mileageAlerts, dateAlerts]);
  
  const mostUrgentAlert: MaintenanceAlert | null = allRepetitionAlerts.length > 0 ? allRepetitionAlerts[0] : null;


  // Efeito para lidar com a navegação de edição/criação do Dashboard
  useEffect(() => {
    const state = location.state as { editRecordId?: string, createFromAlert?: MaintenanceAlert } | undefined;
    
    if (state?.editRecordId) {
      const record = records.find(r => r.id === state.editRecordId);
      if (record) {
        handleEdit(record);
      }
    } else if (state?.createFromAlert) {
        // Se for um alerta de repetição, preparamos para criar um novo registro
        setAlertToCreateFrom(state.createFromAlert);
        setIsDialogOpen(true);
    }
    
    // Limpa o estado para não reabrir o modal em refresh
    window.history.replaceState({}, document.title, location.pathname);
  }, [location.state, records]);


  const handleAddOrEdit = async (data: Omit<MaintenanceRecord, 'id'>) => {
    await addOrUpdateRecord(data, recordToEdit?.id);
    setRecordToEdit(null);
    setAlertToCreateFrom(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (record: MaintenanceRecord) => {
    setRecordToEdit(record);
    setAlertToCreateFrom(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este registro de manutenção?')) {
      await deleteRecord(id);
    }
  };
  
  const handleComplete = async (record: MaintenanceRecord) => {
    // Ao concluir, abrimos o formulário para que o usuário possa confirmar o KM e o Custo, se necessário.
    if (record.cost === 0 || record.mileage === 0) {
        showError('Por favor, edite o registro para confirmar o KM e o Custo antes de concluir.');
        handleEdit(record);
        return;
    }
    
    // Se já tiver KM e Custo, podemos concluir diretamente
    await addOrUpdateRecord({ ...record, status: 'Concluído' }, record.id);
  };

  const handleOpenDialog = () => {
    setRecordToEdit(null);
    setAlertToCreateFrom(null);
    setIsDialogOpen(true);
  };
  
  const handleAlertClick = (alert: MaintenanceAlert) => {
      // Ao clicar em um alerta, abrimos o modal para criar um NOVO registro
      setAlertToCreateFrom(alert);
      setRecordToEdit(null);
      setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
        <p className="mt-4 dark:text-white">Carregando registros de manutenção...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
          <Wrench className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <span>Manutenções</span>
        </h2>
        <Button 
          onClick={handleOpenDialog}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          disabled={isMutating}
        >
          {isMutating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <PlusCircle className="w-4 h-4 mr-2" />
          )}
          Adicionar Manutenção
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <UpcomingMaintenanceCard 
            record={upcomingRecord} 
            fallbackAlert={upcomingRecord ? null : mostUrgentAlert}
            onEdit={handleEdit} 
            onAlertClick={handleAlertClick}
          />
        </div>
        <div className="md:col-span-2 flex items-center justify-center bg-gray-50 border border-dashed rounded-lg dark:bg-gray-800 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Espaço para filtros ou estatísticas rápidas de manutenção.
            </p>
        </div>
      </div>

      <MaintenanceTable 
        records={records} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        onComplete={handleComplete}
      />

      <MaintenanceFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        recordToEdit={recordToEdit}
        alertToCreateFrom={alertToCreateFrom}
        onSubmit={handleAddOrEdit}
        currentMileage={currentMileage}
      />
    </div>
  );
};

export default MaintenancePage;