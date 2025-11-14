import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Fuel, Loader2 } from 'lucide-react';
import { FuelingRecord } from '@/types/fueling';
import { showSuccess } from '@/utils/toast';
import FuelingTable from '@/components/FuelingTable';
import FuelingFormDialog from '@/components/FuelingFormDialog';
import { useFuelingRecords } from '@/hooks/useFuelingRecords';

const FuelingPage: React.FC = () => {
  const { records, addOrUpdateRecord, deleteRecord, isLoading, isMutating } = useFuelingRecords();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<FuelingRecord | null>(null);

  const handleAddOrEdit = async (data: Omit<FuelingRecord, 'id'>) => {
    try {
        await addOrUpdateRecord(data, recordToEdit?.id);
        if (recordToEdit) {
            showSuccess('Abastecimento atualizado com sucesso!');
        } else {
            // A mensagem de sucesso para viagem é tratada dentro do TripFuelingForm, 
            // mas para abastecimento único, mostramos aqui.
            if (data.mileage > 0) { 
                showSuccess('Novo abastecimento adicionado!');
            }
        }
    } catch (e) {
        // Erro já tratado no hook de mutação
    }
    setRecordToEdit(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (record: FuelingRecord) => {
    setRecordToEdit(record);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este registro de abastecimento?')) {
      await deleteRecord(id);
      showSuccess('Registro de abastecimento deletado.');
    }
  };

  const handleOpenDialog = () => {
    setRecordToEdit(null);
    setIsDialogOpen(true);
  };
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
        <p className="mt-4 dark:text-white">Carregando registros de abastecimento...</p>
      </div>
    );
  }

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
          disabled={isMutating}
        >
          {isMutating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <PlusCircle className="w-4 h-4 mr-2" />
          )}
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