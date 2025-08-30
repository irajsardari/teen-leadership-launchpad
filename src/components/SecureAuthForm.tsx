import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RateLimiter, AuthSecurity, InputSecurity } from '@/utils/security';
import { SecurePasswordInput } from './SecurePasswordInput';
import { PasswordStrengthValidator } from './PasswordStrengthValidator';
import { SessionTimeoutWarning } from './SessionTimeoutWarning';

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(12, 'Password must be at least 12 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignUpForm = z.infer<typeof signUpSchema>;
type SignInForm = z.infer<typeof signInSchema>;

interface SecureAuthFormProps {
  mode: 'signin' | 'signup';
  onSuccess?: (user: any) => void;
  onModeChange?: (mode: 'signin' | 'signup') => void;
}

export const SecureAuthForm: React.FC<SecureAuthFormProps> = ({
  mode,
  onSuccess,
  onModeChange
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  
  const isSignUp = mode === 'signup';
  const schema = isSignUp ? signUpSchema : signInSchema;
  
  const form = useForm<SignUpForm | SignInForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const getClientIdentifier = () => {
    // Use a combination of IP-like identifier (in real app, get from headers)
    return 'client_' + Date.now().toString(36);
  };

  const handleSubmit = async (values: SignUpForm | SignInForm) => {
    const clientId = getClientIdentifier();
    const action = isSignUp ? 'signup' : 'signin';
    
    // Rate limiting check
    const canProceed = await RateLimiter.checkRateLimit(clientId, action, 5, 15);
    if (!canProceed) {
      toast({
        title: "Rate Limited",
        description: "Too many attempts. Please wait before trying again.",
        variant: "destructive",
      });
      await RateLimiter.logAttempt(clientId, action, false);
      return;
    }

    try {
      setIsLoading(true);

      // Input sanitization
      const sanitizedEmail = InputSecurity.sanitizeString(values.email.toLowerCase().trim());
      
      if (!InputSecurity.validateEmail(sanitizedEmail)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
      }

      if (isSignUp) {
        const signUpValues = values as SignUpForm;
        
        // Password strength validation
        const passwordStrength = await import('@/utils/security').then(m => 
          m.PasswordSecurity.validateStrength(signUpValues.password)
        );
        
        if (!passwordStrength.isValid) {
          toast({
            title: "Password Too Weak",
            description: "Please choose a stronger password.",
            variant: "destructive",
          });
          return;
        }
        
        const sanitizedFullName = InputSecurity.sanitizeString(signUpValues.fullName);
        
        const { data, error } = await supabase.auth.signUp({
          email: sanitizedEmail,
          password: signUpValues.password,
          options: {
            emailRedirectTo: `${window.location.origin}/portal`,
            data: {
              full_name: sanitizedFullName,
            },
          },
        });

        if (error) {
          throw error;
        }

        await AuthSecurity.logAuthEvent('signup_success', true);
        await RateLimiter.logAttempt(clientId, action, true);
        
        toast({
          title: "Account Created",
          description: "Please check your email to verify your account.",
        });
        
        if (data.user && onSuccess) {
          onSuccess(data.user);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: sanitizedEmail,
          password: values.password,
        });

        if (error) {
          throw error;
        }

        await AuthSecurity.logAuthEvent('signin_success', true);
        await RateLimiter.logAttempt(clientId, action, true);
        
        toast({
          title: "Welcome Back",
          description: "You have been successfully signed in.",
        });
        
        if (data.user && onSuccess) {
          onSuccess(data.user);
        }
      }
      
      form.reset();
      
    } catch (error: any) {
      console.error(`${action} error:`, error);
      
      await AuthSecurity.logAuthEvent(`${action}_failed`, false);
      await RateLimiter.logAttempt(clientId, action, false);
      
      const sanitizedError = AuthSecurity.sanitizeError(error);
      toast({
        title: `${isSignUp ? 'Sign Up' : 'Sign In'} Failed`,
        description: sanitizedError,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {isSignUp && (
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your full name" 
                        {...field}
                        disabled={isLoading}
                        autoComplete="name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="Enter your email" 
                      {...field}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <SecurePasswordInput
                    value={field.value}
                    onChange={field.onChange}
                    onValidationChange={(isValid) => {
                      // Store validation state if needed
                      setPassword(field.value);
                    }}
                    label="Password"
                    placeholder={isSignUp ? "Create a strong password" : "Enter your password"}
                    required
                    showStrengthMeter={isSignUp}
                    checkBreach={isSignUp}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isSignUp && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Confirm your password" 
                        {...field}
                        disabled={isLoading}
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {isSignUp && (
              <div className="mt-4">
                <PasswordStrengthValidator 
                  password={password}
                  onValidityChange={(isValid) => {
                    // Update form validation state if needed
                  }}
                />
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
            
            {onModeChange && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => onModeChange(isSignUp ? 'signin' : 'signup')}
                disabled={isLoading}
              >
                {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
              </Button>
            )}
          </form>
        </Form>
        
        {/* Session timeout warning for admin users */}
        <SessionTimeoutWarning />
      </CardContent>
    </Card>
  );
};