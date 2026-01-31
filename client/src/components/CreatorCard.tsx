import { Link } from "wouter";
import { motion } from "framer-motion";
import { type Creator } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Instagram, Youtube, Video, Sparkles } from "lucide-react";
import { RatingSummary } from "@/components/Reviews";

interface CreatorCardProps {
  creator: Creator;
}

export function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="group overflow-hidden bg-card/50 backdrop-blur-sm border-white/10 hover:border-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <motion.div 
          className="h-24 bg-gradient-to-r from-pink-500/20 via-purple-500/10 to-cyan-400/10 relative overflow-hidden"
          whileHover={{ backgroundPosition: "100% 0%" }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>
      <CardHeader className="relative pt-0 pb-4">
        <div className="flex justify-between items-start">
          <Avatar className="h-20 w-20 -mt-10 border-4 border-background shadow-sm">
            <AvatarImage src={creator.profileImage || undefined} className="object-cover" />
            <AvatarFallback className="text-xl bg-pink-500/10 text-pink-500">
              {creator.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex gap-2 mt-4">
            {creator.socialLinks?.instagram && (
              <a href={creator.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-pink-500 hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] transition-all">
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {creator.socialLinks?.youtube && (
              <a href={creator.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-pink-500 hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] transition-all">
                <Youtube className="h-4 w-4" />
              </a>
            )}
            {creator.socialLinks?.tiktok && (
              <a href={creator.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-pink-500 hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] transition-all">
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
        <RatingSummary userId={creator.userId} showLabel={false} />
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {creator.bio || "No bio yet."}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {creator.niches?.slice(0, 3).map((niche) => (
            <Badge key={niche} variant="secondary" className="font-normal text-xs px-2.5 py-0.5 bg-white/5 border border-white/10 text-secondary-foreground">
              {niche}
            </Badge>
          ))}
          {creator.niches && creator.niches.length > 3 && (
            <Badge variant="outline" className="text-xs text-muted-foreground font-normal border-white/10">
              +{creator.niches.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-6 relative z-10">
        <Link href={`/creators/${creator.handle}`} className="w-full">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" className="w-full border-white/10 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:via-purple-500 group-hover:to-cyan-400 group-hover:text-white group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-pink-500/20 transition-all duration-300">
              View Portfolio
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ExternalLink className="ml-2 h-4 w-4 opacity-50 group-hover:opacity-100" />
              </motion.div>
            </Button>
          </motion.div>
        </Link>
      </CardFooter>
      </Card>
    </motion.div>
  );
}
