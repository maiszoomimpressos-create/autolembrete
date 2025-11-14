import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Wrench, Loader2 } from 'lucide-react';
import MaintenanceTable from '@/components/MaintenanceTable';
import MaintenanceFormDialog from '@/components/MaintenanceFormDialog';
import { MaintenanceRecord } from '@/types/maintenance';
import { showSuccess, showError } from '@/utils/toast';
import { useMaintenanceRecords } from '@/hooks/useMaintenanceRecords';
import UpcomingMaintenanceCard from '@/components/UpcomingMaintenanceCard';
import { useUpcomingMaintenance } from '@/hooks/useUpcomingMaintenance';
import { useMileageRecords } from '@/hooks/useMileageRecords';
import { useFuelingRecords } from '@/hooks/useFuelingRecords';
import { useMileageAlerts } from '@/hooks/useMileageAlerts'; // Novo Import
import { useDateAlerts } from '@/hooks/useDateAlerts'; // Novo Import
import { MaintenanceAlert } from '@/types/alert'; // Novo Import
import { useNavigate } from 'react-router-dom'; // Novo Import

const MaintenancePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Hooks para obter o KM atual e registros
  const { records: fuelingRecords } = useFuelingRecords();
  const { currentMileage } = useMileageRecords(fuelingRecords);

  const { records, addOrUpdateRecord, deleteRecord, isLoading, isMutating } = useMaintenanceRecords();
  const upcomingRecord = useUpcomingMaintenance(records);
  
  // Hooks de Alerta
  const { alerts: mileageAlerts } = useMileageAlerts(records, currentMileage);
  const { alerts: dateAlerts } = useDateAlerts(records);
  
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
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<MaintenanceRecord | null>(null);

  const handleAddOrEdit = async (data: Omit<MaintenanceRecord, 'id'>) => {
    await addOrUpdateRecord(data, recordToEdit?.id);
    setRecordToEdit(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (record: MaintenanceRecord) => {
    setRecordToEdit(record);
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
  
  const handleAlertClick = (alert: MaintenanceAlert) => {
    // Redireciona para a página de alertas para ver todos
    navigate('/alerts');
  };

  const handleOpenDialog = () => {
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
            fallbackAlert={mostUrgentAlert} // Passando o alerta mais urgente
            onEdit={handleEdit} 
            onAlertClick={handleAlertClick}
          />
        </div>
        <div className="md:col-span-2 flex items-center justify-center bg-gray-50 border border-dashed rounded-lg dark:bg-gray-800 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                {mileageAlerts.length + dateAlerts.length} alertas de repetição ativos.
            </p>
            <Button 
                variant="link" 
                size="sm" 
                onClick={() => navigate('/alerts')}
                className="ml-2 text-blue-600 dark:text-blue-400"
            >
                Ver Todos
            </Button>
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
        onSubmit={handleAddOrEdit}
        currentMileage={currentMileage}
      />
    </div>
  );
};

export default MaintenancePage;