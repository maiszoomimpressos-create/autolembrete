"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MaintenanceForm } from './MaintenanceForm';

// Mock type for a maintenance record (should match the data structure in MaintenancePage)
interface MaintenanceRecord {
  id: string;
  type: 'oil' | 'revision' | 'tire' | 'brake' | 'other';
  title: string;
  date: string; // ISO date string or similar
  mileage: number;
  cost: number;
  workshop: string;
  notes: string;
  status: 'pending' | 'scheduled' | 'completed';
  urgency: 'Urgente' | 'Atenção' | 'Normal';
}

interface MaintenanceEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenance: MaintenanceRecord | null;
  onSave: (updatedData: any) => void;
}

const MaintenanceEditDialog: React.FC<MaintenanceEditDialogProps> = ({ open, onOpenChange, maintenance, onSave }) => {
  if (!maintenance) return null;

  // Convert mock data to form values
  const initialData = {
    type: maintenance.type,
    date: new Date(maintenance.date),
    mileage: maintenance.mileage,
    cost: maintenance.cost,
    workshop: maintenance.workshop,
    notes: maintenance.notes,
  };

  const handleFormSubmit = (data: any) => {
    // In a real app, you would call an API here.
    // For now, we call the onSave prop with the updated data and close the dialog.
    onSave({ ...maintenance, ...data });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Editar Manutenção: {maintenance.title}</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Atualize os detalhes desta manutenção.
          </DialogDescription>
        </DialogHeader>
        <MaintenanceForm
          initialData={initialData}
          onSubmit={handleFormSubmit}
          isEditing={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceEditDialog;