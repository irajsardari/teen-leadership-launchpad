import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AuthSecurity, SecurityAudit } from '@/utils/security';
import { useToast } from '@/hooks/use-toast';

interface SecurityContextType {
  isSecure: boolean;
  userRole: string | null;
  canAccess: (requiredRole: string) => boolean;
  logSecurityEvent: (event: string, resourceType: string, resourceId?: string) => void;
  validateAccess: (action: string) => Promise<boolean>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isSecure, setIsSecure] = useState(false);

  useEffect(() => {
    const validateSecurity = async () => {
      if (!user) {
        setIsSecure(false);
        setUserRole(null);
        return;
      }

      try {
        // Validate session
        const sessionValid = await AuthSecurity.validateSession();
        if (!sessionValid) {
          setIsSecure(false);
          return;
        }

        // Get user role
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error);
          setIsSecure(false);
          return;
        }

        const role = profile?.role || 'challenger';
        setUserRole(role);
        setIsSecure(true);

        // Log session validation
        await SecurityAudit.log('session_validated', 'authentication', user.id);
        
      } catch (error) {
        console.error('Security validation error:', error);
        setIsSecure(false);
        toast({
          title: "Security Error",
          description: "Please refresh the page and try again",
          variant: "destructive",
        });
      }
    };

    validateSecurity();
  }, [user, toast]);

  const canAccess = (requiredRole: string): boolean => {
    if (!isSecure || !userRole) return false;
    
    // Admin can access everything
    if (userRole === 'admin') return true;
    
    // Exact role match
    if (userRole === requiredRole) return true;
    
    // Teacher can access student resources
    if (userRole === 'teacher' && requiredRole === 'challenger') return true;
    
    return false;
  };

  const logSecurityEvent = async (
    event: string, 
    resourceType: string, 
    resourceId?: string
  ) => {
    try {
      await SecurityAudit.log(event, resourceType, resourceId);
    } catch (error) {
      console.warn('Failed to log security event:', error);
    }
  };

  const validateAccess = async (action: string): Promise<boolean> => {
    if (!isSecure) {
      await logSecurityEvent('unauthorized_access_attempt', action);
      return false;
    }

    await logSecurityEvent('authorized_access', action, user?.id);
    return true;
  };

  const contextValue: SecurityContextType = {
    isSecure,
    userRole,
    canAccess,
    logSecurityEvent,
    validateAccess,
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

// HOC for protecting routes
export const withSecurityCheck = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: string
) => {
  return (props: P) => {
    const { canAccess, isSecure } = useSecurityContext();
    const { toast } = useToast();

    useEffect(() => {
      if (!isSecure) {
        toast({
          title: "Access Denied",
          description: "Please sign in to access this page",
          variant: "destructive",
        });
        return;
      }

      if (requiredRole && !canAccess(requiredRole)) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        return;
      }
    }, [isSecure, canAccess, requiredRole, toast]);

    if (!isSecure) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Access Denied</h2>
            <p className="text-muted-foreground">Please sign in to access this page</p>
          </div>
        </div>
      );
    }

    if (requiredRole && !canAccess(requiredRole)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access this page
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};