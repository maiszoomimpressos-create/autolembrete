import React, { useState, useCallback } from 'react';
import { Check, ChevronsUpDown, PlusCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GasStation } from '@/types/gasStation';
import { useGasStationsQuery, useGasStationMutations } from '@/integrations/supabase/gasStations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError } from '@/utils/toast';

interface GasStationComboboxProps {
  selectedStationName: string;
  onStationSelect: (name: string) => void;
}

const GasStationCombobox: React.FC<GasStationComboboxProps> = ({ selectedStationName, onStationSelect }) => {
  const [open, setOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newStationName, setNewStationName] = useState('');
  const [newStationCity, setNewStationCity] = useState('');
  const [newStationState, setNewStationState] = useState('');

  const { data: stations = [], isLoading: isLoadingStations } = useGasStationsQuery();
  const { addStation, isMutating } = useGasStationMutations();

  const handleSelect = useCallback((currentName: string) => {
    onStationSelect(currentName === selectedStationName ? '' : currentName);
    setOpen(false);
  }, [selectedStationName, onStationSelect]);

  const handleAddNewStation = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newStationName.trim();
    
    if (!name) {
        showError("O nome do posto é obrigatório.");
        return;
    }
    
    try {
        const newStation = await addStation({ 
            name, 
            city: newStationCity.trim(), 
            state: newStationState.trim() 
        });
        
        // Seleciona o novo posto e fecha o modal
        onStationSelect(newStation.name);
        setNewStationName('');
        setNewStationCity('');
        setNewStationState('');
        setIsAddingNew(false);
        setOpen(false);
    } catch (error) {
        // Erro já tratado no hook
    }
  };

  // Se estiver adicionando um novo posto
  if (isAddingNew) {
    return (
      <div className="space-y-3 p-2 border rounded-md dark:border-gray-700">
        <h4 className="text-sm font-semibold dark:text-white">Adicionar Novo Posto</h4>
        <form onSubmit={handleAddNewStation} className="grid gap-3">
          <Input
            placeholder="Nome do Posto (Obrigatório)"
            value={newStationName}
            onChange={(e) => setNewStationName(e.target.value)}
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Cidade (Opcional)"
              value={newStationCity}
              onChange={(e) => setNewStationCity(e.target.value)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Input
              placeholder="Estado (Opcional)"
              value={newStationState}
              onChange={(e) => setNewStationState(e.target.value)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAddingNew(false)}
                disabled={isMutating}
            >
                Cancelar
            </Button>
            <Button 
                type="submit" 
                size="sm" 
                disabled={isMutating}
            >
                {isMutating ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4 mr-1" />}
                Salvar Posto
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Combobox de Seleção
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          disabled={isLoadingStations}
        >
          {selectedStationName
            ? stations.find((station) => station.name === selectedStationName)?.name
            : "Selecione ou digite o posto..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100%-2rem)] p-0 dark:bg-gray-800 dark:border-gray-700">
        <Command className="dark:bg-gray-800">
          <CommandInput placeholder="Buscar posto..." className="dark:placeholder-gray-400" />
          <CommandList>
            {isLoadingStations ? (
                <CommandEmpty>
                    <Loader2 className="w-4 h-4 animate-spin mr-2 inline" /> Carregando postos...
                </CommandEmpty>
            ) : (
                <CommandEmpty>
                    Nenhum posto encontrado.
                    <Button 
                        variant="link" 
                        size="sm" 
                        onClick={() => setIsAddingNew(true)}
                        className="text-blue-500 dark:text-blue-400"
                    >
                        Adicionar Novo Posto
                    </Button>
                </CommandEmpty>
            )}
            <CommandGroup>
              {stations.map((station) => (
                <CommandItem
                  key={station.id}
                  value={station.name}
                  onSelect={() => handleSelect(station.name)}
                  className="dark:hover:bg-gray-700"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedStationName === station.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {station.name}
                  {(station.city || station.state) && (
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          ({[station.city, station.state].filter(Boolean).join('/')})
                      </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup>
                <CommandItem onSelect={() => setIsAddingNew(true)} className="text-blue-500 dark:text-blue-400 cursor-pointer">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Novo Posto
                </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default GasStationCombobox;