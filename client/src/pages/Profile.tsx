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
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row gap-8 items-start relative">
            <div className="relative group">
              <img 
                src={creator.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"} 
                className="w-48 h-48 rounded-3xl object-cover shadow-lg border-4 border-background"
                alt={creator.name}
              />
              <div className="absolute inset-0 rounded-3xl bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-bold">{creator.name}</h1>
                    {isOwnProfile && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setLocation("/dashboard")}
                        className="rounded-full"
                        data-testid="button-edit-profile"
                      >
                        <Settings className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-xl text-muted-foreground">@{creator.handle}</p>
                    <div className="flex items-center gap-2">
                      {creator.socialLinks?.instagram && (
                        <a href={creator.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}
                      {creator.socialLinks?.tiktok && (
                        <a href={creator.socialLinks.tiktok} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                          <Music2 className="h-5 w-5" />
                        </a>
                      )}
                      {creator.socialLinks?.youtube && (
                        <a href={creator.socialLinks.youtube} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                          <Youtube className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full shadow-sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl p-2">
                    <DropdownMenuItem onClick={shareToTwitter} className="cursor-pointer gap-2 rounded-lg">
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={shareToFacebook} className="cursor-pointer gap-2 rounded-lg">
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer gap-2 rounded-lg">
                      <LinkIcon className="h-4 w-4" />
                      Copy Link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap gap-2">
                {creator.niches?.map(niche => (
                  <Badge key={niche} variant="secondary">{niche}</Badge>
                ))}
              </div>
              <p className="text-lg leading-relaxed text-balance">{creator.bio}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {creator.portfolio?.length === 0 ? (
              <Card className="md:col-span-2 py-12 border-dashed text-center">
                <p className="text-muted-foreground italic">No portfolio items added yet.</p>
              </Card>
            ) : (
              creator.portfolio?.map(item => (
                <Card key={item.id} className="overflow-hidden group hover:border-primary transition-colors">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <p className="text-muted-foreground font-medium">Video: {item.title}</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{item.title}</h3>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
