import React from 'react';
import { PasswordSecurity } from '@/utils/security';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  className = ''
}) => {
  if (!password) return null;
  
  const strength = PasswordSecurity.validateStrength(password);
  
  const getStrengthColor = (score: number) => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 4) return 'bg-orange-500';
    if (score <= 6) return 'bg-yellow-500';
    if (score <= 8) return 'bg-blue-500';
    return 'bg-green-500';
  };
  
  const getStrengthText = (score: number) => {
    if (score <= 2) return 'Very Weak';
    if (score <= 4) return 'Weak';
    if (score <= 6) return 'Fair';
    if (score <= 8) return 'Good';
    return 'Strong';
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span>Password Strength:</span>
        <span className={`font-medium ${
          strength.score <= 4 ? 'text-destructive' : 'text-foreground'
        }`}>
          {getStrengthText(strength.score)}
        </span>
      </div>
      
      <Progress 
        value={(strength.score / 10) * 100} 
        className="h-2"
      />
      
      {strength.feedback.length > 0 && (
        <Alert className="text-xs">
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {strength.feedback.map((feedback, index) => (
                <li key={index}>{feedback}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};