import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SessionTimeoutConfig {
  timeoutMinutes?: number;
  warningMinutes?: number;
  adminOnly?: boolean;
}

export const useSessionTimeout = ({
  timeoutMinutes = 30,
  warningMinutes = 5,
  adminOnly = true
}: SessionTimeoutConfig = {}) => {
  const { user, session, signOut } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef<number>(Date.now());

  const isAdmin = user?.user_metadata?.role === 'admin';
  const shouldTimeout = adminOnly ? isAdmin : !!user;

  const resetTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    
    if (!shouldTimeout || !session) return;

    lastActivityRef.current = Date.now();

    // Set warning timer
    warningRef.current = setTimeout(() => {
      toast.warning(
        `Your session will expire in ${warningMinutes} minutes due to inactivity`,
        {
          duration: 10000,
          action: {
            label: 'Stay Active',
            onClick: () => resetTimers()
          }
        }
      );
    }, (timeoutMinutes - warningMinutes) * 60 * 1000);

    // Set logout timer
    timeoutRef.current = setTimeout(() => {
      toast.error('Session expired due to inactivity');
      signOut();
    }, timeoutMinutes * 60 * 1000);
  }, [shouldTimeout, session, timeoutMinutes, warningMinutes, signOut]);

  const handleActivity = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;
    
    // Only reset if it's been more than 30 seconds since last activity
    if (timeSinceLastActivity > 30000) {
      resetTimers();
    }
  }, [resetTimers]);

  useEffect(() => {
    if (!shouldTimeout || !session) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      return;
    }

    // Start session timeout
    resetTimers();

    // Activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [shouldTimeout, session, handleActivity, resetTimers]);

  return {
    resetTimers,
    timeRemaining: timeoutMinutes * 60 * 1000 - (Date.now() - lastActivityRef.current)
  };
};