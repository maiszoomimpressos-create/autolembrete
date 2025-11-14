import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MaintenanceRecord } from '@/types/maintenance';
import { Wrench, AlertTriangle, Clock, Gauge } from 'lucide-react';
import { showError } from '@/utils/toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MaintenanceFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recordToEdit: MaintenanceRecord | null;
  onSubmit: (data: Omit<MaintenanceRecord, 'id'>) => void;
  currentMileage: number; // Novo prop
}

// Tipo auxiliar para o estado do formulário, incluindo o intervalo
interface FormDataState extends Omit<MaintenanceRecord, 'id' | 'nextMileage'> {
    nextMileageInterval?: number;
}

const MaintenanceFormDialog: React.FC<MaintenanceFormDialogProps> = ({
  isOpen,
  onOpenChange,
  recordToEdit,
  onSubmit,
  currentMileage, // Recebendo o KM atual
}) => {
  const isEditing = !!recordToEdit;
  const title = isEditing ? 'Editar Manutenção' : 'Adicionar Nova Manutenção';

  // Estado inicial padrão
  const initialFormData: FormDataState = {
    date: new Date().toISOString().split('T')[0],
    mileage: currentMileage, // Usando o KM atual como padrão
    type: 'Troca de Óleo',
    customType: '',
    description: '',
    cost: 0,
    status: 'Concluído',
    nextMileageInterval: undefined,
    nextDate: undefined,
  };

  const [formData, setFormData] = React.useState<FormDataState>(initialFormData);

  React.useEffect(() => {
    if (recordToEdit) {
      // Modo Edição
      setFormData({
        date: recordToEdit.date,
        mileage: recordToEdit.mileage,
        type: recordToEdit.type,
        customType: recordToEdit.customType || '',
        description: recordToEdit.description,
        cost: recordToEdit.cost,
        status: recordToEdit.status,
        nextMileageInterval: recordToEdit.nextMileageInterval || undefined,
        nextDate: recordToEdit.nextDate || undefined,
      });
    } else {
      // Modo Criação Padrão: Atualiza o KM inicial se o modal for aberto
      setFormData({
        ...initialFormData,
        mileage: currentMileage,
      });
    }
  }, [recordToEdit, isOpen, currentMileage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    let parsedValue: string | number = value;
    if (id === 'mileage' || id === 'cost' || id === 'nextMileageInterval') {
        parsedValue = parseFloat(value) || 0;
    }
    
    setFormData(prev => ({
      ...prev,
      [id]: parsedValue,
    }));
  };

  const handleSelectChange = (id: keyof FormDataState, value: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: value,
      // Limpa customType se o tipo não for 'Outro'
      customType: value !== 'Outro' ? '' : prev.customType,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validação para o campo 'Outro'
    if (formData.type === 'Outro' && !formData.customType?.trim()) {
        showError('Por favor, especifique o nome da manutenção personalizada.');
        return;
    }
    
    // 2. Cálculo do nextMileage final
    let finalNextMileage: number | undefined = undefined;
    if (formData.nextMileageInterval && formData.nextMileageInterval > 0) {
        finalNextMileage = formData.mileage + formData.nextMileageInterval;
    }
    
    // 3. Validação de Data de Alerta
    if (formData.nextDate && new Date(formData.nextDate) <= new Date(formData.date)) {
        showError('A Data de Alerta deve ser posterior à data da manutenção atual.');
        return;
    }
    
    // 4. Preparar dados para submissão (incluindo o KM alvo calculado)
    const dataToSubmit: Omit<MaintenanceRecord, 'id'> = {
        ...formData,
        nextMileage: finalNextMileage, // KM alvo calculado
        nextMileageInterval: formData.nextMileageInterval, // Mantém o intervalo para referência
    };

    onSubmit(dataToSubmit);
    onOpenChange(false);
  };

  const isCustomType = formData.type === 'Outro';
  
  // Lógica de Alerta de KM
  const isCompleted = formData.status === 'Concluído';
  const isMileageHigherThanCurrent = isCompleted && formData.mileage > currentMileage;
  const mileageDifference = formData.mileage - currentMileage;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] dark:bg-gray-900 dark:text-white">
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
          
          {/* Seção de Detalhes Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Data */}
            <div className="space-y-2">
              <Label htmlFor="date" className="dark:text-gray-300">Data da Manutenção</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>
            
            {/* KM */}
            <div className="space-y-2">
              <Label htmlFor="mileage" className="dark:text-gray-300">Quilometragem (KM)</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={handleChange}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>
            
            {/* Tipo */}
            <div className="space-y-2">
              <Label htmlFor="type" className="dark:text-gray-300">Tipo de Serviço</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {['Troca de Óleo', 'Revisão', 'Pneus', 'Freios', 'Outro'].map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Custo */}
            <div className="space-y-2">
              <Label htmlFor="cost" className="dark:text-gray-300">Custo (R$)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={handleChange}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>
            
            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="dark:text-gray-300">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {['Concluído', 'Pendente', 'Agendado'].map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Campo de Nome Personalizado (aparece se Tipo for 'Outro') */}
            {isCustomType && (
              <div className="space-y-2">
                <Label htmlFor="customType" className="dark:text-gray-300">Nome Personalizado</Label>
                <Input
                  id="customType"
                  type="text"
                  value={formData.customType}
                  onChange={handleChange}
                  placeholder="Ex: Troca de Bateria"
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  required
                />
              </div>
            )}
          </div>
          
          {/* Alerta de KM */}
          {isMileageHigherThanCurrent && currentMileage > 0 && (
            <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-sm text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Atualização de Quilometragem Sugerida</p>
                  <p>O KM desta manutenção ({formData.mileage.toLocaleString('pt-BR')} km) é {mileageDifference.toLocaleString('pt-BR')} km maior que o KM atual registrado ({currentMileage.toLocaleString('pt-BR')} km). Considere atualizar o KM atual do seu veículo.</p>
                </div>
              </div>
            </div>
          )}

          {/* Seção de Alertas de Repetição */}
          <Card className="dark:bg-gray-800 dark:border-gray-700 mt-4">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-semibold flex items-center space-x-2 dark:text-white">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span>Alerta de Próxima Manutenção (Opcional)</span>
                </CardTitle>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Defina o intervalo de KM e/ou a Data para ser lembrado da próxima ocorrência deste serviço.
                </p>
            </CardHeader>
            <CardContent className="p-4 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* KM de Alerta (Intervalo) */}
                <div className="space-y-2">
                    <Label htmlFor="nextMileageInterval" className="dark:text-gray-300 flex items-center">
                        <Gauge className="w-4 h-4 mr-1 text-blue-500" />
                        Intervalo de KM (Ex: 10000)
                    </Label>
                    <Input
                        id="nextMileageInterval"
                        type="number"
                        value={formData.nextMileageInterval || ''}
                        onChange={handleChange}
                        placeholder="Ex: 10000 km"
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        min={0}
                    />
                    {formData.nextMileageInterval && formData.mileage > 0 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            KM Alvo: {(formData.mileage + formData.nextMileageInterval).toLocaleString('pt-BR')} km
                        </p>
                    )}
                </div>
                
                {/* Data de Alerta */}
                <div className="space-y-2">
                    <Label htmlFor="nextDate" className="dark:text-gray-300 flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-yellow-500" />
                        Data de Alerta
                    </Label>
                    <Input
                        id="nextDate"
                        type="date"
                        value={formData.nextDate || ''}
                        onChange={handleChange}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
            </CardContent>
          </Card>

          {/* Descrição */}
          <div className="grid gap-2">
            <Label htmlFor="description" className="dark:text-gray-300">Descrição Detalhada</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detalhes da manutenção, peças trocadas, local..."
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white min-h-[100px]"
            />
          </div>
          
          <Button type="submit" className="mt-4 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
            {isEditing ? 'Salvar Alterações' : 'Registrar Manutenção'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceFormDialog;