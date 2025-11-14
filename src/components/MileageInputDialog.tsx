import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gauge, Loader2, Car, Check } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { useMileageRecords } from '@/hooks/useMileageRecords';
import { useFuelingRecords } from '@/hooks/useFuelingRecords';
import { useVehicle } from '@/hooks/useVehicle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';

interface MileageInputDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const MileageInputDialog: React.FC<MileageInputDialogProps> = ({ isOpen, onOpenChange }) => {
  const { records: fuelingRecords } = useFuelingRecords();
  const { currentMileage, addManualRecord, isMutating } = useMileageRecords(fuelingRecords);
  const { vehicle: activeVehicle, vehicles, isLoading: isLoadingVehicle } = useVehicle();
  
  const [mileage, setMileage] = useState<number>(currentMileage);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Estado local para o veículo selecionado no modal (apenas para exibição, o hook useVehicle já define o ativo)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(activeVehicle.id);

  useEffect(() => {
    // Atualiza o KM e o ID do veículo no formulário quando o veículo ativo muda
    setMileage(currentMileage);
    setSelectedVehicleId(activeVehicle.id);
  }, [currentMileage, activeVehicle.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeVehicle.id === '') {
        showError("Por favor, cadastre um veículo antes de registrar a quilometragem.");
        return;
    }
    
    if (mileage <= currentMileage) {
      showError(`O novo KM (${mileage.toLocaleString('pt-BR')}) deve ser maior que o KM atual registrado (${currentMileage.toLocaleString('pt-BR')}).`);
      return;
    }
    
    if (mileage <= 0) {
        showError("A quilometragem deve ser um valor positivo.");
        return;
    }

    try {
        // O addManualRecord usa o veículo ativo definido pelo useVehicle, que é o que está sendo exibido
        await addManualRecord(date, mileage);
        showSuccess(`Quilometragem do ${activeVehicle.model} atualizada para ${mileage.toLocaleString('pt-BR')} km.`);
        onOpenChange(false);
    } catch (e) {
        // Erro já tratado no hook
    }
  };
  
  const isLoading = isMutating || isLoadingVehicle;
  const hasMultipleVehicles = vehicles.length > 1;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Gauge className="w-5 h-5 text-blue-500" />
            <span>Registrar Quilometragem</span>
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Atualize o odômetro do veículo selecionado.
          </DialogDescription>
        </DialogHeader>
        
        {/* Seletor de Veículo (Aparece se houver múltiplos) */}
        {hasMultipleVehicles && (
            <div className="space-y-2">
                <Label htmlFor="vehicle-select">Veículo</Label>
                <Select
                    value={activeVehicle.id}
                    onValueChange={(id) => {
                        // Ao selecionar, atualiza o veículo ativo globalmente
                        const selected = vehicles.find(v => v.id === id);
                        if (selected) {
                            // O useVehicle já tem a função setActiveVehicle, mas como o MileageInputDialog
                            // não a expõe diretamente, vamos usar o hook useActiveVehicle se necessário,
                            // ou, mais simplesmente, confiar que o useVehicle está retornando o ativo.
                            // Para fins de demonstração e simplicidade, vamos apenas exibir o ativo.
                            // Se o usuário quiser trocar o veículo ativo, ele deve ir para a página de Configurações.
                            // Para evitar complexidade de estado global dentro de um modal simples,
                            // vamos manter o foco no veículo ATIVO.
                            showError("Para trocar o veículo ativo, vá para Configurações > Veículo.");
                        }
                    }}
                >
                    <SelectTrigger id="vehicle-select" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                        <SelectValue placeholder="Selecione o veículo" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        {vehicles.map(v => (
                            <SelectItem key={v.id} value={v.id}>
                                <div className="flex items-center justify-between w-full">
                                    <span>{v.model} ({v.plate})</span>
                                    {v.id === activeVehicle.id && <Check className="w-4 h-4 text-blue-500 ml-2" />}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Você está registrando o KM para o veículo ativo.
                </p>
            </div>
        )}
        
        {/* Exibição do Veículo Ativo (Sempre visível) */}
        <div className={cn(
            "flex items-center space-x-2 p-3 rounded-md border",
            hasMultipleVehicles ? "bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700" : "bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
        )}>
            <Car className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span className="text-sm font-medium dark:text-white">
                {activeVehicle.id ? `${activeVehicle.model} (${activeVehicle.plate})` : 'Nenhum Veículo Cadastrado'}
            </span>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          <div className="space-y-2">
            <Label htmlFor="mileage">Nova Quilometragem (KM)</Label>
            <Input
              id="mileage"
              type="number"
              value={mileage}
              onChange={(e) => setMileage(parseInt(e.target.value) || 0)}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
              min={currentMileage + 1}
              disabled={isLoading || activeVehicle.id === ''}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">KM atual registrado: {currentMileage.toLocaleString('pt-BR')} km</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Data do Registro</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
              disabled={isLoading || activeVehicle.id === ''}
            />
          </div>
          
          <Button 
            type="submit" 
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            disabled={isLoading || activeVehicle.id === ''}
          >
            {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                'Atualizar KM'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MileageInputDialog;