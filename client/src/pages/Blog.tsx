import { Navbar } from "@/components/Navbar";
import { SchemaMarkup } from "@/components/SchemaMarkup";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  date: string;
  featured?: boolean;
  keywords: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-become-ugc-creator-canada",
    title: "How to Become a UGC Creator in Canada (2026 Complete Guide)",
    description: "Everything you need to know to start earning as a UGC content creator in Canada — from setting up your profile to landing your first paid brand deal.",
    category: "Creator Tips",
    readTime: "8 min read",
    date: "June 1, 2026",
    featured: true,
    keywords: ["how to become ugc creator canada", "ugc creator jobs canada", "ugc creator beginner guide"],
  },
  {
    slug: "best-ugc-platform-canada",
    title: "Best UGC Platforms in Canada 2026 — Compared",
    description: "Comparing the top UGC creator platforms available to Canadian brands and creators. Find out which platform gives you the best rates, fastest turnaround, and most Canadian creators.",
    category: "UGC Marketing",
    readTime: "6 min read",
    date: "May 28, 2026",
    featured: true,
    keywords: ["best ugc platform canada", "ugc marketplace canada", "ugc creator platform comparison"],
  },
  {
    slug: "ugc-pricing-canada-2026",
    title: "UGC Pricing in Canada 2026 — What Brands Should Budget",
    description: "A complete breakdown of UGC content pricing in Canada for 2026. Learn what to budget for TikTok UGC, Instagram reels, YouTube content, and more.",
    category: "UGC Marketing",
    readTime: "7 min read",
    date: "May 22, 2026",
    featured: true,
    keywords: ["ugc pricing canada", "how much does ugc cost canada", "ugc rates 2026"],
  },
  {
    slug: "hire-ugc-creators-tiktok-ads",
    title: "How to Hire UGC Creators for TikTok Ads That Actually Convert",
    description: "The step-by-step process for hiring Canadian UGC creators to produce TikTok ads. Includes what to look for, briefing templates, and what converts.",
    category: "TikTok Ads",
    readTime: "9 min read",
    date: "May 15, 2026",
    keywords: ["hire ugc creators tiktok", "tiktok ugc ads canada", "tiktok creator ads"],
  },
  {
    slug: "ugc-vs-influencer-marketing",
    title: "UGC vs Influencer Marketing — Which Is Better for Canadian Brands?",
    description: "A head-to-head comparison of user-generated content vs. influencer marketing for Canadian brands. Includes ROI data, conversion rates, and cost comparisons.",
    category: "UGC Marketing",
    readTime: "7 min read",
    date: "May 10, 2026",
    keywords: ["ugc vs influencer marketing", "ugc marketing canada", "ugc roi"],
  },
  {
    slug: "canadian-ugc-creators-shopify",
    title: "How Canadian Shopify Brands Use UGC to 3x Their Ad ROI",
    description: "Real strategies Canadian Shopify store owners use to leverage UGC content for product pages, ads, and email marketing. Includes creator brief templates.",
    category: "Shopify Marketing",
    readTime: "8 min read",
    date: "May 5, 2026",
    keywords: ["shopify ugc canada", "ugc for shopify brands", "canadian shopify ugc creators"],
  },
  {
    slug: "meta-ads-ugc-strategy-canada",
    title: "Meta Ads UGC Strategy for Canadian Brands in 2026",
    description: "How to structure a Meta (Facebook & Instagram) ads campaign using UGC content. Includes creative formats, targeting tips, and Canadian market insights.",
    category: "Meta Ads",
    readTime: "10 min read",
    date: "April 28, 2026",
    keywords: ["meta ads ugc canada", "facebook ugc ads", "instagram ugc strategy canada"],
  },
  {
    slug: "ugc-content-brief-template",
    title: "The Perfect UGC Content Brief Template (Free Download)",
    description: "Use this proven UGC content brief template to brief creators effectively. Includes all sections: hook, product showcase, CTA, tone, and usage rights.",
    category: "Creator Tips",
    readTime: "5 min read",
    date: "April 20, 2026",
    keywords: ["ugc content brief template", "how to brief ugc creator", "ugc brief example"],
  },
  {
    slug: "ugc-creator-rates-tiktok-instagram",
    title: "UGC Creator Rates for TikTok and Instagram in Canada",
    description: "Detailed breakdown of what Canadian UGC creators charge for TikTok videos and Instagram reels in 2026. Includes beginner, intermediate, and pro rates.",
    category: "Creator Economy",
    readTime: "6 min read",
    date: "April 15, 2026",
    keywords: ["ugc creator rates canada", "tiktok ugc rates", "instagram ugc rates canada"],
  },
  {
    slug: "how-to-find-ugc-creators-canada",
    title: "How to Find UGC Creators in Canada — 5 Best Methods",
    description: "The top 5 ways to find and hire vetted Canadian UGC creators for your brand campaigns. From marketplace platforms to social media sourcing.",
    category: "UGC Marketing",
    readTime: "6 min read",
    date: "April 8, 2026",
    keywords: ["find ugc creators canada", "hire canadian ugc creators", "ugc creator search canada"],
  },
];

