import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Wrench } from 'lucide-react';
import MaintenanceTable from '@/components/MaintenanceTable';
import MaintenanceFormDialog from '@/components/MaintenanceFormDialog';
import { MaintenanceRecord } from '@/types/maintenance';
import { showSuccess, showError } from '@/utils/toast';
import { useMaintenanceRecords } from '@/hooks/useMaintenanceRecords';

const MaintenancePage: React.FC = () => {
  const { records, addOrUpdateRecord, deleteRecord } = useMaintenanceRecords();
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