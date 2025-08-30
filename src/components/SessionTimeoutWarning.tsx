import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SessionTimeoutWarningProps {
  warningMinutes?: number; // Show warning X minutes before timeout
  sessionTimeoutMinutes?: number; // Total session length for admins
}

export const SessionTimeoutWarning: React.FC<SessionTimeoutWarningProps> = ({
  warningMinutes = 5,
  sessionTimeoutMinutes = 720 // 12 hours for admin sessions
}) => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isExtending, setIsExtending] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    // Check if user is admin (only admins get session timeout warnings)
    const checkUserRole = async () => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (profile?.role !== 'admin') return;

        // Start session monitoring for admin users
        startSessionMonitoring();
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };

    checkUserRole();
  }, [user]);

  const startSessionMonitoring = () => {
    const checkSessionTimeout = () => {
      // Get session start time from localStorage or use current time
      const sessionStart = localStorage.getItem('admin_session_start');
      const startTime = sessionStart ? new Date(sessionStart) : new Date();
      
      if (!sessionStart) {
        localStorage.setItem('admin_session_start', startTime.toISOString());
      }

      const now = new Date();
      const sessionDuration = (now.getTime() - startTime.getTime()) / (1000 * 60); // in minutes
      const remainingMinutes = sessionTimeoutMinutes - sessionDuration;

      if (remainingMinutes <= warningMinutes && remainingMinutes > 0) {
        setTimeRemaining(Math.ceil(remainingMinutes));
        setShowWarning(true);
      } else if (remainingMinutes <= 0) {
        // Session has expired
        handleSessionExpired();
      }
    };

    // Check immediately and then every minute
    checkSessionTimeout();
    const interval = setInterval(checkSessionTimeout, 60000);

    return () => clearInterval(interval);
  };

  const handleSessionExpired = async () => {
    toast({
      title: "Session Expired",
      description: "Your admin session has expired for security reasons. Please sign in again.",
      variant: "destructive",
    });

    // Invalidate the session
    try {
      await supabase.rpc('invalidate_user_sessions', {
        target_user_id: user?.id
      });
    } catch (error) {
      console.error('Error invalidating session:', error);
    }

    // Clear session data and sign out
    localStorage.removeItem('admin_session_start');
    await signOut();
  };

  const handleExtendSession = async () => {
    setIsExtending(true);
    try {
      // Reset session start time
      localStorage.setItem('admin_session_start', new Date().toISOString());
      
      // Log session extension
      await supabase.rpc('log_sensitive_operation', {
        p_action: 'admin_session_extended',
        p_resource_type: 'session_management',
        p_resource_id: user?.id
      });

      setShowWarning(false);
      toast({
        title: "Session Extended",
        description: "Your admin session has been extended for another 12 hours.",
      });
    } catch (error) {
      console.error('Error extending session:', error);
      toast({
        title: "Extension Failed",
        description: "Failed to extend session. Please save your work and sign in again.",
        variant: "destructive",
      });
    } finally {
      setIsExtending(false);
    }
  };

  const handleSignOutNow = async () => {
    localStorage.removeItem('admin_session_start');
    await signOut();
  };

  const formatTimeRemaining = (minutes: number) => {
    if (minutes < 1) return 'less than 1 minute';
    if (minutes === 1) return '1 minute';
    return `${Math.ceil(minutes)} minutes`;
  };

  return (
    <Dialog open={showWarning} onOpenChange={setShowWarning}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            Session Timeout Warning
          </DialogTitle>
          <DialogDescription>
            Your admin session will expire soon for security reasons.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>Time remaining: {formatTimeRemaining(timeRemaining)}</strong>
              <br />
              Your session will automatically expire to protect sensitive data.
            </AlertDescription>
          </Alert>

          <div className="text-sm text-muted-foreground space-y-2">
            <p>What happens when your session expires:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>You'll be automatically signed out</li>
              <li>Any unsaved work will be lost</li>
              <li>You'll need to sign in again to continue</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleSignOutNow}
            className="w-full sm:w-auto"
          >
            Sign Out Now
          </Button>
          <Button
            onClick={handleExtendSession}
            disabled={isExtending}
            className="w-full sm:w-auto"
          >
            {isExtending ? 'Extending...' : 'Extend Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};