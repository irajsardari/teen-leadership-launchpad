import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';

interface SecurityMiddlewareProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'mentor' | 'challenger';
  enableRateLimit?: boolean;
  rateLimitAction?: string;
}

export const SecurityMiddleware: React.FC<SecurityMiddlewareProps> = ({
  children,
  requiredRole,
  enableRateLimit = true,
  rateLimitAction = 'page_access'
}) => {
  const { user, session } = useAuth();
  const [isValidating, setIsValidating] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockExpiry, setBlockExpiry] = useState<Date | null>(null);

  useEffect(() => {
    const validateAccess = async () => {
      try {
        setIsValidating(true);
        setErrorMessage('');

        // Check authentication
        if (!user || !session) {
          setHasAccess(false);
          setErrorMessage('Authentication required');
          return;
        }

        // Validate session freshness
        const sessionAge = Date.now() - new Date(session.user.created_at).getTime();
        const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (sessionAge > maxSessionAge) {
          await supabase.auth.signOut();
          setHasAccess(false);
          setErrorMessage('Session expired. Please sign in again.');
          return;
        }

        // Rate limiting check if enabled
        if (enableRateLimit) {
          try {
            const { data: rateLimitResult, error } = await supabase
              .rpc('check_enhanced_rate_limit', {
                p_identifier: `user_${user.id}`,
                p_action: rateLimitAction,
                p_max_attempts: 100, // High limit for page access
                p_window_minutes: 60
              });

            if (error) {
              console.warn('Rate limit check failed:', error);
            } else if (rateLimitResult && !rateLimitResult.allowed) {
              setIsBlocked(true);
              if (rateLimitResult.blocked_until) {
                setBlockExpiry(new Date(rateLimitResult.blocked_until));
              }
              setHasAccess(false);
              setErrorMessage('Rate limit exceeded. Please try again later.');
              return;
            }
          } catch (rateLimitError) {
            console.warn('Rate limiting error:', rateLimitError);
            // Continue without rate limiting if it fails
          }
        }

        // Get user role if role check is required
        if (requiredRole) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            setHasAccess(false);
            setErrorMessage('Unable to verify user permissions');
            return;
          }

          const currentRole = profile?.role || 'challenger';
          setUserRole(currentRole);

          // Check role permissions
          const hasRoleAccess = 
            currentRole === 'admin' || 
            currentRole === requiredRole ||
            (currentRole === 'mentor' && requiredRole === 'challenger');

          if (!hasRoleAccess) {
            setHasAccess(false);
            setErrorMessage(`Access denied. Required role: ${requiredRole}`);
            return;
          }
        }

        // Log successful access
        try {
          await supabase.rpc('log_sensitive_operation', {
            p_action: `security_middleware_access_${rateLimitAction}`,
            p_resource_type: 'authentication',
            p_resource_id: user.id
          });
        } catch (logError) {
          console.warn('Audit logging failed:', logError);
        }

        setHasAccess(true);
      } catch (error) {
        console.error('Security validation error:', error);
        setHasAccess(false);
        setErrorMessage('Security validation failed');
      } finally {
        setIsValidating(false);
      }
    };

    validateAccess();
  }, [user, session, requiredRole, enableRateLimit, rateLimitAction]);

  // Loading state
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Validating security...</span>
          </div>
        </div>
      </div>
    );
  }

  // Blocked state
  if (isBlocked && blockExpiry) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="max-w-md w-full p-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Access Temporarily Blocked</AlertTitle>
            <AlertDescription className="text-red-700 space-y-2">
              <p>Too many requests detected. Please wait before trying again.</p>
              <p className="text-sm">
                Access will be restored at: {blockExpiry.toLocaleString()}
              </p>
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              size="sm"
            >
              Check Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Access denied state
  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="max-w-md w-full p-6">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Access Denied</AlertTitle>
            <AlertDescription className="text-amber-700">
              {errorMessage}
            </AlertDescription>
          </Alert>
          <div className="mt-4 space-y-2 text-center">
            {!user && (
              <Button onClick={() => window.location.href = '/portal'}>
                Sign In
              </Button>
            )}
            <div className="text-sm text-muted-foreground">
              {userRole && (
                <p>Current role: <span className="font-medium">{userRole}</span></p>
              )}
              <p>If you believe this is an error, contact support.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Access granted - render protected content
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
};

export default SecurityMiddleware;