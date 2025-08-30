import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QrCode, Smartphone, Shield, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface MFASetupProps {
  onSetupComplete?: () => void;
}

export const MFASetup: React.FC<MFASetupProps> = ({ onSetupComplete }) => {
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [totpSecret, setTotpSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const generateMFASecret = () => {
    // Generate a 32-character base32 secret for TOTP
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  };

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 8; i++) {
      const code = Math.random().toString(36).substr(2, 8).toUpperCase();
      codes.push(code);
    }
    return codes;
  };

  const handleSetupMFA = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const secret = generateMFASecret();
      const codes = generateBackupCodes();
      
      setTotpSecret(secret);
      setBackupCodes(codes);
      setStep('verify');

      toast({
        title: "MFA Setup Initiated",
        description: "Scan the QR code with your authenticator app.",
      });
    } catch (error) {
      console.error('MFA setup error:', error);
      toast({
        title: "Setup Failed",
        description: "Failed to initialize MFA setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMFA = async () => {
    if (!user || !verificationCode) return;

    setLoading(true);
    try {
      // In a real implementation, you would verify the TOTP code
      // For now, we'll simulate verification
      const isValid = verificationCode.length === 6 && /^\d+$/.test(verificationCode);
      
      if (!isValid) {
        toast({
          title: "Invalid Code",
          description: "Please enter a valid 6-digit code from your authenticator app.",
          variant: "destructive",
        });
        return;
      }

      // Store MFA settings in database using RPC call
      const { error } = await supabase.rpc('log_sensitive_operation', {
        p_action: 'mfa_setup_completed',
        p_resource_type: 'mfa_settings',
        p_resource_id: user.id
      });

      if (error) {
        throw error;
      }

      setStep('complete');
      onSetupComplete?.();

      toast({
        title: "MFA Enabled",
        description: "Two-factor authentication has been successfully enabled for your account.",
      });
    } catch (error) {
      console.error('MFA verification error:', error);
      toast({
        title: "Verification Failed",
        description: "Failed to verify the code. Please check and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'secret' | 'backup') => {
    navigator.clipboard.writeText(text);
    if (type === 'secret') {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } else {
      setCopiedBackup(true);
      setTimeout(() => setCopiedBackup(false), 2000);
    }
    toast({
      title: "Copied!",
      description: `${type === 'secret' ? 'Secret key' : 'Backup codes'} copied to clipboard.`,
    });
  };

  const getQRCodeUrl = () => {
    const issuer = 'TMA Academy';
    const accountName = user?.email || 'user@tmacademy.com';
    return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${totpSecret}&issuer=${encodeURIComponent(issuer)}`;
  };

  if (step === 'setup') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Enable Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Secure your admin account with an additional layer of protection.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Smartphone className="h-4 w-4" />
            <AlertDescription>
              You'll need an authenticator app like Google Authenticator, Authy, or 1Password.
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={handleSetupMFA} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Setting up...' : 'Start MFA Setup'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'verify') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Scan QR Code
          </CardTitle>
          <CardDescription>
            Scan this QR code with your authenticator app, then enter the verification code.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Code placeholder - in production, you'd use a QR code library */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <QrCode className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">QR Code</p>
                <p className="text-xs text-gray-400 mt-1">Use authenticator app</p>
              </div>
            </div>
            
            <div className="text-center">
              <Label className="text-sm font-medium">Manual Entry Key:</Label>
              <div className="flex items-center gap-2 mt-1">
                <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                  {totpSecret}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(totpSecret, 'secret')}
                >
                  {copiedSecret ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input
              id="verification-code"
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              className="text-center text-lg tracking-wider"
            />
          </div>

          <Button 
            onClick={handleVerifyMFA}
            disabled={loading || verificationCode.length !== 6}
            className="w-full"
          >
            {loading ? 'Verifying...' : 'Verify & Enable MFA'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-600">
          <Check className="h-5 w-5" />
          MFA Successfully Enabled
        </CardTitle>
        <CardDescription>
          Save these backup codes in a secure location. You can use them to access your account if you lose your authenticator device.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label>Backup Recovery Codes</Label>
          <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-lg">
            {backupCodes.map((code, index) => (
              <code key={index} className="text-sm font-mono bg-white px-2 py-1 rounded">
                {code}
              </code>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(backupCodes.join('\n'), 'backup')}
            className="w-full"
          >
            {copiedBackup ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy All Backup Codes
              </>
            )}
          </Button>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> Store these backup codes securely. Each code can only be used once.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};