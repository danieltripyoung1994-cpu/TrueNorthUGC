import { Link } from "wouter";
import { type Creator } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Instagram, Youtube, Video } from "lucide-react";

interface CreatorCardProps {
  creator: Creator;
}

export function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <Card className="group overflow-hidden border-border/50 bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      <div className="h-24 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
      <CardHeader className="relative pt-0 pb-4">
        <div className="flex justify-between items-start">
          <Avatar className="h-20 w-20 -mt-10 border-4 border-background shadow-sm">
            <AvatarImage src={creator.profileImage || undefined} className="object-cover" />
            <AvatarFallback className="text-xl bg-primary/10 text-primary">
              {creator.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex gap-2 mt-4">
            {creator.socialLinks?.instagram && (
              <a href={creator.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {creator.socialLinks?.youtube && (
              <a href={creator.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            )}
            {creator.socialLinks?.tiktok && (
              <a href={creator.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Video className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="font-bold text-xl leading-none">{creator.name}</h3>
          <p className="text-sm text-muted-foreground font-medium">@{creator.handle}</p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {creator.bio || "No bio yet."}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {creator.niches?.slice(0, 3).map((niche) => (
            <Badge key={niche} variant="secondary" className="font-normal text-xs px-2.5 py-0.5 bg-secondary/50 text-secondary-foreground">
              {niche}
            </Badge>
          ))}
          {creator.niches && creator.niches.length > 3 && (
            <Badge variant="outline" className="text-xs text-muted-foreground font-normal">
              +{creator.niches.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-6">
        <Link href={`/creators/${creator.handle}`} className="w-full">
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
            View Portfolio
            <ExternalLink className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
