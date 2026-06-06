import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SchemaMarkup } from "@/components/SchemaMarkup";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Calculator, DollarSign, TrendingUp, Info, ArrowRight, CheckCircle } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

type Platform = "tiktok" | "instagram" | "youtube" | "facebook";
type ContentType = "ugc_video" | "story" | "reel" | "product_review" | "unboxing" | "tutorial";
type ExperienceLevel = "beginner" | "intermediate" | "pro" | "elite";
type UsageRights = "organic_only" | "paid_ads_30" | "paid_ads_90" | "perpetual";

const PLATFORM_MULTIPLIERS: Record<Platform, number> = {
  tiktok: 1.0,
  instagram: 1.1,
  youtube: 1.4,
  facebook: 0.9,
};

const CONTENT_BASE: Record<ContentType, number> = {
  ugc_video: 150,
  story: 75,
  reel: 175,
  product_review: 200,
  unboxing: 225,
  tutorial: 250,
};

const EXPERIENCE_MULTIPLIERS: Record<ExperienceLevel, number> = {
  beginner: 0.6,
  intermediate: 1.0,
  pro: 1.6,
  elite: 2.4,
};

const USAGE_MULTIPLIERS: Record<UsageRights, number> = {
  organic_only: 1.0,
  paid_ads_30: 1.3,
  paid_ads_90: 1.6,
  perpetual: 2.0,
};

const PLATFORM_LABELS: Record<Platform, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  youtube: "YouTube",
  facebook: "Facebook",
};

const CONTENT_LABELS: Record<ContentType, string> = {
  ugc_video: "UGC Video",
  story: "Story / Short",
  reel: "Reel",
  product_review: "Product Review",
  unboxing: "Unboxing",
  tutorial: "Tutorial",
};

const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  beginner: "Beginner (0–1 yr)",
  intermediate: "Intermediate (1–3 yrs)",
  pro: "Pro (3–5 yrs)",
  elite: "Elite (5+ yrs)",
};

const USAGE_LABELS: Record<UsageRights, string> = {
  organic_only: "Organic Only",
  paid_ads_30: "Paid Ads (30 days)",
  paid_ads_90: "Paid Ads (90 days)",
  perpetual: "Perpetual / Unlimited",
};

function SelectGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  tooltip,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  tooltip?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-white font-semibold text-sm">{label}</label>
        {tooltip && (
          <span className="text-white/40 text-xs cursor-help" title={tooltip}>
            <Info className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              value === opt.value
                ? "bg-gradient-to-r from-pink-500 to-purple-600 border-transparent text-white shadow-lg shadow-pink-500/20"
                : "border-white/10 bg-white/5 text-white/70 hover:border-pink-500/40 hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function UGCRateCalculator() {
  usePageMeta({
    title: "UGC Rate Calculator Canada 2026 — Free Pricing Tool | TrueNorthUGC",
    description:
      "Calculate fair UGC creator rates in Canada. Free tool for brands and creators to estimate pricing for TikTok videos, Instagram reels, product reviews, and more. Updated for 2026.",
    keywords:
      "UGC rate calculator Canada, UGC pricing Canada, how much does UGC cost Canada, UGC creator rates 2026, TikTok UGC pricing, Canadian creator rates",
    canonicalUrl: "https://www.truenorthugc.com/tools/ugc-rate-calculator",
  });

  const [platform, setPlatform] = useState<Platform>("tiktok");
  const [contentType, setContentType] = useState<ContentType>("ugc_video");
  const [experience, setExperience] = useState<ExperienceLevel>("intermediate");
  const [usageRights, setUsageRights] = useState<UsageRights>("organic_only");
  const [quantity, setQuantity] = useState(1);

  const baseRate = CONTENT_BASE[contentType];
  const rate =
    baseRate *
    PLATFORM_MULTIPLIERS[platform] *
    EXPERIENCE_MULTIPLIERS[experience] *
    USAGE_MULTIPLIERS[usageRights];

  const low = Math.round(rate * 0.8);
  const mid = Math.round(rate);
  const high = Math.round(rate * 1.3);
  const totalLow = low * quantity;
  const totalHigh = high * quantity;

  const platformFee = Math.round(mid * 0.2);
  const creatorPayout = mid - platformFee;

  const faqs = [
    {
      question: "How much do UGC creators charge in Canada?",
      answer:
        "Canadian UGC creators typically charge $75–$500+ per piece depending on content type, experience, platform, and usage rights. Beginner creators may charge $75–$150, while pro/elite creators charge $250–$1,000+.",
    },
    {
      question: "What affects UGC pricing in Canada?",
      answer:
        "Key factors: creator experience level, content type (video vs. story), platform (YouTube pays more than TikTok), usage rights (paid ads cost more than organic), quantity, turnaround time, and exclusivity requirements.",
    },
    {
      question: "How much does a TikTok UGC video cost?",
      answer:
        "A TikTok UGC video from a Canadian creator typically costs $90–$400. Beginner creators charge $90–$150, intermediate $150–$250, pro $240–$400, and elite creators $360–$600+.",
    },
    {
      question: "Do I pay more for paid ads usage rights?",
      answer:
        "Yes. If you want to run the content as paid ads, expect to pay 30–100% more depending on ad duration. A piece for organic only might cost $150, while paid ads usage for 90 days could cost $240.",
    },
    {
      question: "What is a fair UGC rate for a brand?",
      answer:
        "A fair rate covers the creator's time, equipment, editing, and gives you clear usage rights. Budget $100–$300 per piece for most Canadian creators. Volume deals can reduce per-piece cost by 15–25%.",
    },
    {
      question: "How do I find Canadian UGC creators?",
      answer:
        "Browse TrueNorthUGC's creator directory to find vetted Canadian creators filtered by niche, location, experience, and rate. All creator profiles include transparent rate cards.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SchemaMarkup
        schema={{
          type: "FAQPage",
          data: { questions: faqs },
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-cyan-500/10 pointer-events-none" />
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp}>
              <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/40 text-white text-sm font-semibold">
                <Calculator className="h-4 w-4 mr-2 inline" /> Free Tool
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
                UGC Rate Calculator<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">
                  Canada 2026
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                Instantly calculate fair UGC creator rates for any platform, content type, and usage rights.
                Built for Canadian brands and creators.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Calculator */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="lg:col-span-2">
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8 space-y-8">
                  <SelectGroup
                    label="Platform"
                    value={platform}
                    onChange={setPlatform}
                    options={Object.entries(PLATFORM_LABELS).map(([v, l]) => ({ value: v as Platform, label: l }))}
                    tooltip="The platform where the content will be posted"
                  />
                  <SelectGroup
                    label="Content Type"
                    value={contentType}
                    onChange={setContentType}
                    options={Object.entries(CONTENT_LABELS).map(([v, l]) => ({ value: v as ContentType, label: l }))}
                    tooltip="What type of content the creator will produce"
                  />
                  <SelectGroup
                    label="Creator Experience Level"
                    value={experience}
                    onChange={setExperience}
                    options={Object.entries(EXPERIENCE_LABELS).map(([v, l]) => ({ value: v as ExperienceLevel, label: l }))}
                    tooltip="Creator's experience directly impacts quality and rate"
                  />
                  <SelectGroup
                    label="Usage Rights"
                    value={usageRights}
                    onChange={setUsageRights}
                    options={Object.entries(USAGE_LABELS).map(([v, l]) => ({ value: v as UsageRights, label: l }))}
                    tooltip="Paid ads usage costs more than organic-only usage"
                  />
                  {/* Quantity */}
                  <div className="space-y-3">
                    <label className="text-white font-semibold text-sm">Number of Pieces</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 flex items-center justify-center text-xl font-bold transition-colors"
                      >
                        −
                      </button>
                      <span className="text-2xl font-black text-white w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(50, quantity + 1))}
                        className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 flex items-center justify-center text-xl font-bold transition-colors"
                      >
                        +
                      </button>
                      <span className="text-white/40 text-sm">pieces of content</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <motion.div
                key={`${platform}-${contentType}-${experience}-${usageRights}-${quantity}`}
                initial={{ scale: 0.97, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-sm">
                  <CardContent className="p-6 space-y-6">
                    <div className="text-center">
                      <div className="text-white/60 text-sm mb-2">Estimated Rate Per Piece</div>
                      <div className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
                        ${mid}
                      </div>
                      <div className="text-white/50 text-sm mt-1">CAD</div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/60">Low estimate</span>
                        <span className="text-white font-semibold">${low}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/60">Mid estimate</span>
                        <span className="text-pink-400 font-bold">${mid}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/60">High estimate</span>
                        <span className="text-white font-semibold">${high}</span>
                      </div>
                      {quantity > 1 && (
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <span className="text-white/60">Total ({quantity} pieces)</span>
                          <span className="text-cyan-400 font-bold">${totalLow}–${totalHigh}</span>
                        </div>
                      )}
                      <div className="pt-2 space-y-1 text-xs text-white/40">
                        <div className="flex justify-between">
                          <span>Creator receives (80%)</span>
                          <span>${creatorPayout}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Platform fee (20%)</span>
                          <span>${platformFee}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Tips */}
              <Card className="border-white/10 bg-white/5">
                <CardContent className="p-5 space-y-3">
                  <div className="text-white font-semibold text-sm">Pro Tips</div>
                  <div className="space-y-2 text-xs text-white/60">
                    <div className="flex gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Order 3+ pieces to negotiate volume discounts</span>
                    </div>
                    <div className="flex gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Specify usage rights upfront to avoid renegotiation</span>
                    </div>
                    <div className="flex gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>YouTube content costs more due to longer production time</span>
                    </div>
                    <div className="flex gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Always use written agreements for paid ads campaigns</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Link href="/creators" onClick={() => trackCTAClick("find_creators_calculator", "ugc_rate_calculator")}>
                <Button className="w-full py-5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 font-bold" data-testid="button-find-creators-calculator">
                  Find Creators at These Rates <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Benchmarks */}
      <section className="py-20 px-4 border-y border-white/10 bg-white/5">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-3xl font-black text-white mb-4">
                Canadian UGC Rate Benchmarks 2026
              </h2>
              <p className="text-white/60">Average market rates for Canadian UGC creators across platforms</p>
            </motion.div>
            <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { platform: "TikTok UGC Video", beginner: "$90", intermediate: "$150", pro: "$240", elite: "$360+" },
                { platform: "Instagram Reel", beginner: "$100", intermediate: "$165", pro: "$265", elite: "$400+" },
                { platform: "Product Review", beginner: "$120", intermediate: "$200", pro: "$320", elite: "$480+" },
                { platform: "YouTube Video", beginner: "$130", intermediate: "$215", pro: "$345", elite: "$520+" },
              ].map((row) => (
                <motion.div
                  key={row.platform}
                  variants={fadeUp}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="font-bold text-white mb-4 text-sm">{row.platform}</div>
                  <div className="space-y-2">
                    {[
                      { label: "Beginner", value: row.beginner },
                      { label: "Intermediate", value: row.intermediate },
                      { label: "Pro", value: row.pro },
                      { label: "Elite", value: row.elite },
                    ].map((tier) => (
                      <div key={tier.label} className="flex justify-between text-xs">
                        <span className="text-white/50">{tier.label}</span>
                        <span className="text-white font-medium">{tier.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <motion.p variants={fadeUp} className="text-center text-white/40 text-xs mt-6">
              * Rates are in CAD and represent per-piece pricing for organic-only usage rights.
              Add 30–100% for paid ads usage. Updated June 2026.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <h2 className="text-3xl font-black text-white">UGC Pricing FAQs</h2>
            </motion.div>
            <motion.div variants={stagger} className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <h3 className="font-bold text-white mb-2">{faq.question}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{faq.answer}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 border-t border-white/10 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-cyan-500/10">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fadeUp}>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Ready to Hire Canadian Creators?
              </h2>
              <p className="text-white/60 mb-8">
                Browse verified Canadian UGC creators with transparent rate cards.
                Pay the fair rate — direct, no hidden fees.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/creators" onClick={() => trackCTAClick("browse_creators_calculator_bottom", "ugc_rate_calculator")}>
                  <Button size="lg" className="px-8 py-6 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 font-bold text-lg" data-testid="button-browse-creators-calculator">
                    Browse Creators <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/pricing" onClick={() => trackCTAClick("view_pricing_calculator", "ugc_rate_calculator")}>
                  <Button size="lg" variant="outline" className="px-8 py-6 rounded-2xl border-white/20 hover:bg-white/10 text-white font-bold text-lg">
                    View Brand Plans
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
