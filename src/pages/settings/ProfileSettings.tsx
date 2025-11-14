import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
import { showError } from '@/utils/toast';
import { Loader2, Edit, Save } from 'lucide-react';
import { ProfileData } from '@/types/profile';

// Tipo para o estado local do formulário (apenas campos editáveis)
interface ProfileFormState {
    firstName: string;
    lastName: string;
    phoneNumber: string; // Novo campo
}

const ProfileSettings: React.FC = () => {
  const { profile, updateProfile, isLoading, isMutating } = useProfile();
  
  const [isEditing, setIsEditing] = useState(false); // Novo estado para controle de edição
  
  const [formData, setFormData] = useState<ProfileFormState>({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    phoneNumber: profile.phoneNumber || '',
  });

  useEffect(() => {
    // Atualiza o formulário quando os dados do perfil mudam (após o carregamento inicial ou mutação)
    setFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      phoneNumber: profile.phoneNumber || '',
    });
    // Se a mutação for concluída com sucesso, sai do modo de edição
    if (!isMutating && isEditing) {
        setIsEditing(false);
    }
  }, [profile, isMutating]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    setFormData(prev => ({ ...prev, [id]: value }));
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
        phoneNumber: formData.phoneNumber.trim() || null,
    };

    updateProfile(dataToUpdate);
    // O useEffect acima irá definir isEditing para false após a conclusão da mutação
  };
  
  const handleEditClick = () => {
      setIsEditing(true);
  };
  
  const handleCancelClick = () => {
      // Reseta o formulário para os dados atuais do perfil e sai do modo de edição
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phoneNumber: profile.phoneNumber || '',
      });
      setIsEditing(false);
  };

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
      <CardHeader className="px-0 pt-0 flex flex-row justify-between items-start">
        <div>
            <CardTitle className="text-2xl dark:text-white">Perfil</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Atualize suas informações pessoais e endereço de e-mail.
            </CardDescription>
        </div>
        
        {/* Botão de Edição/Salvar/Cancelar */}
        <div>
            {isEditing ? (
                <div className="flex space-x-2">
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleCancelClick}
                        disabled={isMutating}
                        className="dark:hover:bg-gray-700"
                    >
                        Cancelar
                    </Button>
                    <Button 
                        type="submit" 
                        form="profile-form" // Associa ao formulário abaixo
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                        disabled={isMutating}
                    >
                        {isMutating ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        Salvar
                    </Button>
                </div>
            ) : (
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleEditClick}
                    className="dark:hover:bg-gray-700"
                >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                </Button>
            )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        <form id="profile-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Primeiro Nome</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
                    required
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome (Opcional)</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
                    disabled={!isEditing}
                  />
                </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Número de Telefone (Opcional)</Label>
              <Input 
                id="phoneNumber" 
                type="tel" 
                value={formData.phoneNumber} 
                onChange={handleChange} 
                placeholder="(XX) XXXXX-XXXX"
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
                disabled={!isEditing}
              />
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
            
            {/* O botão de salvar principal foi movido para o cabeçalho, mas mantemos o submit aqui para o formulário */}
            {isEditing && (
                <Button 
                    type="submit" 
                    className="hidden" // Esconde o botão duplicado
                    disabled={isMutating}
                >
                    Salvar Alterações
                </Button>
            )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;