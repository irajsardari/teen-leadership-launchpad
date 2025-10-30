import { Button } from "@/components/ui/button";
import { Linkedin, X, MessageCircle, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareButtonsProps {
  title: string;
  description?: string;
  className?: string;
}

export const SocialShareButtons = ({ title, description, className = "" }: SocialShareButtonsProps) => {
  const { toast } = useToast();

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const shareToX = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(description ? `${title} - ${description}` : title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const shareToWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(description ? `${title} - ${description}` : title);
    window.open(`https://api.whatsapp.com/send?text=${text} ${url}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "The page link has been copied to your clipboard.",
    });
  };

  return (
    <div className={`flex justify-center gap-3 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={shareToLinkedIn}
        className="h-10 w-10 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        title="Share on LinkedIn"
      >
        <Linkedin className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={shareToX}
        className="h-10 w-10 p-0 hover:bg-slate-50 hover:text-slate-800 transition-colors"
        title="Share on X"
      >
        <X className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={shareToWhatsApp}
        className="h-10 w-10 p-0 hover:bg-green-50 hover:text-green-600 transition-colors"
        title="Share on WhatsApp"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={copyLink}
        className="h-10 w-10 p-0 hover:bg-gray-50 hover:text-gray-600 transition-colors"
        title="Copy Link"
      >
        <LinkIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};
