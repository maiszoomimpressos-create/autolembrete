import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MaintenanceRecord } from '@/types/maintenance';
import { Wrench } from 'lucide-react';

interface MaintenanceFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recordToEdit: MaintenanceRecord | null;
  onSubmit: (data: Omit<MaintenanceRecord, 'id'>) => void;
}

const MaintenanceFormDialog: React.FC<MaintenanceFormDialogProps> = ({
  isOpen,
  onOpenChange,
  recordToEdit,
  onSubmit,
}) => {
  const isEditing = !!recordToEdit;
  const title = isEditing ? 'Editar Manutenção' : 'Adicionar Nova Manutenção';

  // Simulação de estado do formulário (para simplificar, não usaremos react-hook-form ainda)
  const [formData, setFormData] = React.useState<Omit<MaintenanceRecord, 'id'>>({
    date: recordToEdit?.date || new Date().toISOString().split('T')[0],
    mileage: recordToEdit?.mileage || 0,
    type: recordToEdit?.type || 'Troca de Óleo',
    description: recordToEdit?.description || '',
    cost: recordToEdit?.cost || 0,
    status: recordToEdit?.status || 'Concluído',
  });

  React.useEffect(() => {
    if (recordToEdit) {
      setFormData({
        date: recordToEdit.date,
        mileage: recordToEdit.mileage,
        type: recordToEdit.type,
        description: recordToEdit.description,
        cost: recordToEdit.cost,
        status: recordToEdit.status,
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        mileage: 0,
        type: 'Troca de Óleo',
        description: '',
        cost: 0,
        status: 'Concluído',
      });
    }
  }, [recordToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'mileage' || id === 'cost' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (id: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-blue-500" />
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Preencha os detalhes da manutenção realizada ou agendada.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right dark:text-gray-300">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mileage" className="text-right dark:text-gray-300">KM</Label>
            <Input
              id="mileage"
              type="number"
              value={formData.mileage}
              onChange={handleChange}
              className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right dark:text-gray-300">Tipo</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange('type', value as MaintenanceRecord['type'])}
            >
              <SelectTrigger className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {['Troca de Óleo', 'Revisão Geral', 'Pneus', 'Freios', 'Outro'].map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cost" className="text-right dark:text-gray-300">Custo (R$)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={handleChange}
              className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right dark:text-gray-300">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange('status', value as MaintenanceRecord['status'])}
            >
              <SelectTrigger className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {['Concluído', 'Pendente', 'Agendado'].map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="dark:text-gray-300">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detalhes da manutenção..."
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
          <Button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
            {isEditing ? 'Salvar Alterações' : 'Adicionar Manutenção'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceFormDialog;