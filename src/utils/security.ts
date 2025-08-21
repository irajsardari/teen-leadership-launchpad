import { supabase } from '@/integrations/supabase/client';

// Security utility functions for TMA Academy

// Rate limiting utility
export class RateLimiter {
  private static attempts = new Map<string, { count: number; firstAttempt: number }>();
  
  static async checkRateLimit(
    identifier: string,
    action: string,
    maxAttempts: number = 5,
    windowMinutes: number = 15
  ): Promise<boolean> {
    const key = `${identifier}:${action}`;
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;
    
    const attemptData = this.attempts.get(key);
    
    if (!attemptData || (now - attemptData.firstAttempt) > windowMs) {
      // New window or first attempt
      this.attempts.set(key, { count: 1, firstAttempt: now });
      return true;
    }
    
    if (attemptData.count >= maxAttempts) {
      return false;
    }
    
    attemptData.count++;
    return true;
  }
  
  static async logAttempt(
    identifier: string,
    action: string,
    success: boolean = true
  ): Promise<void> {
    try {
      await supabase.from('rate_limit_attempts').insert({
        identifier,
        action: `${action}_${success ? 'success' : 'failed'}`,
        attempts: 1
      });
    } catch (error) {
      console.warn('Failed to log rate limit attempt:', error);
    }
  }
}

// Security audit logging
export class SecurityAudit {
  static async log(
    action: string,
    resourceType: string,
    resourceId?: string,
    additionalData?: any
  ): Promise<void> {
    try {
      const { data, error } = await supabase.rpc('log_sensitive_operation', {
        p_action: action,
        p_resource_type: resourceType,
        p_resource_id: resourceId
      });
      
      if (error) {
        console.warn('Security audit logging failed:', error);
      }
    } catch (error) {
      console.warn('Security audit logging error:', error);
    }
  }
}

// File access security
export class SecureFileAccess {
  static async generateSecureUrl(
    bucketName: string,
    filePath: string,
    expiresIn: number = 300 // 5 minutes default
  ): Promise<string | null> {
    try {
      // Log file access attempt
      await SecurityAudit.log('file_access_request', 'file', filePath);
      
      // Use the secure function we created
      const { data, error } = await supabase.rpc('generate_secure_file_url', {
        p_bucket_name: bucketName,
        p_file_path: filePath,
        p_expires_in: expiresIn
      });
      
      if (error) {
        console.error('Failed to generate secure URL:', error);
        return null;
      }
      
      // For now, use Supabase's built-in signed URL as fallback
      const { data: signedUrl } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(filePath, expiresIn);
      
      return signedUrl?.signedUrl || null;
    } catch (error) {
      console.error('Secure file access error:', error);
      return null;
    }
  }
  
  static async uploadSecureFile(
    bucketName: string,
    file: File,
    fileName: string
  ): Promise<string | null> {
    try {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size exceeds 10MB limit');
      }
      
      // Check file type (basic validation)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error('File type not allowed');
      }
      
      // Upload with user-specific path
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('Authentication required');
      }
      
      const userPath = `${userData.user.id}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(userPath, file);
      
      if (error) {
        throw error;
      }
      
      // Log file upload
      await SecurityAudit.log('file_upload', 'file', userPath);
      
      return data.path;
    } catch (error) {
      console.error('Secure file upload error:', error);
      return null;
    }
  }
}

// Authentication security utilities
export class AuthSecurity {
  static async validateSession(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }
  
  static async requireRole(requiredRole: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      
      return profile?.role === requiredRole;
    } catch (error) {
      console.error('Role validation error:', error);
      return false;
    }
  }
  
  static async logAuthEvent(event: string, success: boolean): Promise<void> {
    try {
      await SecurityAudit.log(`auth_${event}`, 'authentication', undefined, { success });
    } catch (error) {
      console.warn('Auth event logging failed:', error);
    }
  }
  
  static sanitizeError(error: any): string {
    // Don't expose internal error messages to users
    const safeMessages: { [key: string]: string } = {
      'Invalid login credentials': 'Invalid email or password',
      'Email not confirmed': 'Please check your email and click the confirmation link',
      'Too many requests': 'Too many attempts. Please try again later',
      'Network request failed': 'Network error. Please check your connection',
      'JWT expired': 'Session expired. Please sign in again'
    };
    
    const message = error?.message || 'An error occurred';
    return safeMessages[message] || 'Authentication error. Please try again';
  }
}

// Input validation and sanitization
export class InputSecurity {
  static sanitizeString(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }
  
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }
  
  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{8,20}$/;
    return phoneRegex.test(phone);
  }
  
  static isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }
}

// CSRF Protection utility
export class CSRFProtection {
  private static token: string | null = null;
  
  static generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    this.token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    sessionStorage.setItem('csrf_token', this.token);
    return this.token;
  }
  
  static validateToken(token: string): boolean {
    const storedToken = sessionStorage.getItem('csrf_token') || this.token;
    return storedToken === token;
  }
  
  static getHeaders(): { [key: string]: string } {
    const token = sessionStorage.getItem('csrf_token') || this.generateToken();
    return {
      'X-CSRF-Token': token,
      'Content-Type': 'application/json'
    };
  }
}

// Password strength validation
export class PasswordSecurity {
  static validateStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;
    
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;
    else feedback.push('Use at least 12 characters for better security');
    
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Include lowercase letters');
    
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Include uppercase letters');
    
    if (/\d/.test(password)) score += 1;
    else feedback.push('Include numbers');
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 2;
    else feedback.push('Include special characters (!@#$%^&*)');
    
    // Check against common passwords (basic check)
    const commonPasswords = ['password', '123456', 'password123', 'admin', 'qwerty'];
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      score -= 2;
      feedback.push('Avoid common passwords');
    }
    
    return {
      isValid: score >= 5,
      score: Math.max(0, Math.min(10, score)),
      feedback
    };
  }
}