import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { SchemaMarkup } from "@/components/SchemaMarkup";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react";
import { BLOG_POSTS, BlogPost as BlogPostType } from "./Blog";
import { trackCTAClick } from "@/lib/analytics";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const CATEGORY_COLORS: Record<string, string> = {
  "UGC Marketing": "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "Creator Tips": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "TikTok Ads": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Meta Ads": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Shopify Marketing": "bg-green-500/20 text-green-300 border-green-500/30",
  "Creator Economy": "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

function generateArticleContent(post: BlogPostType): React.ReactNode {
  const sections: Record<string, { heading: string; body: string[] }[]> = {
    "how-to-become-ugc-creator-canada": [
      {
        heading: "What is UGC and Why is it Booming in Canada?",
        body: [
          "User-Generated Content (UGC) refers to authentic content created by real people — not agencies or brands. It includes product reviews, unboxing videos, tutorials, lifestyle shots, and short-form videos that feel genuine and relatable.",
          "Brands prefer UGC because it converts 3-4x better than polished brand content. Canadian brands on TikTok and Meta are pouring ad budgets into UGC-style content, and they need creators to make it.",
          "The Canadian UGC market is growing rapidly. With a population of 38 million, strong bilingual communities, and high social media adoption rates, Canadian creators are in high demand — and that demand is outpacing supply.",
        ],
      },
      {
        heading: "Step 1: Choose Your Niche",
        body: [
          "The most successful UGC creators specialize. Niches that pay well in Canada include: fitness and wellness, beauty and skincare, tech and gadgets, food and beverage, lifestyle and home, and fashion.",
          "Pick a niche you can produce content about consistently. Brands want creators who understand their audience — not someone who does everything.",
          "Canadian niches with especially high brand demand: outdoor and adventure (REI, Canada Goose, Mountain Equipment Company), health and wellness (Herbalife, Garden of Life), and beauty (The Ordinary, CeraVe, Drunk Elephant).",
        ],
      },
      {
        heading: "Step 2: Build a Portfolio (Even Without Brand Deals)",
        body: [
          "You don't need brand deals to build a portfolio. Create spec content — UGC-style videos for products you already own. Treat it as if you were hired by the brand.",
          "Aim for 5-10 strong portfolio pieces across different content types: product review, unboxing, tutorial, and lifestyle.",
          "Record in good lighting, use your phone (it looks more authentic), and focus on the hook — the first 2-3 seconds that grab attention.",
        ],
      },
      {
        heading: "Step 3: Set Your Rates",
        body: [
          "Canadian UGC rates in 2026 range from $75 for beginners to $500+ for experienced creators per piece. Use the TrueNorthUGC Rate Calculator to find the right price for your experience level and content type.",
          "Starting out: $75–$150 per video is fair for beginners. After 5-10 completed deals: $150–$250. Pro creators with proven conversion results: $250–$500+.",
          "Always charge separately for usage rights if a brand wants to use your content in paid ads. Organic-only rights are standard — paid ads usage should cost 30-100% more.",
        ],
      },
      {
        heading: "Step 4: List on TrueNorthUGC",
        body: [
          "Create a free creator profile on TrueNorthUGC. Fill in your niche, location, bio, portfolio videos, and rate card. The more complete your profile, the more visibility you get.",
          "Canadian brands actively search for creators by city, niche, and experience level. A complete profile in a high-demand niche will start receiving inquiries within days.",
          "Respond quickly to brand messages. Speed and professionalism are what separate working creators from those still waiting for their first deal.",
        ],
      },
      {
        heading: "Step 5: Deliver and Scale",
        body: [
          "Your first deal is the hardest. After that, if you deliver quality work on time, brands come back. Many UGC creators earn 60-80% of their income from repeat clients.",
          "Ask satisfied brands for reviews on your profile. Social proof accelerates everything.",
          "Once you have 10+ completed campaigns, you can increase your rates, get selective about clients, and potentially earn $2,000–$5,000/month as a part-time Canadian UGC creator.",
        ],
      },
    ],
    "best-ugc-platform-canada": [
      {
        heading: "What to Look For in a UGC Platform",
        body: [
          "Not all UGC platforms are equal for Canadian brands and creators. Key factors to evaluate: creator pool size and quality, Canadian creator presence, payment transparency, platform fees, campaign management tools, and review/rating systems.",
          "Many US-based platforms have few Canadian creators and don't understand the Canadian market nuances — bilingual content, Canadian cultural references, Canadian consumer behaviour.",
        ],
      },
      {
        heading: "TrueNorthUGC — Canada's Dedicated Platform",
        body: [
          "TrueNorthUGC is the only UGC marketplace built exclusively for the Canadian market. Every creator on the platform is Canadian, understands Canadian culture, and can create content that resonates with Canadian audiences.",
          "Key advantages: Canadian-only creator pool, transparent rate cards on every profile, direct brand-creator messaging, campaign management tools, and a 20% platform fee (80% goes to creators).",
          "Best for: Canadian brands that want genuine Canadian content and fast turnaround. Rates are market-competitive and fully transparent.",
        ],
      },
      {
        heading: "Global Platforms vs. Canadian-Specific",
        body: [
          "Global platforms like Billo, Trend.io, and others have large creator pools but Canadian creators are a small fraction. You may get matched with US creators who don't understand the Canadian market.",
          "For Canadian brands running campaigns targeting Canadian consumers, working with Canadian creators on a Canada-specific platform produces better results — the content feels authentic to the audience.",
          "For pure volume at low cost, global platforms can make sense. For quality and Canadian relevance, TrueNorthUGC is the stronger choice.",
        ],
      },
    ],
    "ugc-pricing-canada-2026": [
      {
        heading: "What Affects UGC Pricing in Canada?",
        body: [
          "Several factors directly impact UGC content pricing: creator experience level, content type and complexity, platform (YouTube requires more production time than TikTok), usage rights (organic vs. paid ads), turnaround time, exclusivity, and quantity.",
          "The biggest variable is usage rights. A creator might charge $150 for a TikTok video for organic posting, but $300 for the same video with paid ads usage for 90 days.",
        ],
      },
      {
        heading: "2026 UGC Rates by Experience Level",
        body: [
          "Beginner creators (0-1 year): $75-$150 per piece. Good for low-budget campaigns and brands willing to coach creators. Quality varies, but great value for volume.",
          "Intermediate creators (1-3 years): $150-$300 per piece. The sweet spot for most Canadian brands. Proven portfolio, consistent quality, reliable delivery.",
          "Pro creators (3-5 years): $250-$500 per piece. High-converting content, minimal direction needed, often repeat clients at premium rates.",
          "Elite creators (5+ years): $400-$1,000+ per piece. Reserved for premium campaigns where conversion quality is critical.",
        ],
      },
      {
        heading: "Platform-Specific Pricing",
        body: [
          "TikTok UGC videos: $90-$400 depending on creator level. Most in-demand format in 2026.",
          "Instagram Reels: $100-$440. Slightly premium over TikTok due to Instagram's audience quality.",
          "YouTube videos/shorts: $130-$520. Highest rates due to longer production time and higher-value audience.",
          "Product photography: $50-$200 per shot. Often bundled with video packages.",
        ],
      },
      {
        heading: "How to Budget for a UGC Campaign",
        body: [
          "For a solid test campaign: budget $500-$1,500 for 3-5 pieces of content. This gives you enough creative variants to test in ads.",
          "For a scaling campaign: budget $2,000-$5,000/month for consistent content production at quality.",
          "Always build 20-30% buffer for revisions, additional usage rights, or repurposing across platforms.",
          "Use the TrueNorthUGC Rate Calculator to get precise estimates based on your specific requirements.",
        ],
      },
    ],
  };

  const content = sections[post.slug];

  if (content) {
    return (
      <div className="prose prose-invert prose-lg max-w-none">
        {content.map((section, i) => (
          <div key={i} className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">{section.heading}</h2>
            {section.body.map((para, j) => (
              <p key={j} className="text-white/70 leading-relaxed mb-4">{para}</p>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="prose prose-invert prose-lg max-w-none">
      <p className="text-white/70 leading-relaxed mb-6">
        {post.description}
      </p>
      <p className="text-white/70 leading-relaxed mb-6">
        The Canadian UGC market continues to grow rapidly in 2026. Brands are investing more in authentic creator content
        for TikTok, Meta, and Shopify storefronts — and Canadian creators are at the forefront of this shift.
      </p>
      <h2 className="text-2xl font-bold text-white mb-4">Why This Matters for Canadian Brands</h2>
      <p className="text-white/70 leading-relaxed mb-6">
        Canadian consumers respond better to content from Canadian creators. The cultural references, tone, and
        authenticity resonate in a way that US-produced content simply cannot replicate. For brands targeting
        Canadian audiences, working with Canadian UGC creators is a strategic advantage.
      </p>
      <h2 className="text-2xl font-bold text-white mb-4">Getting Started</h2>
      <p className="text-white/70 leading-relaxed mb-6">
        Whether you're a brand looking for creators or a creator looking for your next deal, TrueNorthUGC connects
        you directly with verified Canadian partners. Browse creator profiles, view portfolios, check transparent rate
        cards, and message creators directly — no agency middleman required.
      </p>
    </div>
  );
}

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "";

  const post = BLOG_POSTS.find((p) => p.slug === slug);
  const related = BLOG_POSTS.filter((p) => p.slug !== slug && p.category === post?.category).slice(0, 3);

  usePageMeta({
    title: post ? `${post.title} — TrueNorthUGC Blog` : "Article Not Found — TrueNorthUGC",
    description: post?.description || "UGC marketing insights from Canada's leading UGC creator marketplace.",
    keywords: post?.keywords.join(", ") || "",
    canonicalUrl: post ? `https://www.truenorthugc.com/blog/${post.slug}` : undefined,
  });

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto max-w-3xl px-4 pt-40 text-center">
          <h1 className="text-3xl font-black text-white mb-4">Article Not Found</h1>
          <Link href="/blog">
            <Button variant="outline" className="border-white/20 text-white">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SchemaMarkup
        schema={{
          type: "Organization",
          data: {
            name: post.title,
            url: `https://www.truenorthugc.com/blog/${post.slug}`,
            description: post.description,
          },
        }}
      />
      <Navbar />

      <article className="pt-32 pb-24 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
            <nav className="flex items-center gap-2 text-sm text-white/40">
              <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white/70 transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-white/60 truncate">{post.title}</span>
            </nav>
          </motion.div>

          {/* Header */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="mb-12"
          >
            <motion.div variants={fadeUp}>
              <Badge className={`mb-4 ${CATEGORY_COLORS[post.category] || "bg-white/10 text-white/60"}`}>
                {post.category}
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                {post.title}
              </h1>
              <p className="text-lg text-white/60 leading-relaxed mb-6">{post.description}</p>
              <div className="flex items-center gap-4 text-sm text-white/40 pb-8 border-b border-white/10">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{post.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{post.readTime}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            {generateArticleContent(post)}
          </motion.div>

          {/* Inline CTA */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="my-12 rounded-2xl border border-pink-500/30 bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-8 text-center"
          >
            <h3 className="text-xl font-bold text-white mb-2">Ready to Find Canadian UGC Creators?</h3>
            <p className="text-white/60 mb-6 text-sm">Browse verified creators with transparent rates. Direct access, no agency fees.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/creators" onClick={() => trackCTAClick("find_creators_blog_inline", `blog_${slug}`)}>
                <Button className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 border-0 font-bold" data-testid="button-find-creators-blog">
                  Browse Creators <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/tools/ugc-rate-calculator">
                <Button variant="outline" className="rounded-xl border-white/20 text-white">
                  Rate Calculator
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Related */}
          {related.length > 0 && (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-16"
            >
              <motion.h2 variants={fadeUp} className="text-2xl font-black text-white mb-6">
                Related Articles
              </motion.h2>
              <motion.div variants={stagger} className="grid sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <motion.div key={r.slug} variants={fadeUp}>
                    <Link href={`/blog/${r.slug}`}>
                      <div className="group rounded-xl border border-white/10 bg-white/5 hover:border-pink-500/30 transition-all p-4 h-full cursor-pointer">
                        <Badge className={`mb-2 text-xs ${CATEGORY_COLORS[r.category] || "bg-white/10 text-white/60"}`}>
                          {r.category}
                        </Badge>
                        <h3 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors leading-snug">
                          {r.title}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Back */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-12">
            <Link href="/blog">
              <Button variant="ghost" className="text-white/60 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Button>
            </Link>
          </motion.div>
        </div>
      </article>
    </div>
  );
}
