import { useMemo } from 'react';
import { useServiceTypesQuery, ServiceType } from '@/integrations/supabase/serviceTypes';
import { MaintenanceRecord } from '@/types/maintenance';

// Tipos de serviço comuns fixos foram removidos. A lista agora é baseada apenas no Supabase.

export const useServiceTypes = () => {
    const { data: customTypes = [], isLoading, error } = useServiceTypesQuery();

    const baseServiceTypes = useMemo(() => {
        const types: MaintenanceRecord['type'][] = [];
        
        // Adiciona tipos personalizados
        customTypes.forEach(type => {
            types.push(type.name as MaintenanceRecord['type']);
        });
        
        return types;
    }, [customTypes]);
    
    const allServiceTypesWithOther = useMemo(() => {
        // Adiciona a opção 'Outro' por último
        return [...baseServiceTypes, 'Outro'];
    }, [baseServiceTypes]);

    return {
        baseServiceTypes, // Tipos personalizados (sem 'Outro')
        allServiceTypes: allServiceTypesWithOther, // Tipos personalizados + 'Outro'
        isLoading,
        error,
        customTypes,
    };
};