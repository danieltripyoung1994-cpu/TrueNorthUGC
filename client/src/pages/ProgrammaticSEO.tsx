import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { usePageMeta } from "@/hooks/use-page-meta";
import { SchemaMarkup } from "@/components/SchemaMarkup";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCreators } from "@/hooks/use-creators";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Users, Star, Sparkles, CheckCircle, Search } from "lucide-react";
import { PageTransition } from "@/components/ui/page-transition";
import { CardSkeleton } from "@/components/ui/skeleton-loaders";
import { CreatorCard } from "@/components/CreatorCard";

const HIRE_PAGES: Record<string, { name: string; subtitle: string; description: string; keywords: string[] }> = {
  "ugc-creators": {
    name: "UGC Creators",
    subtitle: "Hire UGC Creators in Canada",
    description: "Find and hire vetted Canadian UGC creators for product videos, brand content, and social media campaigns.",
    keywords: ["hire ugc creators canada", "ugc creators for hire", "canadian ugc creator marketplace"],
  },
  "tiktok-creators": {
    name: "TikTok Creators",
    subtitle: "Hire TikTok UGC Creators in Canada",
    description: "Connect with top Canadian TikTok creators for high-converting short-form video content and TikTok ad campaigns.",
    keywords: ["hire tiktok creators canada", "tiktok ugc canada", "tiktok content creators canada"],
  },
  "meta-ad-creators": {
    name: "Meta Ad Creators",
    subtitle: "Hire Meta Ad UGC Creators in Canada",
    description: "Find Canadian creators who produce high-converting UGC for Facebook and Instagram ad campaigns.",
    keywords: ["hire meta ad creators canada", "facebook ugc creators", "instagram ugc creators canada"],
  },
  "canadian-creators": {
    name: "Canadian Creators",
    subtitle: "Hire Authentic Canadian Content Creators",
    description: "The only marketplace exclusively for Canadian UGC creators. Find creators who understand the Canadian market.",
    keywords: ["hire canadian creators", "canadian content creators", "canada ugc marketplace"],
  },
  "shopify-creators": {
    name: "Shopify UGC Creators",
    subtitle: "Hire UGC Creators for Shopify Brands",
    description: "Find Canadian UGC creators who specialize in product content for Shopify stores — unboxing, reviews, and tutorials.",
    keywords: ["shopify ugc creators canada", "hire ugc creators shopify", "ecommerce ugc canada"],
  },
  "beauty-creators": {
    name: "Beauty UGC Creators",
    subtitle: "Hire Canadian Beauty & Skincare UGC Creators",
    description: "Connect with top Canadian beauty, makeup, and skincare content creators for brand-authentic UGC campaigns.",
    keywords: ["beauty ugc creators canada", "hire beauty creators", "skincare ugc creators canada"],
  },
  "fitness-creators": {
    name: "Fitness UGC Creators",
    subtitle: "Hire Canadian Fitness & Wellness UGC Creators",
    description: "Find fitness and wellness UGC creators in Canada for gym, supplement, and health brand campaigns.",
    keywords: ["fitness ugc creators canada", "hire fitness creators", "wellness ugc canada"],
  },
};

const CITIES: Record<string, { name: string; province: string; population: string; description: string }> = {
  toronto: { name: "Toronto", province: "Ontario", population: "6.2M", description: "Canada's largest city and hub for content creators, influencers, and digital marketing." },
  vancouver: { name: "Vancouver", province: "British Columbia", population: "2.6M", description: "West Coast creative hub with thriving film, lifestyle, and tech creator communities." },
  montreal: { name: "Montreal", province: "Quebec", population: "4.3M", description: "Bilingual creative capital with unique fashion, food, and arts scene." },
  calgary: { name: "Calgary", province: "Alberta", population: "1.6M", description: "Growing creator economy in fitness, outdoor, and Western lifestyle content." },
  edmonton: { name: "Edmonton", province: "Alberta", population: "1.1M", description: "Emerging tech and gaming creator hub with strong community support." },
  ottawa: { name: "Ottawa", province: "Ontario", population: "1.4M", description: "Government and tech-adjacent creators with strong lifestyle content." },
  winnipeg: { name: "Winnipeg", province: "Manitoba", population: "0.8M", description: "Up-and-coming creator scene with affordable living costs." },
};

const NICHES: Record<string, { name: string; description: string; keywords: string[] }> = {
  fitness: { name: "Fitness", description: "Workout, wellness, and healthy lifestyle content creators.", keywords: ["gym", "workout", "wellness", "health"] },
  beauty: { name: "Beauty", description: "Makeup, skincare, and fashion content creators.", keywords: ["makeup", "skincare", "cosmetics", "fashion"] },
  tech: { name: "Tech", description: "Technology reviews, tutorials, and gadget content creators.", keywords: ["gadgets", "reviews", "tutorials", "apps"] },
  travel: { name: "Travel", description: "Travel, adventure, and destination content creators.", keywords: ["adventure", "destinations", "hotels", "explore"] },
  food: { name: "Food", description: "Food, cooking, and restaurant review content creators.", keywords: ["cooking", "recipes", "restaurants", "foodie"] },
  fashion: { name: "Fashion", description: "Style, clothing, and trend content creators.", keywords: ["style", "clothing", "outfits", "trends"] },
  lifestyle: { name: "Lifestyle", description: "General lifestyle, vlog, and day-in-the-life content creators.", keywords: ["vlog", "day-in-life", "home", "routine"] },
  gaming: { name: "Gaming", description: "Gaming, esports, and streamer content creators.", keywords: ["esports", "streaming", "gameplay", "reviews"] },
};

