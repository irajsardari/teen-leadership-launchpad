import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BlogFeedbackProps {
  postSlug: string;
}

export const BlogFeedback = ({ postSlug }: BlogFeedbackProps) => {
  const [feedback, setFeedback] = useState<'none' | 'helpful' | 'not-helpful'>('none');
  const [improvementText, setImprovementText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleYes = () => {
    setFeedback('helpful');
    setSubmitted(true);
    toast({
      title: "Thank you!",
      description: "We're glad you found this article helpful.",
    });
  };

  const handleNo = () => {
    setFeedback('not-helpful');
  };

  const handleSubmitImprovement = () => {
    if (improvementText.trim()) {
      // In a real app, this would send to your backend
      console.log('Feedback for post:', postSlug, 'Improvement:', improvementText);
      setSubmitted(true);
      toast({
        title: "Feedback submitted",
        description: "Thank you for helping us improve our content!",
      });
    }
  };

  if (submitted) {
    return (
      <div className="mt-8 p-6 bg-muted/20 rounded-xl border border-border/50 text-center">
        <div className="text-tma-blue mb-2">
          <ThumbsUp className="h-6 w-6 mx-auto" />
        </div>
        <p className="text-foreground font-medium">Thank you for your feedback!</p>
        <p className="text-muted-foreground text-sm mt-1">
          Your input helps us create better content for our readers.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-muted/20 rounded-xl border border-border/50">
      <h3 className="text-lg font-semibold mb-4 text-foreground text-center">
        Was this article helpful?
      </h3>
      
      {feedback === 'none' && (
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleYes}
            variant="outline"
            className="flex items-center gap-2 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors"
          >
            <ThumbsUp className="h-4 w-4" />
            Yes
          </Button>
          <Button
            onClick={handleNo}
            variant="outline"
            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          >
            <ThumbsDown className="h-4 w-4" />
            No
          </Button>
        </div>
      )}

      {feedback === 'not-helpful' && (
        <div className="space-y-4">
          <p className="text-muted-foreground text-center">
            Tell us how we can improve:
          </p>
          <Textarea
            placeholder="Your feedback helps us create better content..."
            value={improvementText}
            onChange={(e) => setImprovementText(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <div className="text-center">
            <Button
              onClick={handleSubmitImprovement}
              disabled={!improvementText.trim()}
              className="bg-tma-blue hover:bg-tma-blue/90 text-white flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};