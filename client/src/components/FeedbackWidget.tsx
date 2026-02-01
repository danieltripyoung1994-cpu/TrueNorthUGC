import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare, ThumbsUp, ThumbsDown, Send, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeedbackWidgetProps {
  pageContext?: string;
}

export function FeedbackWidget({ pageContext = "general" }: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<'positive' | 'negative' | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!rating) return;
    
    setIsSubmitting(true);
    
    const payload = {
      rating,
      feedback: feedback.trim(),
      pageContext,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    };
    
    if (import.meta.env.DEV) {
      console.log('%c[Feedback Submitted]', 'color: #10b981; font-weight: bold;', payload);
    }
    
    try {
      if (import.meta.env.PROD) {
        await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      
      setIsSubmitted(true);
      toast({
        title: "Thank you for your feedback!",
        description: "We appreciate you taking the time to help us improve.",
      });
      
      setTimeout(() => {
        setIsOpen(false);
        setRating(null);
        setFeedback("");
        setIsSubmitted(false);
      }, 2000);
    } catch {
      toast({
        title: "Failed to submit feedback",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 shadow-lg gap-2"
          data-testid="button-feedback"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Feedback</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>
            Help us improve TrueNorthUGC by sharing your thoughts.
          </DialogDescription>
        </DialogHeader>
        
        {isSubmitted ? (
          <div className="flex flex-col items-center py-8 gap-4">
            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-center text-muted-foreground">
              Thank you for your feedback!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-3 justify-center">
              <Button
                variant={rating === 'positive' ? 'default' : 'outline'}
                size="lg"
                className="flex-1 gap-2"
                onClick={() => setRating('positive')}
                data-testid="button-feedback-positive"
              >
                <ThumbsUp className="h-5 w-5" />
                Good
              </Button>
              <Button
                variant={rating === 'negative' ? 'destructive' : 'outline'}
                size="lg"
                className="flex-1 gap-2"
                onClick={() => setRating('negative')}
                data-testid="button-feedback-negative"
              >
                <ThumbsDown className="h-5 w-5" />
                Needs Work
              </Button>
            </div>
            
            {rating && (
              <div className="space-y-3">
                <Textarea
                  placeholder={
                    rating === 'positive'
                      ? "What did you like? (optional)"
                      : "What could we improve? (optional)"
                  }
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  data-testid="input-feedback-text"
                />
                <Button
                  className="w-full gap-2"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  data-testid="button-feedback-submit"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
