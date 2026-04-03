import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { usePageMeta } from "@/hooks/use-page-meta";
import { CampaignCard } from "@/components/CampaignCard";
import { useCampaigns } from "@/hooks/use-campaigns";
import { type Campaign, type Brand } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, FilterX, Megaphone, DollarSign, Calendar, MapPin, Package, Building, ExternalLink, Video, Users, Sparkles, Hash, AtSign, Clock, Shield, FileText, Trophy, BarChart2 } from "lucide-react";
import { CardSkeleton } from "@/components/ui/skeleton-loaders";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

const NICHES = ["All", "Fitness", "Beauty", "Tech", "Travel", "Food", "Fashion", "Lifestyle", "Gaming"];


const CAMPAIGN_TYPE_LABELS: Record<string, string> = {
  product_review: "Product Review",
  testimonial: "Testimonial",
  unboxing: "Unboxing",
  tutorial: "Tutorial / How-To",
  lifestyle: "Lifestyle Integration",
  brand_awareness: "Brand Awareness",
  challenge: "Challenge / Trend",
  giveaway: "Giveaway Promo",
};

const COMPENSATION_LABELS: Record<string, string> = {
  fixed: "Fixed Payment",
  product_gifting: "Product Gifting Only",
  commission: "Commission Based",
  hybrid: "Payment + Product",
  negotiable: "Negotiable",
};

const CONTENT_STYLE_LABELS: Record<string, string> = {
  professional: "Professional / Polished",
  casual: "Casual / Relatable",
  authentic: "Raw / Authentic UGC",
  cinematic: "Cinematic",
  comedic: "Comedic / Fun",
};

const USAGE_RIGHTS_LABELS: Record<string, string> = {
  "30_days": "30 Days",
  "90_days": "90 Days",
  "6_months": "6 Months",
  "1_year": "1 Year",
  perpetual: "Perpetual / Forever",
  negotiable: "Negotiable",
};

const EXCLUSIVITY_LABELS: Record<string, string> = {
  none: "No Exclusivity",
  category: "Category Exclusive",
  full: "Full Exclusivity",
};

const PLATFORM_LABELS: Record<string, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  youtube: "YouTube",
  twitter: "X (Twitter)",
  facebook: "Facebook",
};

const EXPERIENCE_LABELS: Record<string, string> = {
  any: "Any Level",
  beginner: "Beginner",
  intermediate: "Intermediate",
  pro: "Pro",
  elite: "Elite Only",
};

