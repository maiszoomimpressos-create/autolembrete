import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Wrench } from 'lucide-react';
import MaintenanceTable from '@/components/MaintenanceTable';
import MaintenanceFormDialog from '@/components/MaintenanceFormDialog';
import { MaintenanceRecord } from '@/types/maintenance';
import { showSuccess, showError } from '@/utils/toast';
import { useMaintenanceRecords } from '@/hooks/useMaintenanceRecords';
import UpcomingMaintenanceCard from '@/components/UpcomingMaintenanceCard'; // Novo Import
import { useUpcomingMaintenance } from '@/hooks/useUpcomingMaintenance'; // Novo Import

const MaintenancePage: React.FC = () => {
  const { records, addOrUpdateRecord, deleteRecord } = useMaintenanceRecords();
  const upcomingRecord = useUpcomingMaintenance(records); // Usando o novo hook
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<MaintenanceRecord | null>(null);

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
  };

  const handleEdit = (record: MaintenanceRecord) => {
    setRecordToEdit(record);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este registro de manutenção?')) {
      deleteRecord(id);
      showSuccess('Registro de manutenção deletado.');
    }
  };

  const handleOpenDialog = () => {
    setRecordToEdit(null);
    setIsDialogOpen(true);
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

      {/* Cartão de Próxima Manutenção */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <UpcomingMaintenanceCard record={upcomingRecord} onEdit={handleEdit} />
        </div>
        {/* Placeholder para outras métricas ou filtros */}
        <div className="md:col-span-2 flex items-center justify-center bg-gray-50 border border-dashed rounded-lg dark:bg-gray-800 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Espaço para filtros ou estatísticas rápidas de manutenção.
            </p>
        </div>
      </div>

      <MaintenanceTable records={records} onEdit={handleEdit} onDelete={handleDelete} />

      <MaintenanceFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        recordToEdit={recordToEdit}
        onSubmit={handleAddOrEdit}
      />
    </div>
  );
};

export default MaintenancePage;