import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useCreators } from "@/hooks/use-creators";
import { useBrand } from "@/hooks/use-brand";
import { useParams, useLocation } from "wouter";
import { Loader2, Share2, Twitter, Facebook, Link as LinkIcon, Settings, Instagram, Music2, Youtube } from "lucide-react";
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

export default function Profile() {
  const { handle } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { data: creators, isLoading: loadingCreator } = useCreators({ search: handle });
  const { brand: myBrand, isLoading: loadingBrand } = useBrand();
  const { toast } = useToast();

  const isLoading = loadingCreator || loadingBrand;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const creator = creators?.[0];
  
  if (!creator) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Profile not found</h1>
          <Button variant="link" onClick={() => setLocation("/")} className="mt-4">
            Go back home
          </Button>
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Link copied!",
      description: "Profile link has been copied to your clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-12"
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
                        <a href={creator.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          <Instagram className="h-6 w-6" />
                        </a>
                      )}
                      {creator.socialLinks?.tiktok && (
                        <a href={creator.socialLinks.tiktok} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          <Music2 className="h-6 w-6" />
                        </a>
                      )}
                      {creator.socialLinks?.youtube && (
                        <a href={creator.socialLinks.youtube} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          <Youtube className="h-6 w-6" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full shadow-lg hover:bg-primary hover:text-primary-foreground transition-all">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[160px] shadow-2xl border-primary/10">
                    <DropdownMenuItem onClick={shareToTwitter} className="cursor-pointer gap-3 rounded-xl p-3 font-medium">
                      <Twitter className="h-4 w-4 text-sky-500" />
                      Twitter
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={shareToFacebook} className="cursor-pointer gap-3 rounded-xl p-3 font-medium">
                      <Facebook className="h-4 w-4 text-blue-600" />
                      Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer gap-3 rounded-xl p-3 font-medium">
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
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black tracking-tighter">Portfolio</h2>
              <div className="h-px bg-muted flex-1" />
            </div>
            
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {creator.portfolio?.length === 0 ? (
                <Card className="md:col-span-2 py-20 border-2 border-dashed rounded-[2.5rem] bg-muted/30 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-muted">
                      <Video className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-bold text-lg">Your masterpiece awaits...</p>
                    <p className="text-sm text-muted-foreground">Add items to your portfolio to showcase your talent.</p>
                  </div>
                </Card>
              ) : (
                creator.portfolio?.map((item, idx) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="overflow-hidden group hover:border-primary transition-all duration-500 rounded-[2rem] shadow-lg hover:shadow-2xl hover:shadow-primary/20">
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                        <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop')] bg-cover bg-center">
                          <div className="w-16 h-16 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-2xl transform scale-0 group-hover:scale-100 transition-transform duration-500 z-20 backdrop-blur-sm">
                            <Play className="h-8 w-8 fill-current ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6 z-20 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <p className="text-white font-black text-xl leading-tight">{item.title}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
