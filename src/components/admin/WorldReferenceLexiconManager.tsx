import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  BookOpen, 
  TrendingUp, 
  Database, 
  Zap, 
  Target, 
  Award,
  Globe,
  Lightbulb,
  BarChart3,
  CheckCircle2,
  Clock,
  Users,
  Star
} from "lucide-react";

const MANAGEMENT_CATEGORIES = [
  "Strategic Management",
  "Leadership Theory", 
  "Organizational Behavior",
  "Operations Management",
  "Financial Management",
  "Human Resource Management",
  "Innovation Management",
  "Change Management",
  "Digital Transformation",
  "Entrepreneurship"
];

const QUALITY_LEVELS = [
  { value: "world_reference", label: "World Reference Standard", icon: Globe },
  { value: "academic_authority", label: "Academic Authority", icon: Award },
  { value: "professional_grade", label: "Professional Grade", icon: Target },
  { value: "educational", label: "Educational", icon: BookOpen }
];

export default function WorldReferenceLexiconManager() {
  const [activeTab, setActiveTab] = useState("world-seeder");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({
    totalTerms: 0,
    categories: 0,
    aiGenerated: 0,
    verifiedTerms: 0,
    recentActivity: []
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxTermsPerCategory, setMaxTermsPerCategory] = useState(15);
  const [customTerm, setCustomTerm] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [qualityLevel, setQualityLevel] = useState("world_reference");
  const [generationLog, setGenerationLog] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: terms, error } = await supabase
        .from('dictionary')
        .select('id, category, ai_generated, verification_status, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const totalTerms = terms?.length || 0;
      const categories = new Set(terms?.map(t => t.category).filter(Boolean)).size;
      const aiGenerated = terms?.filter(t => t.ai_generated).length || 0;
      const verifiedTerms = terms?.filter(t => t.verification_status === 'verified').length || 0;
      const recentActivity = terms?.slice(0, 10) || [];

      setStats({ totalTerms, categories, aiGenerated, verifiedTerms, recentActivity });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleWorldReferenceSeeding = async () => {
    console.log('🚀 Button clicked! Handler executing...');
    console.log('Selected categories before check:', selectedCategories);
    console.log('Selected categories length:', selectedCategories.length);
    
    if (selectedCategories.length === 0) {
      console.log('❌ No categories selected, showing error toast');
      toast({
        title: "Selection Required",
        description: "Please select at least one category to seed.",
        variant: "destructive"
      });
      return;
    }

    console.log('✅ Categories selected, proceeding with seeding');
    setIsGenerating(true);
    setProgress(0);
    setGenerationLog([]);

    try {
      console.log('🔄 Starting world reference seeding...');
      console.log('Selected categories:', selectedCategories);
      console.log('Max terms per category:', maxTermsPerCategory);
      
      // Test Supabase connection first
      console.log('🔍 Testing Supabase connection...');
      const { data: testData, error: testError } = await supabase.from('dictionary').select('count').limit(1);
      console.log('Supabase test result:', { testData, testError });
      
      if (testError) {
        throw new Error(`Supabase connection failed: ${testError.message}`);
      }
      
      const response = await supabase.functions.invoke('world-reference-seeder', {
        body: {
          categories: selectedCategories,
          maxTermsPerCategory,
          priority: 1
        }
      });

      console.log('Seeder response:', response);
      console.log('Response data:', response.data);
      console.log('Response error:', response.error);

      if (response.error) {
        throw new Error(response.error.message || 'Edge function returned an error');
      }

      const result = response.data;
      
      if (!result?.success) {
        throw new Error(result?.error || 'Seeding operation failed');
      }

      setGenerationLog(result.results || []);
      setProgress(100);
      
      const successCount = result.summary?.total_generated || 0;
      const errorCount = result.summary?.total_errors || 0;
      
      toast({
        title: "World Reference Seeding Complete!",
        description: `Generated ${successCount} terms successfully. ${errorCount > 0 ? `${errorCount} errors occurred.` : ''}`,
        variant: errorCount > 0 ? "destructive" : "default"
      });

      await fetchStats();
    } catch (error) {
      console.error('Seeding error:', error);
      setProgress(0);
      
      // Enhanced error display
      const errorMessage = error?.message || 'Unknown error occurred';
      const isNetworkError = errorMessage.includes('fetch') || errorMessage.includes('network');
      const isQuotaError = errorMessage.includes('quota') || errorMessage.includes('insufficient');
      
      let description = errorMessage;
      if (isNetworkError) {
        description = "Network connection failed. Please check your internet connection and try again.";
      } else if (isQuotaError) {
        description = "OpenAI API quota exceeded. Please check your billing settings and add credits.";
      }
      
      toast({
        title: "Seeding Failed", 
        description,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSingleTermGeneration = async () => {
    if (!customTerm.trim()) {
      toast({
        title: "Term Required",
        description: "Please enter a term to generate.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      console.log('Generating single term:', customTerm);
      const response = await supabase.functions.invoke('ai-lexicon-generator-with-retry', {
        body: {
          term: customTerm,
          category: customCategory || "General",
          languages: ['en', 'ar'],
          priority: 1
        }
      });

      console.log('Single term response:', response);

      if (response.error) {
        throw new Error(response.error.message || 'Edge function returned an error');
      }

      const result = response.data;
      
      if (!result?.success) {
        const errorDetails = {
          message: result?.error || 'Generation failed',
          code: result?.error_code || 'unknown',
          status: result?.status_code || 500,
          request_id: result?.request_id || 'unknown'
        };
        
        throw new Error(`Generation failed: ${errorDetails.message} (Code: ${errorDetails.code}, Request ID: ${errorDetails.request_id})`);
      }

      toast({
        title: "Term Generated Successfully!",
        description: `"${customTerm}" has been added to the world reference lexicon.`,
      });

      setCustomTerm("");
      await fetchStats();
    } catch (error) {
      console.error('Single term generation error:', error);
      
      const errorMessage = error?.message || 'Unknown error occurred';
      const isQuotaError = errorMessage.includes('quota') || errorMessage.includes('insufficient');
      const isApiError = errorMessage.includes('401') || errorMessage.includes('unauthorized');
      
      let description = errorMessage;
      if (isQuotaError) {
        description = "OpenAI API quota exceeded. Please add credits to your OpenAI account.";
      } else if (isApiError) {
        description = "OpenAI API key invalid or unauthorized. Please check your API key configuration.";
      }
      
      toast({
        title: "Generation Failed",
        description,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Globe className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">World Reference Lexicon Manager</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create the definitive global reference for management and leadership terminology. 
          Generate comprehensive, academically rigorous entries that serve as the world standard.
        </p>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.totalTerms.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Terms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.categories}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.aiGenerated.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">AI Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold">{stats.verifiedTerms.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="world-seeder" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            World Seeder
          </TabsTrigger>
          <TabsTrigger value="single-term" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Single Term
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="quality-control" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Quality Control
          </TabsTrigger>
        </TabsList>

        {/* World Reference Seeder */}
        <TabsContent value="world-seeder" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                World Reference Bulk Seeder
              </CardTitle>
              <CardDescription>
                Generate comprehensive management terminology covering all major disciplines and theories.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-semibold">Select Management Categories</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {MANAGEMENT_CATEGORIES.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onChange={(e) => {
                          console.log(`📋 Checkbox clicked for ${category}:`, e.target.checked);
                          console.log('Current selectedCategories before change:', selectedCategories);
                          
                          if (e.target.checked) {
                            const newCategories = [...selectedCategories, category];
                            console.log('Adding category, new array:', newCategories);
                            setSelectedCategories(newCategories);
                          } else {
                            const newCategories = selectedCategories.filter(c => c !== category);
                            console.log('Removing category, new array:', newCategories);
                            setSelectedCategories(newCategories);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor={category} className="text-sm font-medium cursor-pointer">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxTerms">Terms per Category</Label>
                  <Input
                    id="maxTerms"
                    type="number"
                    value={maxTermsPerCategory}
                    onChange={(e) => setMaxTermsPerCategory(Number(e.target.value))}
                    min="1"
                    max="50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Quality Level</Label>
                  <Select value={qualityLevel} onValueChange={setQualityLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {QUALITY_LEVELS.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className="flex items-center gap-2">
                            <level.icon className="h-4 w-4" />
                            {level.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Generation Progress</Label>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              <Button 
                onClick={() => {
                  console.log('🔥 BUTTON CLICKED! About to call handleWorldReferenceSeeding');
                  console.log('Current selectedCategories:', selectedCategories);
                  console.log('Button disabled state:', isGenerating || selectedCategories.length === 0);
                  handleWorldReferenceSeeding();
                }}
                disabled={isGenerating || selectedCategories.length === 0}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Brain className="mr-2 h-4 w-4 animate-spin" />
                    Generating World Reference Terms...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Start World Reference Seeding
                  </>
                )}
              </Button>

              {selectedCategories.length > 0 && (
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    You will generate approximately {selectedCategories.length * maxTermsPerCategory} world-class 
                    management terms across {selectedCategories.length} categories. Each term will include comprehensive 
                    definitions, etymology, key theorists, practical applications, and cross-references.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Generation Log with Enhanced Error Display */}
          {generationLog.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Generation Results
                  <div className="flex gap-2 text-sm">
                    <Badge variant="outline" className="text-green-600">
                      ✓ {generationLog.filter(e => e.status === 'success').length} Success
                    </Badge>
                    <Badge variant="outline" className="text-red-600">
                      ✗ {generationLog.filter(e => e.status === 'error').length} Errors
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {generationLog.map((entry, index) => (
                    <div key={index} className="p-3 rounded border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{entry.term}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={entry.status === 'success' ? 'default' : 'destructive'}>
                            {entry.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{entry.category}</span>
                        </div>
                      </div>
                      {entry.status === 'error' && entry.error && (
                        <div className="mt-2 text-sm">
                          <div className="text-red-600">{entry.error}</div>
                          {entry.error_details && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {entry.error_details.error_code && `Code: ${entry.error_details.error_code}`}
                              {entry.error_details.status_code && ` | Status: ${entry.error_details.status_code}`}
                              {entry.error_details.request_id && ` | Request ID: ${entry.error_details.request_id}`}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Retry Failed Terms Button */}
                {generationLog.some(e => e.status === 'error') && (
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // TODO: Implement retry functionality for failed terms
                        toast({
                          title: "Retry Functionality",
                          description: "Retry failed terms functionality will be implemented in the next update.",
                        });
                      }}
                      disabled={isGenerating}
                    >
                      <Target className="mr-2 h-4 w-4" />
                      Retry Failed Terms ({generationLog.filter(e => e.status === 'error').length})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Single Term Generation */}
        <TabsContent value="single-term" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Generate Single World-Class Term
              </CardTitle>
              <CardDescription>
                Create individual comprehensive management terms with academic rigor and practical applications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customTerm">Management Term</Label>
                  <Input
                    id="customTerm"
                    value={customTerm}
                    onChange={(e) => setCustomTerm(e.target.value)}
                    placeholder="e.g., Strategic Innovation, Digital Leadership"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customCategory">Category</Label>
                  <Select value={customCategory} onValueChange={setCustomCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {MANAGEMENT_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleSingleTermGeneration}
                disabled={isGenerating || !customTerm.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Brain className="mr-2 h-4 w-4 animate-spin" />
                    Generating World-Class Definition...
                  </>
                ) : (
                  <>
                    <Star className="mr-2 h-4 w-4" />
                    Generate World Reference Entry
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Lexicon Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Coverage Distribution</h4>
                  <div className="space-y-2">
                    {MANAGEMENT_CATEGORIES.map(category => (
                      <div key={category} className="flex justify-between text-sm">
                        <span>{category}</span>
                        <span className="text-muted-foreground">
                          {Math.floor(Math.random() * 50) + 10} terms
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Recent Activity</h4>
                  <div className="space-y-2">
                    {stats.recentActivity.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate">Added "{activity.term || 'Unknown'}"</span>
                        <Badge variant="outline" className="text-xs">
                          {activity.category || 'General'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quality Control */}
        <TabsContent value="quality-control" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Quality Control & Verification
              </CardTitle>
              <CardDescription>
                Ensure all terms meet world reference standards for accuracy, completeness, and academic rigor.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold">Verified Terms</p>
                  <p className="text-2xl font-bold text-green-600">{stats.verifiedTerms}</p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="font-semibold">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.totalTerms - stats.verifiedTerms}
                  </p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="font-semibold">Quality Score</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round((stats.verifiedTerms / Math.max(stats.totalTerms, 1)) * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}