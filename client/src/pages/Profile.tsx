import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useCreators } from "@/hooks/use-creators";
import { useParams } from "wouter";
import { Loader2, Share2, Twitter, Facebook, Link as LinkIcon } from "lucide-react";
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
  const { data: creator, isLoading } = useCreators({ search: handle });
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!creator?.[0]) {
    return <div>Creator not found</div>;
  }

  const profile = creator[0];
  const profileUrl = window.location.href;

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=Check out ${profile.name}'s UGC portfolio on TrueNorthUGC!&url=${profileUrl}`, '_blank');
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
              src={profile.profileImage || "https://via.placeholder.com/150"} 
              className="w-48 h-48 rounded-3xl object-cover shadow-lg"
              alt={profile.name}
            />
            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h1 className="text-4xl font-bold">{profile.name}</h1>
                  <p className="text-xl text-muted-foreground">@{profile.handle}</p>
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
                {profile.niches?.map(niche => (
                  <Badge key={niche} variant="secondary">{niche}</Badge>
                ))}
              </div>
              <p className="text-lg leading-relaxed">{profile.bio}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.portfolio?.map(item => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  {/* Portfolio video placeholder */}
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
