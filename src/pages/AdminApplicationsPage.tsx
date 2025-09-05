import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { SecurityAudit, SecureFileAccess, AuthSecurity } from "@/utils/security";
import { withSecurityCheck } from "@/components/SecurityProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Eye, Download, Mail, Phone, User, Calendar } from "lucide-react";

interface ApplicationRow {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone_number: string;
  status: string | null;
  cv_url: string | null;
  specialization: string;
  confidential_info: string | null;
  experience_years: number;
  education: string;
  cover_letter: string;
}

const AdminApplicationsPage = () => {
  const [rows, setRows] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [securityCheck, setSecurityCheck] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationRow | null>(null);

  // Enhanced security data fetching with comprehensive audit logging
  const fetchApplicationsSecurely = async () => {
    try {
      console.log('🔒 Initiating secure teacher applications fetch...');

      // First, log the access attempt
      await supabase.rpc('log_teacher_application_select_access', {
        application_ids: []  // Initial empty array
      });

      const { data, error } = await supabase
        .from("teacher_applications")
        .select("id, created_at, full_name, email, phone_number, status, cv_url, specialization, confidential_info, experience_years, education, cover_letter")
        .order("created_at", { ascending: false });

      if (error) {
        console.error('❌ Failed to fetch teacher applications:', error);
        toast.error("Failed to load applications - access may be restricted");
        await SecurityAudit.log('application_fetch_failed', 'security_violation', error.message);
        return;
      }

      if (data && data.length > 0) {
        // Log successful access with all application IDs
        const applicationIds = data.map(app => app.id);
        await supabase.rpc('log_teacher_application_select_access', {
          application_ids: applicationIds
        });
        
        console.log(`✅ Successfully fetched ${data.length} applications with security logging`);
      }

      setRows(data as ApplicationRow[] || []);
      setSecurityCheck(true);
      
      // Log successful security check
      await SecurityAudit.log('admin_applications_access_success', 'sensitive_data_access', `loaded_${data?.length || 0}_applications`);
      
    } catch (error) {
      console.error('🚨 Security check failed:', error);
      toast.error("Security validation failed - access denied");
      await SecurityAudit.log('security_check_failed', 'critical_security_error', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationsSecurely();
  }, []);

  // Secure CSV export with data masking for compliance
  const exportCsv = async () => {
    try {
      await SecurityAudit.log('csv_export_initiated', 'sensitive_data_export', `attempting_${rows.length}_records`);
      
      const header = ["Name", "Email (Masked)", "Phone (Masked)", "Specialization", "Submission Date", "Status"].join(",");
      const body = rows.map(r => [
        r.full_name, 
        // Security: Always mask email in exports
        r.email ? r.email.replace(/(.{2}).*@/, '$1***@') : 'Not provided',
        // Security: Always mask phone numbers
        r.phone_number ? r.phone_number.replace(/.{4}$/, '****') : 'Not provided',
        r.specialization || 'Not specified',
        new Date(r.created_at).toLocaleDateString(), 
        r.status ?? "pending"
      ].join(",")).join("\n");
      
      const blob = new Blob([header + "\n" + body], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; 
      a.download = `teacher-applications-secure-${Date.now()}.csv`; 
      a.click();
      URL.revokeObjectURL(url);
      
      // Log successful export
      await SecurityAudit.log('csv_export_completed', 'data_export_success', `exported_${rows.length}_masked_records`);
      toast.success(`Exported ${rows.length} applications (data masked for security)`);
      
    } catch (error) {
      console.error('Export failed:', error);
      await SecurityAudit.log('csv_export_failed', 'export_error', (error as Error).message);
      toast.error("Export failed - security error");
    }
  };

  // Enhanced status update with comprehensive logging
  const updateStatus = async (id: string, status: string) => {
    try {
      // Log the status change attempt
      await SecurityAudit.log('status_change_attempt', 'teacher_application', `${id}:${status}`);
      
      const { error } = await supabase
        .from('teacher_applications')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        console.error('Failed to update application status:', error);
        toast.error("Failed to update status - access denied");
        await SecurityAudit.log('status_update_failed', 'security_error', `${id}:${error.message}`);
        return;
      }
      
      // Update local state
      setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      toast.success(`Status updated to ${status}`);
      
      // Log successful status update
      await SecurityAudit.log('status_update_success', 'teacher_application', `${id}:${status}`);
        
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error("Security error during status update");
      await SecurityAudit.log('status_update_exception', 'critical_error', (error as Error).message);
    }
  };

// Enhanced security detailed application view
  const viewApplicationDetails = async (applicationId: string) => {
    try {
      await SecurityAudit.log('detailed_view_attempt', 'sensitive_access', applicationId);
      
      const { data, error } = await supabase.rpc('get_teacher_application_secure', {
        application_id: applicationId,
        include_sensitive: true
      });

      if (error || !data || data.length === 0) {
        toast.error("Access denied or application not found");
        await SecurityAudit.log('detailed_view_denied', 'access_violation', applicationId);
        return;
      }

      const application = data[0];
      // Create a properly typed application object
      const typedApplication: ApplicationRow = {
        id: application.id,
        created_at: application.created_at,
        full_name: application.full_name,
        email: application.email,
        phone_number: application.phone_number || '',
        status: application.status,
        cv_url: application.cv_url,
        specialization: application.specialization || '',
        confidential_info: (application as any).confidential_info || null,
        experience_years: application.experience_years || 0,
        education: application.education || '',
        cover_letter: application.cover_letter || ''
      };
      
      setSelectedApplication(typedApplication);
      
      // Log successful detailed access
      await SecurityAudit.log('detailed_view_success', 'sensitive_data_access', applicationId);
      toast.success(`Secure access granted for: ${application.full_name}`);
      
    } catch (error) {
      console.error('Failed to fetch application details:', error);
      toast.error("Security error accessing application details");
      await SecurityAudit.log('detailed_view_error', 'security_exception', (error as Error).message);
    }
  };

  // Secure CV access with comprehensive logging
  const accessCV = async (applicationId: string, cvUrl: string) => {
    try {
      await SecurityAudit.log('cv_access_attempt', 'document_access', applicationId);
      
      // Generate secure URL through the security system
      const secureUrl = await SecureFileAccess.generateSecureUrl('teacher-documents', cvUrl, 600);
      
      if (secureUrl) {
        window.open(secureUrl, '_blank', 'noopener,noreferrer');
        await SecurityAudit.log('cv_access_success', 'document_accessed', applicationId);
        toast.success("CV accessed securely");
      } else {
        throw new Error("Failed to generate secure URL");
      }
      
    } catch (error) {
      console.error('CV access failed:', error);
      await SecurityAudit.log('cv_access_failed', 'document_security_error', applicationId);
      toast.error("Security error accessing CV");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 animate-pulse text-blue-600" />
            <span>Loading applications securely...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Admin Applications - Secure Access</title>
        <meta name="description" content="Secure admin interface for managing teacher applications with enhanced data protection" />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      {/* Security Status Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-6 w-6 text-green-600" />
          <h1 className="text-3xl font-bold">Teacher Applications</h1>
          {securityCheck && (
            <Badge variant="secondary" className="ml-2">
              🔒 Secure Access Verified
            </Badge>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <p className="text-gray-600">
              {rows.length} applications found
            </p>
            <div className="flex items-center gap-1 text-sm text-blue-600">
              <AlertTriangle className="h-4 w-4" />
              All access is logged and audited
            </div>
          </div>
          <Button onClick={exportCsv} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV (Masked Data)
          </Button>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="grid gap-6">
        {rows.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No applications found</p>
            </CardContent>
          </Card>
        ) : (
          rows.map((row) => (
            <Card key={row.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {row.full_name}
                    </CardTitle>
                    <div className="flex flex-col gap-1 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {/* Security: Show masked email by default */}
                        <span className="font-mono">
                          {row.email ? row.email.replace(/(.{2}).*@/, '$1***@') : 'Not provided'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span className="font-mono">
                          {row.phone_number ? row.phone_number.replace(/.{4}$/, '****') : 'Not provided'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Applied: {new Date(row.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={
                      row.status === 'approved' ? 'default' :
                      row.status === 'declined' ? 'destructive' :
                      'secondary'
                    }>
                      {row.status || 'pending'}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      🎯 {row.specialization || 'Not specified'}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => viewApplicationDetails(row.id)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Full Details
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(row.id, 'approved')}
                    className="text-green-700 hover:text-green-800"
                  >
                    ✅ Approve
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(row.id, 'declined')}
                    className="text-red-700 hover:text-red-800"
                  >
                    ❌ Decline
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(row.id, 'pending')}
                  >
                    ⏸️ Set Pending
                  </Button>

                  {row.cv_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => accessCV(row.id, row.cv_url!)}
                      className="flex items-center gap-2"
                    >
                      📄 View CV
                    </Button>
                  )}
                </div>
                
                {/* Security Notice */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2 text-sm">
                    <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-blue-800">
                      <strong>Security Protection:</strong> Personal data is masked for protection. 
                      All access is logged and audited. Rate limiting is enforced. 
                      Click "View Full Details" to access complete information through secure channels.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detailed Application Modal/View */}
      {selectedApplication && (
        <Card className="fixed inset-4 bg-white shadow-2xl border-2 border-blue-500 z-50 overflow-auto">
          <CardHeader className="bg-blue-50">
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Secure Application Details: {selectedApplication.full_name}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedApplication(null)}
              >
                ✕ Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Personal Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Full Name:</strong> {selectedApplication.full_name}</p>
                  <p><strong>Email:</strong> {selectedApplication.email}</p>
                  <p><strong>Phone:</strong> {selectedApplication.phone_number || 'Not provided'}</p>
                  <p><strong>Specialization:</strong> {selectedApplication.specialization || 'Not specified'}</p>
                  <p><strong>Experience:</strong> {selectedApplication.experience_years || 'Not specified'} years</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Application Details</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Status:</strong> {selectedApplication.status || 'pending'}</p>
                  <p><strong>Applied:</strong> {new Date(selectedApplication.created_at).toLocaleString()}</p>
                  <p><strong>Education:</strong> {selectedApplication.education || 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            {selectedApplication.cover_letter && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Cover Letter</h3>
                <div className="p-3 bg-gray-50 rounded text-sm whitespace-pre-wrap">
                  {selectedApplication.cover_letter}
                </div>
              </div>
            )}
            
            {selectedApplication.confidential_info && (
              <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded">
                <h3 className="font-semibold mb-3 text-red-800">⚠️ Confidential Information</h3>
                <div className="text-sm text-red-700">
                  {selectedApplication.confidential_info}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default withSecurityCheck(AdminApplicationsPage, 'admin');