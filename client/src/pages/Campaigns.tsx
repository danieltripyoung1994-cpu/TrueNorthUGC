import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { CampaignCard } from "@/components/CampaignCard";
import { useCampaigns } from "@/hooks/use-campaigns";
import { type Campaign, type Brand } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, FilterX, Megaphone, DollarSign, Calendar, MapPin, Package, Building, ExternalLink } from "lucide-react";
import { CardSkeleton } from "@/components/ui/skeleton-loaders";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

const NICHES = ["All", "Fitness", "Beauty", "Tech", "Travel", "Food", "Fashion", "Lifestyle", "Gaming"];

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
  const [search, setSearch] = useState("");
  const [niche, setNiche] = useState<string>("All");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const { data: campaigns, isLoading, isError } = useCampaigns("active");
  const { data: selectedBrand } = useBrandByUserId(selectedCampaign?.brandUserId || null);

  const filteredCampaigns = campaigns?.filter(campaign => {
    const matchesSearch = search === "" || 
      campaign.title.toLowerCase().includes(search.toLowerCase()) ||
      campaign.description.toLowerCase().includes(search.toLowerCase());
    const matchesNiche = niche === "All" || 
      campaign.niches?.some(n => n.toLowerCase() === niche.toLowerCase());
    return matchesSearch && matchesNiche;
  });

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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20"
            >
              <Megaphone className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Campaign Opportunities</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter"
            >
              Find Your Next{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
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

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-8 sm:mb-12 shadow-sm"
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

                <div className="flex flex-wrap gap-2">
                  {selectedCampaign.niches?.map((n) => (
                    <Badge key={n} variant="secondary">{n}</Badge>
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
                  {selectedCampaign.deadline && (
                    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Deadline</p>
                        <p className="font-semibold" data-testid="text-campaign-modal-deadline">{formatDeadline(selectedCampaign.deadline)}</p>
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
                </div>

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

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    className="flex-1" 
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
