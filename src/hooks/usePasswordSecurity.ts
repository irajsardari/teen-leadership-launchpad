import { useState } from 'react';
import zxcvbn from 'zxcvbn';

interface PasswordValidation {
  isValid: boolean;
  score: number;
  feedback: string[];
  isBreached?: boolean;
}

export const usePasswordSecurity = () => {
  const [isChecking, setIsChecking] = useState(false);

  const validatePasswordStrength = (password: string): PasswordValidation => {
    if (!password) {
      return {
        isValid: false,
        score: 0,
        feedback: ['Password is required']
      };
    }

    const result = zxcvbn(password);
    const feedback: string[] = [];

    // Minimum requirements
    if (password.length < 12) {
      feedback.push('Password must be at least 12 characters long');
    }

    // Add zxcvbn feedback
    if (result.feedback.warning) {
      feedback.push(result.feedback.warning);
    }
    
    result.feedback.suggestions.forEach(suggestion => {
      feedback.push(suggestion);
    });

    const isValid = password.length >= 12 && result.score >= 3;

    return {
      isValid,
      score: result.score,
      feedback
    };
  };

  const checkPasswordBreach = async (password: string): Promise<boolean> => {
    setIsChecking(true);
    try {
      // Hash the password using SHA-1 for HIBP k-anonymity
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      
      // Use only first 5 characters for k-anonymity
      const prefix = hashHex.substring(0, 5);
      const suffix = hashHex.substring(5);
      
      // Query HIBP API
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      if (!response.ok) {
        console.warn('Could not check password breach status');
        return false;
      }
      
      const hashes = await response.text();
      const isBreached = hashes.split('\n').some(line => {
        const [hash, count] = line.split(':');
        return hash === suffix && parseInt(count) > 10; // Only flag if seen >10 times
      });
      
      return isBreached;
    } catch (error) {
      console.warn('Password breach check failed:', error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const validatePassword = async (password: string): Promise<PasswordValidation> => {
    const strengthResult = validatePasswordStrength(password);
    
    if (!strengthResult.isValid) {
      return strengthResult;
    }

    const isBreached = await checkPasswordBreach(password);
    
    if (isBreached) {
      return {
        ...strengthResult,
        isValid: false,
        isBreached: true,
        feedback: [...strengthResult.feedback, 'This password has been found in data breaches. Please use a different password.']
      };
    }

    return strengthResult;
  };

  return {
    validatePassword,
    validatePasswordStrength,
    checkPasswordBreach,
    isChecking
  };
};