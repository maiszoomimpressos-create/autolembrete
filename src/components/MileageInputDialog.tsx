import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useFuelingRecords } from '@/hooks/useFuelingRecords';
import { useMileageRecords } from '@/hooks/useMileageRecords';
import { Gauge, Loader2, Fuel, Car } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showError, showSuccess } from '@/utils/toast';
import { useVehicle } from '@/hooks/useVehicle';
import { FuelingRecord } from '@/types/fueling';
import GasStationCombobox from './GasStationCombobox'; // Importando o Combobox
import { useAveragePriceQuery } from '@/hooks/useAveragePrice'; // Importando o hook de preço médio

interface MileageInputDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Tipos de combustível disponíveis
const FUEL_TYPES: FuelingRecord['fuelType'][] = ['Gasolina Comum', 'Gasolina Aditivada', 'Etanol', 'Diesel'];

const MileageInputDialog: React.FC<MileageInputDialogProps> = ({ isOpen, onOpenChange }) => {
  const { vehicle: activeVehicle } = useVehicle();
  const { records: fuelingRecords, addOrUpdateRecord: addFuelingRecord, isMutating: isFuelingMutating } = useFuelingRecords();
  const { currentMileage, addManualRecord, isMutating: isMileageMutating } = useMileageRecords(fuelingRecords);

  const [newMileage, setNewMileage] = useState<number>(currentMileage);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Estados para Abastecimento Opcional
  const [isFuelingEnabled, setIsFuelingEnabled] = useState(false);
  const [volumeLiters, setVolumeLiters] = useState<number>(0);
  const [costPerLiter, setCostPerLiter] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [fuelType, setFuelType] = useState<FuelingRecord['fuelType']>(FUEL_TYPES[0]);
  const [station, setStation] = useState<string>('');
  const [isPriceSuggested, setIsPriceSuggested] = useState(false);

  // Hook para buscar o preço médio
  const { data: averagePrice, isLoading: isLoadingPrice } = useAveragePriceQuery(
    { 
        fuelType, 
        stationName: station 
    }, 
    isOpen && isFuelingEnabled // Habilita a query apenas quando o modal está aberto e o abastecimento está ativo
  );
  
  // Efeito para aplicar o preço sugerido
  React.useEffect(() => {
      if (averagePrice !== null && averagePrice > 0 && isFuelingEnabled && !isPriceSuggested) {
          setCostPerLiter(averagePrice);
          // Recalcula o custo total se litros já estiver preenchido
          setTotalCost(parseFloat((volumeLiters * averagePrice).toFixed(2)));
          setIsPriceSuggested(true);
      }
  }, [averagePrice, isFuelingEnabled, isPriceSuggested, volumeLiters]);


  // Atualiza o estado local do KM quando o KM atual muda (após o carregamento inicial ou mutação)
  React.useEffect(() => {
    setNewMileage(currentMileage);
  }, [currentMileage]);
  
  // Lógica de cálculo de custo bidirecional
  React.useEffect(() => {
    if (isFuelingEnabled) {
        // Recalcula Custo Total se Litros ou Custo/L mudar
        const calculatedTotal = parseFloat((volumeLiters * costPerLiter).toFixed(2));
        if (calculatedTotal !== totalCost) {
            setTotalCost(calculatedTotal);
        }
    }
  }, [volumeLiters, costPerLiter, isFuelingEnabled]);
  
  const handleTotalCostChange = (value: string) => {
    const total = parseFloat(value) || 0;
    setTotalCost(total);
    setIsPriceSuggested(false);
    
    // Recalcula Custo/L se Litros > 0
    if (volumeLiters > 0) {
        const calculatedCostPerLiter = parseFloat((total / volumeLiters).toFixed(2));
        setCostPerLiter(calculatedCostPerLiter);
    }
  };
  
  const handleVolumeLitersChange = (value: string) => {
      const liters = parseFloat(value) || 0;
      setVolumeLiters(liters);
      setIsPriceSuggested(false);
      
      // Recalcula Custo Total
      setTotalCost(parseFloat((liters * costPerLiter).toFixed(2)));
  };
  
  const handleCostPerLiterChange = (value: string) => {
      const cost = parseFloat(value) || 0;
      setCostPerLiter(cost);
      setIsPriceSuggested(false);
      
      // Recalcula Custo Total
      setTotalCost(parseFloat((volumeLiters * cost).toFixed(2)));
  };
  
  const handleFuelTypeChange = (value: string) => {
      setFuelType(value as FuelingRecord['fuelType']);
      setIsPriceSuggested(false); // Resetar sugestão ao mudar o tipo
  };
  
  const handleStationSelect = (stationName: string) => {
      setStation(stationName);
      setIsPriceSuggested(false); // Resetar sugestão ao mudar o posto
  };
  
  const handleApplySuggestedPrice = () => {
      if (averagePrice !== null && averagePrice > 0) {
          setCostPerLiter(averagePrice);
          setTotalCost(parseFloat((volumeLiters * averagePrice).toFixed(2)));
          setIsPriceSuggested(true);
      }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeVehicle.id === '') {
        showError("Por favor, cadastre um veículo antes de registrar a quilometragem.");
        return;
    }

    if (newMileage <= currentMileage) {
      showError(`A nova quilometragem (${newMileage.toLocaleString('pt-BR')} km) deve ser maior que a quilometragem atual (${currentMileage.toLocaleString('pt-BR')} km).`);
      return;
    }
    
    if (!date) {
        showError("A data é obrigatória.");
        return;
    }
    
    if (isFuelingEnabled) {
        // Validação de abastecimento
        if (volumeLiters <= 0 || totalCost <= 0) {
            showError("Preencha Litros e Custo Total para registrar o abastecimento.");
            return;
        }
        
        // 1. Registrar Abastecimento (que também atualiza o KM)
        const fuelingData: Omit<FuelingRecord, 'id'> = {
            date,
            mileage: newMileage,
            fuelType,
            volumeLiters,
            costPerLiter,
            totalCost,
            station,
            vehicleId: activeVehicle.id,
        };
        
        try {
            await addFuelingRecord(fuelingData);
            showSuccess(`Abastecimento e quilometragem atualizados para ${newMileage.toLocaleString('pt-BR')} km.`);
            onOpenChange(false);
        } catch (error) {
            // Erro tratado no hook
        }
        
    } else {
        // 2. Registrar KM Manual
        try {
            await addManualRecord(date, newMileage);
            showSuccess(`Quilometragem atualizada para ${newMileage.toLocaleString('pt-BR')} km.`);
            onOpenChange(false);
        } catch (error) {
            // Erro tratado no hook
        }
    }
  }, [
    newMileage, 
    currentMileage, 
    date, 
    addManualRecord, 
    onOpenChange, 
    isFuelingEnabled,
    volumeLiters,
    costPerLiter,
    totalCost,
    fuelType,
    station,
    addFuelingRecord,
    activeVehicle.id
  ]);
  
  const isMutating = isMileageMutating || isFuelingMutating;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Gauge className="w-5 h-5 text-blue-500" />
            <span>Registro Rápido de Quilometragem</span>
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Atualize o odômetro do seu veículo.
          </DialogDescription>
        </DialogHeader>
        
        {activeVehicle.id === '' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 dark:bg-red-900/10 dark:border-red-900 dark:text-red-400">
                ⚠️ Por favor, cadastre um veículo em Configurações antes de adicionar registros.
            </div>
        )}
        
        <div className="p-0">
          <form onSubmit={handleSubmit} className="grid gap-4">
            
            {/* KM Atual Registrada */}
            <div className="space-y-2">
              <Label htmlFor="current-mileage" className="dark:text-gray-300">Quilometragem Atual Registrada</Label>
              <Input
                id="current-mileage"
                type="text"
                value={`${currentMileage.toLocaleString('pt-BR')} km`}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                disabled
              />
            </div>
            
            {/* Data do Registro */}
            <div className="space-y-2">
              <Label htmlFor="date" className="dark:text-gray-300">Data do Registro</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Nova Quilometragem */}
            <div className="space-y-2">
              <Label htmlFor="new-mileage" className="dark:text-gray-300">Nova Quilometragem (KM)</Label>
              <Input
                id="new-mileage"
                type="number"
                value={newMileage}
                onChange={(e) => setNewMileage(parseInt(e.target.value) || 0)}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
                min={currentMileage + 1}
              />
              {newMileage > 0 && newMileage <= currentMileage && (
                <p className="text-xs text-red-500">O KM deve ser maior que o KM atual.</p>
              )}
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
                onCheckedChange={(checked) => {
                    setIsFuelingEnabled(checked);
                    setIsPriceSuggested(false); // Resetar sugestão ao desativar/ativar
                }}
                disabled={isMutating || activeVehicle.id === ''}
              />
            </div>
            
            {/* Campos de Abastecimento (Condicional) */}
            {isFuelingEnabled && (
              <div className="grid gap-4 border p-4 rounded-lg dark:border-gray-700">
                  <h3 className="text-lg font-semibold dark:text-white">Detalhes do Abastecimento</h3>
                  
                  <div className="space-y-2">
                      <Label htmlFor="fuelType" className="dark:text-gray-300">Tipo de Combustível</Label>
                      <Select
                        value={fuelType}
                        onValueChange={handleFuelTypeChange}
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
                  
                  {/* Posto (Combobox) */}
                  <div className="space-y-2">
                    <Label htmlFor="station" className="dark:text-gray-300">Posto</Label>
                    <GasStationCombobox 
                        selectedStationName={station}
                        onStationSelect={handleStationSelect}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="volumeLiters" className="dark:text-gray-300">Litros</Label>
                        <Input
                          id="volumeLiters"
                          type="number"
                          step="0.01"
                          value={volumeLiters}
                          onChange={(e) => handleVolumeLitersChange(e.target.value)}
                          className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          required={isFuelingEnabled}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="costPerLiter" className="dark:text-gray-300">Custo/L (R$)</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                              id="costPerLiter"
                              type="number"
                              step="0.01"
                              value={costPerLiter}
                              onChange={(e) => handleCostPerLiterChange(e.target.value)}
                              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                              required={isFuelingEnabled}
                            />
                            {averagePrice !== null && averagePrice > 0 && (
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={handleApplySuggestedPrice}
                                    className="flex-shrink-0 text-xs h-10 dark:hover:bg-gray-700"
                                    disabled={isLoadingPrice}
                                >
                                    {isLoadingPrice ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        `Sugestão: R$ ${averagePrice.toFixed(2)}`
                                    )}
                                </Button>
                            )}
                        </div>
                        {isPriceSuggested && (
                            <p className="text-xs text-green-600 dark:text-green-400">
                                Preço sugerido aplicado.
                            </p>
                        )}
                      </div>
                  </div>
                  
                  <div className="space-y-2">
                      <Label htmlFor="totalCost" className="dark:text-gray-300">Custo Total (R$)</Label>
                      <Input
                        id="totalCost"
                        type="number"
                        step="0.01"
                        value={totalCost}
                        onChange={(e) => handleTotalCostChange(e.target.value)}
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        required={isFuelingEnabled}
                      />
                  </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="mt-2 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              disabled={isMutating || newMileage <= currentMileage || activeVehicle.id === ''}
            >
              {isMutating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                isFuelingEnabled ? 'Registrar Abastecimento e KM' : 'Salvar Nova Quilometragem'
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MileageInputDialog;