import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/SessionContextProvider';

const IndexPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useSession();

  // Redireciona se o usuário estiver logado
  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <p className="text-lg dark:text-white">Carregando...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: 'url(https://readdy.ai/api/search-image?query=modern%20automotive%20service%20garage%20with%20clean%20luxury%20cars%2C%20professional%20car%20maintenance%20workshop%20interior%2C%20bright%20lighting%20and%20organized%20tools%2C%20automotive%20service%20center%20background%20image%20for%20login%20page&width=1440&height=1024&seq=login-bg-1&orientation=landscape)'
      }}
    >
      <div className="absolute inset-0 bg-black/30 dark:bg-black/60"></div>
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="text-center space-y-6 mb-8">
          <div className="flex items-center justify-center space-x-3">
            <Car className="w-10 h-10 text-blue-400 drop-shadow-lg" />
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Autolembrete</h1>
          </div>
          <p className="text-lg text-white drop-shadow-lg">
            Gerencie a manutenção do seu veículo de forma inteligente e eficiente
          </p>
        </div>
        
        <div className="bg-white/95 backdrop-blur-sm shadow-2xl p-6 rounded-lg dark:bg-gray-900/95 dark:text-white">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="dark" // Usando tema escuro para combinar com o fundo
            providers={[]}
            redirectTo={window.location.origin + '/dashboard'}
            localization={{
                variables: {
                    sign_in: {
                        email_label: 'Email',
                        password_label: 'Senha',
                        email_input_placeholder: 'Seu email',
                        password_input_placeholder: 'Sua senha',
                        button_label: 'Entrar',
                        loading_button_label: 'Entrando...',
                        social_provider_text: 'Entrar com {{provider}}',
                        link_text: 'Já tem uma conta? Faça login',
                        confirmation_text: 'Verifique seu email para o link de login',
                    },
                    sign_up: {
                        email_label: 'Email',
                        password_label: 'Criar Senha',
                        email_input_placeholder: 'Seu email',
                        password_input_placeholder: 'Sua senha',
                        button_label: 'Criar Conta',
                        loading_button_label: 'Criando conta...',
                        social_provider_text: 'Criar conta com {{provider}}',
                        link_text: 'Não tem uma conta? Crie uma',
                        confirmation_text: 'Verifique seu email para confirmar a criação da conta',
                    },
                    forgotten_password: {
                        email_label: 'Email',
                        email_input_placeholder: 'Seu email',
                        button_label: 'Enviar instruções de recuperação',
                        loading_button_label: 'Enviando...',
                        link_text: 'Esqueceu sua senha?',
                        confirmation_text: 'Verifique seu email para o link de recuperação de senha',
                    },
                    update_password: {
                        password_label: 'Nova Senha',
                        password_input_placeholder: 'Sua nova senha',
                        button_label: 'Atualizar Senha',
                        loading_button_label: 'Atualizando...',
                    },
                }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default IndexPage;