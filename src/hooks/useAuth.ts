import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
}

const MASTER_ADMIN_EMAIL = 'maiszoomimpressos@gmail.com';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAdmin: false,
  });

  const checkAdminStatus = useCallback(async (user: User) => {
    if (user.email === MASTER_ADMIN_EMAIL) {
      return true;
    }

    // Check if the user's email is in the admin_emails table
    const { data, error } = await supabase
      .from('admin_emails')
      .select('email')
      .eq('email', user.email)
      .single();

    return !!data;
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = session.user;
        const isAdmin = await checkAdminStatus(user);
        setAuthState({ user, isLoading: false, isAdmin });
      } else {
        setAuthState({ user: null, isLoading: false, isAdmin: false });
      }
    });

    // Fetch initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const user = session.user;
        const isAdmin = await checkAdminStatus(user);
        setAuthState({ user, isLoading: false, isAdmin });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, [checkAdminStatus]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setAuthState({ user: null, isLoading: false, isAdmin: false });
  }, []);

  return { ...authState, signOut };
};