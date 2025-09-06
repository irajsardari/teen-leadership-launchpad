import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Languages, 
  User, 
  Calendar,
  Globe,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { Lang, supportedLanguages } from '@/utils/language';

interface DictionaryTerm {
  id: string;
  term: string;
  slug: string;
  short_def: string;
  long_def: string;
  category: string;
  translations: any;
  updated_at: string;
  verification_status: string;
}

interface TranslationApprovalManagerProps {
  term: DictionaryTerm;
  onUpdate: () => void;
}

export const TranslationApprovalManager: React.FC<TranslationApprovalManagerProps> = ({
  term,
  onUpdate
}) => {
  const [editingLang, setEditingLang] = useState<Lang | null>(null);
  const [editedTranslation, setEditedTranslation] = useState({
    term: '',
    shortDef: '',
    longDef: ''
  });
  const [saving, setSaving] = useState(false);

  const getTranslationData = (lang: Lang) => {
    if (!term.translations || !term.translations[lang]) {
      return null;
    }
    
    const translation = term.translations[lang];
    return {
      term: translation.term || translation.translated_term || '',
      shortDef: translation.shortDef || translation.short_def || translation.definition || '',
      longDef: translation.longDef || translation.long_def || '',
      source: translation.source || 'ai',
      updatedAt: translation.updatedAt || translation.updated_at,
      approved: translation.approved || false
    };
  };

  const startEditing = (lang: Lang) => {
    const translationData = getTranslationData(lang);
    if (translationData) {
      setEditedTranslation({
        term: translationData.term,
        shortDef: translationData.shortDef,
        longDef: translationData.longDef
      });
    } else {
      setEditedTranslation({
        term: '',
        shortDef: '',
        longDef: ''
      });
    }
    setEditingLang(lang);
  };

  const cancelEditing = () => {
    setEditingLang(null);
    setEditedTranslation({ term: '', shortDef: '', longDef: '' });
  };

  const saveTranslation = async (lang: Lang) => {
    if (!editedTranslation.term.trim() || !editedTranslation.shortDef.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Term and short definition are required',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      const updatedTranslations = {
        ...term.translations,
        [lang]: {
          ...getTranslationData(lang),
          term: editedTranslation.term.trim(),
          shortDef: editedTranslation.shortDef.trim(),
          longDef: editedTranslation.longDef.trim(),
          source: 'human',
          updatedAt: new Date().toISOString(),
          approved: true
        }
      };

      const { error } = await supabase
        .from('dictionary')
        .update({
          translations: updatedTranslations,
          updated_at: new Date().toISOString()
        })
        .eq('id', term.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Translation updated for ${supportedLanguages[lang].nativeName}`,
      });

      setEditingLang(null);
      onUpdate();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to update translation: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const approveTranslation = async (lang: Lang) => {
    const translationData = getTranslationData(lang);
    if (!translationData) return;

    try {
      const updatedTranslations = {
        ...term.translations,
        [lang]: {
          ...translationData,
          approved: true,
          updatedAt: new Date().toISOString()
        }
      };

      const { error } = await supabase
        .from('dictionary')
        .update({
          translations: updatedTranslations,
          updated_at: new Date().toISOString()
        })
        .eq('id', term.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Translation approved for ${supportedLanguages[lang].nativeName}`,
      });

      onUpdate();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to approve translation: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  const rejectTranslation = async (lang: Lang) => {
    try {
      const updatedTranslations = { ...term.translations };
      delete updatedTranslations[lang];

      const { error } = await supabase
        .from('dictionary')
        .update({
          translations: updatedTranslations,
          updated_at: new Date().toISOString()
        })
        .eq('id', term.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Translation rejected for ${supportedLanguages[lang].nativeName}`,
      });

      onUpdate();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to reject translation: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  const languages = Object.keys(supportedLanguages).filter(lang => lang !== 'en') as Lang[];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="w-5 h-5" />
          Translation Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="edit">Edit Translations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4">
              {languages.map((lang) => {
                const translationData = getTranslationData(lang);
                const langConfig = supportedLanguages[lang];

                return (
                  <div key={lang} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span className="font-semibold">{langConfig.nativeName}</span>
                        <span className="text-sm text-muted-foreground">({langConfig.name})</span>
                      </div>
                      
                      {translationData ? (
                        <div className="flex items-center gap-2">
                          <Badge variant={translationData.approved ? "default" : "secondary"}>
                            {translationData.approved ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approved
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </>
                            )}
                          </Badge>
                          
                          <Badge variant="outline" className="text-xs">
                            <User className="w-3 h-3 mr-1" />
                            {translationData.source === 'human' ? 'Human' : 'AI'}
                          </Badge>
                        </div>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="w-3 h-3 mr-1" />
                          Not Available
                        </Badge>
                      )}
                    </div>

                    {translationData ? (
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Term:</span>
                          <p className="text-sm">{translationData.term}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Definition:</span>
                          <p className="text-sm">{translationData.shortDef}</p>
                        </div>
                        {translationData.updatedAt && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            Updated: {new Date(translationData.updatedAt).toLocaleDateString()}
                          </div>
                        )}
                        
                        {!translationData.approved && (
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              onClick={() => approveTranslation(lang)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => rejectTranslation(lang)}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No translation available. Generate translations using the batch translation tool.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="edit" className="space-y-4">
            <div className="grid gap-4">
              {languages.map((lang) => {
                const translationData = getTranslationData(lang);
                const langConfig = supportedLanguages[lang];
                const isEditing = editingLang === lang;

                return (
                  <div key={lang} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span className="font-semibold">{langConfig.nativeName}</span>
                      </div>
                      
                      {!isEditing ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(lang)}
                        >
                          <Edit3 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => saveTranslation(lang)}
                            disabled={saving}
                          >
                            <Save className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEditing}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Term</label>
                          <Input
                            value={editedTranslation.term}
                            onChange={(e) => setEditedTranslation(prev => ({ ...prev, term: e.target.value }))}
                            placeholder="Enter translated term"
                            dir={langConfig.direction}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Short Definition</label>
                          <Textarea
                            value={editedTranslation.shortDef}
                            onChange={(e) => setEditedTranslation(prev => ({ ...prev, shortDef: e.target.value }))}
                            placeholder="Enter short definition"
                            rows={3}
                            dir={langConfig.direction}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Long Definition (Optional)</label>
                          <Textarea
                            value={editedTranslation.longDef}
                            onChange={(e) => setEditedTranslation(prev => ({ ...prev, longDef: e.target.value }))}
                            placeholder="Enter detailed definition"
                            rows={4}
                            dir={langConfig.direction}
                          />
                        </div>
                      </div>
                    ) : translationData ? (
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Term:</span>
                          <p className="text-sm" dir={langConfig.direction}>{translationData.term}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Short Definition:</span>
                          <p className="text-sm" dir={langConfig.direction}>{translationData.shortDef}</p>
                        </div>
                        {translationData.longDef && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Long Definition:</span>
                            <p className="text-sm" dir={langConfig.direction}>{translationData.longDef}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No translation available</p>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};