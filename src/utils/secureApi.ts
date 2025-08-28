import { supabase } from '@/integrations/supabase/client';

interface SecureApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

class SecureApiClient {
  private baseUrl: string;
  private csrfToken: string | null = null;

  constructor() {
    this.baseUrl = 'https://gedgcagidpheugikoyim.supabase.co/functions/v1';
    this.generateCSRFToken();
  }

  private generateCSRFToken(): void {
    this.csrfToken = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    sessionStorage.setItem('csrf-token', this.csrfToken);
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    
    if (!token) {
      throw new Error('Authentication required');
    }

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-CSRF-Token': this.csrfToken || '',
    };
  }

  async submitForm<T = any>(formType: string, formData: any): Promise<SecureApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/secure-forms`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          formType,
          formData,
          csrfToken: this.csrfToken,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      return result;
    } catch (error: any) {
      console.error('Secure form submission error:', error);
      return {
        success: false,
        error: error.message || 'Form submission failed',
      };
    }
  }

  async uploadFile(bucket: string, fileName: string, file: File): Promise<SecureApiResponse> {
    try {
      const headers = await this.getAuthHeaders();
      
      // Convert file to base64
      const arrayBuffer = await file.arrayBuffer();
      const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      const response = await fetch(`${this.baseUrl}/secure-storage`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'upload',
          bucket,
          fileName,
          fileData: base64Data,
          fileType: file.type,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      return result;
    } catch (error: any) {
      console.error('Secure file upload error:', error);
      return {
        success: false,
        error: error.message || 'File upload failed',
      };
    }
  }

  async getFileUrl(bucket: string, filePath: string): Promise<SecureApiResponse> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/secure-storage`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'download',
          bucket,
          filePath,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      return result;
    } catch (error: any) {
      console.error('Secure file URL generation error:', error);
      return {
        success: false,
        error: error.message || 'File URL generation failed',
      };
    }
  }

  async deleteFile(bucket: string, filePath: string): Promise<SecureApiResponse> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/secure-storage`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'delete',
          bucket,
          filePath,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      return result;
    } catch (error: any) {
      console.error('Secure file deletion error:', error);
      return {
        success: false,
        error: error.message || 'File deletion failed',
      };
    }
  }

  async sendEmail(emailData: any): Promise<SecureApiResponse> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/secure-email`, {
        method: 'POST',
        headers,
        body: JSON.stringify(emailData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      return result;
    } catch (error: any) {
      console.error('Secure email sending error:', error);
      return {
        success: false,
        error: error.message || 'Email sending failed',
      };
    }
  }
}

// Export singleton instance
export const secureApi = new SecureApiClient();

// Input validation utilities
export const validateInput = {
  email: (email: string): boolean => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email.trim().toLowerCase());
  },

  phone: (phone: string): boolean => {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    return cleanPhone.length >= 10;
  },

  name: (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 100;
  },

  sanitizeText: (text: string): string => {
    return text.replace(/[<>"\\'&]/g, '').trim();
  },

  sanitizeHtml: (html: string): string => {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  },
};

// Rate limiting utility for client-side
export class ClientRateLimit {
  private static attempts = new Map<string, { count: number; resetTime: number }>();

  static check(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (attempt.count >= maxAttempts) {
      return false;
    }

    attempt.count++;
    return true;
  }

  static getRemainingTime(key: string): number {
    const attempt = this.attempts.get(key);
    if (!attempt) return 0;
    return Math.max(0, attempt.resetTime - Date.now());
  }
}