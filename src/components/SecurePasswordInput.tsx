import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePasswordSecurity } from '@/hooks/usePasswordSecurity';

interface SecurePasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  showStrengthMeter?: boolean;
  checkBreach?: boolean;
}

export const SecurePasswordInput: React.FC<SecurePasswordInputProps> = ({
  value,
  onChange,
  onValidationChange,
  label = 'Password',
  placeholder = 'Enter a secure password',
  required = false,
  showStrengthMeter = true,
  checkBreach = true
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState<any>(null);
  const { validatePassword, validatePasswordStrength, isChecking } = usePasswordSecurity();

  useEffect(() => {
    const checkPassword = async () => {
      if (!value) {
        setValidation(null);
        onValidationChange?.(false);
        return;
      }

      if (checkBreach) {
        const result = await validatePassword(value);
        setValidation(result);
        onValidationChange?.(result.isValid);
      } else {
        const result = validatePasswordStrength(value);
        setValidation(result);
        onValidationChange?.(result.isValid);
      }
    };

    const debounce = setTimeout(checkPassword, 500);
    return () => clearTimeout(debounce);
  }, [value, checkBreach, validatePassword, validatePasswordStrength, onValidationChange]);

  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStrengthText = (score: number) => {
    switch (score) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="secure-password">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id="secure-password"
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`pr-10 ${validation?.isValid === false && value ? 'border-destructive' : ''} ${validation?.isValid && value ? 'border-green-500' : ''}`}
        />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>

      {showStrengthMeter && value && validation && (
        <div className="space-y-2">
          {/* Strength Meter */}
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <Progress 
                value={(validation.score + 1) * 20} 
                className="h-2"
              />
            </div>
            <span className="text-sm font-medium">
              {getStrengthText(validation.score)}
            </span>
          </div>

          {/* Breach Check Status */}
          {checkBreach && isChecking && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 animate-pulse" />
              <span>Checking against known breaches...</span>
            </div>
          )}

          {validation.isBreached && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This password has been found in data breaches. Please choose a different password.
              </AlertDescription>
            </Alert>
          )}

          {/* Validation Feedback */}
          {validation.feedback.length > 0 && (
            <Alert variant={validation.isValid ? "default" : "destructive"}>
              {validation.isValid ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {validation.feedback.map((feedback: string, index: number) => (
                    <li key={index} className="text-sm">{feedback}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};