function useBrandByUserId(userId: string | null) {
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

export default function Campaigns() {
  usePageMeta({ 
    title: "UGC Campaigns - Find Brand Opportunities", 
    description: "Browse active UGC campaigns from Canadian brands seeking content creators. Apply to paid opportunities, build your portfolio, and grow your creator business with TrueNorthUGC.",
    keywords: "UGC campaigns Canada, paid creator opportunities, brand deals Canada, content creator jobs, UGC opportunities, Canadian brand partnerships, creator campaigns",
    canonicalPath: "/campaigns"
  });
  const [search, setSearch] = useState("");
  const [niche, setNiche] = useState<string>("All");
  const [dealType, setDealType] = useState<"all" | "campaign" | "contest">("all");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const { data: campaigns, isLoading, isError } = useCampaigns("active");
  const { data: selectedBrand } = useBrandByUserId(selectedCampaign?.brandUserId || null);

  const filteredCampaigns = campaigns?.filter(campaign => {
    const matchesSearch = search === "" || 
      campaign.title.toLowerCase().includes(search.toLowerCase()) ||
      campaign.description.toLowerCase().includes(search.toLowerCase());
    const matchesNiche = niche === "All" || 
      campaign.niches?.some(n => n.toLowerCase() === niche.toLowerCase());
    const campaignDealType = (campaign as any).dealType || "campaign";
    const matchesDeal = dealType === "all" || campaignDealType === dealType;
    return matchesSearch && matchesNiche && matchesDeal;
  });

  const campaignCount = campaigns?.filter(c => ((c as any).dealType || "campaign") === "campaign").length || 0;
  const contestCount = campaigns?.filter(c => ((c as any).dealType || "campaign") === "contest").length || 0;

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    return date.toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 sm:py-12 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6 mb-8 sm:mb-12"
        >
          <div className="space-y-3 max-w-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20"
            >
              <Megaphone className="h-4 w-4 text-pink-500" />
              <span className="text-sm font-medium text-pink-500">Campaign Opportunities</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter"
            >
              Find Your Next{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">
                Collaboration
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-muted-foreground text-base sm:text-lg md:text-xl"
            >
              Browse active campaigns from brands looking for talented creators like you.
            </motion.p>
          </div>
        </motion.div>

        {/* Deal Type Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex gap-2 mb-5 sm:mb-7"
        >
          {[
            { value: "all", label: "All Deals", icon: <Megaphone className="h-4 w-4" />, count: (campaignCount + contestCount) },
            { value: "campaign", label: "Campaign Deals", icon: <Sparkles className="h-4 w-4" />, count: campaignCount },
            { value: "contest", label: "Contest Deals", icon: <Trophy className="h-4 w-4" />, count: contestCount },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setDealType(tab.value as typeof dealType)}
              data-testid={`tab-deal-${tab.value}`}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold border transition-all duration-200 ${
                dealType === tab.value
                  ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/40 text-pink-400 shadow-sm shadow-pink-500/10"
                  : "border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="inline sm:hidden">{tab.label.split(" ")[0]}</span>
              {!isLoading && (
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-bold ${dealType === tab.value ? "bg-pink-500/20 text-pink-400" : "bg-card/80 text-muted-foreground"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-8 sm:mb-12 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search campaigns..." 
                className="pl-9 h-11 sm:h-12 bg-background border-border/50 focus:border-primary text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search-campaigns"
              />
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Select value={niche} onValueChange={setNiche}>
                <SelectTrigger className="w-full sm:w-[160px] h-11 sm:h-12 bg-background border-border/50 text-sm sm:text-base" data-testid="select-campaign-niche">
                  <SelectValue placeholder="Niche" />
                </SelectTrigger>
                <SelectContent>
                  {NICHES.map((n) => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(search || niche !== "All") && (
                <Button 
                  variant="ghost" 
                  onClick={() => { 
                    setSearch(""); 
                    setNiche("All"); 
                  }}
                  className="h-11 sm:h-12 px-4 text-muted-foreground hover:text-destructive"
                  data-testid="button-clear-campaign-filters"
                >
                  <FilterX className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {[...Array(6)].map((_, idx) => (
                <CardSkeleton key={idx} />
              ))}
            </motion.div>
          ) : isError ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p className="text-destructive">Failed to load campaigns. Please try again.</p>
            </motion.div>
          ) : filteredCampaigns?.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 sm:py-20 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-2xl sm:rounded-3xl border border-dashed border-border mx-2 sm:mx-0"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Megaphone className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground/50 mb-4" />
              </motion.div>
              <h3 className="text-lg sm:text-xl font-bold">No campaigns found</h3>
              <p className="text-muted-foreground text-base sm:text-lg">Try adjusting your search or filters.</p>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {filteredCampaigns?.map((campaign) => (
                <motion.div
                  key={campaign.id}
                  variants={itemVariants}
                >
                  <CampaignCard 
                    campaign={campaign} 
                    onViewDetails={() => setSelectedCampaign(campaign)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <Dialog open={!!selectedCampaign} onOpenChange={(open) => !open && setSelectedCampaign(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold" data-testid="text-campaign-modal-title">
                {selectedCampaign?.title}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 text-base">
                <Building className="h-4 w-4" />
                {selectedBrand?.name || "Loading brand..."}
              </DialogDescription>
            </DialogHeader>
            
            {selectedCampaign && (
              <div className="space-y-6 pt-4">
                <div className="flex flex-wrap gap-2">
                  {selectedCampaign.campaignType && (
                    <Badge variant="default" className="bg-gradient-to-r from-pink-500 to-purple-500 border-white/10">
                      {CAMPAIGN_TYPE_LABELS[selectedCampaign.campaignType] || selectedCampaign.campaignType}
                    </Badge>
                  )}
                  {selectedCampaign.compensationType && (
                    <Badge variant="secondary" className="border-white/10">
                      {COMPENSATION_LABELS[selectedCampaign.compensationType] || selectedCampaign.compensationType}
                    </Badge>
                  )}
                  {selectedCampaign.contentStyle && (
                    <Badge variant="outline" className="border-white/10">
                      <Sparkles className="h-3 w-3 mr-1 text-pink-500" />
                      {CONTENT_STYLE_LABELS[selectedCampaign.contentStyle] || selectedCampaign.contentStyle}
                    </Badge>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground" data-testid="text-campaign-modal-description">
                    {selectedCampaign.description}
                  </p>
                </div>

                {selectedCampaign.requirements && (
                  <div>
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <p className="text-muted-foreground" data-testid="text-campaign-modal-requirements">
                      {selectedCampaign.requirements}
                    </p>
                  </div>
                )}

                {(selectedCampaign as any).dealType === "contest" && (
                  <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                    <h4 className="font-semibold flex items-center gap-2 text-amber-400">
                      <Trophy className="h-5 w-5" />
                      Contest Details
                    </h4>
                    {(selectedCampaign as any).prizeValue && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Prize Value:</span>
                        <span className="font-semibold text-amber-300">{(selectedCampaign as any).prizeValue}</span>
                      </div>
                    )}
                    {(selectedCampaign as any).winnerCount && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Winners:</span>
                        <span className="font-semibold">{(selectedCampaign as any).winnerCount}</span>
                      </div>
                    )}
                    {(selectedCampaign as any).contestRules && (
                      <div className="text-sm">
                        <p className="text-muted-foreground mb-1">Rules &amp; Eligibility:</p>
                        <p className="text-foreground/80">{(selectedCampaign as any).contestRules}</p>
                      </div>
                    )}
                  </div>
                )}

                {(selectedCampaign as any).dealType === "cpm_deal" && ((selectedCampaign as any).cpmRate || (selectedCampaign as any).viewsGuaranteed) && (
                  <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 space-y-3">
                    <h4 className="font-semibold flex items-center gap-2 text-cyan-400">
                      <BarChart2 className="h-5 w-5" />
                      CPM Deal Terms
                    </h4>
                    {(selectedCampaign as any).cpmRate && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Rate:</span>
                        <span className="font-semibold text-cyan-300">{(selectedCampaign as any).cpmRate} per 1,000 views</span>
                      </div>
                    )}
                    {(selectedCampaign as any).viewsGuaranteed && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Views Guaranteed:</span>
                        <span className="font-semibold">{(selectedCampaign as any).viewsGuaranteed}</span>
                      </div>
                    )}
                  </div>
                )}

                {selectedCampaign.platforms && selectedCampaign.platforms.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Video className="h-4 w-4 text-pink-500" />
                      Target Platforms
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCampaign.platforms.map((p) => (
                        <Badge key={p} variant="outline" className="border-white/10">
                          {PLATFORM_LABELS[p] || p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {selectedCampaign.niches?.map((n) => (
                    <Badge key={n} variant="secondary" className="border-white/10">{n}</Badge>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedCampaign.budget && (
                    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Budget</p>
                        <p className="font-semibold" data-testid="text-campaign-modal-budget">{selectedCampaign.budget}</p>
                      </div>
                    </div>
                  )}
                  {selectedCampaign.creatorCount && (
                    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                      <Users className="h-5 w-5 text-indigo-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Creators Needed</p>
                        <p className="font-semibold">{selectedCampaign.creatorCount}</p>
                      </div>
                    </div>
                  )}
                  {selectedCampaign.deadline && (
                    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Content Deadline</p>
                        <p className="font-semibold" data-testid="text-campaign-modal-deadline">{formatDeadline(selectedCampaign.deadline)}</p>
                      </div>
                    </div>
                  )}
                  {selectedCampaign.applicationDeadline && (
                    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                      <Clock className="h-5 w-5 text-amber-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Apply By</p>
                        <p className="font-semibold">{formatDeadline(selectedCampaign.applicationDeadline)}</p>
                      </div>
                    </div>
                  )}
                  {selectedCampaign.location && (
                    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                      <MapPin className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-semibold" data-testid="text-campaign-modal-location">{selectedCampaign.location}</p>
                      </div>
                    </div>
                  )}
                  {selectedCampaign.experienceLevel && selectedCampaign.experienceLevel !== "any" && (
                    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Experience Level</p>
                        <p className="font-semibold">{EXPERIENCE_LABELS[selectedCampaign.experienceLevel] || selectedCampaign.experienceLevel}</p>
                      </div>
                    </div>
                  )}
                </div>

                {(selectedCampaign.usageRights || selectedCampaign.exclusivity || selectedCampaign.productProvided) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedCampaign.productProvided && (
                      <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <Package className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Product Provided</p>
                          <p className="font-semibold">
                            {selectedCampaign.productProvided === "yes" ? "Yes - Shipped to you" : 
                             selectedCampaign.productProvided === "digital" ? "Digital product/access" : "No"}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedCampaign.usageRights && (
                      <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <Shield className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Usage Rights</p>
                          <p className="font-semibold">{USAGE_RIGHTS_LABELS[selectedCampaign.usageRights] || selectedCampaign.usageRights}</p>
                        </div>
                      </div>
                    )}
                    {selectedCampaign.exclusivity && selectedCampaign.exclusivity !== "none" && (
                      <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <Shield className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Exclusivity</p>
                          <p className="font-semibold">{EXCLUSIVITY_LABELS[selectedCampaign.exclusivity] || selectedCampaign.exclusivity}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedCampaign.deliverables && selectedCampaign.deliverables.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4 text-purple-500" />
                      Deliverables
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground" data-testid="list-campaign-modal-deliverables">
                      {selectedCampaign.deliverables.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {(selectedCampaign.hashtags && selectedCampaign.hashtags.length > 0) || (selectedCampaign.mentions && selectedCampaign.mentions.length > 0) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedCampaign.hashtags && selectedCampaign.hashtags.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Hash className="h-4 w-4 text-pink-500" />
                          Required Hashtags
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedCampaign.hashtags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-pink-500 border-white/10">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedCampaign.mentions && selectedCampaign.mentions.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <AtSign className="h-4 w-4 text-cyan-400" />
                          Required Mentions
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedCampaign.mentions.map((mention, i) => (
                            <Badge key={i} variant="outline" className="text-cyan-400 border-white/10">{mention}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}

                {selectedCampaign.briefDocument && (
                  <div className="p-4 bg-card/50 backdrop-blur-sm border border-white/10 rounded-lg">
                    <a 
                      href={selectedCampaign.briefDocument} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-pink-500 hover:underline font-medium hover:text-pink-400 transition-colors"
                    >
                      <FileText className="h-5 w-5" />
                      View Full Campaign Brief
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0 hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300" 
                    onClick={() => setSelectedCampaign(null)}
                    data-testid="button-close-campaign-modal"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
