import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, CheckCircle, Clock, Activity, Users, FileText, Database } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { MFASetup } from './MFASetup';
import { SecurityAuditLog } from './SecurityAuditLog';

interface SecurityStatus {
  overall_status: 'SECURE' | 'NEEDS_ATTENTION';
  rls: {
    enabled_tables: number;
    required_tables: number;
    status: 'PASS' | 'FAIL';
  };
  storage: {
    secure_buckets: number;
    status: 'PASS' | 'FAIL';
  };
  policies_updated: boolean;
  encryption_enabled: boolean;
  audit_logging: boolean;
  timestamp: string;
}

interface SecurityMetrics {
  total_users: number;
  admin_users: number;
  recent_logins: number;
  failed_attempts: number;
  sensitive_operations: number;
}

export const SecurityDashboard: React.FC = () => {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadSecurityData();
      checkMFAStatus();
    }
  }, [user]);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      
      // Get security status
      const { data: statusData, error: statusError } = await supabase
        .rpc('get_security_status');

      if (statusError) {
        console.error('Security status error:', statusError);
        toast({
          title: "Access Denied", 
          description: "Admin privileges required to view security dashboard.",
          variant: "destructive",
        });
        return;
      }

      setSecurityStatus(statusData as unknown as SecurityStatus);

      // Get security metrics
      const { data: auditData } = await supabase
        .from('security_audit_logs')
        .select('action, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(1000);

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('role')
        .limit(1000);

      // Calculate metrics
      const totalUsers = profilesData?.length || 0;
      const adminUsers = profilesData?.filter(p => p.role === 'admin').length || 0;
      const recentLogins = auditData?.filter(a => a.action.includes('login')).length || 0;
      const failedAttempts = auditData?.filter(a => a.action.includes('failed')).length || 0;
      const sensitiveOps = auditData?.filter(a => 
        a.action.includes('CRITICAL') || 
        a.action.includes('SENSITIVE') ||
        a.action.includes('CONFIDENTIAL')
      ).length || 0;

      setMetrics({
        total_users: totalUsers,
        admin_users: adminUsers,
        recent_logins: recentLogins,
        failed_attempts: failedAttempts,
        sensitive_operations: sensitiveOps
      });

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading security data:', error);
      toast({
        title: "Error",
        description: "Failed to load security dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkMFAStatus = async () => {
    if (!user) return;

    try {
      // For now, simulate MFA status - in production this would check the admin_mfa_settings table
      // Once the types are regenerated, we can use the proper table query
      const { data: auditData } = await supabase
        .from('security_audit_logs')
        .select('action')
        .eq('user_id', user.id)
        .eq('action', 'mfa_setup_completed')
        .limit(1);

      setMfaEnabled(auditData && auditData.length > 0);
    } catch (error) {
      console.error('Error checking MFA status:', error);
    }
  };

  const getStatusIcon = (status: 'PASS' | 'FAIL' | 'SECURE' | 'NEEDS_ATTENTION') => {
    switch (status) {
      case 'PASS':
      case 'SECURE':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'FAIL':
      case 'NEEDS_ATTENTION':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: 'PASS' | 'FAIL' | 'SECURE' | 'NEEDS_ATTENTION') => {
    switch (status) {
      case 'PASS':
      case 'SECURE':
        return 'bg-green-100 text-green-800';
      case 'FAIL':
      case 'NEEDS_ATTENTION':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Security Dashboard</h1>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading security data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Security Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <Button variant="outline" size="sm" onClick={loadSecurityData}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Security Status */}
      {securityStatus && (
        <Alert className={securityStatus.overall_status === 'SECURE' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <div className="flex items-center gap-2">
            {getStatusIcon(securityStatus.overall_status)}
            <AlertDescription className="font-medium">
              System Security Status: 
              <Badge className={`ml-2 ${getStatusColor(securityStatus.overall_status)}`}>
                {securityStatus.overall_status}
              </Badge>
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Security Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.total_users}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.admin_users} admin users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.recent_logins}</div>
              <p className="text-xs text-muted-foreground">
                logins in 24h
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{metrics.failed_attempts}</div>
              <p className="text-xs text-muted-foreground">
                in 24h
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sensitive Ops</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.sensitive_operations}</div>
              <p className="text-xs text-muted-foreground">
                operations in 24h
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mfa">Two-Factor Auth</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {securityStatus && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Row Level Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">
                        {securityStatus.rls.enabled_tables}/{securityStatus.rls.required_tables}
                      </div>
                      <p className="text-sm text-muted-foreground">Tables protected</p>
                    </div>
                    <Badge className={getStatusColor(securityStatus.rls.status)}>
                      {securityStatus.rls.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Storage Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">
                        {securityStatus.storage.secure_buckets}
                      </div>
                      <p className="text-sm text-muted-foreground">Secure buckets</p>
                    </div>
                    <Badge className={getStatusColor(securityStatus.storage.status)}>
                      {securityStatus.storage.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Security Features</CardTitle>
              <CardDescription>Current security implementation status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Row Level Security', enabled: securityStatus?.rls.status === 'PASS' },
                  { name: 'Field Encryption', enabled: securityStatus?.encryption_enabled },
                  { name: 'Audit Logging', enabled: securityStatus?.audit_logging },
                  { name: 'Storage Policies', enabled: securityStatus?.storage.status === 'PASS' },
                  { name: 'Enhanced Policies', enabled: securityStatus?.policies_updated },
                  { name: 'Two-Factor Auth', enabled: mfaEnabled }
                ].map((feature) => (
                  <div key={feature.name} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{feature.name}</span>
                    <div className="flex items-center gap-2">
                      {feature.enabled ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <Badge className="bg-red-100 text-red-800">Disabled</Badge>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mfa" className="space-y-4">
          {mfaEnabled ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Two-Factor Authentication Enabled
                </CardTitle>
                <CardDescription>
                  Your account is protected with two-factor authentication.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  MFA is active and working to secure your admin account. You can disable it from your account settings if needed.
                </p>
              </CardContent>
            </Card>
          ) : (
            <MFASetup onSetupComplete={() => setMfaEnabled(true)} />
          )}
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <SecurityAuditLog />
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Policies Status</CardTitle>
              <CardDescription>
                Overview of database security policies and access controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityStatus && (
                  <>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Row Level Security (RLS)</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Protects sensitive data by restricting access to authorized users only.
                      </p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(securityStatus.rls.status)}
                        <span className="text-sm font-medium">
                          {securityStatus.rls.enabled_tables} of {securityStatus.rls.required_tables} tables protected
                        </span>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Storage Security</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Ensures file uploads and documents are only accessible to authorized users.
                      </p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(securityStatus.storage.status)}
                        <span className="text-sm font-medium">
                          {securityStatus.storage.secure_buckets} secure storage buckets configured
                        </span>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Audit Logging</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Comprehensive logging of all sensitive operations and data access.
                      </p>
                      <div className="flex items-center gap-2">
                        {securityStatus.audit_logging ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm font-medium">
                          {securityStatus.audit_logging ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};