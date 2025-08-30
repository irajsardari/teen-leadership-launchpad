import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useSecurityContext } from './SecurityProvider';
import { SecurityAudit } from '@/utils/security';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Eye, Shield, Lock, AlertTriangle, Plus } from 'lucide-react';

interface ConfidentialRecord {
  id: string;
  entity_id: string;
  entity_type: string;
  confidential_info: string;
  created_at: string;
  updated_at: string;
}

interface ConfidentialRecordsManagerProps {
  entityId?: string;
  entityType?: string;
  readOnly?: boolean;
}

export const ConfidentialRecordsManager: React.FC<ConfidentialRecordsManagerProps> = ({
  entityId,
  entityType,
  readOnly = false
}) => {
  const [records, setRecords] = useState<ConfidentialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<ConfidentialRecord | null>(null);
  const [newRecord, setNewRecord] = useState({
    entity_id: entityId || '',
    entity_type: entityType || '',
    confidential_info: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  
  const { canAccess, logSecurityEvent } = useSecurityContext();
  const { toast } = useToast();

  // Check verification status and fetch records
  useEffect(() => {
    if (!canAccess('admin')) {
      setLoading(false);
      return;
    }

    checkVerificationStatus();
  }, [canAccess, entityId, entityType]);

  const checkVerificationStatus = async () => {
    try {
      const { data: verificationData } = await supabase
        .from('security_audit_logs')
        .select('created_at')
        .eq('action', 'admin_verification_success')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      const verified = verificationData && verificationData.length > 0;
      setIsVerified(verified);
      
      if (verified) {
        await fetchRecords();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking verification:', error);
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.rpc('verify_admin_for_confidential_access', {
        verification_code: verificationCode,
      });

      if (error) throw error;

      setIsVerified(true);
      setVerificationCode('');
      
      toast({
        title: "Verification Successful",
        description: "You now have access to confidential records for 1 hour",
      });

      await logSecurityEvent('admin_confidential_verification_success', 'confidential_access');
      await fetchRecords();
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code",
        variant: "destructive",
      });
      await logSecurityEvent('admin_confidential_verification_failed', 'security_violation');
      setLoading(false);
    }
  };

  const fetchRecords = async () => {
    try {
      await logSecurityEvent('confidential_records_access_attempt', 'confidential_records');
      
      // Use the new ultra-secure RLS policies - records will be filtered automatically
      let query = supabase
        .from('confidential_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (entityId) {
        query = query.eq('entity_id', entityId);
      }
      
      if (entityType) {
        query = query.eq('entity_type', entityType);  
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching confidential records:', error);
        
        // Enhanced error handling for new security policies
        if (error.message?.includes('policy') || error.code === '42501') {
          toast({
            title: "Access Denied",
            description: "Insufficient privileges to access confidential records. Admin access required.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Access Error", 
            description: "Failed to fetch confidential records. Please check your permissions.",
            variant: "destructive",
          });
        }
        return;
      }

      setRecords(data || []);
      
      // Enhanced audit logging with more details
      await SecurityAudit.log(
        'confidential_records_retrieved_secure', 
        'confidential_records', 
        `count:${data?.length || 0}_entity_filter:${entityType || 'all'}`
      );
      
    } catch (error) {
      console.error('Confidential records fetch error:', error);
      toast({
        title: "Security Error",
        description: "Unable to access confidential records due to security restrictions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRecord = async () => {
    if (!newRecord.confidential_info.trim() || !newRecord.entity_type.trim()) {
      toast({
        title: "Validation Error",
        description: "All fields are required for confidential records.",
        variant: "destructive",
      });
      return;
    }

    try {
      await SecurityAudit.log('confidential_record_create_attempt', 'confidential_records');
      
      const { data, error } = await supabase
        .from('confidential_records')
        .insert([newRecord])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setRecords([data, ...records]);
      setNewRecord({ entity_id: entityId || '', entity_type: entityType || '', confidential_info: '' });
      setShowForm(false);
      
      toast({
        title: "Record Created",
        description: "Confidential record has been securely stored.",
      });
      
      await SecurityAudit.log('confidential_record_created', 'confidential_records', data.id);
      
    } catch (error: any) {
      console.error('Error creating confidential record:', error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create confidential record.",
        variant: "destructive",
      });
      await SecurityAudit.log('confidential_record_create_failed', 'confidential_records');
    }
  };

  const updateRecord = async () => {
    if (!editingRecord) return;

    try {
      await SecurityAudit.log('confidential_record_update_attempt', 'confidential_records', editingRecord.id);
      
      const { data, error } = await supabase
        .from('confidential_records')
        .update({
          confidential_info: editingRecord.confidential_info,
          entity_type: editingRecord.entity_type
        })
        .eq('id', editingRecord.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setRecords(records.map(r => r.id === editingRecord.id ? data : r));
      setEditingRecord(null);
      
      toast({
        title: "Record Updated",
        description: "Confidential record has been updated securely.",
      });
      
      await SecurityAudit.log('confidential_record_updated', 'confidential_records', data.id);
      
    } catch (error: any) {
      console.error('Error updating confidential record:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update confidential record.",
        variant: "destructive",
      });
      await SecurityAudit.log('confidential_record_update_failed', 'confidential_records', editingRecord.id);
    }
  };

  const deleteRecord = async (recordId: string) => {
    try {
      await SecurityAudit.log('confidential_record_delete_attempt', 'confidential_records', recordId);
      
      const { error } = await supabase
        .from('confidential_records')
        .delete()
        .eq('id', recordId);

      if (error) {
        throw error;
      }

      setRecords(records.filter(r => r.id !== recordId));
      
      toast({
        title: "Record Deleted",
        description: "Confidential record has been permanently deleted.",
      });
      
      await SecurityAudit.log('confidential_record_deleted', 'confidential_records', recordId);
      
    } catch (error: any) {
      console.error('Error deleting confidential record:', error);
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete confidential record.",
        variant: "destructive",
      });
      await SecurityAudit.log('confidential_record_delete_failed', 'confidential_records', recordId);
    }
  };

  if (!canAccess('admin')) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Only administrators can access confidential records
          </p>
        </CardContent>
      </Card>
    );
  }

  // Require verification for access
  if (!isVerified) {
    return (
      <Card className="border-warning">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Admin Verification Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Ultra-secure Access Required:</strong> Confidential records require manual 
              verification. Enter today's verification code: CONFIDENTIAL_YYYYMMDD
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Label htmlFor="verification">Verification Code</Label>
            <Input
              id="verification"
              type="password"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="CONFIDENTIAL_YYYYMMDD"
            />
          </div>
          
          <Button 
            onClick={handleVerification}
            disabled={loading || !verificationCode}
            className="w-full"
          >
            {loading ? 'Verifying...' : 'Verify Access'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5" />
            <span>Confidential Records</span>
            <Badge variant="destructive">Admin Only</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 border-red-200 bg-red-50">
            <Shield className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>ULTRA-SECURE ACCESS VERIFIED:</strong> You have temporary access to confidential 
              records (expires in 1 hour). All operations are logged and audited. This data contains 
              highly sensitive information - handle with extreme care.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Confidential Records ({records.length})</h3>
              <p className="text-sm text-muted-foreground">
                Access expires in 1 hour • All activity monitored
              </p>
            </div>
            <Badge variant="destructive" className="text-xs">
              CONFIDENTIAL
            </Badge>
          </div>

          {!readOnly && (
            <div className="mb-4">
              <Button 
                onClick={() => setShowForm(!showForm)}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {showForm ? 'Cancel' : 'Add Confidential Record'}
              </Button>
            </div>
          )}

          {showForm && (
            <Card className="mb-4 border-warning">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="entity-id">Entity ID</Label>
                    <Input
                      id="entity-id"
                      placeholder="Entity UUID"
                      value={newRecord.entity_id}
                      onChange={(e) => setNewRecord({ ...newRecord, entity_id: e.target.value })}
                      disabled={!!entityId}
                    />
                  </div>
                  <div>
                    <Label htmlFor="entity-type">Entity Type</Label>
                    <Input
                      id="entity-type"
                      placeholder="e.g., user, application, report"
                      value={newRecord.entity_type}
                      onChange={(e) => setNewRecord({ ...newRecord, entity_type: e.target.value })}
                      disabled={!!entityType}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="confidential-info">Confidential Information</Label>
                  <Textarea
                    id="confidential-info"
                    placeholder="Enter confidential information..."
                    value={newRecord.confidential_info}
                    onChange={(e) => setNewRecord({ ...newRecord, confidential_info: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={createRecord} disabled={loading}>
                    {loading ? 'Creating...' : 'Create Record'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator className="my-4" />

          {loading ? (
            <div className="text-center p-4">Loading confidential records...</div>
          ) : records.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              No confidential records found
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {records.map((record) => (
                  <Card key={record.id} className="border-red-200">
                    <CardContent className="p-4">
                      {editingRecord?.id === record.id ? (
                        <div className="space-y-4">
                          <Input
                            value={editingRecord.entity_type}
                            onChange={(e) => setEditingRecord({ ...editingRecord, entity_type: e.target.value })}
                            placeholder="Entity Type"
                          />
                          <Textarea
                            value={editingRecord.confidential_info}
                            onChange={(e) => setEditingRecord({ ...editingRecord, confidential_info: e.target.value })}
                            rows={4}
                          />
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={updateRecord}>Save</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingRecord(null)}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <Badge variant="outline">{record.entity_type}</Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                ID: {record.entity_id}
                              </p>
                            </div>
                            {!readOnly && (
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingRecord(record)}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteRecord(record.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                          <div className="bg-gray-50 p-3 rounded text-sm">
                            {record.confidential_info}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Created: {new Date(record.created_at).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};