const CATEGORIES = ["All", "UGC Marketing", "Creator Tips", "TikTok Ads", "Meta Ads", "Shopify Marketing", "Creator Economy"];

const CATEGORY_COLORS: Record<string, string> = {
  "UGC Marketing": "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "Creator Tips": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "TikTok Ads": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Meta Ads": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Shopify Marketing": "bg-green-500/20 text-green-300 border-green-500/30",
  "Creator Economy": "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

export default function Blog() {
  usePageMeta({
    title: "UGC Marketing Blog Canada — TrueNorthUGC",
    description:
      "Expert UGC marketing guides, creator tips, TikTok ad strategies, and Canadian creator economy insights. Learn from Canada's leading UGC marketplace.",
    keywords:
      "ugc marketing canada, ugc creator blog, tiktok ads canada, meta ads ugc, canadian creator economy, ugc tips",
    canonicalUrl: "https://www.truenorthugc.com/blog",
  });

  const featured = BLOG_POSTS.filter((p) => p.featured);
  const rest = BLOG_POSTS.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SchemaMarkup
        schema={{
          type: "CollectionPage",
          data: {
            name: "TrueNorthUGC Blog — UGC Marketing for Canadian Brands",
            description: "Expert UGC marketing guides, creator tips, TikTok ad strategies, and Canadian creator economy insights.",
            url: "https://www.truenorthugc.com/blog",
          },
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-cyan-500/10 pointer-events-none" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp}>
              <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/40 text-white text-sm font-semibold">
                UGC Insights & Strategies
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6">
                The UGC Marketing<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">
                  Blog for Canada
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto">
                Guides, strategies, and insights for Canadian brands and creators navigating
                the UGC content economy.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} className="text-2xl font-black text-white mb-8">
              Featured Articles
            </motion.h2>
            <motion.div variants={stagger} className="grid md:grid-cols-3 gap-6 mb-12">
              {featured.map((post) => (
                <motion.div key={post.slug} variants={fadeUp}>
                  <Link href={`/blog/${post.slug}`} onClick={() => trackCTAClick(`blog_post_${post.slug}`, "blog_featured")}>
                    <div className="group rounded-2xl border border-white/10 bg-white/5 hover:border-pink-500/30 hover:bg-white/8 transition-all h-full p-6 flex flex-col gap-4 cursor-pointer">
                      <Badge className={`w-fit text-xs ${CATEGORY_COLORS[post.category] || "bg-white/10 text-white/60"}`}>
                        {post.category}
                      </Badge>
                      <h3 className="font-bold text-white leading-snug group-hover:text-pink-300 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed flex-1">{post.description}</p>
                      <div className="flex items-center gap-3 text-xs text-white/40 pt-2 border-t border-white/10">
                        <span>{post.date}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.h2 variants={fadeUp} className="text-2xl font-black text-white mb-8">
              All Articles
            </motion.h2>
            <motion.div variants={stagger} className="space-y-4">
              {rest.map((post) => (
                <motion.div key={post.slug} variants={fadeUp}>
                  <Link href={`/blog/${post.slug}`} onClick={() => trackCTAClick(`blog_post_${post.slug}`, "blog_list")}>
                    <div className="group rounded-2xl border border-white/10 bg-white/5 hover:border-pink-500/30 transition-all p-6 cursor-pointer">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={`text-xs ${CATEGORY_COLORS[post.category] || "bg-white/10 text-white/60"}`}>
                              {post.category}
                            </Badge>
                            <span className="text-white/30 text-xs flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                          </div>
                          <h3 className="font-bold text-white group-hover:text-pink-300 transition-colors mb-1">
                            {post.title}
                          </h3>
                          <p className="text-white/50 text-sm">{post.description}</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-white/30 group-hover:text-pink-400 transition-colors flex-shrink-0" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-white/10 bg-gradient-to-br from-pink-500/10 to-purple-500/5">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fadeUp}>
              <h2 className="text-3xl font-black text-white mb-4">Ready to Get Started?</h2>
              <p className="text-white/60 mb-8">Connect with vetted Canadian UGC creators today.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/creators" onClick={() => trackCTAClick("browse_creators_blog", "blog_cta")}>
                  <Button size="lg" className="px-8 py-6 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 border-0 font-bold text-lg" data-testid="button-browse-creators-blog">
                    Browse Creators <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/tools/ugc-rate-calculator">
                  <Button size="lg" variant="outline" className="px-8 py-6 rounded-2xl border-white/20 hover:bg-white/10 text-white font-bold text-lg">
                    Try Rate Calculator
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
