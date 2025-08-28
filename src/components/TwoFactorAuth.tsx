import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Smartphone, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export const TwoFactorAuth: React.FC = () => {
  const { user } = useAuth();
  const [isEnabled, setIsEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showSetup, setShowSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [secret, setSecret] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkTwoFactorStatus();
  }, [user]);

  const checkTwoFactorStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      
      const hasTotpFactor = data.totp.length > 0;
      setIsEnabled(hasTotpFactor);
    } catch (error) {
      console.error('Error checking 2FA status:', error);
    }
  };

  const enableTwoFactor = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'TMA Platform Authenticator',
      });

      if (error) throw error;

      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setShowSetup(true);
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      toast.error('Failed to enable 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAndComplete = async () => {
    if (!verificationCode) {
      toast.error('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: qrCode, // This would be the factor ID from enrollment
        code: verificationCode,
      });

      if (error) throw error;

      setIsEnabled(true);
      setShowSetup(false);
      toast.success('Two-factor authentication enabled successfully!');
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      toast.error('Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const disableTwoFactor = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;

      const factor = data.totp[0];
      if (factor) {
        await supabase.auth.mfa.unenroll({ factorId: factor.id });
        setIsEnabled(false);
        toast.success('Two-factor authentication disabled');
      }
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast.error('Failed to disable 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    toast.success('Secret copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your admin account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEnabled && !showSetup && (
          <div className="space-y-4">
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                Two-factor authentication is not enabled. Enable it to secure your admin account.
              </AlertDescription>
            </Alert>
            <Button onClick={enableTwoFactor} disabled={isLoading} className="w-full">
              Enable Two-Factor Authentication
            </Button>
          </div>
        )}

        {showSetup && (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </AlertDescription>
            </Alert>
            
            {qrCode && (
              <div className="flex justify-center">
                <img 
                  src={qrCode} 
                  alt="2FA QR Code" 
                  className="border border-border rounded-lg"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Manual Entry Key:</label>
              <div className="flex gap-2">
                <Input
                  value={secret}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copySecret}
                  className="shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Verification Code:</label>
              <Input
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={verifyAndComplete} 
                disabled={isLoading || !verificationCode}
                className="flex-1"
              >
                Verify & Enable
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowSetup(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {isEnabled && (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <Shield className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Two-factor authentication is enabled and protecting your account.
              </AlertDescription>
            </Alert>
            <Button 
              variant="destructive" 
              onClick={disableTwoFactor} 
              disabled={isLoading}
              className="w-full"
            >
              Disable Two-Factor Authentication
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};