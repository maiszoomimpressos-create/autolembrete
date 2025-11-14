import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/components/SessionContextProvider';
import { supabase } from '@/integrations/supabase/client';
import { PlusCircle, Trash2, Loader2, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';

interface AdminEmail {
  id: string;
  email: string;
  created_at: string;
}

const MASTER_ADMIN_EMAIL = 'maiszoomimpressos@gmail.com';

const AdminEmailsPage: React.FC = () => {
  const { user } = useSession();
  const [adminEmails, setAdminEmails] = useState<AdminEmail[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAdminEmails = useCallback(async () => {
    setIsFetching(true);
    const { data, error } = await supabase
      .from('admin_emails')
      .select('id, email, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      showError('Erro ao carregar emails de administrador.');
      console.error(error);
    } else {
      setAdminEmails(data || []);
    }
    setIsFetching(false);
  }, []);

  useEffect(() => {
    fetchAdminEmails();
  }, [fetchAdminEmails]);

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = newEmail.trim().toLowerCase();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showError('Por favor, insira um email válido.');
      return;
    }
    if (email === MASTER_ADMIN_EMAIL) {
        showError('O email mestre já possui acesso irrestrito.');
        return;
    }
    if (adminEmails.some(a => a.email === email)) {
        showError('Este email já está na lista de administradores.');
        return;
    }

    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('admin_emails')
      .insert({ email, added_by: user?.id });

    setIsSubmitting(false);

    if (error) {
      showError('Erro ao adicionar email: ' + error.message);
      console.error(error);
    } else {
      showSuccess(`Email ${email} adicionado como administrador.`);
      setNewEmail('');
      fetchAdminEmails();
    }
  };

  const handleDeleteEmail = async (id: string, email: string) => {
    if (!window.confirm(`Tem certeza que deseja remover o acesso de administrador para ${email}?`)) {
      return;
    }

    const { error } = await supabase
      .from('admin_emails')
      .delete()
      .eq('id', id);

    if (error) {
      showError('Erro ao remover email: ' + error.message);
      console.error(error);
    } else {
      showSuccess(`Email ${email} removido.`);
      fetchAdminEmails();
    }
  };

  return (
    <Card className="shadow-none border-none dark:bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl dark:text-white flex items-center space-x-2">
            <Mail className="w-6 h-6 text-red-600 dark:text-red-400" />
            <span>Gerenciar Administradores</span>
        </CardTitle>
        <CardDescription className="dark:text-gray-400">
          Gerencie os e-mails autorizados que possuem acesso total ao painel de administração.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        {/* Adicionar Novo Administrador */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl dark:text-white">Adicionar Novo Administrador</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddEmail} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow space-y-2">
                <Label htmlFor="new-admin-email">Email do Novo Administrador</Label>
                <Input
                  id="new-admin-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="exemplo@dominio.com"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="sm:self-end bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <PlusCircle className="w-4 h-4 mr-2" />
                )}
                Adicionar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Administradores Autorizados */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl dark:text-white">E-mails Autorizados</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-md border dark:border-gray-700 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                  {/* Email Mestre */}
                  <tr className="bg-red-50/50 dark:bg-red-900/10">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {MASTER_ADMIN_EMAIL}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                      Mestre (Acesso Total)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <span className="text-gray-400 dark:text-gray-600">N/A</span>
                    </td>
                  </tr>
                  
                  {/* Emails Secundários */}
                  {isFetching ? (
                      <tr>
                          <td colSpan={3} className="text-center py-4 text-gray-500 dark:text-gray-400">
                              <Loader2 className="w-5 h-5 mx-auto animate-spin" />
                              Carregando...
                          </td>
                      </tr>
                  ) : adminEmails.length === 0 ? (
                      <tr>
                          <td colSpan={3} className="text-center py-4 text-gray-500 dark:text-gray-400">
                              Nenhum administrador secundário adicionado.
                          </td>
                      </tr>
                  ) : (
                      adminEmails.map((admin) => (
                          <tr key={admin.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                  {admin.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                                  Secundário
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => handleDeleteEmail(admin.id, admin.email)}
                                      className="text-red-500 hover:bg-red-500/10"
                                  >
                                      <Trash2 className="w-4 h-4" />
                                  </Button>
                              </td>
                          </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default AdminEmailsPage;