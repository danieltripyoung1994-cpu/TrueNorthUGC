import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { CreatorCard } from "@/components/CreatorCard";
import { useCreators } from "@/hooks/use-creators";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2, FilterX } from "lucide-react";
import { motion } from "framer-motion";

const NICHES = ["All", "Fitness", "Beauty", "Tech", "Travel", "Food", "Fashion", "Lifestyle", "Gaming"];

export default function Directory() {
  const [search, setSearch] = useState("");
  const [niche, setNiche] = useState<string>("All");
  
  const { data: creators, isLoading, isError } = useCreators({
    search: search || undefined,
    niche: niche === "All" ? undefined : niche
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="space-y-2 max-w-xl">
            <h1 className="text-4xl font-bold tracking-tight">Discover Creators</h1>
            <p className="text-muted-foreground text-lg">
              Find the perfect content creator for your brand from our curated community.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border rounded-2xl p-4 mb-12 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or handle..." 
              className="pl-9 h-12 bg-background border-border/50 focus:border-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={niche} onValueChange={setNiche}>
            <SelectTrigger className="w-full md:w-[200px] h-12 bg-background border-border/50">
              <SelectValue placeholder="Select Niche" />
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
              onClick={() => { setSearch(""); setNiche("All"); }}
              className="h-12 px-4 text-muted-foreground hover:text-destructive"
            >
              <FilterX className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-destructive">Failed to load creators. Please try again.</p>
          </div>
        ) : creators?.length === 0 ? (
          <div className="text-center py-20 bg-secondary/20 rounded-3xl">
            <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold">No creators found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {creators?.map((creator, i) => (
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
