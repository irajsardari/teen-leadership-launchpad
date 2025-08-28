import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

interface StorageRequest {
  action: 'upload' | 'download' | 'delete';
  bucket: string;
  fileName?: string;
  filePath?: string;
  fileData?: string; // base64 encoded file data for upload
  fileType?: string;
}

// Rate limiting for file operations
const rateLimitMap = new Map<string, { attempts: number; windowStart: number }>();

const checkRateLimit = (identifier: string, maxAttempts = 10, windowMs = 60 * 1000): boolean => {
  const now = Date.now();
  const existing = rateLimitMap.get(identifier);
  
  if (!existing || now - existing.windowStart > windowMs) {
    rateLimitMap.set(identifier, { attempts: 1, windowStart: now });
    return true;
  }
  
  if (existing.attempts >= maxAttempts) {
    return false;
  }
  
  existing.attempts++;
  return true;
};

const validateFileType = (fileName: string, allowedTypes: string[]): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
};

const validateFileSize = (fileData: string, maxSizeMB: number): boolean => {
  const sizeBytes = (fileData.length * 3) / 4; // base64 to bytes approximation
  return sizeBytes <= maxSizeMB * 1024 * 1024;
};

const generateSecurePath = (userId: string, bucket: string, fileName: string): string => {
  const timestamp = Date.now();
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${userId}/${timestamp}_${sanitizedName}`;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Authenticate user
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Rate limiting
    if (!checkRateLimit(user.id, 20, 60 * 1000)) { // 20 operations per minute
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const storageRequest: StorageRequest = await req.json();
    let result;

    switch (storageRequest.action) {
      case 'upload':
        result = await handleUpload(supabase, user, storageRequest);
        break;
      case 'download':
        result = await handleDownload(supabase, user, storageRequest);
        break;
      case 'delete':
        result = await handleDelete(supabase, user, storageRequest);
        break;
      default:
        throw new Error('Invalid action');
    }

    // Log file operation
    await supabase.rpc('log_file_access', {
      p_file_path: storageRequest.filePath || storageRequest.fileName || 'unknown',
      p_action: storageRequest.action
    });

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Storage operation error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

const handleUpload = async (supabase: any, user: any, request: StorageRequest) => {
  const { bucket, fileName, fileData, fileType } = request;
  
  if (!fileName || !fileData || !bucket) {
    throw new Error('Missing required upload parameters');
  }

  // Define allowed file types per bucket
  const allowedTypes: { [key: string]: string[] } = {
    'teacher-documents': ['pdf', 'doc', 'docx'],
    'teacher-cvs': ['pdf', 'doc', 'docx'],
    'student-documents': ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
    'cv': ['pdf', 'doc', 'docx'],
  };

  const maxSizes: { [key: string]: number } = {
    'teacher-documents': 10, // 10MB
    'teacher-cvs': 10,
    'student-documents': 5,
    'cv': 10,
  };

  // Validate file type
  if (!validateFileType(fileName, allowedTypes[bucket] || [])) {
    throw new Error(`File type not allowed for bucket: ${bucket}`);
  }

  // Validate file size
  if (!validateFileSize(fileData, maxSizes[bucket] || 5)) {
    throw new Error(`File too large for bucket: ${bucket}`);
  }

  // Generate secure file path
  const securePath = generateSecurePath(user.id, bucket, fileName);
  
  // Convert base64 to binary
  const binaryData = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));
  
  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(securePath, binaryData, {
      contentType: fileType || 'application/octet-stream',
      duplex: 'half'
    });

  if (error) throw error;

  return {
    path: data.path,
    fullPath: data.fullPath,
    securePath,
    bucket
  };
};

const handleDownload = async (supabase: any, user: any, request: StorageRequest) => {
  const { bucket, filePath } = request;
  
  if (!filePath || !bucket) {
    throw new Error('Missing required download parameters');
  }

  // Verify user has access to this file
  // Check if file belongs to user or user is admin
  const userRole = await getUserRole(supabase, user.id);
  const fileOwnership = filePath.startsWith(user.id + '/');
  
  if (!fileOwnership && userRole !== 'admin') {
    throw new Error('Access denied to file');
  }

  // Generate signed URL (expires in 1 hour)
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, 3600); // 1 hour expiry

  if (error) throw error;

  return {
    signedUrl: data.signedUrl,
    expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
  };
};

const handleDelete = async (supabase: any, user: any, request: StorageRequest) => {
  const { bucket, filePath } = request;
  
  if (!filePath || !bucket) {
    throw new Error('Missing required delete parameters');
  }

  // Verify user has permission to delete this file
  const userRole = await getUserRole(supabase, user.id);
  const fileOwnership = filePath.startsWith(user.id + '/');
  
  if (!fileOwnership && userRole !== 'admin') {
    throw new Error('Access denied to delete file');
  }

  // Delete file from storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) throw error;

  return { deleted: true, filePath };
};

const getUserRole = async (supabase: any, userId: string): Promise<string> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (error || !data) return 'challenger';
  return data.role || 'challenger';
};

serve(handler);