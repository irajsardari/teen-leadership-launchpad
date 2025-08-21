import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSecurityContext } from './SecurityProvider';
import { SecurityAudit } from '@/utils/security';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Eye, Shield, Lock } from 'lucide-react';

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
  
  const { canAccess, logSecurityEvent } = useSecurityContext();
  const { toast } = useToast();

  useEffect(() => {
    if (!canAccess('admin')) {
      setLoading(false);
      return;
    }

    fetchRecords();
  }, [canAccess, entityId, entityType]);

  const fetchRecords = async () => {
    try {
      await logSecurityEvent('confidential_records_access_attempt', 'confidential_records');
      
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
        toast({
          title: "Access Error",
          description: "Failed to fetch confidential records. Access may be restricted.",
          variant: "destructive",
        });
        return;
      }

      setRecords(data || []);
      await SecurityAudit.log('confidential_records_retrieved', 'confidential_records', `count:${data?.length || 0}`);
      
    } catch (error) {
      console.error('Confidential records fetch error:', error);
      toast({
        title: "Security Error",
        description: "Unable to access confidential records.",
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
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="w-6 h-6 text-destructive" />
            <p className="text-center text-muted-foreground">
              Access denied. Administrator privileges required.
            </p>
          </div>
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
          <Alert className="mb-4">
            <Shield className="w-4 h-4" />
            <AlertDescription>
              These records contain sensitive confidential information. All access is logged and monitored.
              Only authorized administrators can view, create, or modify these records.
            </AlertDescription>
          </Alert>

          {!readOnly && (
            <div className="mb-4">
              <Button 
                onClick={() => setShowForm(!showForm)}
                disabled={loading}
              >
                {showForm ? 'Cancel' : 'Add Confidential Record'}
              </Button>
            </div>
          )}

          {showForm && (
            <Card className="mb-4">
              <CardContent className="p-4 space-y-4">
                <Input
                  placeholder="Entity ID"
                  value={newRecord.entity_id}
                  onChange={(e) => setNewRecord({ ...newRecord, entity_id: e.target.value })}
                  disabled={!!entityId}
                />
                <Input
                  placeholder="Entity Type"
                  value={newRecord.entity_type}
                  onChange={(e) => setNewRecord({ ...newRecord, entity_type: e.target.value })}
                  disabled={!!entityType}
                />
                <Textarea
                  placeholder="Confidential Information"
                  value={newRecord.confidential_info}
                  onChange={(e) => setNewRecord({ ...newRecord, confidential_info: e.target.value })}
                  rows={4}
                />
                <div className="flex space-x-2">
                  <Button onClick={createRecord}>Create Record</Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

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