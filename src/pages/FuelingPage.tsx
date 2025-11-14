import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Fuel } from 'lucide-react';
import { FuelingRecord } from '@/types/fueling';
import { showSuccess } from '@/utils/toast';
import FuelingTable from '@/components/FuelingTable';
import FuelingFormDialog from '@/components/FuelingFormDialog';
import { useFuelingRecords } from '@/hooks/useFuelingRecords';

const FuelingPage: React.FC = () => {
  const { records, addOrUpdateRecord, deleteRecord } = useFuelingRecords();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<FuelingRecord | null>(null);

  const handleAddOrEdit = (data: Omit<FuelingRecord, 'id'>) => {
    if (recordToEdit) {
      // Edição
      addOrUpdateRecord(data, recordToEdit.id);
      showSuccess('Abastecimento atualizado com sucesso!');
    } else {
      // Adição (inclui registros de viagem)
      addOrUpdateRecord(data);
      // A mensagem de sucesso para viagem é tratada dentro do TripFuelingForm, mas aqui tratamos o caso único.
      if (data.mileage > 0) { // Checagem simples para evitar duplicidade de toast se vier do TripForm
        // showSuccess('Novo abastecimento adicionado!'); // Removido para evitar duplicidade com TripForm
      }
    }
    setRecordToEdit(null);
  };

  const handleEdit = (record: FuelingRecord) => {
    setRecordToEdit(record);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este registro de abastecimento?')) {
      deleteRecord(id);
      showSuccess('Registro de abastecimento deletado.');
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
          <Fuel className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <span>Abastecimentos</span>
        </h2>
        <Button 
          onClick={handleOpenDialog}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Adicionar Abastecimento
        </Button>
      </div>

      <FuelingTable records={records} onEdit={handleEdit} onDelete={handleDelete} />

      <FuelingFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        recordToEdit={recordToEdit}
        onSubmit={handleAddOrEdit}
      />
    </div>
  );
};

export default FuelingPage;