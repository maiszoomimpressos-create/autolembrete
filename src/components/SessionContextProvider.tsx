import React, { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@supabase/supabase-js';

interface SessionContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionContextProvider');
  }
  return context;
};

interface SessionContextProviderProps {
  children: React.ReactNode;
}

const SessionContextProvider: React.FC<SessionContextProviderProps> = ({ children }) => {
  const auth = useAuth();

  return (
    <SessionContext.Provider value={auth}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContextProvider;