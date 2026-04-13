import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateReview, useReviewSummary } from "@/hooks/use-reviews";
import { useToast } from "@/hooks/use-toast";
import type { Review } from "@shared/schema";

const reviewFormSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  title: z.string().optional(),
  body: z.string().min(10, "Review must be at least 10 characters"),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRating({ rating, onRatingChange, readonly = false, size = "md" }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };
  
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          disabled={readonly}
          className={`${readonly ? "cursor-default" : "cursor-pointer"} focus:outline-none`}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          onClick={() => onRatingChange?.(star)}
          whileHover={!readonly ? { scale: 1.2 } : {}}
          whileTap={!readonly ? { scale: 0.9 } : {}}
          data-testid={`star-${star}`}
        >
          <Star
            className={`${sizeClasses[size]} transition-colors ${
              (hovered || rating) >= star
                ? "fill-yellow-400 text-yellow-400"
                : "fill-transparent text-muted-foreground"
            }`}
          />
        </motion.button>
      ))}
    </div>
  );
}

interface RatingSummaryProps {
  userId: string | undefined;
  showLabel?: boolean;
}

export function RatingSummary({ userId, showLabel = true }: RatingSummaryProps) {
  const { data: summary, isLoading } = useReviewSummary(userId);
  
  if (isLoading || !summary) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="h-4 w-4 fill-muted text-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }
  
  const { averageRating, totalReviews } = summary;
  
  if (totalReviews === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <StarRating rating={0} readonly size="sm" />
        {showLabel && <span>No reviews yet</span>}
      </div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2"
    >
      <StarRating rating={Math.round(averageRating)} readonly size="sm" />
      <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
      <span className="text-sm text-muted-foreground">
        ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
      </span>
    </motion.div>
  );
}

interface ReviewFormProps {
  revieweeUserId: string;
  revieweeType: "creator" | "brand";
  revieweeName: string;
  onSuccess?: () => void;
}

export function ReviewForm({ revieweeUserId, revieweeType, revieweeName, onSuccess }: ReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const createReview = useCreateReview();
  const { toast } = useToast();
  
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      title: "",
      body: "",
    },
  });
  
  const onSubmit = async (data: ReviewFormData) => {
    try {
      await createReview.mutateAsync({
        revieweeUserId,
        revieweeType,
        rating: data.rating,
        title: data.title,
        body: data.body,
      });
      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback.",
      });
      form.reset();
      setIsOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" data-testid="button-write-review">
          <MessageSquare className="h-4 w-4" />
          Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review {revieweeName}</DialogTitle>
          <DialogDescription className="sr-only">Share your experience working with {revieweeName} by leaving a rating and written review.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <StarRating
                      rating={field.value}
                      onRatingChange={field.onChange}
                      size="lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Summarize your experience" 
                      {...field} 
                      data-testid="input-review-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Share your experience working with them..."
                      className="min-h-[100px]"
                      {...field}
                      data-testid="input-review-body"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full" 
              disabled={createReview.isPending}
              data-testid="button-submit-review"
            >
              {createReview.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
}

export function ReviewList({ reviews, isLoading }: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-1/4 mb-2" />
              <div className="h-3 bg-muted rounded w-full mb-1" />
              <div className="h-3 bg-muted rounded w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (!reviews || reviews.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No reviews yet. Be the first to leave a review!</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
            data-testid={`card-review-${review.id}`}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium capitalize">{review.reviewerType}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} readonly size="sm" />
                </div>
                {review.title && (
                  <h4 className="font-semibold mb-1">{review.title}</h4>
                )}
                <p className="text-sm text-muted-foreground">{review.body}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ReviewsSectionProps {
  userId: string;
  userType: "creator" | "brand";
  userName: string;
  reviews: Review[];
  isLoading?: boolean;
  canReview?: boolean;
}

export function ReviewsSection({ userId, userType, userName, reviews, isLoading, canReview = true }: ReviewsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold">Reviews</h3>
          <RatingSummary userId={userId} />
        </div>
        {canReview && (
          <ReviewForm
            revieweeUserId={userId}
            revieweeType={userType}
            revieweeName={userName}
          />
        )}
      </div>
      <ReviewList reviews={reviews} isLoading={isLoading} />
    </div>
  );
}
