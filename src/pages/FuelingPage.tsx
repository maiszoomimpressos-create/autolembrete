import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Fuel } from 'lucide-react';
import { FuelingRecord } from '@/types/fueling';
import { showSuccess } from '@/utils/toast';
import FuelingTable from '@/components/FuelingTable';
import FuelingFormDialog from '@/components/FuelingFormDialog';

// Dados simulados iniciais
const initialRecords: FuelingRecord[] = [
  { id: 'f1', date: '2024-07-20', mileage: 45500, fuelType: 'Gasolina Comum', volumeLiters: 40.5, costPerLiter: 5.50, totalCost: 222.75, station: 'Posto Ipiranga' },
  { id: 'f2', date: '2024-07-10', mileage: 45000, fuelType: 'Etanol', volumeLiters: 35.0, costPerLiter: 3.80, totalCost: 133.00, station: 'Posto Shell' },
  { id: 'f3', date: '2024-06-25', mileage: 44500, fuelType: 'Gasolina Aditivada', volumeLiters: 42.0, costPerLiter: 6.00, totalCost: 252.00, station: 'Posto BR' },
];

const FuelingPage: React.FC = () => {
  const [records, setRecords] = useState<FuelingRecord[]>(initialRecords);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<FuelingRecord | null>(null);

  const handleAddOrEdit = (data: Omit<FuelingRecord, 'id'>) => {
    if (recordToEdit) {
      // Edição
      setRecords(prev => prev.map(r => r.id === recordToEdit.id ? { ...data, id: r.id } : r));
      showSuccess('Abastecimento atualizado com sucesso!');
    } else {
      // Adição
      const newRecord: FuelingRecord = {
        ...data,
        id: Date.now().toString(), // ID simples para simulação
      };
      setRecords(prev => [newRecord, ...prev]);
      showSuccess('Novo abastecimento adicionado!');
    }
    setRecordToEdit(null);
  };

  const handleEdit = (record: FuelingRecord) => {
    setRecordToEdit(record);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este registro de abastecimento?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
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