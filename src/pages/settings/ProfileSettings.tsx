import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
import { showError } from '@/utils/toast';
import { Loader2 } from 'lucide-react';
import { ProfileData } from '@/types/profile';

// Tipo para o estado local do formulário (apenas campos editáveis)
interface ProfileFormState {
    firstName: string;
    lastName: string;
}

const ProfileSettings: React.FC = () => {
  const { profile, updateProfile, isLoading, isMutating } = useProfile();
  
  const [formData, setFormData] = useState<ProfileFormState>({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
  });

  useEffect(() => {
    // Atualiza o formulário quando os dados do perfil mudam (após o carregamento inicial ou mutação)
    setFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
    });
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    if (id === 'firstName') {
      setFormData(prev => ({ ...prev, firstName: value }));
    } else if (id === 'lastName') {
      setFormData(prev => ({ ...prev, lastName: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim()) {
        showError("O nome é obrigatório.");
        return;
    }

    const dataToUpdate: Omit<ProfileData, 'id' | 'avatarUrl'> = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim() || null,
    };

    updateProfile(dataToUpdate);
  };
  
  // Combina primeiro e último nome para exibição
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
        <p className="ml-2 dark:text-white">Carregando perfil...</p>
      </div>
    );
  }

  return (
    <Card className="shadow-none border-none dark:bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl dark:text-white">Perfil</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Atualize suas informações pessoais e endereço de e-mail.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Primeiro Nome</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome (Opcional)</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
                  />
                </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={profile.email} 
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
                disabled
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                O email é gerenciado pelo sistema de autenticação e não pode ser alterado aqui.
              </p>
            </div>
            
            <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                disabled={isMutating}
            >
              {isMutating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                'Salvar Alterações'
              )}
            </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;