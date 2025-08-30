import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Clock, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SafeguardingSession {
  session_id: string;
  access_reason: string;
  expires_at: string;
  created_at: string;
}

export const SafeguardingAccessVerification: React.FC = () => {
  const [accessReason, setAccessReason] = useState('');
  const [currentSession, setCurrentSession] = useState<SafeguardingSession | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'verifying' | 'verified' | 'expired'>('none');
  const [loading, setLoading] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const verifyAndCreateSession = async () => {
    if (!user || !accessReason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a reason for accessing safeguarding data.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // First verify safeguarding admin access
      const { data: verificationData, error: verificationError } = await supabase
        .rpc('verify_safeguarding_admin_access', {
          verification_reason: accessReason.trim()
        });

      if (verificationError || !verificationData) {
        throw new Error('Safeguarding access verification failed');
      }

      // Create safeguarding session
      const { data: sessionData, error: sessionError } = await supabase
        .rpc('create_safeguarding_session', {
          access_reason: accessReason.trim()
        });

      if (sessionError) {
        throw sessionError;
      }

      setCurrentSession({
        session_id: sessionData,
        access_reason: accessReason.trim(),
        expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        created_at: new Date().toISOString()
      });

      setVerificationStatus('verified');
      setAccessReason('');

      toast({
        title: "Access Verified",
        description: "Safeguarding access has been granted for 2 hours.",
      });

    } catch (error: any) {
      console.error('Safeguarding verification error:', error);
      
      let errorMessage = 'Failed to verify safeguarding access.';
      if (error.message?.includes('admin')) {
        errorMessage = 'Admin privileges required for safeguarding access.';
      } else if (error.message?.includes('safeguarding')) {
        errorMessage = 'Safeguarding permissions required. Contact your administrator.';
      }

      toast({
        title: "Access Denied",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSafeguardingReports = async () => {
    if (verificationStatus !== 'verified') {
      toast({
        title: "Verification Required",
        description: "Please verify your safeguarding access first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('safeguarding_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      setReports(data || []);
      setShowReports(true);

      toast({
        title: "Reports Loaded",
        description: `Found ${data?.length || 0} safeguarding reports.`,
      });

    } catch (error: any) {
      console.error('Error loading safeguarding reports:', error);
      toast({
        title: "Access Failed",
        description: "Unable to access safeguarding reports. Please verify your permissions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkSessionStatus = () => {
    if (!currentSession) return 'none';
    
    const expiresAt = new Date(currentSession.expires_at);
    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();
    
    if (timeUntilExpiry <= 0) {
      return 'expired';
    } else if (timeUntilExpiry <= 30 * 60 * 1000) { // 30 minutes warning
      return 'expiring';
    } else {
      return 'active';
    }
  };

  const formatTimeRemaining = () => {
    if (!currentSession) return '';
    
    const expiresAt = new Date(currentSession.expires_at);
    const now = new Date();
    const timeRemaining = expiresAt.getTime() - now.getTime();
    
    if (timeRemaining <= 0) return 'Expired';
    
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m remaining`;
  };

  const sessionStatus = checkSessionStatus();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Safeguarding Access Verification
          </CardTitle>
          <CardDescription>
            Critical child protection data requires additional verification and access logging.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Session Status */}
          {currentSession && (
            <Alert className={sessionStatus === 'expired' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
              <div className="flex items-center gap-2">
                {sessionStatus === 'expired' ? (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                ) : sessionStatus === 'expiring' ? (
                  <Clock className="h-4 w-4 text-orange-500" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                <AlertDescription>
                  <div className="space-y-1">
                    <div className="font-medium">
                      Session Status: 
                      <Badge className={`ml-2 ${
                        sessionStatus === 'expired' ? 'bg-red-100 text-red-800' :
                        sessionStatus === 'expiring' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {sessionStatus === 'expired' ? 'Expired' :
                         sessionStatus === 'expiring' ? 'Expiring Soon' :
                         'Active'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Access Reason: {currentSession.access_reason}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatTimeRemaining()}
                    </div>
                  </div>
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* Verification Form */}
          {(verificationStatus === 'none' || verificationStatus === 'expired') && (
            <div className="space-y-4">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Multi-layer Security Required:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Admin privileges with MFA</li>
                    <li>• Active safeguarding permissions</li>
                    <li>• Recent security verification (2 hours)</li>
                    <li>• No recent security violations</li>
                    <li>• IP address verification (if configured)</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Label htmlFor="access-reason">Access Reason (Required)</Label>
                <Input
                  id="access-reason"
                  value={accessReason}
                  onChange={(e) => setAccessReason(e.target.value)}
                  placeholder="e.g., Review incident report #123, Monthly safety audit, etc."
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  All access is logged and monitored for compliance and security.
                </p>
              </div>

              <Button 
                onClick={verifyAndCreateSession}
                disabled={loading || !accessReason.trim()}
                className="w-full"
              >
                {loading ? 'Verifying...' : 'Verify Safeguarding Access'}
              </Button>
            </div>
          )}

          {/* Verified Access Actions */}
          {verificationStatus === 'verified' && sessionStatus === 'active' && (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription>
                  <strong>Access Verified:</strong> You now have temporary access to safeguarding data.
                  All actions are being logged for security and compliance.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button 
                  onClick={loadSafeguardingReports}
                  disabled={loading}
                  variant="outline"
                  className="flex-1"
                >
                  {loading ? 'Loading...' : 'View Reports'}
                </Button>
                
                <Button
                  onClick={() => setShowReports(!showReports)}
                  variant="ghost"
                  size="sm"
                >
                  {showReports ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          {/* Reports Display */}
          {showReports && reports.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Recent Safeguarding Reports</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {reports.map((report) => (
                  <div key={report.id} className="p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {report.report_type}
                          </Badge>
                          <Badge className={
                            report.urgency === 'high' ? 'bg-red-100 text-red-800' :
                            report.urgency === 'medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {report.urgency} priority
                          </Badge>
                        </div>
                        <div className="text-sm font-medium">
                          Report ID: {report.id.substring(0, 8)}...
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Created: {new Date(report.created_at).toLocaleString()}
                        </div>
                      </div>
                      <Badge variant={report.status === 'submitted' ? 'destructive' : 'default'}>
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Notice */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Security Notice:</strong> This system handles child protection data. 
              All access is monitored and logged. Unauthorized access or misuse may result in 
              legal action and immediate account suspension.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};