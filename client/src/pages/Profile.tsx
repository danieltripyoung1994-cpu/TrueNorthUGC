import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useCreator, useMyCreatorProfile } from "@/hooks/use-creators";
import { useBrand } from "@/hooks/use-brand";
import { useReviewsByCreator } from "@/hooks/use-reviews";
import { useParams, useLocation, Redirect } from "wouter";
import {
  Share2, Link as LinkIcon, Settings, Youtube, Video, Star, MapPin,
  Globe, MessageCircle, CheckCircle, Languages, Briefcase, ExternalLink
} from "lucide-react";
import { SiTiktok, SiInstagram, SiSnapchat, SiX, SiFacebook, SiYoutube, SiCanva } from "react-icons/si";
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
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400" data-testid="text-profile-not-found">Profile not found</h1>
          <p className="text-muted-foreground mt-2 mb-4">This creator profile doesn't exist or may have been removed.</p>
          <div className="flex gap-2 justify-center">
            <Button variant="ghost" onClick={() => setLocation("/")} className="hover:text-pink-500" data-testid="button-go-home">
              Go back home
            </Button>
            {user && (
              <Button onClick={() => setLocation("/dashboard")} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg hover:shadow-pink-500/20 border-0 text-white" data-testid="button-create-profile">
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

  const handleMessageCreator = () => {
    if (!user) {
      setLocation("/dashboard");
    } else {
      setLocation("/dashboard?tab=messages");
    }
  };

  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const socialLinks = creator.socialLinks || {};
  const languages: string[] = (creator as any).languages || [];
  const location: string = (creator as any).location || "";
  const experienceLevel: string = (creator as any).experienceLevel || "";

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      <main className="container mx-auto px-4 py-12 relative">
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl -z-10"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-10 relative z-10"
        >
          {/* Hero Header */}
          <div className="flex flex-col md:flex-row gap-8 items-start relative">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative group shrink-0"
            >
              {creator.profileImage ? (
                <img
                  src={creator.profileImage}
                  className="w-44 h-44 rounded-[2rem] object-cover shadow-2xl border-4 border-white/10 group-hover:scale-105 group-hover:shadow-pink-500/30 transition-all duration-500"
                  alt={creator.name}
                  loading="lazy"
                  width={176}
                  height={176}
                />
              ) : (
                <div className="w-44 h-44 rounded-[2rem] bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-cyan-400/20 shadow-2xl border-4 border-white/10 flex items-center justify-center group-hover:scale-105 group-hover:shadow-pink-500/30 transition-all duration-500">
                  <span className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">
                    {creator.name[0]?.toUpperCase()}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-t from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {/* Available badge */}
              <div className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                <CheckCircle className="h-3 w-3" />
                Available
              </div>
            </motion.div>

            {/* Info */}
            <div className="space-y-4 flex-1 min-w-0">
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400" data-testid="text-creator-name">{creator.name}</h1>
                    {isOwnProfile && (
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setLocation("/dashboard")}
                        className="rounded-full h-10 w-10 bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg hover:shadow-pink-500/20 border-0 text-white shrink-0"
                        data-testid="button-edit-profile"
                      >
                        <Settings className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  <p className="text-lg font-medium text-muted-foreground" data-testid="text-creator-handle">@{creator.handle}</p>

                  {/* Quick stats row */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {avgRating && (
                      <span className="flex items-center gap-1 font-semibold text-yellow-400" data-testid="text-avg-rating">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {avgRating} ({reviews?.length} review{reviews?.length !== 1 ? "s" : ""})
                      </span>
                    )}
                    {location && (
                      <span className="flex items-center gap-1" data-testid="text-creator-location">
                        <MapPin className="h-4 w-4 text-pink-500" />
                        {location}
                      </span>
                    )}
                    {experienceLevel && (
                      <span className="flex items-center gap-1" data-testid="text-creator-experience">
                        <Briefcase className="h-4 w-4 text-purple-400" />
                        {experienceLevel}
                      </span>
                    )}
                    {languages.length > 0 && (
                      <span className="flex items-center gap-1" data-testid="text-creator-languages">
                        <Languages className="h-4 w-4 text-cyan-400" />
                        {languages.join(", ")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Share button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full shadow-lg bg-card/50 backdrop-blur-sm border-white/10 hover:shadow-pink-500/20 hover:border-pink-500/30 shrink-0" data-testid="button-share">
                      <Share2 className="h-4 w-4 text-pink-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[160px] shadow-2xl bg-card/50 backdrop-blur-sm border-white/10">
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
                      <LinkIcon className="h-4 w-4 text-pink-500" />
                      Copy Link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Niches */}
              {creator.niches && creator.niches.length > 0 && (
                <div className="flex flex-wrap gap-2" data-testid="creator-niches">
                  {creator.niches.map(niche => (
                    <Badge key={niche} variant="secondary" className="px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-widest bg-card/50 backdrop-blur-sm border border-white/10 text-pink-400">
                      {niche}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Bio */}
              {creator.bio && (
                <p className="text-base leading-relaxed text-muted-foreground max-w-2xl font-medium" data-testid="text-creator-bio">{creator.bio}</p>
              )}

              {/* Social links row */}
              <div className="flex items-center gap-3 flex-wrap">
                {socialLinks.instagram && (
                  <motion.a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-pink-500 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-testid="link-instagram"
                  >
                    <SiInstagram className="h-5 w-5" />
                    <span className="hidden sm:inline">Instagram</span>
                  </motion.a>
                )}
                {socialLinks.tiktok && (
                  <motion.a
                    href={socialLinks.tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-pink-500 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-testid="link-tiktok"
                  >
                    <SiTiktok className="h-5 w-5" />
                    <span className="hidden sm:inline">TikTok</span>
                  </motion.a>
                )}
                {socialLinks.youtube && (
                  <motion.a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-testid="link-youtube"
                  >
                    <SiYoutube className="h-5 w-5" />
                    <span className="hidden sm:inline">YouTube</span>
                  </motion.a>
                )}
                {socialLinks.twitter && (
                  <motion.a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-testid="link-twitter"
                  >
                    <SiX className="h-5 w-5" />
                    <span className="hidden sm:inline">X</span>
                  </motion.a>
                )}
                {socialLinks.facebook && (
                  <motion.a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-blue-500 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-testid="link-facebook"
                  >
                    <SiFacebook className="h-5 w-5" />
                    <span className="hidden sm:inline">Facebook</span>
                  </motion.a>
                )}
                {socialLinks.canva && (
                  <motion.a
                    href={socialLinks.canva}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-purple-500 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-testid="link-canva"
                  >
                    <SiCanva className="h-5 w-5" />
                    <span className="hidden sm:inline">Canva Portfolio</span>
                  </motion.a>
                )}
              </div>

              {/* Action buttons */}
              {!isOwnProfile && user && (
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    onClick={handleMessageCreator}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 hover:shadow-lg hover:shadow-pink-500/20 border-0 text-white"
                    data-testid="button-message-creator"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Creator
                  </Button>
                  {myBrand && (
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
                  )}
                </div>
              )}
              {myBrand && !isOwnProfile && (
                <p className="text-xs text-muted-foreground">
                  Pay directly through PayPal. 20% platform fee applies.
                </p>
              )}
            </div>
          </div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
              <Card className="bg-card/50 backdrop-blur-sm border-white/10 text-center py-4">
                <p className="text-2xl font-black text-pink-500" data-testid="stat-portfolio-count">{creator.portfolio?.length || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Portfolio Videos</p>
              </Card>
              <Card className="bg-card/50 backdrop-blur-sm border-white/10 text-center py-4">
                <p className="text-2xl font-black text-purple-400" data-testid="stat-review-count">{reviews?.length || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Reviews</p>
              </Card>
              <Card className="bg-card/50 backdrop-blur-sm border-white/10 text-center py-4">
                <p className="text-2xl font-black text-cyan-400" data-testid="stat-avg-rating">{avgRating || "—"}</p>
                <p className="text-xs text-muted-foreground mt-1">Avg Rating</p>
              </Card>
              <Card className="bg-card/50 backdrop-blur-sm border-white/10 text-center py-4">
                <p className="text-2xl font-black text-green-400" data-testid="stat-niches">{creator.niches?.length || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Niches</p>
              </Card>
          </motion.div>

          {/* Portfolio Section */}
          {creator.portfolio && creator.portfolio.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-black tracking-tighter flex items-center gap-2">
                    <Video className="h-6 w-6 text-pink-500" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">Portfolio</span>
                  </h2>
                  <div className="h-px bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-transparent flex-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {creator.portfolio.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      data-testid={`card-portfolio-${idx}`}
                    >
                      <Card className="overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border-white/10 hover:shadow-lg hover:shadow-pink-500/20 hover:border-pink-500/30 transition-all duration-300">
                        <div className="aspect-video bg-black/20">
                          {item.url.includes('youtube.com') || item.url.includes('youtu.be') ? (
                            <iframe
                              src={item.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={item.title}
                              loading="lazy"
                            />
                          ) : item.url.includes('tiktok.com') ? (
                            <iframe
                              src={`https://www.tiktok.com/embed/v2/${item.url.match(/video\/(\d+)/)?.[1] || item.url.split('/').pop()?.split('?')[0]}`}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={item.title}
                              loading="lazy"
                            />
                          ) : item.url.includes('instagram.com') ? (
                            <iframe
                              src={`${item.url.split('?')[0]}embed/`}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={item.title}
                              loading="lazy"
                            />
                          ) : item.url.includes('facebook.com') || item.url.includes('fb.watch') ? (
                            <iframe
                              src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(item.url)}&show_text=false`}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              title={item.title}
                              loading="lazy"
                            />
                          ) : item.url.includes('twitter.com') || item.url.includes('x.com') ? (
                            <iframe
                              src={`https://platform.twitter.com/embed/Tweet.html?id=${item.url.match(/status\/(\d+)/)?.[1]}`}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={item.title}
                              loading="lazy"
                            />
                          ) : item.url.includes('reddit.com') ? (
                            <iframe
                              src={`${item.url.replace('www.reddit.com', 'embed.reddit.com')}`}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              sandbox="allow-scripts allow-same-origin allow-popups"
                              title={item.title}
                              loading="lazy"
                            />
                          ) : (
                            <video
                              src={item.url}
                              controls
                              className="w-full h-full object-cover"
                              poster={item.thumbnail}
                            />
                          )}
                        </div>
                        <CardContent className="p-4 flex items-center justify-between">
                          <p className="font-bold text-base">{item.title}</p>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-pink-500 transition-colors"
                            data-testid={`link-portfolio-external-${idx}`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-black tracking-tighter flex items-center gap-2">
                  <Star className="h-6 w-6 text-pink-500 fill-pink-500" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">Reviews</span>
                </h2>
                <div className="h-px bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-transparent flex-1" />
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
