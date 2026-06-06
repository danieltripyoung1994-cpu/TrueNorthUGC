import { Navbar } from "@/components/Navbar";
import { SchemaMarkup } from "@/components/SchemaMarkup";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { MapPin, Users, Briefcase, Heart, Star, ArrowRight, Shield, Zap, Globe } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function About() {
  usePageMeta({
    title: "About TrueNorthUGC — Canada's UGC Creator Marketplace",
    description:
      "Learn about TrueNorthUGC — the Canadian platform built to connect authentic UGC creators with brands. Our story, mission, and commitment to Canadian creators.",
    keywords: "about TrueNorthUGC, Canadian UGC marketplace, UGC creator platform Canada, Daniel Young TrueNorthUGC",
    canonicalUrl: "https://www.truenorthugc.com/about",
  });

  const values = [
    {
      icon: <Shield className="h-6 w-6 text-pink-500" />,
      title: "Vetted & Verified",
      description: "Every creator goes through a quality review. Brands only see creators who produce real, high-converting content.",
    },
    {
      icon: <Globe className="h-6 w-6 text-purple-500" />,
      title: "Canadian First",
      description: "Built specifically for the Canadian market. Our creators understand Canadian audiences, culture, and language nuances.",
    },
    {
      icon: <Zap className="h-6 w-6 text-cyan-400" />,
      title: "Fast Turnaround",
      description: "Get content delivered in 3-7 days. No slow agency pipelines. Direct creator access means faster campaigns.",
    },
    {
      icon: <Heart className="h-6 w-6 text-pink-400" />,
      title: "Creator First",
      description: "Creators keep 80% of every deal. We believe the people creating the content deserve to be paid fairly.",
    },
  ];

  const stats = [
    { value: "50+", label: "Active Creators" },
    { value: "25+", label: "Campaigns Launched" },
    { value: "$10K+", label: "Paid to Creators" },
    { value: "7", label: "Canadian Cities" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SchemaMarkup
        schema={{
          type: "Organization",
          data: {
            name: "TrueNorthUGC",
            url: "https://www.truenorthugc.com",
            logo: "https://www.truenorthugc.com/logo.png",
            description: "Canada's premier UGC creator marketplace connecting brands with authentic Canadian content creators.",
            founder: { name: "Daniel Young" },
            email: "TrueNorthUGCcanada@gmail.com",
            telephone: "1-226-220-1522",
            address: { addressCountry: "CA" },
          },
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-cyan-500/10 pointer-events-none" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <Badge className="mb-6 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/40 text-white">
              🍁 Made in Canada
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
              Built for Canadian<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">
                Creators & Brands
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              TrueNorthUGC is Canada's only dedicated UGC creator marketplace — designed to help brands
              find authentic content that converts, and to help creators land paid deals that match their niche.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/10 bg-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={fadeUp}>
                <div className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
                  {s.value}
                </div>
                <div className="text-white/60 text-sm mt-1">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp}>
              <Badge className="mb-4 bg-pink-500/20 border-pink-500/40 text-pink-300">Our Story</Badge>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
                Why We Built TrueNorthUGC
              </h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  TrueNorthUGC was founded by <strong className="text-white">Daniel Young</strong> out of a simple frustration:
                  Canadian brands were being forced to work with US-based platforms that didn't understand
                  the Canadian market — and Canadian creators were being overlooked.
                </p>
                <p>
                  We built TrueNorthUGC to solve both problems at once. A marketplace where Canadian
                  brands can find Canadian creators who understand their audience, and where creators can
                  access real, paid brand deals — without needing to fight for visibility on generic global platforms.
                </p>
                <p>
                  Every feature is built around what Canadian brands and creators actually need: transparent
                  pricing, direct communication, fast turnarounds, and content that actually converts.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <MapPin className="h-4 w-4 text-pink-400" />
                  Founded in Canada, 2025
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Heart className="h-4 w-4 text-pink-400" />
                  Creator-first philosophy
                </div>
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-pink-500/10 to-purple-500/10 p-8 space-y-6">
                <div className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
                  "
                </div>
                <p className="text-lg text-white/90 leading-relaxed italic">
                  Canada has some of the most talented content creators in the world.
                  They deserve a platform built for them — not an afterthought on a US platform.
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center font-bold text-white">
                    DY
                  </div>
                  <div>
                    <div className="font-bold text-white">Daniel Young</div>
                    <div className="text-sm text-white/60">Founder, TrueNorthUGC</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 bg-white/5 border-y border-white/10">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white">What We Stand For</h2>
            <p className="text-white/60 mt-4 max-w-xl mx-auto">
              Our platform is built around four core principles that guide every decision.
            </p>
          </motion.div>
          <motion.div
            className="grid sm:grid-cols-2 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-pink-500/30 transition-colors"
              >
                <div className="mb-4">{v.icon}</div>
                <h3 className="font-bold text-white text-lg mb-2">{v.title}</h3>
                <p className="text-white/60 leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp}>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-white/70 leading-relaxed mb-10">
                To become Canada's #1 creator marketplace — where every Canadian brand can find
                the perfect UGC creator, and every creator can build a sustainable income doing what
                they love.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/creators">
                <Button
                  size="lg"
                  className="px-8 py-6 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0 font-bold text-lg"
                >
                  Browse Creators <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="px-8 py-6 rounded-2xl border-white/20 hover:bg-white/10 text-white font-bold text-lg">
                  Get in Touch
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 border-t border-white/10 bg-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-white/40 text-sm mb-1">Email</div>
              <a href="mailto:TrueNorthUGCcanada@gmail.com" className="text-white font-medium hover:text-pink-400 transition-colors">
                TrueNorthUGCcanada@gmail.com
              </a>
            </div>
            <div>
              <div className="text-white/40 text-sm mb-1">Phone</div>
              <a href="tel:+12262201522" className="text-white font-medium hover:text-pink-400 transition-colors">
                1-226-220-1522
              </a>
            </div>
            <div>
              <div className="text-white/40 text-sm mb-1">Headquarters</div>
              <span className="text-white font-medium">Canada 🍁</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
