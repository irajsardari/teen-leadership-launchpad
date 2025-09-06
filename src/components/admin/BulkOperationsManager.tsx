import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Loader2,
  Eye,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { supportedLanguages } from '@/utils/language';

interface BulkOperation {
  id: string;
  operation_type: string;
  status: string;
  file_name: string;
  total_records: number;
  processed_records: number;
  success_count: number;
  error_count: number;
  error_log: any;
  created_at: string;
  completed_at?: string;
  created_by?: string;
  metadata?: any;
}

const BulkOperationsManager: React.FC = () => {
  const [operations, setOperations] = useState<BulkOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportLanguages, setExportLanguages] = useState<string[]>(['en']);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');

  useEffect(() => {
    fetchOperations();
  }, []);

  const fetchOperations = async () => {
    try {
      const { data, error } = await supabase
        .from('bulk_operations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setOperations(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch operations: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload a CSV or JSON file',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    try {
      const fileContent = await file.text();
      
      // Create operation record
      const { data: operation, error: opError } = await supabase
        .from('bulk_operations')
        .insert({
          operation_type: 'import',
          status: 'pending',
          file_name: file.name,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (opError) throw opError;

      // Process import via Edge Function
      const { data, error } = await supabase.functions.invoke('bulk-import-lexicon', {
        body: {
          csvData: fileContent,
          filename: file.name,
          operationId: operation.id
        }
      });

      if (error) throw error;

      toast({
        title: 'Import Started',
        description: `Processing ${file.name}. Check the operations tab for progress.`
      });

      fetchOperations();
    } catch (error: any) {
      toast({
        title: 'Import Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      // Create operation record
      const { data: operation, error: opError } = await supabase
        .from('bulk_operations')
        .insert({
          operation_type: 'export',
          status: 'processing',
          file_name: `lexicon-export-${new Date().toISOString().split('T')[0]}.${exportFormat}`,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          metadata: { languages: exportLanguages, format: exportFormat }
        })
        .select()
        .single();

      if (opError) throw opError;

      // Fetch terms with translations
      let query = supabase
        .from('dictionary')
        .select('*')
        .eq('status', 'published');

      const { data: terms, error } = await query;
      if (error) throw error;

      let exportData: any;
      const processedTerms = (terms || []).map(term => {
        const result: any = {
          term: term.term,
          slug: term.slug,
          short_def: term.short_def,
          long_def: term.long_def,
          category: term.category,
          status: term.status,
          created_at: term.created_at
        };

        // Add translations for selected languages
        exportLanguages.forEach(lang => {
          if (lang === 'en') {
            result[`${lang}_term`] = term.term;
            result[`${lang}_definition`] = term.short_def;
          } else if (term.translations && term.translations[lang]) {
            const translation = term.translations[lang];
            result[`${lang}_term`] = translation.term || translation.translated_term || '';
            result[`${lang}_definition`] = translation.shortDef || translation.short_def || translation.definition || '';
          } else {
            result[`${lang}_term`] = '';
            result[`${lang}_definition`] = '';
          }
        });

        return result;
      });

      if (exportFormat === 'csv') {
        // Convert to CSV
        const headers = [
          'term', 'slug', 'short_def', 'long_def', 'category', 'status', 'created_at',
          ...exportLanguages.flatMap(lang => [`${lang}_term`, `${lang}_definition`])
        ];
        
        const csvContent = [
          headers.join(','),
          ...processedTerms.map(term => 
            headers.map(header => {
              const value = term[header] || '';
              return `"${String(value).replace(/"/g, '""')}"`;
            }).join(',')
          )
        ].join('\n');
        
        exportData = csvContent;
      } else {
        exportData = JSON.stringify({
          exported_at: new Date().toISOString(),
          languages: exportLanguages,
          total_terms: processedTerms.length,
          terms: processedTerms
        }, null, 2);
      }

      // Download file
      const blob = new Blob([exportData], { 
        type: exportFormat === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = operation.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Update operation status
      await supabase
        .from('bulk_operations')
        .update({
          status: 'completed',
          total_records: processedTerms.length,
          processed_records: processedTerms.length,
          success_count: processedTerms.length,
          completed_at: new Date().toISOString()
        })
        .eq('id', operation.id);

      toast({
        title: 'Export Complete',
        description: `Downloaded ${processedTerms.length} terms in ${exportFormat.toUpperCase()} format`
      });

      fetchOperations();
    } catch (error: any) {
      toast({
        title: 'Export Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setExporting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'processing': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="import">Import Terms</TabsTrigger>
          <TabsTrigger value="export">Export Terms</TabsTrigger>
          <TabsTrigger value="operations">Operation History</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Bulk Import Terms
              </CardTitle>
              <p className="text-muted-foreground">
                Upload a CSV or JSON file to bulk import lexicon terms. 
                The file should include columns: term, short_def, long_def, category.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Drop your file here or click to browse</p>
                  <p className="text-xs text-muted-foreground">
                    Supports CSV and JSON files up to 10MB
                  </p>
                </div>
                <Input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="mt-4 cursor-pointer"
                />
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Processing file...</span>
                    <span>Please wait</span>
                  </div>
                  <Progress value={50} className="w-full" />
                </div>
              )}

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">CSV Format Example:</h4>
                <pre className="text-xs font-mono bg-background p-2 rounded overflow-x-auto">
{`term,short_def,long_def,category
Leadership,The ability to guide others,A comprehensive definition...,Management
Innovation,Creating new ideas,The process of implementing...,Strategy`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Terms
              </CardTitle>
              <p className="text-muted-foreground">
                Download all published terms with translations in your preferred format.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Export Format</label>
                  <Select value={exportFormat} onValueChange={(value: 'csv' | 'json') => setExportFormat(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV (Spreadsheet)</SelectItem>
                      <SelectItem value="json">JSON (Programming)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Languages to Include</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-lg p-2">
                    {Object.entries(supportedLanguages).map(([code, config]) => (
                      <label key={code} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exportLanguages.includes(code)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setExportLanguages([...exportLanguages, code]);
                            } else {
                              setExportLanguages(exportLanguages.filter(lang => lang !== code));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{config.flag} {config.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleExport}
                disabled={exporting || exportLanguages.length === 0}
                className="w-full"
              >
                {exporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export {exportLanguages.length} Language{exportLanguages.length !== 1 ? 's' : ''} as {exportFormat.toUpperCase()}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Operation History
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchOperations}
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {operations.map((operation) => (
                  <div key={operation.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(operation.status)}
                          <span className="font-medium">{operation.file_name}</span>
                          <Badge className={getStatusColor(operation.status)}>
                            {operation.status}
                          </Badge>
                          <Badge variant="outline">
                            {operation.operation_type}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Total:</span> {operation.total_records}
                          </div>
                          <div>
                            <span className="font-medium">Processed:</span> {operation.processed_records}
                          </div>
                          <div>
                            <span className="font-medium">Success:</span> {operation.success_count}
                          </div>
                          <div>
                            <span className="font-medium">Errors:</span> {operation.error_count}
                          </div>
                        </div>

                        {operation.status === 'processing' && operation.total_records > 0 && (
                          <div className="mt-3">
                            <Progress 
                              value={(operation.processed_records / operation.total_records) * 100} 
                              className="w-full"
                            />
                          </div>
                        )}

                        <p className="text-xs text-muted-foreground mt-2">
                          Started: {new Date(operation.created_at).toLocaleString()}
                          {operation.completed_at && (
                            <> • Completed: {new Date(operation.completed_at).toLocaleString()}</>
                          )}
                        </p>
                      </div>
                    </div>

                    {operation.error_log && operation.error_log.length > 0 && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm text-red-600 hover:text-red-700">
                          View Errors ({operation.error_log.length})
                        </summary>
                        <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                          {operation.error_log.map((error, index) => (
                            <div key={index} className="text-xs font-mono bg-red-50 text-red-700 p-2 rounded">
                              {error}
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                ))}

                {operations.length === 0 && !loading && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No operations found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BulkOperationsManager;