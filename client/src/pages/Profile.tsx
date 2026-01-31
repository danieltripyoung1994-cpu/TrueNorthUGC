import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useCreator, useMyCreatorProfile } from "@/hooks/use-creators";
import { useBrand } from "@/hooks/use-brand";
import { useReviewsByCreator } from "@/hooks/use-reviews";
import { useParams, useLocation, Redirect } from "wouter";
import { Share2, Link as LinkIcon, Settings, Instagram, Music2, Youtube, Video, Play, Star } from "lucide-react";
import { SiTiktok, SiInstagram, SiSnapchat, SiX, SiFacebook } from "react-icons/si";
import { ProfileSkeleton } from "@/components/ui/skeleton-loaders";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ReviewsSection, RatingSummary } from "@/components/Reviews";
import PaymentButton from "@/components/PaymentButton";

export default function Profile() {
  const { handle } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const isMyProfile = handle === "me";
  const isCreateRoute = handle === "new" || handle === "create";
  
  if (isCreateRoute) {
    return <Redirect to="/dashboard" />;
  }
  
  const { data: creatorByHandle, isLoading: loadingByHandle } = useCreator(isMyProfile ? "" : (handle || ""));
  const { data: myProfile, isLoading: loadingMyProfile } = useMyCreatorProfile();
  
  const creator = isMyProfile ? myProfile : creatorByHandle;
  const { brand: myBrand, isLoading: loadingBrand } = useBrand();
  const { toast } = useToast();
  const { data: reviews, isLoading: loadingReviews } = useReviewsByCreator(creator?.userId);

  const isLoading = (isMyProfile ? loadingMyProfile : loadingByHandle) || loadingBrand;
  
  if (isMyProfile && !isLoading && !myProfile) {
    return <Redirect to="/dashboard" />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <ProfileSkeleton />
        </main>
      </div>
    );
  }
  
  if (!creator) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold" data-testid="text-profile-not-found">Profile not found</h1>
          <p className="text-muted-foreground mt-2 mb-4">This creator profile doesn't exist or may have been removed.</p>
          <div className="flex gap-2 justify-center">
            <Button variant="ghost" onClick={() => setLocation("/")} data-testid="button-go-home">
              Go back home
            </Button>
            {user && (
              <Button onClick={() => setLocation("/dashboard")} data-testid="button-create-profile">
                Create your profile
              </Button>
            )}
          </div>
        </main>
      </div>
    );
  }

  const isOwnProfile = user?.id === creator.userId;
  const profileUrl = window.location.href;

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=Check out ${creator.name}'s UGC portfolio on TrueNorthUGC!&url=${profileUrl}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${profileUrl}`, '_blank');
  };

  const shareToTikTok = () => {
    navigator.clipboard.writeText(`Check out ${creator.name}'s UGC portfolio on TrueNorthUGC! ${profileUrl}`);
    toast({
      title: "Link copied for TikTok!",
      description: "Paste this in your TikTok bio or message.",
    });
  };

  const shareToInstagram = () => {
    navigator.clipboard.writeText(`Check out ${creator.name}'s UGC portfolio on TrueNorthUGC! ${profileUrl}`);
    toast({
      title: "Link copied for Instagram!",
      description: "Paste this in your Instagram story or message.",
    });
  };

  const shareToSnapchat = () => {
    window.open(`https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(profileUrl)}`, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Link copied!",
      description: "Profile link has been copied to your clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      <main className="container mx-auto px-4 py-12 relative">
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-12 relative z-10"
        >
          <div className="flex flex-col md:flex-row gap-10 items-start relative">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative group shrink-0"
            >
              <img 
                src={creator.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"} 
                className="w-48 h-48 rounded-[2.5rem] object-cover shadow-2xl border-8 border-background group-hover:scale-105 transition-transform duration-500"
                alt={creator.name}
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
            <div className="space-y-6 flex-1">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-4 flex-wrap">
                    <h1 className="text-5xl font-black tracking-tighter">{creator.name}</h1>
                    {isOwnProfile && (
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        onClick={() => setLocation("/dashboard")}
                        className="rounded-full h-10 w-10 hover-elevate shadow-md"
                        data-testid="button-edit-profile"
                      >
                        <Settings className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-6">
                    <p className="text-xl font-medium text-muted-foreground">@{creator.handle}</p>
                    <div className="flex items-center gap-4">
                      {creator.socialLinks?.instagram && (
                        <motion.a 
                          href={creator.socialLinks.instagram} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-muted-foreground hover:text-primary transition-colors"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Instagram className="h-6 w-6" />
                        </motion.a>
                      )}
                      {creator.socialLinks?.tiktok && (
                        <motion.a 
                          href={creator.socialLinks.tiktok} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-muted-foreground hover:text-primary transition-colors"
                          whileHover={{ scale: 1.2, rotate: -5 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Music2 className="h-6 w-6" />
                        </motion.a>
                      )}
                      {creator.socialLinks?.youtube && (
                        <motion.a 
                          href={creator.socialLinks.youtube} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-muted-foreground hover:text-primary transition-colors"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Youtube className="h-6 w-6" />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full shadow-lg">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[160px] shadow-2xl border-primary/10">
                    <DropdownMenuItem onClick={shareToInstagram} className="cursor-pointer gap-3 rounded-xl p-3 font-medium" data-testid="share-instagram">
                      <SiInstagram className="h-4 w-4 text-pink-500" />
                      Instagram
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={shareToTikTok} className="cursor-pointer gap-3 rounded-xl p-3 font-medium" data-testid="share-tiktok">
                      <SiTiktok className="h-4 w-4" />
                      TikTok
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={shareToSnapchat} className="cursor-pointer gap-3 rounded-xl p-3 font-medium" data-testid="share-snapchat">
                      <SiSnapchat className="h-4 w-4 text-yellow-400" />
                      Snapchat
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={shareToTwitter} className="cursor-pointer gap-3 rounded-xl p-3 font-medium" data-testid="share-twitter">
                      <SiX className="h-4 w-4" />
                      X (Twitter)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={shareToFacebook} className="cursor-pointer gap-3 rounded-xl p-3 font-medium" data-testid="share-facebook">
                      <SiFacebook className="h-4 w-4 text-blue-600" />
                      Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer gap-3 rounded-xl p-3 font-medium" data-testid="share-copy-link">
                      <LinkIcon className="h-4 w-4 text-primary" />
                      Copy Link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap gap-2">
                {creator.niches?.map(niche => (
                  <Badge key={niche} variant="secondary" className="px-4 py-1 rounded-full font-bold uppercase text-[10px] tracking-widest bg-primary/10 text-primary border-none">
                    {niche}
                  </Badge>
                ))}
              </div>
              <p className="text-xl leading-relaxed text-muted-foreground max-w-2xl font-medium">{creator.bio}</p>
              
              {/* Payment Button - visible to brands viewing creator profiles */}
              {!isOwnProfile && user && myBrand && (
                <div className="pt-4">
                  <PaymentButton
                    creatorUserId={creator.userId}
                    creatorName={creator.name}
                    description={`Payment to ${creator.name} for UGC services`}
                    buttonText="Pay Creator"
                    allowCustomAmount={true}
                    onSuccess={(transaction) => {
                      toast({
                        title: "Payment Complete",
                        description: `Successfully paid $${transaction.amount} CAD to ${creator.name}. Platform fee: $${transaction.platformFee} CAD.`,
                      });
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Pay directly through PayPal. 20% platform fee applies.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-black tracking-tighter flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                  Reviews
                </h2>
                <div className="h-px bg-muted flex-1" />
              </div>
              <ReviewsSection
                userId={creator.userId}
                userType="creator"
                userName={creator.name}
                reviews={reviews || []}
                isLoading={loadingReviews}
                canReview={!isOwnProfile && !!user && !!myBrand}
              />
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
