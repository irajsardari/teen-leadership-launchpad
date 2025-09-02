import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ProcessContentOptions {
  contentId: string;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
}

export const useContentProcessor = () => {
  const processContent = async ({ contentId, onSuccess, onError }: ProcessContentOptions) => {
    try {
      console.log(`Starting content processing for: ${contentId}`);
      
      const { data, error } = await supabase.functions.invoke('process-content', {
        body: { contentId }
      });

      if (error) {
        throw error;
      }

      console.log('Content processing completed:', data);
      
      toast({
        title: 'Content Processed',
        description: `Successfully processed content with ${data.termsLinked} terms linked and ${data.newDraftsCreated} new dictionary drafts created.`,
      });

      if (onSuccess) {
        onSuccess(data);
      }

      return data;
    } catch (error: any) {
      console.error('Content processing failed:', error);
      
      const errorMessage = error.message || 'Failed to process content';
      
      toast({
        title: 'Processing Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      if (onError) {
        onError(error);
      }
      
      throw error;
    }
  };

  const publishContent = async (contentData: {
    title: string;
    body_html: string;
    body_text: string;
    slug: string;
    author_id?: string;
  }) => {
    try {
      // First, insert the content
      const { data: content, error: insertError } = await supabase
        .from('content')
        .insert({
          ...contentData,
          status: 'published',
          published_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      console.log('Content published:', content);

      // Then process it for auto-categorization and dictionary terms
      await processContent({ contentId: content.id });

      return content;
    } catch (error: any) {
      console.error('Content publishing failed:', error);
      throw error;
    }
  };

  return {
    processContent,
    publishContent
  };
};