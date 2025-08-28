import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';

interface SessionTimeoutProviderProps {
  children: ReactNode;
}

export const SessionTimeoutProvider = ({ children }: SessionTimeoutProviderProps) => {
  // Enable session timeout for admin users (30 min timeout, 5 min warning)
  useSessionTimeout({ 
    timeoutMinutes: 30, 
    warningMinutes: 5, 
    adminOnly: true 
  });

  return <>{children}</>;
};