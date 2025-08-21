# Security Hardening Implementation

This directory contains comprehensive security utilities implemented for TMA Academy to address critical security vulnerabilities and enhance platform protection.

## 🔐 Security Features Implemented

### 1. Database Security
- **Row Level Security (RLS)**: All public tables have RLS enabled with proper policies
- **Audit Logging**: Comprehensive logging of sensitive operations
- **Rate Limiting**: Database-backed rate limiting for authentication attempts
- **Secure File Access**: Controlled file access with signed URLs and logging

### 2. Authentication Security
- **Password Strength Validation**: Enforces strong passwords (12+ chars, complexity requirements)
- **Session Management**: Secure session handling with validation
- **Rate Limiting**: Login attempt throttling (5 attempts per 15 minutes)
- **Error Sanitization**: Safe error messages that don't leak internal information

### 3. File Security
- **Secure Upload**: File type and size validation before upload
- **Signed URLs**: Time-limited file access URLs (5-10 minutes)
- **Access Logging**: All file access attempts are logged
- **User-specific Paths**: Files stored in user-specific directories

### 4. Input Security
- **Sanitization**: HTML and script injection prevention
- **Validation**: Email, phone, and URL validation
- **CSRF Protection**: Cross-site request forgery protection

### 5. Application Security
- **Security Headers**: CSP, HSTS, X-Frame-Options, etc.
- **Role-based Access**: Granular permission system
- **Admin Protection**: Enhanced security for admin functions

## 📁 File Structure

```
src/utils/
├── security.ts              # Main security utility classes
├── securityHeaders.ts       # Security headers and CSP configuration
├── configToml.ts           # Supabase config recommendations
└── README.md               # This file

src/components/
├── SecurityProvider.tsx     # React context for security
├── PasswordStrengthIndicator.tsx  # Password validation UI
├── SecureAuthForm.tsx       # Enhanced authentication form
└── SecurityAuditLog.tsx     # Admin audit log viewer
```

## 🛡️ Security Classes

### RateLimiter
```typescript
// Check if action is within rate limits
await RateLimiter.checkRateLimit(identifier, action, maxAttempts, windowMinutes);

// Log attempt for monitoring
await RateLimiter.logAttempt(identifier, action, success);
```

### SecurityAudit
```typescript
// Log sensitive operations
await SecurityAudit.log(action, resourceType, resourceId, additionalData);
```

### SecureFileAccess
```typescript
// Generate secure, time-limited file URLs
const secureUrl = await SecureFileAccess.generateSecureUrl(bucket, path, expiresIn);

// Secure file upload with validation
const filePath = await SecureFileAccess.uploadSecureFile(bucket, file, fileName);
```

### AuthSecurity
```typescript
// Validate user session
const isValid = await AuthSecurity.validateSession();

// Check user role
const hasRole = await AuthSecurity.requireRole('admin');

// Sanitize error messages
const safeMessage = AuthSecurity.sanitizeError(error);
```

### InputSecurity
```typescript
// Sanitize user input
const clean = InputSecurity.sanitizeString(userInput);

// Validate email format
const isValid = InputSecurity.validateEmail(email);
```

### PasswordSecurity
```typescript
// Validate password strength
const { isValid, score, feedback } = PasswordSecurity.validateStrength(password);
```

## 🚀 Usage Examples

### Protecting API Calls
```typescript
import { SecurityAudit, RateLimiter } from '@/utils/security';

const handleSubmit = async (data) => {
  // Rate limiting
  const canProceed = await RateLimiter.checkRateLimit(userId, 'submit_form');
  if (!canProceed) throw new Error('Rate limited');
  
  // Process request
  const result = await apiCall(data);
  
  // Audit log
  await SecurityAudit.log('form_submitted', 'application', result.id);
};
```

### Secure File Handling
```typescript
import { SecureFileAccess } from '@/utils/security';

// Upload with validation
const filePath = await SecureFileAccess.uploadSecureFile('documents', file, fileName);

// Generate secure access URL
const secureUrl = await SecureFileAccess.generateSecureUrl('documents', filePath, 300);
```

### Role-based Protection
```typescript
import { withSecurityCheck } from '@/components/SecurityProvider';

// Protect component with role requirement
export default withSecurityCheck(AdminComponent, 'admin');

// Use in hooks
const { canAccess, logSecurityEvent } = useSecurityContext();
if (!canAccess('teacher')) return <AccessDenied />;
```

## ⚙️ Configuration Required

### 1. Supabase Auth Settings
Enable in Supabase Dashboard > Authentication > Settings:
- ✅ Leaked Password Protection
- ✅ Password Strength Requirements
- ✅ Email Confirmation

### 2. Security Headers
Apply the headers from `securityHeaders.ts` in your deployment configuration.

### 3. Database Migrations
All required database changes have been applied via migrations:
- RLS policies enabled
- Audit logging tables created  
- Security functions deployed
- Storage bucket policies configured

## 🔍 Monitoring & Auditing

### Audit Logs
Monitor security events via the `SecurityAuditLog` component:
- Authentication attempts
- File access
- Admin actions
- Failed authorization attempts

### Rate Limiting Logs
Track rate limiting effectiveness:
- Login attempt patterns
- Form submission rates
- API usage patterns

## 🚨 Security Checklist

### ✅ Completed
- [x] RLS enabled on all tables
- [x] Secure file storage with signed URLs
- [x] Rate limiting implementation
- [x] Password strength validation
- [x] Audit logging system
- [x] Input sanitization
- [x] Role-based access control
- [x] CSRF protection
- [x] Security headers configuration

### ⏳ Manual Steps Required
- [ ] Enable leaked password protection in Supabase dashboard
- [ ] Configure security headers in deployment
- [ ] Set up monitoring alerts for security events
- [ ] Regular security audits and penetration testing

## 🔗 References
- [OWASP Security Guidelines](https://owasp.org/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/security)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)