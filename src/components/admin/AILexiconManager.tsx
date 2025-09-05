import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, BookOpen, Brain, Zap, Users, BarChart3, Settings, Plus, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface LexiconCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  is_active: boolean;
}

interface GenerationQueue {
  id: string;
  term: string;
  category: string;
  status: string;
  priority: number;
  requested_at: string;
  error_message?: string;
}

interface LexiconStats {
  total_terms: number;
  ai_generated: number;
  published: number;
  pending: number;
  categories: Record<string, number>;
}

const AILexiconManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [categories, setCategories] = useState<LexiconCategory[]>([]);
  const [queue, setQueue] = useState<GenerationQueue[]>([]);
  const [stats, setStats] = useState<LexiconStats | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Bulk seeding state
  const [seedingInProgress, setSeedingInProgress] = useState(false);
  const [seedingProgress, setSeedingProgress] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [termsPerCategory, setTermsPerCategory] = useState(30);
  
  // Single term generation
  const [newTerm, setNewTerm] = useState('');
  const [newTermCategory, setNewTermCategory] = useState('Management');
  const [generatingTerm, setGeneratingTerm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([
      fetchCategories(),
      fetchQueue(),
      fetchStats()
    ]);
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('lexicon_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch categories: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const fetchQueue = async () => {
    try {
      const { data, error } = await supabase
        .from('lexicon_generation_queue')
        .select('*')
        .order('requested_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setQueue(data || []);
    } catch (error: any) {
      console.error('Failed to fetch queue:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: terms, error } = await supabase
        .from('dictionary')
        .select('status, ai_generated, category');

      if (error) throw error;

      const stats: LexiconStats = {
        total_terms: terms?.length || 0,
        ai_generated: terms?.filter(t => t.ai_generated).length || 0,
        published: terms?.filter(t => t.status === 'published').length || 0,
        pending: terms?.filter(t => t.status === 'draft' || t.status === 'pending').length || 0,
        categories: {}
      };

      // Count by category
      terms?.forEach(term => {
        if (term.category) {
          stats.categories[term.category] = (stats.categories[term.category] || 0) + 1;
        }
      });

      setStats(stats);
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const startBulkSeeding = async () => {
    if (selectedCategories.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one category for seeding',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSeedingInProgress(true);
      setSeedingProgress(0);

      const totalTerms = selectedCategories.length * termsPerCategory;

      const { data, error } = await supabase.functions.invoke('bulk-lexicon-seeder', {
        body: {
          categories: selectedCategories,
          termsPerCategory: termsPerCategory,
          totalTerms: totalTerms,
          languages: ['en', 'ar']
        }
      });

      if (data?.success) {
        toast({
          title: 'Bulk Seeding Completed',
          description: `Successfully generated ${data.summary.successfully_generated} terms out of ${totalTerms} requested.`,
        });
        
        await fetchStats(); // Refresh stats
      } else {
        throw new Error(data?.error || 'Bulk seeding failed');
      }
    } catch (error: any) {
      toast({
        title: 'Seeding Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSeedingInProgress(false);
      setSeedingProgress(0);
    }
  };

  const generateSingleTerm = async () => {
    if (!newTerm.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a term to generate',
        variant: 'destructive',
      });
      return;
    }

    try {
      setGeneratingTerm(true);

      const { data, error } = await supabase.functions.invoke('ai-lexicon-generator-with-retry', {
        body: {
          term: newTerm.trim(),
          category: newTermCategory,
          languages: ['en', 'ar']
        }
      });

      if (data?.success) {
        toast({
          title: 'Term Generated',
          description: `Successfully generated definition for "${newTerm}"`,
        });
        
        setNewTerm('');
        await fetchStats();
      } else {
        throw new Error(data?.error || 'Term generation failed');
      }
    } catch (error: any) {
      toast({
        title: 'Generation Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setGeneratingTerm(false);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  // Simulate progress during seeding (in real implementation, this would be WebSocket-based)
  useEffect(() => {
    if (seedingInProgress && seedingProgress < 90) {
      const timer = setTimeout(() => {
        setSeedingProgress(prev => Math.min(prev + Math.random() * 10, 90));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [seedingInProgress, seedingProgress]);

  const OverviewTab = () => (
    <div className="grid gap-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Terms</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_terms || 0}</div>
            <p className="text-xs text-muted-foreground">
              In the lexicon database
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Generated</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.ai_generated || 0}</div>
            <p className="text-xs text-muted-foreground">
              Created using AI
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.published || 0}</div>
            <p className="text-xs text-muted-foreground">
              Live on the platform
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Active categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Terms by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.categories).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-secondary rounded-full">
                      <div 
                        className="h-2 bg-primary rounded-full transition-all"
                        style={{ 
                          width: `${(count / Math.max(...Object.values(stats.categories))) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Queue Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Generation Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {queue.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <span className="font-medium">{item.term}</span>
                  <span className="text-sm text-muted-foreground ml-2">({item.category})</span>
                </div>
                <Badge 
                  variant={
                    item.status === 'completed' ? 'default' : 
                    item.status === 'failed' ? 'destructive' : 
                    'secondary'
                  }
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const BulkSeedingTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk AI Seeding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">Select Categories to Seed</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`p-3 border rounded cursor-pointer transition-all ${
                    selectedCategories.includes(category.name)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleCategory(category.name)}
                >
                  <div className="text-sm font-medium">{category.name}</div>
                  <div className="text-xs text-muted-foreground">{category.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Terms per Category */}
          <div>
            <label className="text-sm font-medium mb-2 block">Terms per Category</label>
            <Input
              type="number"
              value={termsPerCategory}
              onChange={(e) => setTermsPerCategory(parseInt(e.target.value) || 30)}
              min="10"
              max="100"
              className="w-32"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Total terms: {selectedCategories.length * termsPerCategory}
            </p>
          </div>

          {/* Progress */}
          {seedingInProgress && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Seeding Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(seedingProgress)}%</span>
              </div>
              <Progress value={seedingProgress} className="w-full" />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              onClick={startBulkSeeding}
              disabled={seedingInProgress || selectedCategories.length === 0}
              className="flex items-center gap-2"
            >
              {seedingInProgress ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              {seedingInProgress ? 'Seeding...' : 'Start Bulk Seeding'}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategories([]);
                setTermsPerCategory(30);
              }}
              disabled={seedingInProgress}
            >
              Reset Selection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SingleGenerationTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Individual Term</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Term</label>
            <Input
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              placeholder="Enter term to generate (e.g., 'Strategic Planning')"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select value={newTermCategory} onValueChange={setNewTermCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={generateSingleTerm}
            disabled={generatingTerm || !newTerm.trim()}
            className="flex items-center gap-2"
          >
            {generatingTerm ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {generatingTerm ? 'Generating...' : 'Generate Term'}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Generations Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Generation Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {queue.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">{item.term}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.category} • Priority: {item.priority} • {new Date(item.requested_at).toLocaleString()}
                  </div>
                  {item.error_message && (
                    <div className="text-sm text-destructive mt-1">{item.error_message}</div>
                  )}
                </div>
                <Badge 
                  variant={
                    item.status === 'completed' ? 'default' : 
                    item.status === 'failed' ? 'destructive' : 
                    item.status === 'processing' ? 'secondary' :
                    'outline'
                  }
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'bulk-seeding', label: 'Bulk Seeding', icon: Zap },
    { id: 'single-generation', label: 'Single Generation', icon: Plus },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">AI Lexicon Manager</h2>
          <p className="text-muted-foreground">Manage and generate encyclopedia terms using AI</p>
        </div>
        <Button onClick={fetchData} variant="outline" className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          Refresh Data
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-background shadow-sm'
                : 'hover:bg-background/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'bulk-seeding' && <BulkSeedingTab />}
      {activeTab === 'single-generation' && <SingleGenerationTab />}
    </div>
  );
};

export default AILexiconManager;