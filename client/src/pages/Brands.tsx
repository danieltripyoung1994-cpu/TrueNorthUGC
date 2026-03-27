import { Navbar } from "@/components/Navbar";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useQuery } from "@tanstack/react-query";
import { type Brand } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Search, FilterX, Globe, ExternalLink, MapPin, Megaphone } from "lucide-react";
import { SiInstagram, SiX, SiFacebook } from "react-icons/si";
import { CardSkeleton } from "@/components/ui/skeleton-loaders";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";

const INDUSTRIES = ["All", "Beauty", "Tech", "Fitness", "Food & Beverage", "Fashion", "Health", "Travel", "Gaming", "Home & Living", "Finance", "Pets", "Kids & Parenting"];

export default function Brands() {
  usePageMeta({
    title: "Brand Directory — TrueNorthUGC",
    description: "Discover Canadian brands looking for UGC creators. Connect with brands across beauty, tech, fitness, food, and more.",
    keywords: "Canadian brands, UGC brands Canada, brands looking for creators, brand directory",
    canonicalPath: "/brands"
  });

  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All");

  const { data: brands, isLoading, isError } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  const filtered = brands?.filter(b => {
    const matchSearch = search === "" ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.description || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.industry || "").toLowerCase().includes(search.toLowerCase());
    const matchIndustry = industry === "All" ||
      (b.industry || "").toLowerCase().includes(industry.toLowerCase()) ||
      (b.niches || []).some(n => n.toLowerCase().includes(industry.toLowerCase()));
    return matchSearch && matchIndustry;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />

      <main className="container mx-auto px-4 py-6 sm:py-12 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10" />

        {/* Header */}
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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20"
            >
              <Building2 className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">Brand Directory</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter"
            >
              Brands Seeking{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">
                Creators
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-muted-foreground text-base sm:text-lg"
            >
              Discover the brands behind the campaigns. Connect, pitch, and land your next collaboration.
            </motion.p>
          </div>
        </motion.div>

        {/* Filters */}
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
                placeholder="Search brands..."
                className="pl-9 h-11 sm:h-12 bg-background border-border/50 focus:border-primary text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search-brands"
              />
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="w-full sm:w-[180px] h-11 sm:h-12 bg-background border-border/50 text-sm sm:text-base" data-testid="select-brand-industry">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((i) => (
                    <SelectItem key={i} value={i}>{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(search || industry !== "All") && (
                <Button
                  variant="ghost"
                  onClick={() => { setSearch(""); setIndustry("All"); }}
                  className="h-11 sm:h-12 px-4 text-muted-foreground hover:text-destructive"
                  data-testid="button-clear-brand-filters"
                >
                  <FilterX className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
            </motion.div>
          ) : isError ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <p className="text-destructive">Failed to load brands. Please try again.</p>
            </motion.div>
          ) : filtered?.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-3xl border border-dashed border-border"
            >
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-bold">No brands found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {filtered?.map((brand) => (
                <motion.div key={brand.id} variants={itemVariants}>
                  <BrandCard brand={brand} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function BrandCard({ brand }: { brand: Brand }) {
  const links = (brand as any).socialLinks || {};

  return (
    <Card
      className="group bg-card/50 backdrop-blur-sm border-white/10 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 h-full"
      data-testid={`card-brand-${brand.id}`}
    >
      <CardContent className="p-5 flex flex-col h-full gap-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
            {brand.logo ? (
              <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover rounded-2xl" loading="lazy" />
            ) : (
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                {brand.name[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-lg leading-tight group-hover:text-pink-400 transition-colors" data-testid={`text-brand-name-${brand.id}`}>
              {brand.name}
            </h3>
            {brand.industry && (
              <p className="text-sm text-muted-foreground" data-testid={`text-brand-industry-${brand.id}`}>{brand.industry}</p>
            )}
            {(brand as any).location && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 text-pink-500" />
                {(brand as any).location}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {brand.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
            {brand.description}
          </p>
        )}

        {/* Niches */}
        {brand.niches && brand.niches.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {brand.niches.slice(0, 4).map((niche) => (
              <Badge key={niche} variant="secondary" className="text-xs border border-white/10 bg-card/50">
                {niche}
              </Badge>
            ))}
            {brand.niches.length > 4 && (
              <Badge variant="outline" className="text-xs border-white/10">+{brand.niches.length - 4}</Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
          <div className="flex gap-2">
            {links.instagram && (
              <a href={links.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-pink-500 transition-colors" data-testid={`link-brand-instagram-${brand.id}`}>
                <SiInstagram className="h-4 w-4" />
              </a>
            )}
            {links.twitter && (
              <a href={links.twitter} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" data-testid={`link-brand-twitter-${brand.id}`}>
                <SiX className="h-4 w-4" />
              </a>
            )}
            {links.facebook && (
              <a href={links.facebook} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-blue-500 transition-colors" data-testid={`link-brand-facebook-${brand.id}`}>
                <SiFacebook className="h-4 w-4" />
              </a>
            )}
          </div>
          <div className="flex gap-2 items-center">
            {brand.website && (
              <a
                href={brand.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-pink-500 transition-colors"
                data-testid={`link-brand-website-${brand.id}`}
              >
                <Globe className="h-3.5 w-3.5" />
                Website
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <Link href="/campaigns">
              <Button variant="outline" size="sm" className="h-7 text-xs border-white/10 hover:border-pink-500/30 hover:text-pink-400" data-testid={`button-brand-campaigns-${brand.id}`}>
                <Megaphone className="h-3 w-3 mr-1" />
                Campaigns
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
