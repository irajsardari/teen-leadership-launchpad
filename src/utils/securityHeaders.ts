// Security headers utility for enhanced web application security

export const SECURITY_HEADERS = {
  // Content Security Policy - Prevents XSS attacks
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://gedgcagidpheugikoyim.supabase.co wss://gedgcagidpheugikoyim.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // Force HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Prevent XSS attacks
  'X-XSS-Protection': '1; mode=block',

  // Permissions policy (formerly Feature Policy)
  'Permissions-Policy': [
    'geolocation=()',
    'microphone=()',
    'camera=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ].join(', '),

  // Disable DNS prefetching for security
  'X-DNS-Prefetch-Control': 'off',

  // Cache control for sensitive pages
  'Cache-Control': 'no-cache, no-store, must-revalidate, private',
  'Pragma': 'no-cache',
  'Expires': '0'
};

// Headers specifically for admin pages
export const ADMIN_SECURITY_HEADERS = {
  ...SECURITY_HEADERS,
  'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
  'Cache-Control': 'no-store, no-cache, must-revalidate, private, max-age=0',
};

// Apply security headers to meta tags (for client-side)
export const applySecurityMetaTags = () => {
  const headElement = document.head;
  
  // CSP meta tag
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  cspMeta.content = SECURITY_HEADERS['Content-Security-Policy'];
  headElement.appendChild(cspMeta);

  // X-Content-Type-Options
  const contentTypeMeta = document.createElement('meta');
  contentTypeMeta.httpEquiv = 'X-Content-Type-Options';
  contentTypeMeta.content = SECURITY_HEADERS['X-Content-Type-Options'];
  headElement.appendChild(contentTypeMeta);

  // Referrer Policy
  const referrerMeta = document.createElement('meta');
  referrerMeta.name = 'referrer';
  referrerMeta.content = 'strict-origin-when-cross-origin';
  headElement.appendChild(referrerMeta);

  // Viewport security
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no');
  }
};

// CSRF Token utilities
export const getCSRFToken = (): string => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  return token || generateCSRFToken();
};

export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  
  // Store in session storage
  sessionStorage.setItem('csrf-token', token);
  
  // Add to meta tag
  let csrfMeta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
  if (!csrfMeta) {
    csrfMeta = document.createElement('meta');
    csrfMeta.name = 'csrf-token';
    document.head.appendChild(csrfMeta);
  }
  csrfMeta.content = token;
  
  return token;
};

// Secure cookie settings
export const SECURE_COOKIE_CONFIG = {
  secure: true, // HTTPS only
  httpOnly: true, // Not accessible via JavaScript
  sameSite: 'strict' as const, // CSRF protection
  maxAge: 60 * 60 * 24 * 7, // 7 days
  domain: window.location.hostname,
  path: '/'
};

// Initialize security measures on page load
export const initializeSecurity = () => {
  // Apply security meta tags
  applySecurityMetaTags();
  
  // Generate CSRF token
  generateCSRFToken();
  
  // Disable right-click context menu on sensitive pages (optional)
  const isAdminPage = window.location.pathname.includes('/admin');
  if (isAdminPage) {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
    
    // Disable F12 developer tools on admin pages (basic protection)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        return false;
      }
    });
  }
  
  // Clear sensitive data on page unload
  window.addEventListener('beforeunload', () => {
    // Clear any sensitive data from memory
    if (isAdminPage) {
      sessionStorage.removeItem('admin-data');
    }
  });
};