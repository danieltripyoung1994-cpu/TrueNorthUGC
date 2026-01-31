import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { CreatorCard } from "@/components/CreatorCard";
import { useCreators } from "@/hooks/use-creators";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2, FilterX, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";

const NICHES = ["All", "Fitness", "Beauty", "Tech", "Travel", "Food", "Fashion", "Lifestyle", "Gaming"];
const LOCATIONS = ["All Locations", "Ontario", "British Columbia", "Alberta", "Quebec", "Manitoba", "Saskatchewan", "Nova Scotia", "New Brunswick", "Newfoundland", "Prince Edward Island"];
const EXPERIENCE_LEVELS = ["All Levels", "Beginner", "Intermediate", "Pro", "Elite"];

export default function Directory() {
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="space-y-2 max-w-xl">
            <h1 className="text-5xl font-black tracking-tighter">Discover Talent</h1>
            <p className="text-muted-foreground text-xl">
              Partner with vetted Canadian creators to scale your brand's presence.
            </p>
          </div>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border rounded-2xl p-4 mb-12 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or handle..." 
                className="pl-9 h-12 bg-background border-border/50 focus:border-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search-creators"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={niche} onValueChange={setNiche}>
                <SelectTrigger className="w-full sm:w-[160px] h-12 bg-background border-border/50" data-testid="select-niche">
                  <SelectValue placeholder="Niche" />
                </SelectTrigger>
                <SelectContent>
                  {NICHES.map((n) => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-full sm:w-[180px] h-12 bg-background border-border/50" data-testid="select-location">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger className="w-full sm:w-[160px] h-12 bg-background border-border/50" data-testid="select-experience">
                  <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
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
                  className="h-12 px-4 text-muted-foreground hover:text-destructive"
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
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-destructive">Failed to load creators. Please try again.</p>
          </div>
        ) : filteredCreators?.length === 0 ? (
          <div className="text-center py-20 bg-secondary/10 rounded-3xl border border-dashed border-border">
            <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-bold">No creators found</h3>
            <p className="text-muted-foreground text-lg">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCreators?.map((creator, i) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <CreatorCard creator={creator} />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
