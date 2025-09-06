import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  UserCheck,
  AlertTriangle,
  Filter,
  RefreshCw
} from 'lucide-react';

interface Feedback {
  id: string;
  term_id: string;
  user_email?: string;
  feedback_type: string;
  message: string;
  language: string;
  status: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  dictionary?: any;
}

const FeedbackManager: React.FC = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('term_feedback')
        .select(`
          *,
          dictionary!inner(term, slug)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedback(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch feedback: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFeedbackStatus = async (feedbackId: string, status: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('term_feedback')
        .update({
          status,
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', feedbackId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Feedback marked as ${status}`
      });

      setSelectedFeedback(null);
      setAdminNotes('');
      fetchFeedback();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to update feedback: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'reviewed': return <Eye className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'correction': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'improvement': return <UserCheck className="w-4 h-4 text-blue-500" />;
      case 'translation': return <MessageSquare className="w-4 h-4 text-purple-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredFeedback = feedback.filter(item => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.feedback_type === typeFilter;
    return matchesStatus && matchesType;
  });

  const pendingCount = feedback.filter(f => f.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            User Feedback
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingCount} pending
              </Badge>
            )}
          </h3>
          <p className="text-sm text-muted-foreground">
            Review and manage user feedback on lexicon terms
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="implemented">Implemented</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="correction">Corrections</SelectItem>
              <SelectItem value="improvement">Improvements</SelectItem>
              <SelectItem value="translation">Translations</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchFeedback}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { status: 'pending', label: 'Pending Review', icon: Clock, color: 'text-yellow-600' },
          { status: 'reviewed', label: 'Under Review', icon: Eye, color: 'text-blue-600' },
          { status: 'implemented', label: 'Implemented', icon: CheckCircle, color: 'text-green-600' },
          { status: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-600' }
        ].map(({ status, label, icon: Icon, color }) => {
          const count = feedback.filter(f => f.status === status).length;
          return (
            <Card key={status}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <p className="text-2xl font-bold mt-1">{count}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feedback List */}
      <div className="grid gap-4">
        {filteredFeedback.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(item.feedback_type)}
                    <span className="font-medium">
                      {item.dictionary?.term || 'Unknown Term'}
                    </span>
                    <Badge className={getStatusColor(item.status)}>
                      {getStatusIcon(item.status)}
                      {item.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {item.feedback_type}
                    </Badge>
                    {item.language !== 'en' && (
                      <Badge variant="outline" className="text-xs">
                        {item.language.toUpperCase()}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    {item.message}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {item.user_email && (
                      <span>From: {item.user_email}</span>
                    )}
                    <span>
                      Submitted: {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    {item.updated_at !== item.created_at && (
                      <span>
                        Updated: {new Date(item.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {item.admin_notes && (
                    <div className="mt-3 p-2 bg-muted/50 rounded text-sm">
                      <span className="font-medium">Admin Notes:</span> {item.admin_notes}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  {item.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedFeedback(item);
                        setAdminNotes(item.admin_notes || '');
                      }}
                    >
                      Review
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredFeedback.length === 0 && !loading && (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {statusFilter === 'all' && typeFilter === 'all' 
                  ? 'No feedback received yet'
                  : 'No feedback matches the current filters'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Review Modal */}
      {selectedFeedback && (
        <Card className="fixed inset-4 z-50 max-w-2xl mx-auto bg-background border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getTypeIcon(selectedFeedback.feedback_type)}
              Review Feedback for "{selectedFeedback.dictionary?.term}"
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Feedback Message:</label>
              <div className="mt-1 p-3 bg-muted/50 rounded text-sm">
                {selectedFeedback.message}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Admin Notes:</label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add your notes about this feedback..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFeedback(null);
                  setAdminNotes('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => updateFeedbackStatus(selectedFeedback.id, 'rejected')}
                disabled={updating}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                variant="outline"
                onClick={() => updateFeedbackStatus(selectedFeedback.id, 'reviewed')}
                disabled={updating}
              >
                <Eye className="w-4 h-4 mr-2" />
                Mark Reviewed
              </Button>
              <Button
                onClick={() => updateFeedbackStatus(selectedFeedback.id, 'implemented')}
                disabled={updating}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Implemented
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedFeedback && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => {
            setSelectedFeedback(null);
            setAdminNotes('');
          }}
        />
      )}
    </div>
  );
};

export default FeedbackManager;