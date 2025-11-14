import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Wrench } from 'lucide-react';
import MaintenanceTable from '@/components/MaintenanceTable';
import MaintenanceFormDialog from '@/components/MaintenanceFormDialog';
import { MaintenanceRecord } from '@/types/maintenance';
import { showSuccess, showError } from '@/utils/toast';

// Dados simulados iniciais
const initialRecords: MaintenanceRecord[] = [
  { id: '1', date: '2024-07-01', mileage: 45200, type: 'Troca de Óleo', description: 'Óleo 5W-30 sintético e filtro de óleo.', cost: 350.00, status: 'Concluído' },
  { id: '2', date: '2024-06-15', mileage: 44500, type: 'Pneus', description: 'Rodízio e balanceamento dos 4 pneus.', cost: 120.00, status: 'Concluído' },
  { id: '3', date: '2024-08-20', mileage: 50000, type: 'Revisão Geral', description: 'Revisão completa de 50.000 km.', cost: 0, status: 'Agendado' },
  { id: '4', date: '2024-07-25', mileage: 46000, type: 'Freios', description: 'Troca de pastilhas dianteiras.', cost: 480.50, status: 'Pendente' },
];

const MaintenancePage: React.FC = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>(initialRecords);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<MaintenanceRecord | null>(null);

  const handleAddOrEdit = (data: Omit<MaintenanceRecord, 'id'>) => {
    if (recordToEdit) {
      // Edição
      setRecords(prev => prev.map(r => r.id === recordToEdit.id ? { ...data, id: r.id } : r));
      showSuccess('Manutenção atualizada com sucesso!');
    } else {
      // Adição
      const newRecord: MaintenanceRecord = {
        ...data,
        id: Date.now().toString(), // ID simples para simulação
      };
      setRecords(prev => [newRecord, ...prev]);
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
      setRecords(prev => prev.filter(r => r.id !== id));
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