import { Link } from "wouter";
import { motion } from "framer-motion";
import { type Campaign, type Brand } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, MapPin, Package, Building, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface CampaignCardProps {
  campaign: Campaign;
  onViewDetails?: () => void;
}

function useBrandByUserId(userId: string) {
  return useQuery<Brand>({
    queryKey: ["/api/brands", userId],
    queryFn: async () => {
      const res = await fetch(`/api/brands/${userId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch brand");
      return res.json();
    },
    enabled: !!userId,
  });
}

export function CampaignCard({ campaign, onViewDetails }: CampaignCardProps) {
  const { data: brand } = useBrandByUserId(campaign.brandUserId);

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    return date.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card 
        className="group overflow-visible border-border/50 bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover-elevate h-full flex flex-col"
        data-testid={`card-campaign-${campaign.id}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground truncate">
                  {brand?.name || "Loading..."}
                </p>
                <h3 className="font-bold text-lg leading-tight line-clamp-2" data-testid={`text-campaign-title-${campaign.id}`}>
                  {campaign.title}
                </h3>
              </div>
            </div>
            <Badge 
              variant={campaign.status === "active" ? "default" : "secondary"}
              className="flex-shrink-0"
              data-testid={`badge-campaign-status-${campaign.id}`}
            >
              {campaign.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 flex-1">
          <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`text-campaign-description-${campaign.id}`}>
            {campaign.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {campaign.niches?.slice(0, 3).map((niche) => (
              <Badge 
                key={niche} 
                variant="outline" 
                className="text-xs font-normal"
                data-testid={`badge-campaign-niche-${campaign.id}-${niche}`}
              >
                {niche}
              </Badge>
            ))}
            {campaign.niches && campaign.niches.length > 3 && (
              <Badge variant="outline" className="text-xs text-muted-foreground font-normal">
                +{campaign.niches.length - 3}
              </Badge>
            )}
          </div>

          <div className="space-y-2 text-sm">
            {campaign.budget && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span data-testid={`text-campaign-budget-${campaign.id}`}>{campaign.budget}</span>
              </div>
            )}
            {campaign.deadline && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span data-testid={`text-campaign-deadline-${campaign.id}`}>
                  Deadline: {formatDeadline(campaign.deadline)}
                </span>
              </div>
            )}
            {campaign.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span data-testid={`text-campaign-location-${campaign.id}`}>{campaign.location}</span>
              </div>
            )}
            {campaign.deliverables && campaign.deliverables.length > 0 && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <Package className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2" data-testid={`text-campaign-deliverables-${campaign.id}`}>
                  {campaign.deliverables.join(", ")}
                </span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-3">
          <Button 
            variant="outline" 
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
            onClick={onViewDetails}
            data-testid={`button-view-campaign-${campaign.id}`}
          >
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
