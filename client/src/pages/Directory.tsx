import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { usePageMeta } from "@/hooks/use-page-meta";
import { CreatorCard } from "@/components/CreatorCard";
import { useCreators } from "@/hooks/use-creators";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FilterX, MapPin, Star, Users, Sparkles } from "lucide-react";
import { CardSkeleton } from "@/components/ui/skeleton-loaders";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";

const NICHES = ["All", "Fitness", "Beauty", "Tech", "Travel", "Food", "Fashion", "Lifestyle", "Gaming"];
const LOCATIONS = ["All Locations", "Ontario", "British Columbia", "Alberta", "Quebec", "Manitoba", "Saskatchewan", "Nova Scotia", "New Brunswick", "Newfoundland", "Prince Edward Island"];
const EXPERIENCE_LEVELS = ["All Levels", "Beginner", "Intermediate", "Pro", "Elite"];

export default function Directory() {
  usePageMeta({ 
    title: "Browse Canadian UGC Creators", 
    description: "Discover and hire talented Canadian UGC creators for your brand campaigns. Filter by niche, location, and experience level. Find creators in Toronto, Vancouver, Montreal and across Canada.",
    keywords: "Canadian UGC creators, hire content creators Canada, Toronto creators, Vancouver UGC, Montreal influencers, fitness creators Canada, beauty content creators, tech reviewers Canada",
    canonicalPath: "/creators"
  });
  const [search, setSearch] = useState("");
  const [niche, setNiche] = useState<string>("All");
  const [location, setLocation] = useState<string>("All Locations");
  const [experienceLevel, setExperienceLevel] = useState<string>("All Levels");
  
  const { data: creators, isLoading, isError } = useCreators({
    search: search || undefined,
    niche: niche === "All" ? undefined : niche
  });

  // Client-side filtering for location and experience level
  const filteredCreators = creators?.filter(creator => {
    const matchesLocation = location === "All Locations" || 
      (creator as any).location?.toLowerCase().includes(location.toLowerCase());
    const matchesExperience = experienceLevel === "All Levels" || 
      (creator as any).experienceLevel === experienceLevel;
    return matchesLocation && matchesExperience;
  });

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
    <PageTransition>
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 sm:py-12 relative">
        {/* Background decoration */}
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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300"
            >
              <Users className="h-4 w-4 text-pink-500" />
              <span className="text-sm font-medium text-pink-500">Creator Directory</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter"
            >
              Discover{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">
                Talent
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-muted-foreground text-base sm:text-lg md:text-xl"
            >
              Partner with vetted Canadian creators to scale your brand's presence.
            </motion.p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-8 sm:mb-12 shadow-lg hover:shadow-pink-500/10 transition-all duration-300"
        >
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or handle..." 
                className="pl-9 h-11 sm:h-12 bg-background/50 backdrop-blur-sm border-white/10 focus:border-pink-500/50 focus:ring-pink-500/20 text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search-creators"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-2 sm:gap-3">
              <Select value={niche} onValueChange={setNiche}>
                <SelectTrigger className="w-full lg:w-[160px] h-11 sm:h-12 bg-background/50 backdrop-blur-sm border-white/10 hover:border-pink-500/30 text-sm sm:text-base transition-colors" data-testid="select-niche">
                  <SelectValue placeholder="Niche" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-sm border-white/10">
                  {NICHES.map((n) => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-full lg:w-[180px] h-11 sm:h-12 bg-background/50 backdrop-blur-sm border-white/10 hover:border-pink-500/30 text-sm sm:text-base transition-colors" data-testid="select-location">
                  <MapPin className="h-4 w-4 mr-1 sm:mr-2 text-muted-foreground flex-shrink-0" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-sm border-white/10">
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger className="w-full lg:w-[160px] h-11 sm:h-12 bg-background/50 backdrop-blur-sm border-white/10 hover:border-pink-500/30 text-sm sm:text-base col-span-2 sm:col-span-1 transition-colors" data-testid="select-experience">
                  <Star className="h-4 w-4 mr-1 sm:mr-2 text-muted-foreground flex-shrink-0" />
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-sm border-white/10">
                  {EXPERIENCE_LEVELS.map((exp) => (
                    <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(search || niche !== "All" || location !== "All Locations" || experienceLevel !== "All Levels") && (
                <Button 
                  variant="ghost" 
                  onClick={() => { 
                    setSearch(""); 
                    setNiche("All"); 
                    setLocation("All Locations");
                    setExperienceLevel("All Levels");
                  }}
                  className="h-12 px-4 text-muted-foreground hover:text-pink-500 hover:bg-pink-500/10 transition-colors"
                  data-testid="button-clear-filters"
                >
                  <FilterX className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            >
              {[...Array(8)].map((_, idx) => (
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
              <p className="text-destructive">Failed to load creators. Please try again.</p>
            </motion.div>
          ) : filteredCreators?.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 sm:py-20 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-cyan-400/5 rounded-2xl sm:rounded-3xl border border-dashed border-white/10 mx-2 sm:mx-0"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Search className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground/50 mb-4" />
              </motion.div>
              <h3 className="text-lg sm:text-xl font-bold">No creators found</h3>
              <p className="text-muted-foreground text-base sm:text-lg">Try adjusting your search or filters.</p>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            >
              {filteredCreators?.map((creator) => (
                <motion.div
                  key={creator.id}
                  variants={itemVariants}
                >
                  <CreatorCard creator={creator} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
    </PageTransition>
  );
}
