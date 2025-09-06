import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { MessageSquare, Send, X } from 'lucide-react';

interface TermFeedbackFormProps {
  termId: string;
  termName: string;
  language: string;
  onClose: () => void;
}

const TermFeedbackForm: React.FC<TermFeedbackFormProps> = ({
  termId,
  termName,
  language,
  onClose
}) => {
  const [feedbackType, setFeedbackType] = useState<'correction' | 'improvement' | 'translation'>('improvement');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: 'Message Required',
        description: 'Please provide feedback details',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('term_feedback')
        .insert({
          term_id: termId,
          feedback_type: feedbackType,
          message: message.trim(),
          user_email: email.trim() || null,
          language,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: 'Feedback Submitted',
        description: 'Thank you for your feedback! Our team will review it soon.'
      });

      onClose();
    } catch (error: any) {
      toast({
        title: 'Submission Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Suggest an Edit
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Help improve "{termName}" for everyone
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Type of Feedback
              </label>
              <Select value={feedbackType} onValueChange={(value: any) => setFeedbackType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="correction">Correction</SelectItem>
                  <SelectItem value="improvement">Improvement</SelectItem>
                  <SelectItem value="translation">Translation Issue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Your Feedback *
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what could be improved..."
                rows={4}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Email (Optional)
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
              <p className="text-xs text-muted-foreground mt-1">
                We'll contact you if we need more information
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="flex-1">
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermFeedbackForm;