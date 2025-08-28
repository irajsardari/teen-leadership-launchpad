import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, UserCheck, UserX, AlertTriangle, Clock } from 'lucide-react';
import { useSecurityContext } from '@/components/SecurityProvider';

interface SafeguardingPermission {
  id: string;
  user_id: string;
  role: 'safeguarding_officer' | 'safeguarding_manager';
  granted_by: string | null;
  granted_at: string;
  is_active: boolean;
  user_email?: string;
  granted_by_email?: string;
}

export const SafeguardingPermissionsManager: React.FC = () => {
  const [permissions, setPermissions] = useState<SafeguardingPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'safeguarding_officer' | 'safeguarding_manager'>('safeguarding_officer');
  const [isGranting, setIsGranting] = useState(false);
  const { canAccess } = useSecurityContext();
  const { toast } = useToast();

  // Only admins can access this component
  if (!canAccess('admin')) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('safeguarding_permissions')
        .select(`
          *,
          user_profiles:profiles!safeguarding_permissions_user_id_fkey(full_name),
          granted_by_profiles:profiles!safeguarding_permissions_granted_by_fkey(full_name)
        `)
        .order('granted_at', { ascending: false });

      if (error) throw error;
      setPermissions(data || []);
    } catch (error: any) {
      console.error('Error fetching safeguarding permissions:', error);
      toast({
        title: "Error Loading Permissions",
        description: "Failed to load safeguarding permissions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const grantAccess = async () => {
    if (!userEmail || !selectedRole) {
      toast({
        title: "Missing Information",
        description: "Please provide user email and select a role.",
        variant: "destructive",
      });
      return;
    }

    setIsGranting(true);
    
    try {
      // First, find the user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userEmail) // Assuming we have email in profiles, or we need to join with auth.users
        .single();

      if (userError) {
        throw new Error(`User not found with email: ${userEmail}`);
      }

      // Grant safeguarding access
      const { data, error } = await supabase.rpc('grant_safeguarding_access', {
        target_user_id: userData.id,
        access_role: selectedRole
      });

      if (error) throw error;

      toast({
        title: "Access Granted Successfully",
        description: `${selectedRole.replace('_', ' ')} access granted to ${userEmail}`,
      });

      // Reset form and refresh list
      setUserEmail('');
      setSelectedRole('safeguarding_officer');
      await fetchPermissions();

    } catch (error: any) {
      console.error('Error granting safeguarding access:', error);
      toast({
        title: "Error Granting Access",
        description: error.message || "Failed to grant safeguarding access.",
        variant: "destructive",
      });
    } finally {
      setIsGranting(false);
    }
  };

  const revokeAccess = async (permissionId: string, userEmail: string) => {
    try {
      const { error } = await supabase
        .from('safeguarding_permissions')
        .update({ is_active: false })
        .eq('id', permissionId);

      if (error) throw error;

      toast({
        title: "Access Revoked",
        description: `Safeguarding access revoked for ${userEmail}`,
      });

      await fetchPermissions();
    } catch (error: any) {
      console.error('Error revoking safeguarding access:', error);
      toast({
        title: "Error Revoking Access",
        description: "Failed to revoke safeguarding access.",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'safeguarding_manager': return 'default';
      case 'safeguarding_officer': return 'secondary';
      default: return 'outline';
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <div className="space-y-6">
      {/* Warning Alert */}
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="w-4 h-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Critical Security Feature:</strong> Only grant safeguarding access to trained personnel with legitimate need to access child safety reports.
        </AlertDescription>
      </Alert>

      {/* Grant Access Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5" />
            <span>Grant Safeguarding Access</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">User Email</label>
              <Input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Safeguarding Role</label>
              <Select value={selectedRole} onValueChange={(value: any) => setSelectedRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safeguarding_officer">Safeguarding Officer</SelectItem>
                  <SelectItem value="safeguarding_manager">Safeguarding Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={grantAccess}
                disabled={isGranting || !userEmail}
                className="w-full"
              >
                {isGranting ? 'Granting...' : 'Grant Access'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Current Safeguarding Permissions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading permissions...</div>
          ) : permissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No safeguarding permissions granted yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium">User ID: {permission.user_id}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={getRoleBadgeVariant(permission.role)}>
                            {permission.role.replace('_', ' ')}
                          </Badge>
                          <Badge variant={permission.is_active ? 'default' : 'secondary'}>
                            {permission.is_active ? 'Active' : 'Revoked'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Granted: {new Date(permission.granted_at).toLocaleDateString()}</span>
                      {permission.granted_by && (
                        <span>by Admin ID: {permission.granted_by}</span>
                      )}
                    </div>
                  </div>
                  {permission.is_active && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revokeAccess(permission.id, permission.user_id)}
                      className="ml-4"
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};