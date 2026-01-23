import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useCreators } from "@/hooks/use-creators";
import { useBrand } from "@/hooks/use-brand";
import { useParams, useLocation } from "wouter";
import { Loader2, Share2, Twitter, Facebook, Link as LinkIcon, Settings } from "lucide-react";
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
  
  // If no creator found, it might be a brand profile or just missing.
  // For now, our directory only shows creators.
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

  const isOwnProfile = user?.claims.sub === creator.userId;
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
            <img 
              src={creator.profileImage || "https://via.placeholder.com/150"} 
              className="w-48 h-48 rounded-3xl object-cover shadow-lg"
              alt={creator.name}
            />
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
                  <p className="text-xl text-muted-foreground">@{creator.handle}</p>
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
              <p className="text-lg leading-relaxed">{creator.bio}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {creator.portfolio?.map(item => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-muted-foreground">Video: {item.title}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
