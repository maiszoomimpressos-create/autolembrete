import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Wrench } from 'lucide-react';
import MaintenanceTable from '@/components/MaintenanceTable';
import MaintenanceFormDialog from '@/components/MaintenanceFormDialog';
import { MaintenanceRecord } from '@/types/maintenance';
import { showSuccess, showError } from '@/utils/toast';
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

  const { records, addOrUpdateRecord, deleteRecord } = useMaintenanceRecords();
  const upcomingRecord = useUpcomingMaintenance(records);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<MaintenanceRecord | null>(null);
  const [alertToCreateFrom, setAlertToCreateFrom] = useState<MaintenanceAlert | null>(null); // Novo estado para criação a partir de alerta

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


  const handleAddOrEdit = (data: Omit<MaintenanceRecord, 'id'>) => {
    if (recordToEdit) {
      // Edição
      addOrUpdateRecord(data, recordToEdit.id);
      showSuccess('Manutenção atualizada com sucesso!');
    } else {
      // Adição
      addOrUpdateRecord(data);
      showSuccess('Nova manutenção adicionada!');
    }
    setRecordToEdit(null);
    setAlertToCreateFrom(null); // Limpa o alerta após submissão
  };

  const handleEdit = (record: MaintenanceRecord) => {
    setRecordToEdit(record);
    setAlertToCreateFrom(null); // Garante que não estamos em modo de criação por alerta
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este registro de manutenção?')) {
      deleteRecord(id);
      showSuccess('Registro de manutenção deletado.');
    }
  };
  
  const handleComplete = (record: MaintenanceRecord) => {
    // Ao concluir, abrimos o formulário para que o usuário possa confirmar o KM e o Custo, se necessário.
    // Se o custo for 0 ou o KM for 0, sugerimos que ele edite.
    if (record.cost === 0 || record.mileage === 0) {
        showError('Por favor, edite o registro para confirmar o KM e o Custo antes de concluir.');
        handleEdit(record);
        return;
    }
    
    // Se já tiver KM e Custo, podemos concluir diretamente
    addOrUpdateRecord({ ...record, status: 'Concluído' }, record.id);
    showSuccess(`Manutenção '${record.type}' marcada como concluída!`);
  };

  const handleOpenDialog = () => {
    setRecordToEdit(null);
    setAlertToCreateFrom(null);
    setIsDialogOpen(true);
  };
  
  // Funções vazias para o UpcomingMaintenanceCard, pois ele não é usado aqui, mas o DashboardPage precisa delas.
  const handleAlertClick = (alert: MaintenanceAlert) => {
      // No MaintenancePage, se clicarmos em um alerta, abrimos o formulário de edição do registro original.
      const originalRecord = records.find(r => r.id === alert.id.split('-')[0]);
      if (originalRecord) {
          handleEdit(originalRecord);
      }
  };


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
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Adicionar Manutenção
        </Button>
      </div>

      {/* Cartão de Próxima Manutenção (Mantido aqui para consistência, mas o Dashboard é o principal local) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          {/* Aqui usamos o UpcomingMaintenanceCard apenas para exibir o próximo agendamento/pendente */}
          <UpcomingMaintenanceCard 
            record={upcomingRecord} 
            fallbackAlert={null} // Não precisamos de fallback aqui
            onEdit={handleEdit} 
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
        alertToCreateFrom={alertToCreateFrom} // Passando o novo prop
        onSubmit={handleAddOrEdit}
        currentMileage={currentMileage}
      />
    </div>
  );
};

export default MaintenancePage;