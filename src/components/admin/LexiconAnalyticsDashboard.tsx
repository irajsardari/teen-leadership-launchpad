import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Eye, 
  Search, 
  TrendingUp, 
  Globe, 
  FileText, 
  Calendar,
  RefreshCw,
  Download,
  Users
} from 'lucide-react';
import { supportedLanguages } from '@/utils/language';

interface AnalyticsData {
  mostViewedTerms: Array<{ term: string; views: number; term_id: string }>;
  topSearches: Array<{ query: string; count: number; results_count: number }>;
  languageDistribution: Array<{ language: string; count: number; name: string }>;
  translationCoverage: Array<{ language: string; translated: number; total: number; percentage: number }>;
  dailyActivity: Array<{ date: string; views: number; searches: number }>;
  totalStats: {
    totalViews: number;
    totalSearches: number;
    totalTerms: number;
    avgTranslationCoverage: number;
  };
}

const LexiconAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  const colors = ['hsl(var(--primary))', 'hsl(var(--secondary))', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      const days = parseInt(dateRange.replace('d', ''));
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch most viewed terms
      const { data: viewsData } = await supabase
        .from('lexicon_analytics')
        .select(`
          term_id,
          dictionary!inner(term)
        `)
        .eq('event_type', 'view')
        .gte('created_at', startDate.toISOString());

      // Count views per term
      const termViews = (viewsData || []).reduce((acc: any, curr) => {
        const termId = curr.term_id;
        const term = (curr as any).dictionary?.term;
        if (termId && term) {
          acc[termId] = {
            term,
            term_id: termId,
            views: (acc[termId]?.views || 0) + 1
          };
        }
        return acc;
      }, {});

      const mostViewedTerms = Object.values(termViews)
        .sort((a: any, b: any) => b.views - a.views)
        .slice(0, 10);

      // Fetch top searches
      const { data: searchData } = await supabase
        .from('lexicon_analytics')
        .select('search_query, metadata')
        .eq('event_type', 'search')
        .gte('created_at', startDate.toISOString())
        .not('search_query', 'is', null);

      const searchCounts = (searchData || []).reduce((acc: any, curr) => {
        const query = curr.search_query?.toLowerCase().trim();
        if (query) {
          acc[query] = {
            query,
            count: (acc[query]?.count || 0) + 1,
            results_count: (curr.metadata as any)?.results_count || 0
          };
        }
        return acc;
      }, {});

      const topSearches = Object.values(searchCounts)
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 10);

      // Fetch language distribution
      const { data: langData } = await supabase
        .from('lexicon_analytics')
        .select('language')
        .gte('created_at', startDate.toISOString());

      const langCounts = (langData || []).reduce((acc: any, curr) => {
        const lang = curr.language || 'en';
        acc[lang] = (acc[lang] || 0) + 1;
        return acc;
      }, {});

      const languageDistribution = Object.entries(langCounts).map(([lang, count]) => ({
        language: lang,
        count: count as number,
        name: supportedLanguages[lang as keyof typeof supportedLanguages]?.name || lang
      }));

      // Fetch translation coverage
      const { data: termsData } = await supabase
        .from('dictionary')
        .select('translations')
        .eq('status', 'published');

      const translationCoverage = Object.keys(supportedLanguages)
        .filter(lang => lang !== 'en')
        .map(lang => {
          const translated = (termsData || []).filter(term => 
            term.translations && term.translations[lang]
          ).length;
          const total = (termsData || []).length;
          return {
            language: lang,
            translated,
            total,
            percentage: total > 0 ? Math.round((translated / total) * 100) : 0
          };
        });

      // Calculate daily activity
      const { data: dailyData } = await supabase
        .from('lexicon_analytics')
        .select('created_at, event_type')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      const dailyActivity = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        const dateStr = date.toISOString().split('T')[0];
        
        const dayData = (dailyData || []).filter(item => 
          item.created_at.startsWith(dateStr)
        );
        
        return {
          date: dateStr,
          views: dayData.filter(item => item.event_type === 'view').length,
          searches: dayData.filter(item => item.event_type === 'search').length
        };
      });

      // Calculate total stats
      const totalViews = (viewsData || []).length;
      const totalSearches = (searchData || []).length;
      const totalTerms = (termsData || []).length;
      const avgTranslationCoverage = translationCoverage.length > 0
        ? Math.round(translationCoverage.reduce((sum, lang) => sum + lang.percentage, 0) / translationCoverage.length)
        : 0;

      setAnalytics({
        mostViewedTerms: mostViewedTerms as any,
        topSearches: topSearches as any,
        languageDistribution,
        translationCoverage,
        dailyActivity,
        totalStats: {
          totalViews,
          totalSearches,
          totalTerms,
          avgTranslationCoverage
        }
      });

    } catch (error: any) {
      console.error('Analytics fetch error:', error);
      toast({
        title: 'Error',
        description: `Failed to fetch analytics: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  const exportAnalytics = async () => {
    try {
      if (!analytics) return;

      const exportData = {
        period: dateRange,
        generated_at: new Date().toISOString(),
        ...analytics
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lexicon-analytics-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Analytics data exported successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to export analytics: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <BarChart className="w-8 h-8 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Lexicon Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Usage statistics and insights for the TMA Lexicon
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportAnalytics}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Total Views</span>
            </div>
            <p className="text-2xl font-bold mt-1">{analytics?.totalStats.totalViews || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Total Searches</span>
            </div>
            <p className="text-2xl font-bold mt-1">{analytics?.totalStats.totalSearches || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Total Terms</span>
            </div>
            <p className="text-2xl font-bold mt-1">{analytics?.totalStats.totalTerms || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium">Avg Translation</span>
            </div>
            <p className="text-2xl font-bold mt-1">{analytics?.totalStats.avgTranslationCoverage || 0}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Daily Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.dailyActivity || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Views"
                />
                <Line 
                  type="monotone" 
                  dataKey="searches" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  name="Searches"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Language Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Language Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.languageDistribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(analytics?.languageDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Most Viewed Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Most Viewed Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(analytics?.mostViewedTerms || []).slice(0, 8).map((term, index) => (
                <div key={term.term_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {index + 1}.
                    </span>
                    <span className="text-sm font-medium">{term.term}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {term.views} views
                  </Badge>
                </div>
              ))}
              {(analytics?.mostViewedTerms || []).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No view data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Translation Coverage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Translation Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(analytics?.translationCoverage || []).map((lang) => {
                const langConfig = supportedLanguages[lang.language as keyof typeof supportedLanguages];
                return (
                  <div key={lang.language} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {langConfig?.flag} {langConfig?.name}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {lang.translated}/{lang.total} ({lang.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${lang.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Searches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Top Search Queries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(analytics?.topSearches || []).slice(0, 12).map((search, index) => (
              <div key={search.query} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <span className="text-sm font-medium">{search.query}</span>
                  <p className="text-xs text-muted-foreground">
                    {search.results_count} results found
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {search.count}
                </Badge>
              </div>
            ))}
            {(analytics?.topSearches || []).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4 col-span-full">
                No search data available
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LexiconAnalyticsDashboard;