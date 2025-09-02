import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';

interface ManualTranslationFormProps {
  termSlug?: string;
  onSuccess?: () => void;
}

const ManualTranslationForm: React.FC<ManualTranslationFormProps> = ({ 
  termSlug = '',
  onSuccess
}) => {
  const [slug, setSlug] = useState(termSlug);
  const [language, setLanguage] = useState<'ar' | 'fa'>('ar');
  const [translatedTerm, setTranslatedTerm] = useState('');
  const [translatedDefinition, setTranslatedDefinition] = useState('');
  const { addManualTranslation, isTranslating } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!slug || !translatedTerm || !translatedDefinition) {
      return;
    }

    const success = await addManualTranslation(
      slug, 
      language, 
      translatedTerm, 
      translatedDefinition
    );

    if (success) {
      // Reset form
      setTranslatedTerm('');
      setTranslatedDefinition('');
      onSuccess?.();
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Add Manual Translation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="term-slug">Term Slug</Label>
            <Input
              id="term-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g., leadership, communication, resilience"
              required
            />
          </div>

          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={(value: 'ar' | 'fa') => setLanguage(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">Arabic (العربية)</SelectItem>
                <SelectItem value="fa">Persian (فارسی)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="translated-term">Translated Term</Label>
            <Input
              id="translated-term"
              value={translatedTerm}
              onChange={(e) => setTranslatedTerm(e.target.value)}
              placeholder="Enter the translated term"
              className={language === 'ar' || language === 'fa' ? 'text-right' : ''}
              dir={language === 'ar' || language === 'fa' ? 'rtl' : 'ltr'}
              required
            />
          </div>

          <div>
            <Label htmlFor="translated-definition">Translated Definition</Label>
            <Textarea
              id="translated-definition"
              value={translatedDefinition}
              onChange={(e) => setTranslatedDefinition(e.target.value)}
              placeholder="Enter the translated definition"
              rows={4}
              className={language === 'ar' || language === 'fa' ? 'text-right' : ''}
              dir={language === 'ar' || language === 'fa' ? 'rtl' : 'ltr'}
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={isTranslating || !slug || !translatedTerm || !translatedDefinition}
            className="w-full"
          >
            {isTranslating ? 'Adding Translation...' : 'Add Translation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualTranslationForm;