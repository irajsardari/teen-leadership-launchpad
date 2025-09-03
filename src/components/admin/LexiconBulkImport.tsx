import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Upload, Download, BookOpen, Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ImportResult {
  success: boolean;
  import_id?: string;
  total_processed: number;
  successful_imports: number;
  failed_imports: number;
  errors?: string[];
  message: string;
}

const LexiconBulkImport: React.FC = () => {
  const [csvData, setCsvData] = useState('');
  const [filename, setFilename] = useState('');
  const [overwriteExisting, setOverwriteExisting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);

  const sampleCSV = `term,definition,category,discipline_tags,examples,phonetic_en,difficulty_score
Leadership,"The ability to guide and inspire others towards achieving common goals","Leadership","Management,Psychology","A team leader motivating employees during a project","ˈliːdərʃɪp",6
Emotional Intelligence,"The capacity to recognize and manage emotions in oneself and others","Psychology","Psychology,Leadership","Understanding team dynamics and responding appropriately","ɪˈmoʊʃənl ɪnˈtelɪdʒəns",7
Strategic Thinking,"The ability to analyze complex situations and develop long-term plans","Management","Management,Leadership","Creating a 5-year business plan for company growth","strəˈtiːdʒɪk ˈθɪŋkɪŋ",8
Delegation,"The process of assigning responsibilities and authority to others","Management","Management,Leadership","A manager assigning project tasks to team members","ˌdeləˈɡeɪʃən",5`;

  const managementTerms = `term,definition,category,discipline_tags,examples,phonetic_en,difficulty_score
Accountability,"Taking responsibility for one's actions and their outcomes","Management","Leadership,Ethics","A project manager owning up to missed deadlines","əˌkaʊntəˈbɪləti",6
Active Listening,"Fully concentrating on understanding what someone is communicating","Communication","Psychology,Leadership","Giving full attention during team meetings","ˈæktɪv ˈlɪsənɪŋ",4
Adaptability,"The ability to adjust to new conditions and changing circumstances","Psychology","Psychology,Management","Adjusting work methods when company policies change","əˌdæptəˈbɪləti",5
Brainstorming,"A group creativity technique to generate ideas for solving problems","Management","Creativity,Management","Team session to find solutions for customer complaints","ˈbreɪnˌstɔrmɪŋ",3
Change Management,"The process of helping individuals and organizations transition","Management","Management,Psychology","Implementing new software systems across departments","tʃeɪndʒ ˈmænɪdʒmənt",8
Coaching,"A developmental process where someone guides another to improve","Leadership","Leadership,Psychology","Helping a junior employee develop presentation skills","ˈkoʊtʃɪŋ",6
Communication,"The process of exchanging information and ideas effectively","Communication","Communication,Leadership","Clear instructions during team briefings","kəˌmjuːnəˈkeɪʃən",4
Conflict Resolution,"The process of addressing and solving disagreements","Psychology","Psychology,Leadership","Mediating disputes between team members","ˈkɑnflɪkt ˌrezəˈluːʃən",7
Critical Thinking,"Objective analysis and evaluation of issues to form judgment","Psychology","Psychology,Management","Analyzing market data before making business decisions","ˈkrɪtɪkəl ˈθɪŋkɪŋ",7
Decision Making,"The process of choosing between alternatives to achieve goals","Management","Management,Psychology","Selecting the best marketing strategy from several options","dɪˈsɪʒən ˈmeɪkɪŋ",6
Empathy,"The ability to understand and share others' feelings","Psychology","Psychology,Leadership","Understanding why a colleague is stressed about deadlines","ˈempəθi",5
Feedback,"Information about performance used to guide improvement","Management","Management,Psychology","Regular performance reviews with constructive suggestions","ˈfidˌbæk",4
Goal Setting,"The process of establishing specific objectives to achieve","Management","Management,Psychology","Creating SMART objectives for quarterly performance","ɡoʊl ˈsetɪŋ",5
Initiative,"The ability to take action without being prompted","Leadership","Leadership,Management","Starting a new process improvement project independently","ɪˈnɪʃətɪv",6
Innovation,"The introduction of new ideas or methods","Management","Creativity,Management","Developing creative solutions to reduce operational costs","ˌɪnəˈveɪʃən",7
Mentoring,"Guiding and supporting someone's personal development","Leadership","Leadership,Psychology","Experienced manager helping new employee navigate workplace","ˈmentərɪŋ",6
Motivation,"The drive to take action toward achieving goals","Psychology","Psychology,Leadership","Inspiring team members during challenging projects","ˌmoʊtəˈveɪʃən",5
Negotiation,"Discussion aimed at reaching mutual agreement","Communication","Communication,Management","Reaching compromise on project timelines with stakeholders","nɪˌɡoʊʃiˈeɪʃən",7
Networking,"Building professional relationships for mutual benefit","Communication","Communication,Management","Connecting with industry professionals at conferences","ˈnetˌwɜrkɪŋ",6
Performance Management,"Systematic process to improve organizational effectiveness","Management","Management,Leadership","Regular employee evaluations and development planning","pərˈfɔrməns ˈmænɪdʒmənt",8
Planning,"The process of thinking about future activities and organizing them","Management","Management,Leadership","Creating detailed project timelines and resource allocation","ˈplænɪŋ",5
Problem Solving,"The process of finding solutions to difficult situations","Management","Management,Psychology","Identifying root causes of production delays","ˈprɑbləm ˈsɑlvɪŋ",6
Project Management,"The application of knowledge and skills to execute projects","Management","Management,Leadership","Coordinating team efforts to deliver software on schedule","ˈprɑdʒekt ˈmænɪdʒmənt",7
Resilience,"The ability to recover from setbacks and adapt to challenges","Psychology","Psychology,Leadership","Bouncing back from failed product launch","rɪˈzɪljəns",6
Risk Management,"Identifying and mitigating potential business threats","Management","Management,Finance","Assessing market risks before launching new product","rɪsk ˈmænɪdʒmənt",8
Self-Awareness,"Understanding one's own emotions and their impact on others","Psychology","Psychology,Leadership","Recognizing personal stress signals during busy periods","self əˈwernəs",6
Stakeholder Management,"Managing relationships with all parties affected by decisions","Management","Management,Communication","Balancing needs of customers, employees, and investors","ˈsteɪkˌhoʊldər ˈmænɪdʒmənt",8
Team Building,"Activities designed to enhance social relations and define roles","Leadership","Leadership,Psychology","Organizing workshops to improve team collaboration","tim ˈbɪldɪŋ",5
Time Management,"The process of organizing and planning time allocation","Management","Management,Psychology","Using prioritization techniques to meet multiple deadlines","taɪm ˈmænɪdʒmənt",5
Vision,"A clear mental picture of what an organization wants to achieve","Leadership","Leadership,Management","Articulating company's future direction to employees","ˈvɪʒən",6
Work-Life Balance,"Maintaining equilibrium between work and personal life","Psychology","Psychology,Management","Setting boundaries to avoid burnout while staying productive","wɜrk laɪf ˈbæləns",6`;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFilename(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCsvData(content);
      };
      reader.readAsText(file);
    }
  };

  const loadSampleData = (data: string, name: string) => {
    setCsvData(data);
    setFilename(name);
    toast({
      title: 'Sample Data Loaded',
      description: `Loaded ${name} - you can now import these terms.`,
    });
  };

  const handleImport = async () => {
    if (!csvData || !filename) {
      toast({
        title: 'Missing Data',
        description: 'Please provide CSV data and filename.',
        variant: 'destructive',
      });
      return;
    }

    setImporting(true);
    setProgress(0);
    setResult(null);

    try {
      // Start progress animation
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 2, 90));
      }, 100);

      const { data, error } = await supabase.functions.invoke('bulk-import-lexicon', {
        body: {
          csvData,
          filename,
          overwriteExisting
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (error) throw error;

      setResult(data);
      
      if (data.success) {
        toast({
          title: 'Import Successful',
          description: data.message,
        });
        
        // Clear form
        setCsvData('');
        setFilename('');
      } else {
        toast({
          title: 'Import Failed',
          description: data.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      setProgress(0);
      toast({
        title: 'Import Error',
        description: error.message || 'Failed to import terms',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardTitle className="flex items-center gap-2 text-primary">
            <BookOpen className="w-5 h-5" />
            TMA Lexicon Bulk Import
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          
          {/* Sample Data Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Sample Management & Leadership Terms</h3>
            <p className="text-muted-foreground">
              Import comprehensive management, leadership, and psychology terms to build your encyclopedia.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">4 Terms</Badge>
                    <span className="text-sm font-medium">Basic Sample</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Leadership, Emotional Intelligence, Strategic Thinking, Delegation
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => loadSampleData(sampleCSV, 'basic_sample.csv')}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Load Sample
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default" className="text-xs">30 Terms</Badge>
                    <span className="text-sm font-medium">Comprehensive Set</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Complete management and leadership terminology
                  </p>
                  <Button 
                    size="sm"
                    onClick={() => loadSampleData(managementTerms, 'management_leadership_terms.csv')}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Load Full Set
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CSV Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Upload Custom CSV Data</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Upload CSV File</label>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Filename</label>
                <Input
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="Enter filename for import tracking"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">CSV Data</label>
                <Textarea
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  placeholder="Paste CSV data here or upload a file..."
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="overwrite"
                  checked={overwriteExisting}
                  onChange={(e) => setOverwriteExisting(e.target.checked)}
                />
                <label htmlFor="overwrite" className="text-sm text-muted-foreground">
                  Overwrite existing terms with same name
                </label>
              </div>
            </div>
          </div>

          {/* Import Progress */}
          {importing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Importing terms...</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Import Results */}
          {result && (
            <Alert className={result.success ? 'border-green-500' : 'border-red-500'}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">{result.message}</p>
                    
                    {result.success && (
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Processed:</span>
                          <span className="ml-2 font-medium">{result.total_processed}</span>
                        </div>
                        <div>
                          <span className="text-green-600">Success:</span>
                          <span className="ml-2 font-medium">{result.successful_imports}</span>
                        </div>
                        <div>
                          <span className="text-red-600">Failed:</span>
                          <span className="ml-2 font-medium">{result.failed_imports}</span>
                        </div>
                      </div>
                    )}

                    {result.errors && result.errors.length > 0 && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm text-muted-foreground">
                          View errors ({result.errors.length})
                        </summary>
                        <div className="mt-2 max-h-40 overflow-y-auto text-xs space-y-1">
                          {result.errors.slice(0, 20).map((error, index) => (
                            <div key={index} className="text-red-600 font-mono">
                              {error}
                            </div>
                          ))}
                          {result.errors.length > 20 && (
                            <div className="text-muted-foreground">
                              ... and {result.errors.length - 20} more errors
                            </div>
                          )}
                        </div>
                      </details>
                    )}
                  </div>
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* CSV Format Guide */}
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">CSV Format Requirements:</p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• <strong>Required columns:</strong> term, definition, category</li>
                  <li>• <strong>Optional columns:</strong> discipline_tags, examples, phonetic_en, difficulty_score</li>
                  <li>• Use comma-separated values for arrays (e.g., "Management,Psychology")</li>
                  <li>• Enclose multi-word values in quotes if they contain commas</li>
                  <li>• Difficulty score should be 1-10 (1=easiest, 10=hardest)</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={handleImport}
              disabled={importing || !csvData || !filename}
              className="flex-1"
            >
              {importing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Terms
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LexiconBulkImport;