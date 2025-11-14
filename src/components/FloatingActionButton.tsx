import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Gauge } from 'lucide-react';
import MileageInputDialog from './MileageInputDialog';
import { cn } from '@/lib/utils';

const FloatingActionButton: React.FC = () => {
  const [isMileageDialogOpen, setIsMileageDialogOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsMileageDialogOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50",
          "h-14 w-14 rounded-full shadow-xl",
          "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800",
          "transition-transform duration-200 hover:scale-105"
        )}
        size="icon"
        title="Registrar Quilometragem"
      >
        <Gauge className="w-6 h-6" />
      </Button>

      <MileageInputDialog 
        isOpen={isMileageDialogOpen} 
        onOpenChange={setIsMileageDialogOpen} 
      />
    </>
  );
};

export default FloatingActionButton;