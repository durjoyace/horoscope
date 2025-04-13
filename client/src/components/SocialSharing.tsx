import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Link as LinkIcon, 
  Share2, 
  CheckCircle
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SocialSharingProps {
  title: string;
  text: string;
  url?: string;
  className?: string;
  compact?: boolean;
}

export function SocialSharing({ 
  title, 
  text, 
  url = window.location.href,
  className,
  compact = false
}: SocialSharingProps) {
  const { toast } = useToast();
  const [linkCopied, setLinkCopied] = useState(false);
  
  // Encode for URL parameters
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  
  // Set up share URLs
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
  
  const handleShare = async () => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title,
          text,
          url
        });
        
        toast({
          title: "Shared successfully",
          description: "Your horoscope has been shared",
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast({
            title: "Error sharing",
            description: "There was a problem sharing your horoscope",
            variant: "destructive"
          });
        }
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${title}\n\n${text}\n\n${url}`).then(() => {
      setLinkCopied(true);
      
      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard",
      });
      
      setTimeout(() => {
        setLinkCopied(false);
      }, 2000);
    }).catch(err => {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to your clipboard",
        variant: "destructive"
      });
    });
  };
  
  // For compact mode, only show the Share button that uses the Web Share API
  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("rounded-full", className)}
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share your horoscope</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <span className="text-sm font-medium text-muted-foreground mr-2">Share:</span>
      
      <TooltipProvider>
        {/* Twitter */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-[#1DA1F2] hover:bg-[#1a94df] text-white hover:text-white"
              onClick={() => window.open(twitterUrl, '_blank')}
            >
              <Twitter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on Twitter</p>
          </TooltipContent>
        </Tooltip>
        
        {/* Facebook */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-[#4267B2] hover:bg-[#375694] text-white hover:text-white"
              onClick={() => window.open(facebookUrl, '_blank')}
            >
              <Facebook className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on Facebook</p>
          </TooltipContent>
        </Tooltip>
        
        {/* Copy Link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={copyToClipboard}
            >
              {linkCopied ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <LinkIcon className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{linkCopied ? 'Link copied!' : 'Copy link'}</p>
          </TooltipContent>
        </Tooltip>
        
        {/* Web Share API */}
        {typeof navigator.share === 'function' && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
}

export default SocialSharing;