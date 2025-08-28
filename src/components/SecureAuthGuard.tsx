import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';

// PHASE 6: UX Gating - Secure authentication guard component

interface SecureAuthGuardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  requiredMessage?: string;
  redirectPath?: string;
  actionText?: string;
}

export const SecureAuthGuard: React.FC<SecureAuthGuardProps> = ({
  children,
  title = "Authentication Required",
  description = "Please sign in to access this feature",
  requiredMessage = "To protect your personal information and ensure secure access, please sign in before continuing.",
  redirectPath,
  actionText = "Sign In"
}) => {
  const { user } = useAuth();

  // If user is authenticated, show the protected content
  if (user) {
    return <>{children}</>;
  }

  // Generate the redirect URL with current path as next parameter
  const currentPath = window.location.pathname + window.location.search + window.location.hash;
  const loginUrl = redirectPath || `/portal?next=${encodeURIComponent(currentPath)}`;

  // Show authentication gate
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-lg">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-amber-200 bg-amber-50">
            <Lock className="h-4 w-4" />
            <AlertTitle className="text-amber-800">🔐 Secure Access</AlertTitle>
            <AlertDescription className="text-amber-700">
              {requiredMessage}
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              We use industry-standard security measures to protect your data and ensure your privacy.
            </p>
            
            <Link to={loginUrl} className="block">
              <Button size="lg" className="w-full text-lg">
                <Shield className="w-4 h-4 mr-2" />
                {actionText}
              </Button>
            </Link>
            
            <p className="text-xs text-muted-foreground">
              Don't have an account? You can create one during the sign-in process.
            </p>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Encrypted</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// HOC version for easy wrapping
export const withSecureAuth = <P extends object>(
  Component: React.ComponentType<P>,
  guardProps?: Partial<SecureAuthGuardProps>
) => {
  return (props: P) => (
    <SecureAuthGuard {...guardProps}>
      <Component {...props} />
    </SecureAuthGuard>
  );
};

export default SecureAuthGuard;