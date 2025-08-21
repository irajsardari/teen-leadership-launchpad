import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSecurityContext } from './SecurityProvider';

interface AuditLogEntry {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  created_at: string;
  ip_address?: unknown;
  user_agent?: unknown;
}

interface SecurityAuditLogProps {
  limit?: number;
  filterUserId?: string;
  filterAction?: string;
}

export const SecurityAuditLog: React.FC<SecurityAuditLogProps> = ({
  limit = 50,
  filterUserId,
  filterAction
}) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { canAccess } = useSecurityContext();

  useEffect(() => {
    if (!canAccess('admin')) return;

    const fetchLogs = async () => {
      try {
        let query = supabase
          .from('security_audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (filterUserId) {
          query = query.eq('user_id', filterUserId);
        }

        if (filterAction) {
          query = query.ilike('action', `%${filterAction}%`);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching audit logs:', error);
          return;
        }

        setLogs(data || []);
      } catch (error) {
        console.error('Failed to fetch audit logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [canAccess, limit, filterUserId, filterAction]);

  if (!canAccess('admin')) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Access denied. Admin privileges required.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('failed') || action.includes('unauthorized')) {
      return 'destructive';
    }
    if (action.includes('success') || action.includes('authorized')) {
      return 'default';
    }
    return 'secondary';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Audit Log</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <div>Loading audit logs...</div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            No audit logs found
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                      <span className="text-sm font-medium">
                        {log.resource_type}
                      </span>
                      {log.resource_id && (
                        <span className="text-xs text-muted-foreground">
                          ID: {log.resource_id.substring(0, 8)}...
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      User: {log.user_id ? log.user_id.substring(0, 8) + '...' : 'Anonymous'}
                    </div>
                    {log.ip_address && (
                      <div className="text-xs text-muted-foreground">
                        IP: {String(log.ip_address)}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(log.created_at)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};