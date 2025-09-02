import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { BookOpen, CheckCircle, Clock, AlertCircle, Plus, Search, Filter } from 'lucide-react';
import { AuthGuard } from '@/components/AuthGuard';

interface DictionaryTerm {
  id: string;
  term: string;
  slug: string;
  short_def: string;
  long_def: string;
  category: string;
  status: string;
  frequency: number;
  context: string;
  created_from_content_id: string;
  created_at: string;
  synonyms?: string[];
  related?: string[];
  translations?: any;
  updated_at?: string;
}

const AdminDictionaryPage: React.FC = () => {
  const [terms, setTerms] = useState<DictionaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState<DictionaryTerm | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['Management', 'Leadership', 'Psychology', 'Money', 'Digital Life', 'Study Skills'];

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dictionary')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTerms(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch dictionary terms: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTerm = async (termData: Partial<DictionaryTerm>) => {
    try {
      if (selectedTerm) {
        // Update existing term
        const { error } = await supabase
          .from('dictionary')
          .update({
            term: termData.term,
            short_def: termData.short_def,
            long_def: termData.long_def,
            category: termData.category,
            status: termData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedTerm.id);

        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Dictionary term updated successfully',
        });
      } else {
        // Create new term
        const slug = termData.term?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '';
        const { error } = await supabase
          .from('dictionary')
          .insert({
            term: termData.term,
            slug,
            short_def: termData.short_def,
            long_def: termData.long_def,
            category: termData.category,
            status: termData.status || 'draft'
          });

        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Dictionary term created successfully',
        });
      }

      setIsEditing(false);
      setSelectedTerm(null);
      fetchTerms();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to save term: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handlePublishTerm = async (termId: string) => {
    try {
      const { error } = await supabase
        .from('dictionary')
        .update({ status: 'published' })
        .eq('id', termId);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Term published successfully',
      });
      
      fetchTerms();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to publish term: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.short_def?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || term.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || term.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'needs_review': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'needs_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dictionary...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Dictionary Administration - TMA</title>
          <meta name="description" content="Manage TMA Academy dictionary terms and definitions" />
        </Helmet>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dictionary Administration</h1>
            <p className="text-muted-foreground">
              Manage dictionary terms, review auto-generated drafts, and publish definitions.
            </p>
          </div>

          <Tabs defaultValue="terms" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="terms">All Terms ({terms.length})</TabsTrigger>
              <TabsTrigger value="review">
                Needs Review ({terms.filter(t => t.status === 'needs_review').length})
              </TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="terms" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <CardTitle>Dictionary Terms</CardTitle>
                    <Button
                      onClick={() => {
                        setSelectedTerm(null);
                        setIsEditing(true);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Term
                    </Button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search terms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="needs_review">Needs Review</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {filteredTerms.map((term) => (
                      <div
                        key={term.id}
                        className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => {
                          setSelectedTerm(term);
                          setIsEditing(true);
                        }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(term.status)}
                            <h3 className="font-semibold">{term.term}</h3>
                            <Badge className={getStatusColor(term.status)}>
                              {term.status}
                            </Badge>
                            {term.category && (
                              <Badge variant="outline">{term.category}</Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {term.short_def || 'No definition provided'}
                          </p>
                          
                          {term.context && (
                            <p className="text-xs text-muted-foreground">
                              Context: {term.context}
                            </p>
                          )}
                          
                          {term.frequency && (
                            <p className="text-xs text-muted-foreground">
                              Frequency: {term.frequency}
                            </p>
                          )}
                        </div>
                        
                        {term.status === 'needs_review' && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePublishTerm(term.id);
                            }}
                            className="ml-4"
                          >
                            Quick Publish
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    {filteredTerms.length === 0 && (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No terms found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="review" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Terms Needing Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {terms.filter(term => term.status === 'needs_review').map((term) => (
                      <div key={term.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{term.term}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              {term.context}
                            </p>
                            {term.frequency && (
                              <p className="text-xs text-muted-foreground mb-4">
                                Found {term.frequency} times in content
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              setSelectedTerm(term);
                              setIsEditing(true);
                            }}
                            variant="outline"
                          >
                            Edit & Review
                          </Button>
                          <Button
                            onClick={() => handlePublishTerm(term.id)}
                            disabled={!term.short_def}
                          >
                            Publish As-Is
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dictionary Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {terms.filter(t => t.status === 'published').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Published Terms</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {terms.filter(t => t.status === 'needs_review').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Awaiting Review</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {terms.filter(t => t.created_from_content_id).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Auto-Generated</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Term Edit Modal/Form - This would be enhanced with a proper modal */}
          {isEditing && (
            <Card className="fixed inset-4 z-50 bg-background shadow-lg overflow-auto">
              <CardHeader>
                <CardTitle>
                  {selectedTerm ? 'Edit Term' : 'Add New Term'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Term</label>
                  <Input
                    defaultValue={selectedTerm?.term || ''}
                    placeholder="Enter term"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select defaultValue={selectedTerm?.category || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Short Definition</label>
                  <Textarea
                    defaultValue={selectedTerm?.short_def || ''}
                    placeholder="Brief definition (240 characters max)"
                    maxLength={240}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Long Definition</label>
                  <Textarea
                    defaultValue={selectedTerm?.long_def || ''}
                    placeholder="Detailed definition"
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      // This would be enhanced to actually save the form data
                      setIsEditing(false);
                      setSelectedTerm(null);
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedTerm(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthGuard>
  );
};

export default AdminDictionaryPage;