const FAQS: Array<{ question: string; answer: string }> = [
  {
    question: "What is UGC and why does my brand need it?",
    answer: "User-Generated Content (UGC) is authentic content created by real people, not brands. It builds trust, increases engagement, and converts 3-4x better than polished brand content.",
  },
  {
    question: "How do I hire a Canadian UGC creator?",
    answer: "Browse our creator directory, filter by niche and location, view portfolios, and message creators directly. Or post a campaign and let creators apply to you.",
  },
  {
    question: "How much does UGC content cost in Canada?",
    answer: "Rates vary by creator experience and deliverables. Most Canadian creators charge $100-$1,000 per piece. Our platform includes transparent rate cards on every profile.",
  },
  {
    question: "What platforms do Canadian creators work on?",
    answer: "TikTok, Instagram, YouTube, Facebook, and Twitter. Many creators are multi-platform and can adapt content for any channel.",
  },
  {
    question: "How long does it take to get UGC content?",
    answer: "Most creators deliver within 3-7 days of campaign approval. Rush delivery is available for an additional fee.",
  },
  {
    question: "Do you handle content rights and licensing?",
    answer: "Yes. Our campaign system includes usage rights configuration — brands specify exactly how they can use the content and for how long.",
  },
];

export default function ProgrammaticSEO() {
  const params = useParams();
  const [location] = useLocation();
  const slug = params?.slug || "";
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Determine page type from URL path
  const isCity = location.startsWith("/city/");
  const isNiche = location.startsWith("/niche/");
  const isHire = location.startsWith("/hire/");

  const cityData = isCity ? CITIES[slug] : null;
  const nicheData = isNiche ? NICHES[slug] : null;
  const hireData = isHire ? HIRE_PAGES[slug] : null;

  const data = cityData || nicheData || hireData;
  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Page not found</h1>
          <p className="text-muted-foreground mt-2">This SEO landing page doesn't exist.</p>
        </main>
      </div>
    );
  }

  const pageTitle = isCity
    ? `Hire UGC Creators in ${cityData!.name} | Canadian Content Creators | TrueNorthUGC`
    : isNiche
    ? `Hire ${nicheData!.name} UGC Creators Canada | ${nicheData!.name} Content Creators | TrueNorthUGC`
    : `${hireData!.subtitle} | TrueNorthUGC`;

  const pageDescription = isCity
    ? `Find top UGC creators in ${cityData!.name}, ${cityData!.province}. Browse portfolios, view rates, and hire authentic Canadian content creators for your brand campaigns.`
    : isNiche
    ? `Find the best ${nicheData!.name} UGC creators in Canada. Browse portfolios, view rates, and hire authentic Canadian content creators for your brand campaigns.`
    : hireData!.description;

  const pageKeywords = isCity
    ? `${cityData!.name} UGC creators, hire creators ${cityData!.name}, Canadian content creators ${cityData!.province}, UGC marketing ${cityData!.name}, influencer ${cityData!.name}`
    : isNiche
    ? `${nicheData!.name} UGC creators, hire ${nicheData!.name} creators, Canadian ${nicheData!.name} influencers, ${nicheData!.keywords.join(", ")} content creator`
    : hireData!.keywords.join(", ");

  const canonicalPath = isCity ? `/city/${slug}` : isNiche ? `/niche/${slug}` : `/hire/${slug}`;

  usePageMeta({
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    canonicalPath,
  });

  // Fetch creators filtered by niche (for niche and hire-niche pages)
  const filterNiche = isNiche ? nicheData!.name : (isHire && hireData!.name.includes("Beauty")) ? "Beauty" : (isHire && hireData!.name.includes("Fitness")) ? "Fitness" : undefined;
  const { data: creators, isLoading } = useCreators(filterNiche ? { niche: filterNiche } : undefined);

  // Filter by location for city pages
  const filteredCreators = isCity && creators
    ? creators.filter((c) => c.location?.toLowerCase().includes(cityData!.name.toLowerCase()) || c.location?.toLowerCase().includes(cityData!.province.toLowerCase()))
    : creators;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <SchemaMarkup
          schema={{
            type: "CollectionPage",
            data: {
              name: pageTitle,
              url: `https://www.truenorthugc.com${canonicalPath}`,
              description: pageDescription,
              itemList: filteredCreators?.slice(0, 10).map((c) => ({
                name: c.name,
                url: `https://www.truenorthugc.com/creators/${c.handle}`,
                description: c.bio || "Canadian UGC creator",
                image: c.profileImage || undefined,
              })),
            },
          }}
        />

        <SchemaMarkup
          schema={{
            type: "FAQPage",
            data: {
              questions: FAQS,
            },
          }}
        />

        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 via-purple-500/5 to-transparent" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge className="mb-4 bg-pink-500/10 text-pink-400 border-pink-500/20 hover:bg-pink-500/20">
                <MapPin className="w-3 h-3 mr-1" />
                {isCity ? `${cityData!.name}, ${cityData!.province}` : isNiche ? nicheData!.name : "Canada"}
              </Badge>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
                {isCity ? (
                  <>
                    Hire UGC Creators
                    <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">
                      in {cityData!.name}
                    </span>
                  </>
                ) : isNiche ? (
                  <>
                    Hire {nicheData!.name}
                    <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">
                      UGC Creators
                    </span>
                  </>
                ) : (
                  <>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">
                      {hireData!.subtitle}
                    </span>
                  </>
                )}
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                {isCity
                  ? `Connect with ${cityData!.population} metro area's top UGC creators. ${cityData!.description} Find creators for TikTok, Instagram, and Meta ads.`
                  : isNiche
                  ? `Find the best ${nicheData!.name.toLowerCase()} UGC creators in Canada. ${nicheData!.description} Browse portfolios, rates, and hire in minutes.`
                  : hireData!.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/creators">
                  <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl px-8">
                    <Search className="w-4 h-4 mr-2" />
                    Browse All Creators
                  </Button>
                </Link>
                <Link href="/campaigns">
                  <Button size="lg" variant="outline" className="rounded-xl border-pink-500/30 hover:border-pink-500/60 px-8">
                    View Campaigns
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-6 mt-10">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4 text-pink-400" />
                  <span>{filteredCreators?.length || 0}+ creators</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-purple-400" />
                  <span>Vetted & reviewed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  <span>Transparent rates</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Creators Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="w-5 h-5 text-pink-400" />
              <h2 className="text-2xl font-bold">
                {isCity ? `Top Creators in ${cityData!.name}` : isNiche ? `Top ${nicheData!.name} Creators` : `Top UGC Creators`}
              </h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : filteredCreators && filteredCreators.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCreators.map((creator) => (
                  <CreatorCard key={creator.userId} creator={creator} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {isCity
                    ? `No creators found in ${cityData!.name} yet. Be the first to join!`
                    : isNiche
                    ? `No ${nicheData!.name} creators found yet. Check back soon!`
                    : `No creators found yet. Check back soon!`}
                </p>
                <Link href="/creators">
                  <Button variant="outline" className="rounded-xl">
                    Browse All Creators
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Why TrueNorthUGC */}
        <section className="py-16 bg-gradient-to-b from-card/50 to-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
              Why Brands Choose TrueNorthUGC
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Users className="w-6 h-6 text-pink-400" />,
                  title: "Vetted Creators",
                  desc: "Every creator is verified with real portfolio reviews and ratings.",
                },
                {
                  icon: <CheckCircle className="w-6 h-6 text-purple-400" />,
                  title: "Transparent Pricing",
                  desc: "Clear rate cards on every profile. No hidden fees or surprises.",
                },
                {
                  icon: <Star className="w-6 h-6 text-cyan-400" />,
                  title: "Secure Payments",
                  desc: "PayPal-integrated payments with 80% going directly to creators.",
                },
              ].map((item, i) => (
                <Card key={i} className="border border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="border border-white/10 rounded-xl overflow-hidden bg-white/5"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full text-left p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <span className="font-medium text-sm pr-4">{faq.question}</span>
                    <span className="text-lg text-muted-foreground shrink-0">
                      {activeFaq === i ? "−" : "+"}
                    </span>
                  </button>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-cyan-500/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Find Your Perfect Creator?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of Canadian brands using TrueNorthUGC for authentic, high-converting user-generated content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/creators">
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl px-8">
                  Browse All Creators
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/campaigns">
                <Button size="lg" variant="outline" className="rounded-xl border-white/20 px-8">
                  View Campaigns
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer links */}
        <section className="py-12 border-t border-white/10">
          <div className="container mx-auto px-4">
            <h3 className="font-bold text-sm mb-4 text-muted-foreground">Related Searches</h3>
            <div className="flex flex-wrap gap-2">
              {(isCity ? Object.keys(NICHES) : isNiche ? Object.keys(CITIES) : Object.keys(NICHES)).map((key) => (
                <Link
                  key={key}
                  href={isCity ? `/niche/${key}` : isNiche ? `/city/${key}` : `/hire/${key}-creators`}
                  className="text-sm text-muted-foreground hover:text-pink-400 transition-colors underline-offset-2 hover:underline"
                >
                  {isCity ? `Hire ${NICHES[key].name} Creators` : isNiche ? `UGC Creators in ${CITIES[key].name}` : NICHES[key]?.name ? `Hire ${NICHES[key].name} Creators` : key}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
