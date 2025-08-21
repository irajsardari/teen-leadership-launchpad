// Configuration utility to update supabase/config.toml for security enhancements

export const SECURITY_CONFIG_RECOMMENDATIONS = `
# Security-enhanced configuration for supabase/config.toml

[auth]
# Enable password strength requirements
password_min_length = 12
password_require_upper = true
password_require_lower = true
password_require_numbers = true
password_require_symbols = true

# Enable leaked password protection
enable_leaked_password_protection = true

# Rate limiting
rate_limit_login_attempts = 5
rate_limit_window_minutes = 15

[auth.email]
# Require email confirmation
enable_confirmations = true
confirm_email_change = true

[auth.security]
# Session settings
jwt_expiry = 3600  # 1 hour
refresh_token_rotation_enabled = true
security_update_password_require_reauthentication = true

[auth.sessions]
# Session inactivity timeout
inactivity_timeout = 1800  # 30 minutes

# Additional security headers configuration
[api]
extra_search_path = "public"
max_rows = 1000

[api.cors]
# Restrict CORS to known domains
allowed_origins = ["https://teenmanagement.com", "https://*.teenmanagement.com"]
allowed_headers = ["authorization", "content-type", "x-csrf-token"]
allowed_methods = ["GET", "POST", "PUT", "DELETE"]

# Database security
[database]
# Connection pooling and security
max_connections = 100
pool_timeout = 30
statement_timeout = "5min"

# Storage security
[storage]
# File upload restrictions
file_size_limit = "10MB"
file_transform_enabled = false

[edge_functions]
# Verify JWT by default (can be overridden per function)
verify_jwt = true

# Rate limiting for Edge Functions
[edge_functions.rate_limits]
anonymous_requests_per_minute = 10
authenticated_requests_per_minute = 100

# Logging configuration
[logging]
level = "info"
# Enable audit logging
audit_log_enabled = true
audit_log_retention_days = 90
`;

export const generateSecureConfigUpdates = () => {
  return {
    recommendations: SECURITY_CONFIG_RECOMMENDATIONS,
    criticalUpdates: [
      "Enable leaked password protection in Auth settings",
      "Set password minimum length to 12 characters", 
      "Enable email confirmation",
      "Configure CORS to restrict to known domains",
      "Enable audit logging",
      "Set JWT expiry to 1 hour with refresh token rotation"
    ],
    warningUpdates: [
      "Review and update file size limits",
      "Enable statement timeout for database queries",
      "Configure rate limiting for anonymous requests",
      "Set session inactivity timeout"
    ]
  };
};