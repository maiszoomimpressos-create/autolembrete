import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gauge, Loader2, Car, Check, Fuel } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { useMileageRecords } from '@/hooks/useMileageRecords';
import { useFuelingRecords } from '@/hooks/useFuelingRecords';
import { useVehicle } from '@/hooks/useVehicle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { Switch } from "@/components/ui/switch";
import { FuelingRecord } from '@/types/fueling';
import { useFuelingMutations } from '@/integrations/supabase/fueling';

interface MileageInputDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const FUEL_TYPES = ['Gasolina Comum', 'Gasolina Aditivada', 'Etanol', 'Diesel'];

const MileageInputDialog: React.FC<MileageInputDialogProps> = ({ isOpen, onOpenChange }) => {
  const { records: fuelingRecords } = useFuelingRecords();
  const { currentMileage, addManualRecord, isMutating: isMileageMutating } = useMileageRecords(fuelingRecords);
  const { vehicle: activeVehicle, vehicles, isLoading: isLoadingVehicle } = useVehicle();
  const { addRecord: addFuelingRecord, isMutating: isFuelingMutating } = useFuelingMutations();
  
  const [mileage, setMileage] = useState<number>(currentMileage);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [isFuelingEnabled, setIsFuelingEnabled] = useState(false);
  
  // Helper para o estado inicial do formulário de abastecimento
  const initialFuelingData = useMemo(() => ({
    date: new Date().toISOString().split('T')[0],
    mileage: currentMileage,
    fuelType: 'Gasolina Comum' as FuelingRecord['fuelType'],
    volumeLiters: 0,
    costPerLiter: 0,
    totalCost: 0,
    station: '',
  }), [currentMileage]);
  
  const [fuelingData, setFuelingData] = useState<Omit<FuelingRecord, 'id' | 'vehicleId'>>(initialFuelingData);

  useEffect(() => {
    // Atualiza KM e data no formulário principal e no estado de abastecimento ao abrir
    if (isOpen) {
        setMileage(currentMileage);
        setDate(new Date().toISOString().split('T')[0]);
        setFuelingData(prev => ({
            ...initialFuelingData,
            mileage: currentMileage,
            date: new Date().toISOString().split('T')[0],
        }));
    }
  }, [currentMileage, isOpen, initialFuelingData]);
  
  // Sync mileage and date inputs with fueling data whenever they change
  useEffect(() => {
      setFuelingData(prev => ({
          ...prev,
          mileage: mileage,
          date: date,
      }));
  }, [mileage, date]);

  const calculateTotalCost = (liters: number, costPerL: number) => {
    return parseFloat((liters * costPerL).toFixed(2));
  };
  
  const calculateCostPerLiter = (totalCost: number, liters: number) => {
    if (liters > 0) {
      return parseFloat((totalCost / liters).toFixed(2));
    }
    return 0;
  };

  const handleFuelingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    setFuelingData(prev => {
      let newFormData = { ...prev, [id]: value };

      if (id === 'volumeLiters' || id === 'costPerLiter' || id === 'totalCost') {
        const liters = id === 'volumeLiters' ? parseFloat(value) || 0 : prev.volumeLiters;
        const costPerL = id === 'costPerLiter' ? parseFloat(value) || 0 : prev.costPerLiter;
        const total = id === 'totalCost' ? parseFloat(value) || 0 : prev.totalCost;
        
        if (id === 'totalCost') {
            newFormData.totalCost = total;
            newFormData.costPerLiter = calculateCostPerLiter(total, liters);
        } else {
            newFormData.volumeLiters = liters;
            newFormData.costPerLiter = costPerL;
            newFormData.totalCost = calculateTotalCost(liters, costPerL);
        }
      } else if (id === 'station') {
        newFormData.station = value;
      }

      return newFormData;
    });
  };
  
  const handleFuelTypeChange = (value: string) => {
    setFuelingData(prev => ({
        ...prev,
        fuelType: value as FuelingRecord['fuelType'],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeVehicle.id === '') {
        showError("Por favor, cadastre um veículo antes de registrar a quilometragem.");
        return;
    }
    
    if (mileage <= 0) {
        showError("A quilometragem deve ser um valor positivo.");
        return;
    }
    
    const isMileageUpdated = mileage > currentMileage;
    
    if (!isMileageUpdated && !isFuelingEnabled) {
        showError("Nenhuma alteração detectada. Insira um novo KM ou habilite o registro de abastecimento.");
        return;
    }
    
    // Se não for abastecimento, o KM deve ser estritamente maior
    if (!isFuelingEnabled && mileage <= currentMileage) {
        showError(`O novo KM (${mileage.toLocaleString('pt-BR')}) deve ser maior que o KM atual registrado (${currentMileage.toLocaleString('pt-BR')}).`);
        return;
    }
    
    const promises: Promise<any>[] = [];
    let kmUpdateMessage = '';
    
    if (isFuelingEnabled) {
        // 1. Validar dados de abastecimento
        if (fuelingData.volumeLiters <= 0 || fuelingData.totalCost <= 0) {
            showError("Por favor, preencha Litros e Custo Total para o registro de abastecimento.");
            return;
        }
        
        // 2. Registrar Abastecimento (que implicitamente registra o KM)
        const fuelingRecordToSubmit: Omit<FuelingRecord, 'id'> = {
            ...fuelingData,
            mileage: mileage, // Usa o KM do formulário principal
            date: date, // Usa a data do formulário principal
            vehicleId: activeVehicle.id,
        };
        promises.push(addFuelingRecord(fuelingRecordToSubmit));
        kmUpdateMessage = `Abastecimento e KM (${mileage.toLocaleString('pt-BR')} km) registrados com sucesso!`;
    } else if (isMileageUpdated) {
        // 3. Registrar KM Manualmente (apenas se KM foi atualizado E não é um abastecimento)
        promises.push(addManualRecord(date, mileage));
        kmUpdateMessage = `Quilometragem do ${activeVehicle.model} atualizada para ${mileage.toLocaleString('pt-BR')} km.`;
    } else {
        // Caso em que isFuelingEnabled é false e isMileageUpdated é false, mas o código chegou aqui.
        return;
    }

    try {
        await Promise.all(promises);
        showSuccess(kmUpdateMessage);
        onOpenChange(false);
        
        // Reset fueling state after successful submission
        setIsFuelingEnabled(false);
        setFuelingData(initialFuelingData);
    } catch (e) {
        // Error handled by hooks
    }
  };
  
  const isLoading = isMileageMutating || isFuelingMutating || isLoadingVehicle;
  const hasMultipleVehicles = vehicles.length > 1;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] dark:bg-gray-900 dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Gauge className="w-5 h-5 text-blue-500" />
            <span>Registrar Quilometragem</span>
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Atualize o odômetro do veículo selecionado e, opcionalmente, registre um abastecimento.
          </DialogDescription>
        </DialogHeader>
        
        {/* Exibição do Veículo Ativo */}
        <div className={cn(
            "flex items-center space-x-2 p-3 rounded-md border",
            hasMultipleVehicles ? "bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700" : "bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
        )}>
            <Car className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span className="text-sm font-medium dark:text-white">
                Veículo Ativo: {activeVehicle.id ? `${activeVehicle.model} (${activeVehicle.plate})` : 'Nenhum Veículo Cadastrado'}
            </span>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          {/* KM e Data */}
          <div className="space-y-2">
            <Label htmlFor="mileage">Nova Quilometragem (KM)</Label>
            <Input
              id="mileage"
              type="number"
              value={mileage}
              onChange={(e) => setMileage(parseInt(e.target.value) || 0)}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
              min={currentMileage}
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
          
          {/* Toggle para Abastecimento */}
          <div className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center space-x-3">
                <Fuel className="w-5 h-5 text-green-500" />
                <div>
                    <Label htmlFor="fueling-switch" className="text-base dark:text-white">Incluir Abastecimento</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Marque se este registro de KM foi feito durante um abastecimento.
                    </p>
                </div>
            </div>
            <Switch
              id="fueling-switch"
              checked={isFuelingEnabled}
              onCheckedChange={setIsFuelingEnabled}
              disabled={isLoading || activeVehicle.id === ''}
            />
          </div>
          
          {/* Campos de Abastecimento (Condicional) */}
          {isFuelingEnabled && (
            <div className="grid gap-4 border p-4 rounded-lg dark:border-gray-700">
                <h3 className="text-lg font-semibold dark:text-white">Detalhes do Abastecimento</h3>
                
                <div className="space-y-2">
                    <Label htmlFor="fuelType">Tipo de Combustível</Label>
                    <Select
                      value={fuelingData.fuelType}
                      onValueChange={handleFuelTypeChange}
                      disabled={isLoading || activeVehicle.id === ''}
                    >
                      <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        {FUEL_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="volumeLiters">Litros</Label>
                      <Input
                        id="volumeLiters"
                        type="number"
                        step="0.01"
                        value={fuelingData.volumeLiters}
                        onChange={handleFuelingChange}
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        required
                        disabled={isLoading || activeVehicle.id === ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="costPerLiter">Custo/L (R$)</Label>
                      <Input
                        id="costPerLiter"
                        type="number"
                        step="0.01"
                        value={fuelingData.costPerLiter}
                        onChange={handleFuelingChange}
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        required
                        disabled={isLoading || activeVehicle.id === ''}
                      />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="totalCost">Custo Total (R$)</Label>
                    <Input
                      id="totalCost"
                      type="number"
                      step="0.01"
                      value={fuelingData.totalCost}
                      onChange={handleFuelingChange}
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      required
                      disabled={isLoading || activeVehicle.id === ''}
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="station">Posto (Opcional)</Label>
                    <Input
                      id="station"
                      type="text"
                      value={fuelingData.station}
                      onChange={handleFuelingChange}
                      placeholder="Nome do posto"
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      disabled={isLoading || activeVehicle.id === ''}
                    />
                </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            disabled={isLoading || activeVehicle.id === ''}
          >
            {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                isFuelingEnabled ? 'Registrar Abastecimento e KM' : 'Atualizar KM'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MileageInputDialog;