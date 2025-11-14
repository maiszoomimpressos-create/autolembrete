import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FuelingRecord } from '@/types/fueling';
import { Fuel, Car } from 'lucide-react';
import TripFuelingForm from './TripFuelingForm';

interface FuelingFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recordToEdit: FuelingRecord | null;
  onSubmit: (data: Omit<FuelingRecord, 'id'>) => void;
}

const FuelingFormDialog: React.FC<FuelingFormDialogProps> = ({
  isOpen,
  onOpenChange,
  recordToEdit,
  onSubmit,
}) => {
  const isEditing = !!recordToEdit;
  const title = isEditing ? 'Editar Abastecimento' : 'Adicionar Novo Abastecimento';

  const initialFormData: Omit<FuelingRecord, 'id'> = {
    date: new Date().toISOString().split('T')[0],
    mileage: 0,
    fuelType: 'Gasolina Comum',
    volumeLiters: 0,
    costPerLiter: 0,
    totalCost: 0,
    station: '',
  };

  const [formData, setFormData] = React.useState<Omit<FuelingRecord, 'id'>>(initialFormData);
  const [activeTab, setActiveTab] = React.useState<'single' | 'trip'>(isEditing ? 'single' : 'single');

  React.useEffect(() => {
    if (recordToEdit) {
      setFormData({
        date: recordToEdit.date,
        mileage: recordToEdit.mileage,
        fuelType: recordToEdit.fuelType,
        volumeLiters: recordToEdit.volumeLiters,
        costPerLiter: recordToEdit.costPerLiter,
        totalCost: recordToEdit.totalCost,
        station: recordToEdit.station,
      });
      setActiveTab('single'); // Edição sempre no modo único
    } else {
      setFormData(initialFormData);
    }
  }, [recordToEdit, isOpen]);

  const calculateTotalCost = (liters: number, costPerL: number) => {
    return parseFloat((liters * costPerL).toFixed(2));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    setFormData(prev => {
      let newFormData = { ...prev, [id]: value };

      if (id === 'mileage') {
        newFormData.mileage = parseInt(value) || 0;
      } else if (id === 'volumeLiters' || id === 'costPerLiter') {
        const liters = id === 'volumeLiters' ? parseFloat(value) || 0 : prev.volumeLiters;
        const costPerL = id === 'costPerLiter' ? parseFloat(value) || 0 : prev.costPerLiter;
        
        newFormData.volumeLiters = liters;
        newFormData.costPerLiter = costPerL;
        newFormData.totalCost = calculateTotalCost(liters, costPerL);
      } else if (id === 'totalCost') {
        // Se o usuário preencher o custo total, recalcula o custo por litro
        const total = parseFloat(value) || 0;
        const liters = prev.volumeLiters;
        
        newFormData.totalCost = total;
        if (liters > 0) {
          newFormData.costPerLiter = parseFloat((total / liters).toFixed(2));
        }
      }

      return newFormData;
    });
  };

  const handleSelectChange = (id: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmitSingle = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] dark:bg-gray-900 dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Fuel className="w-5 h-5 text-blue-500" />
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            {isEditing ? 'Edite os detalhes do abastecimento.' : 'Registre os detalhes do seu abastecimento ou inicie um registro de viagem.'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'single' | 'trip')} className="w-full">
          {!isEditing && (
            <TabsList className="grid w-full grid-cols-2 dark:bg-gray-800">
              <TabsTrigger value="single" className="flex items-center space-x-2">
                <Fuel className="w-4 h-4" />
                <span>Abastecimento Único</span>
              </TabsTrigger>
              <TabsTrigger value="trip" className="flex items-center space-x-2">
                <Car className="w-4 h-4" />
                <span>Registro de Viagem</span>
              </TabsTrigger>
            </TabsList>
          )}

          {/* Aba de Abastecimento Único (Formulário existente) */}
          <TabsContent value="single" className="mt-4">
            <form onSubmit={handleSubmitSingle} className="grid gap-4 py-4">
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
                <Label htmlFor="fuelType" className="text-right dark:text-gray-300">Combustível</Label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value) => handleSelectChange('fuelType', value as FuelingRecord['fuelType'])}
                >
                  <SelectTrigger className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    {['Gasolina Comum', 'Gasolina Aditivada', 'Etanol', 'Diesel'].map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="volumeLiters" className="text-right dark:text-gray-300">Litros</Label>
                <Input
                  id="volumeLiters"
                  type="number"
                  step="0.01"
                  value={formData.volumeLiters}
                  onChange={handleChange}
                  className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="costPerLiter" className="text-right dark:text-gray-300">Custo/L (R$)</Label>
                <Input
                  id="costPerLiter"
                  type="number"
                  step="0.01"
                  value={formData.costPerLiter}
                  onChange={handleChange}
                  className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="totalCost" className="text-right dark:text-gray-300">Custo Total (R$)</Label>
                <Input
                  id="totalCost"
                  type="number"
                  step="0.01"
                  value={formData.totalCost}
                  onChange={handleChange}
                  className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="station" className="text-right dark:text-gray-300">Posto</Label>
                <Input
                  id="station"
                  type="text"
                  value={formData.station}
                  onChange={handleChange}
                  placeholder="Nome do posto"
                  className="col-span-3 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
              
              <Button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                {isEditing ? 'Salvar Alterações' : 'Adicionar Abastecimento'}
              </Button>
            </form>
          </TabsContent>

          {/* Nova Aba de Registro de Viagem */}
          <TabsContent value="trip" className="mt-4">
            <TripFuelingForm onSubmit={onSubmit} onCancel={() => onOpenChange(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FuelingFormDialog;