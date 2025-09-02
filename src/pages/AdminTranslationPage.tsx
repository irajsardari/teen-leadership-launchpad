import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ManualTranslationForm from '@/components/ManualTranslationForm';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';

const AdminTranslationPage: React.FC = () => {
  const { user } = useAuth();
  const { translateAllTerms, isTranslating, progress } = useTranslation();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data?.role === 'admin');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Show loading while checking admin status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect if not admin
  if (!user || isAdmin === false) {
    return <Navigate to="/" replace />;
  }

  const handleBatchTranslation = async () => {
    await translateAllTerms();
  };

  const handleTranslationSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Pre-defined critical terms for easy access
  const criticalTerms = [
    'leadership',
    'resilience', 
    'critical-thinking',
    'communication',
    'emotional-intelligence',
    'financial-literacy',
    'growth-mindset',
    'empathy',
    'integrity',
    'time-management',
    'digital-citizenship'
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Dictionary Translation Management</h1>
        <p className="text-muted-foreground">
          Add manual translations and manage auto-translation for dictionary terms
        </p>
      </div>

      {/* Batch Translation */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Auto-Translation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Auto-translate all dictionary terms to Arabic, Persian, Spanish, French, German, Turkish, and Urdu
          </p>
          <Button 
            onClick={handleBatchTranslation} 
            disabled={isTranslating}
            className="w-full"
          >
            {isTranslating ? 'Translating...' : 'Start Batch Translation'}
          </Button>
          
          {progress && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Translation Progress</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Processed: {progress.processed}</div>
                <div>Translated: {progress.translated}</div>
                <div>Skipped: {progress.skipped}</div>
                <div>Errors: {progress.errors}</div>
              </div>
              <div className="mt-2">
                <strong>Languages:</strong> {progress.languages.join(', ')}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Manual Translation Form */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Add Manual Translation</h2>
        <ManualTranslationForm 
          key={refreshKey} 
          onSuccess={handleTranslationSuccess}
        />
      </div>

      <Separator />

      {/* Quick Access to Critical Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access - Critical Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Click on any term below to quickly add translations for these critical terms:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {criticalTerms.map((slug) => (
              <Button
                key={slug}
                variant="outline"
                size="sm"
                onClick={() => {
                  // Scroll to manual form and populate term slug
                  const form = document.querySelector('input[placeholder*="leadership"]') as HTMLInputElement;
                  if (form) {
                    form.value = slug;
                    form.dispatchEvent(new Event('input', { bubbles: true }));
                    form.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="justify-start text-left"
              >
                {slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Translation Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>Auto-Translation:</strong>
            <p>Uses AI to translate all terms automatically. Best for bulk processing but may need manual review.</p>
          </div>
          <div>
            <strong>Manual Translation:</strong>
            <p>Allows precise, human-reviewed translations. Recommended for critical terms and culturally sensitive content.</p>
          </div>
          <div>
            <strong>Caching:</strong>
            <p>All translations are cached in the database to avoid repeated API calls and ensure consistent performance.</p>
          </div>
          <div>
            <strong>Priority:</strong>
            <p>Manual translations (human-reviewed) will always take priority over auto-generated translations.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTranslationPage;