import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TwoFactorAuth } from '@/components/TwoFactorAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Clock, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { SecurityMiddleware } from '@/components/SecurityMiddleware';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';

const AdminSecurityPage: React.FC = () => {
  const { timeRemaining } = useSessionTimeout();
  const sessionMinutesRemaining = Math.floor(timeRemaining / (1000 * 60));

  const securityFeatures = [
    {
      name: 'Two-Factor Authentication',
      status: 'configured',
      description: 'TOTP-based 2FA for admin accounts',
      icon: <Shield className="h-5 w-5" />
    },
    {
      name: 'Session Timeouts',
      status: 'active',
      description: '30-minute timeout with 5-minute warning',
      icon: <Clock className="h-5 w-5" />,
      detail: `${sessionMinutesRemaining} minutes remaining`
    },
    {
      name: 'Audit Logging',
      status: 'active',
      description: 'All admin actions logged and monitored',
      icon: <Eye className="h-5 w-5" />
    },
    {
      name: 'RLS Policies',
      status: 'active',
      description: 'Row-Level Security protecting all sensitive data',
      icon: <Shield className="h-5 w-5" />
    },
    {
      name: 'Rate Limiting',
      status: 'active',
      description: 'Protection against brute force attacks',
      icon: <Shield className="h-5 w-5" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'configured':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <SecurityMiddleware requiredRole="admin">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Security Settings</h1>
          <p className="text-muted-foreground">
            Manage security settings for the TMA Academy platform
          </p>
        </div>

        {/* Security Status Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Security Status
            </CardTitle>
            <CardDescription>
              Current security configuration and active protections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-muted-foreground">
                      {feature.icon}
                    </div>
                    <div>
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-sm text-muted-foreground">{feature.description}</div>
                      {feature.detail && (
                        <div className="text-xs text-blue-600 mt-1">{feature.detail}</div>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(feature.status)}>
                    {feature.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Manual Configuration Available */}
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Additional Protection Available:</strong> Enable Captcha protection to protect 
            authentication endpoints from bots and abuse attacks.
            <div className="mt-2">
              <Button variant="outline" size="sm" asChild>
                <a 
                  href="https://supabase.com/dashboard/project/gedgcagidpheugikoyim/auth/protection" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Configure Attack Protection
                </a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        {/* Two-Factor Authentication */}
        <div className="mb-8">
          <TwoFactorAuth />
        </div>

        {/* Security Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle>Security Monitoring</CardTitle>
            <CardDescription>
              View security logs and audit trails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" asChild>
                  <a 
                    href="https://supabase.com/dashboard/project/gedgcagidpheugikoyim/logs/auth-logs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Auth Logs
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a 
                    href="https://supabase.com/dashboard/project/gedgcagidpheugikoyim/logs/postgres-logs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Database Logs
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a 
                    href="https://supabase.com/dashboard/project/gedgcagidpheugikoyim/functions/secure-forms/logs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Function Logs
                  </a>
                </Button>
              </div>
              
              <Alert>
                <Eye className="h-4 w-4" />
                <AlertDescription>
                  All admin actions are automatically logged. Security audit logs are retained for compliance 
                  and can be accessed through the Supabase dashboard.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </SecurityMiddleware>
  );
};

export default AdminSecurityPage;