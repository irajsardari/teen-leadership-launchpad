import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { Check, X, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordStrengthValidatorProps {
  password: string;
  onValidityChange?: (isValid: boolean) => void;
  className?: string;
}

interface PasswordValidation {
  valid: boolean;
  score: number;
  max_score: number;
  issues: string[];
}

export const PasswordStrengthValidator: React.FC<PasswordStrengthValidatorProps> = ({
  password,
  onValidityChange,
  className
}) => {
  const [validation, setValidation] = React.useState<PasswordValidation | null>(null);
  const [isChecking, setIsChecking] = React.useState(false);

  React.useEffect(() => {
    const validatePassword = async () => {
      if (!password) {
        setValidation(null);
        onValidityChange?.(false);
        return;
      }

      setIsChecking(true);
      try {
        const { data, error } = await supabase.rpc('validate_password_strength', {
          password
        });

        if (error) {
          console.error('Password validation error:', error);
          return;
        }

        const validation = data as unknown as PasswordValidation;
        setValidation(validation);
        onValidityChange?.(validation.valid);
      } catch (err) {
        console.error('Failed to validate password:', err);
      } finally {
        setIsChecking(false);
      }
    };

    const timeoutId = setTimeout(validatePassword, 300);
    return () => clearTimeout(timeoutId);
  }, [password, onValidityChange]);

  if (!password) return null;

  const getStrengthColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStrengthLabel = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'Strong';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Fair';
    return 'Weak';
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Password Strength
        </span>
        {isChecking && (
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        )}
      </div>

      {validation && (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Strength: 
                <span className={cn('ml-1 font-medium', getStrengthColor(validation.score, validation.max_score))}>
                  {getStrengthLabel(validation.score, validation.max_score)}
                </span>
              </span>
              <span className="text-xs text-muted-foreground">
                {validation.score}/{validation.max_score}
              </span>
            </div>
            
            <Progress 
              value={(validation.score / validation.max_score) * 100} 
              className="h-2"
            />
          </div>

          {validation.issues.length > 0 && (
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">
                Requirements:
              </span>
              <ul className="space-y-1">
                {[
                  'Password must be at least 12 characters long',
                  'Password must contain lowercase letters',
                  'Password must contain uppercase letters', 
                  'Password must contain numbers',
                  'Password must contain special characters'
                ].map((requirement) => {
                  const isMissing = validation.issues.includes(requirement);
                  return (
                    <li key={requirement} className="flex items-center gap-2 text-xs">
                      {isMissing ? (
                        <X className="h-3 w-3 text-red-500" />
                      ) : (
                        <Check className="h-3 w-3 text-green-500" />
                      )}
                      <span className={isMissing ? 'text-red-600' : 'text-green-600'}>
                        {requirement.replace('Password must ', '')}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {validation.issues.some(issue => issue.includes('common patterns')) && (
            <div className="flex items-center gap-2 p-2 bg-red-50 rounded-md">
              <X className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">
                Avoid common passwords and patterns
              </span>
            </div>
          )}

          {validation.valid && (
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded-md">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-700">
                Password meets all security requirements
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};