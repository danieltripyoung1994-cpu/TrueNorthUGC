import { Link } from "wouter";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, Sparkles, Star, Zap, Users, Shield, Globe, ChevronDown, Quote, Briefcase, DollarSign, Calendar, MapPin, Trophy, Crown, Gift, TrendingUp, Mail, CheckCircle, Share2 } from "lucide-react";
import newLogoPng from "@assets/Photoroom_20260131_221621_1769915813253.png";
import { useRef, useMemo, useState } from "react";
import { useCampaigns } from "@/hooks/use-campaigns";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const GlowOrb = ({ 
  className, 
  prefersReducedMotion,
  parallaxY 
}: { 
  className?: string; 
  prefersReducedMotion: boolean;
  parallaxY?: any;
}) => (
  <motion.div
    initial={{ opacity: 0.6 }}
    animate={prefersReducedMotion ? { opacity: 0.6 } : { opacity: [0.4, 0.7, 0.4] }}
    transition={prefersReducedMotion ? {} : { 
      duration: 6, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
    style={prefersReducedMotion ? {} : { y: parallaxY }}
    className={`absolute rounded-full blur-3xl ${className}`}
  />
);

export default function Landing() {
  usePageMeta({ 
    title: "TrueNorthUGC", 
    description: "Canada's premier UGC creator marketplace. Connect brands with authentic Canadian content creators for user-generated content campaigns. Find creators by niche, location, and platform.",
    keywords: "UGC creators Canada, Canadian content creators, user generated content marketplace, brand partnerships Canada, influencer marketing, creator economy Canada, Toronto UGC, Vancouver creators",
    canonicalPath: "/"
  });
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  
  // Parallax transforms for background elements (0.5x - 0.8x scroll speed)
  const bgParallaxY = useTransform(scrollYProgress, [0, 1], [0, 150]); // 0.5x speed effect
  const orbParallaxY1 = useTransform(scrollYProgress, [0, 1], [0, 80]); // 0.6x speed
  const orbParallaxY2 = useTransform(scrollYProgress, [0, 1], [0, 120]); // 0.4x speed
  const orbParallaxY3 = useTransform(scrollYProgress, [0, 1], [0, 100]); // 0.5x speed

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
        delayChildren: prefersReducedMotion ? 0 : 0.1
      }
    }
  }), [prefersReducedMotion]);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: prefersReducedMotion ? 0.1 : 0.3, ease: "easeOut" }
    }
  }), [prefersReducedMotion]);

  const cardHoverVariants = useMemo(() => ({
    rest: { scale: 1, y: 0 },
    hover: { 
      scale: 1.02, 
      y: -4,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  }), []);

  // Section fade-in variant that respects reduced motion
  const sectionVariants = useMemo(() => ({
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: prefersReducedMotion ? 0.1 : 0.5, 
        ease: "easeOut" 
      }
    }
  }), [prefersReducedMotion]);

  const niches = ["Fitness", "Wellness", "Travel", "Tech", "Beauty", "Fashion", "Food", "Lifestyle", "Gaming", "Parenting"];

  const { data: campaigns } = useCampaigns("active");
  const featuredCampaigns = campaigns?.slice(0, 3) || [];

  // Platform stats
  const { data: stats } = useQuery<{
    totalCreators: number;
    totalCampaigns: number;
    completedCampaigns: number;
    totalPaidOut: number;
    activeBrands: number;
  }>({
    queryKey: ["/api/stats"],
    staleTime: 60000
  });

  // Newsletter signup
  const { toast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const newsletterMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest("POST", "/api/newsletter/subscribe", { email, type: "general" });
    },
    onSuccess: () => {
      setSubscribed(true);
      toast({ title: "Welcome to the community!", description: "You're now subscribed to TrueNorthUGC updates." });
    },
    onError: () => {
      toast({ title: "Subscription failed", description: "Please try again.", variant: "destructive" });
    }
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      newsletterMutation.mutate(newsletterEmail);
    }
  };

  const testimonials = [
    {
      type: "creator",
      name: "Sarah Mitchell",
      role: "Fitness & Wellness Creator",
      location: "Vancouver, BC",
      quote: "TrueNorthUGC has completely transformed my career. I've connected with amazing Canadian brands that truly align with my values. The platform makes collaboration seamless!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
    },
    {
      type: "brand",
      name: "Maple Leaf Organics",
      role: "Wellness Brand",
      location: "Toronto, ON",
      quote: "Finding authentic Canadian creators was always a challenge until we discovered TrueNorthUGC. The quality of content we receive is exceptional, and ROI has been incredible.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=400&fit=crop"
    },
    {
      type: "creator",
      name: "Marcus Chen",
      role: "Tech & Gaming Creator",
      location: "Calgary, AB",
      quote: "The platform's payment system is secure and the 80/20 split is fair. I've earned more in 3 months here than I did all last year working with brands directly.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    {
      type: "brand",
      name: "Northern Beauty Co.",
      role: "Cosmetics Brand",
      location: "Montreal, QC",
      quote: "We've launched 12 successful campaigns through TrueNorthUGC. The creators understand our Canadian audience and deliver content that truly resonates with our customers.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop"
    }
  ];

  const features = [
    {
      icon: Globe,
      title: "Canadian Focus",
      description: "Exclusively featuring creators from across Canada, understanding local culture and markets."
    },
    {
      icon: Search,
      title: "Smart Matching",
      description: "Filter by niche, location, and platform to find the perfect creator for your campaign."
    },
    {
      icon: Star,
      title: "Quality Content",
      description: "Every creator is vetted to ensure high-quality, authentic content that resonates."
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Direct communication with creators in a safe, professional environment."
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative overflow-hidden min-h-[100vh] flex items-center" style={{ position: 'relative' }}>
        {/* Animated Background */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={prefersReducedMotion ? {} : { opacity: heroOpacity }}
        >
          <motion.div
            style={prefersReducedMotion ? {} : { y: bgParallaxY }}
            className="absolute inset-0"
          >
            <img
              src={newLogoPng}
              alt="TrueNorthUGC"
              loading="eager"
              decoding="async"
              width={800}
              height={800}
              className="absolute inset-0 w-full h-full object-contain scale-[1.35] -translate-y-[11%] opacity-30 mix-blend-lighten"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background z-0" />
          
          {/* Simplified glow orbs - only render if motion is allowed */}
          {!prefersReducedMotion && (
            <>
              <GlowOrb className="w-96 h-96 bg-pink-500/40 top-20 -left-48" prefersReducedMotion={!!prefersReducedMotion} parallaxY={orbParallaxY1} />
              <GlowOrb className="w-64 h-64 bg-purple-500/30 top-40 right-20" prefersReducedMotion={!!prefersReducedMotion} parallaxY={orbParallaxY2} />
              <GlowOrb className="w-80 h-80 bg-cyan-500/30 bottom-20 right-1/4" prefersReducedMotion={!!prefersReducedMotion} parallaxY={orbParallaxY3} />
            </>
          )}
        </motion.div>
        
        <motion.div 
          className="container relative mx-auto px-4 z-10"
          style={prefersReducedMotion ? {} : { opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-8 sm:space-y-10">
            {/* Animated Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              className="inline-flex items-center rounded-full border border-pink-500/40 bg-gradient-to-r from-pink-500/20 to-purple-500/20 px-5 py-2 text-sm font-semibold text-white backdrop-blur-xl shadow-[0_0_30px_rgba(255,0,128,0.3)]"
            >
              <img
                src={newLogoPng}
                alt=""
                width={24}
                height={24}
                loading="eager"
                className="mr-2 h-6 w-auto mix-blend-lighten"
              />
              Made for Canadian Creators
            </motion.div>
            
            {/* Hero Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight text-white drop-shadow-2xl leading-[1.05]"
            >
              Canada's <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 inline-block">
                UGC Marketplace
              </span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl text-balance font-medium leading-relaxed drop-shadow-lg px-4 sm:px-0"
            >
              TrueNorthUGC is the premier platform for discovering authentic Canadian user-generated content creators. Find the perfect creator for your brand or showcase your talents to top companies.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto justify-center px-4 sm:px-0"
            >
              <Link href="/creators" className="w-full sm:w-auto group">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-base sm:text-lg md:text-xl px-8 sm:px-12 py-7 sm:py-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 shadow-2xl shadow-pink-500/30 relative overflow-hidden group border-0"
                  data-testid="button-browse-creators"
                >
                  <span className="relative z-10 flex items-center font-bold">
                    Browse Creators
                    <Search className="h-5 w-5 sm:h-6 sm:w-6 ml-3" />
                  </span>
                </Button>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto group">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto text-base sm:text-lg md:text-xl px-8 sm:px-12 py-7 sm:py-8 rounded-2xl sm:rounded-3xl border-2 bg-white/5 hover:bg-white/15 text-white border-pink-500/50 hover:border-pink-500 backdrop-blur-xl relative overflow-hidden"
                  data-testid="button-exclusive-offers"
                >
                  <span className="relative z-10 flex items-center font-bold">
                    Exclusive Offers
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 ml-3" />
                  </span>
                </Button>
              </Link>
            </motion.div>
            
            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-white/60"
              >
                <ChevronDown className="h-8 w-8" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Live Stats Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden" data-testid="section-live-stats">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 text-sm font-bold mb-4">
              <TrendingUp className="h-4 w-4" />
              Growing Community
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">Trusted by Creators & Brands Across Canada</h2>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto"
          >
            {[
              { value: stats?.totalCreators || 50, label: "Active Creators", suffix: "+", icon: <Users className="h-5 w-5 sm:h-6 sm:w-6 text-pink-500" /> },
              { value: stats?.totalCampaigns || 25, label: "Campaigns Launched", suffix: "+", icon: <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" /> },
              { value: stats?.totalPaidOut || 10000, label: "Paid to Creators", prefix: "$", suffix: "+", icon: <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" /> },
              { value: stats?.activeBrands || 15, label: "Partner Brands", suffix: "+", icon: <Star className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-500" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-pink-500/30 transition-colors text-center"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/20 flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">
                  <AnimatedCounter 
                    value={stat.value} 
                    suffix={stat.suffix || ""} 
                    prefix={stat.prefix || ""}
                    duration={1.5}
                  />
                </div>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Niches Section */}
      <section className="py-20 sm:py-28 relative overflow-hidden mesh-gradient">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 mb-6">
              <Users className="h-8 w-8 text-pink-500" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">Creators Across Every <span className="gradient-text">Niche</span></h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">From fitness to tech, find specialists in any content category</p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-20 sm:mb-28"
          >
            {niches.map((niche) => (
              <motion.div
                key={niche}
                variants={itemVariants}
                whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 sm:px-7 py-3 sm:py-4 bg-card/80 backdrop-blur-sm rounded-full border border-white/10 shadow-lg font-bold text-base sm:text-lg cursor-pointer hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-200"
              >
                {niche}
              </motion.div>
            ))}
          </motion.div>

          {/* Why TrueNorthUGC Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">Why <span className="gradient-text">TrueNorthUGC</span>?</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">We're building the bridge between Canadian creators and the brands that need them.</p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                initial="rest"
                whileHover="hover"
                animate="rest"
                className="group"
              >
                <motion.div
                  variants={cardHoverVariants}
                  className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/10 shadow-lg hover:shadow-2xl hover:shadow-pink-500/10 hover:border-pink-500/30 transition-all duration-300 h-full card-shine"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/20 flex items-center justify-center mb-6 group-hover:border-pink-500/40 transition-colors">
                    <feature.icon className="h-7 w-7 text-pink-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex-1 space-y-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Empowering <span className="text-primary">Brands</span> to Find the Perfect Voice
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Stop scrolling and start scaling. TrueNorthUGC is where top Canadian brands find vetted creators who deliver high-converting content.
              </p>
              
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-4"
              >
                <motion.div 
                  variants={itemVariants}
                  className="p-6 bg-gradient-to-r from-secondary/50 to-secondary/30 rounded-3xl border border-border/50 hover:border-primary/30 transition-all"
                >
                  <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    For Brands: Showcase Your Vision
                  </h3>
                  <p className="text-muted-foreground">
                    Build your brand profile, post your requirements, and let the best Canadian creators come to you. Show creators exactly what your brand is about.
                  </p>
                </motion.div>
                
                {[
                  "Create a dedicated brand profile",
                  "Showcase your previous UGC collaborations",
                  "Direct access to creator portfolios and contact info",
                  "Find creators who actually match your brand's aesthetic"
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    variants={itemVariants}
                    whileHover={prefersReducedMotion ? {} : { x: 5 }}
                    className="flex items-center gap-3 group cursor-default"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <motion.a 
                  href="/api/login"
                  target="_top"
                  variants={itemVariants}
                >
                  <Button size="lg" className="text-lg px-8 py-6 rounded-2xl shadow-xl shadow-primary/20 w-full sm:w-auto">
                    Register as a Brand
                  </Button>
                </motion.a>
                <motion.div variants={itemVariants}>
                  <Link href="/pricing">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-2xl border-2 w-full sm:w-auto">
                      View Pricing
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 relative w-full hidden lg:block"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-secondary/50 via-secondary/30 to-primary/10 relative overflow-hidden border border-border/50 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
                
                {/* Dashboard mockup */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 sm:p-12 space-y-4">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="w-full h-1/2 bg-background rounded-2xl shadow-xl border p-4 sm:p-6 space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <div className="h-4 w-1/3 bg-muted rounded-full" />
                    </div>
                    <div className="h-2 bg-primary/30 rounded-full w-3/4" />
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-16 sm:h-20 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl"
                        />
                      ))}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="w-4/5 h-1/3 bg-background/90 rounded-2xl shadow-lg border p-4 sm:p-6 space-y-3 backdrop-blur-sm translate-x-4 sm:translate-x-8 -translate-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-1/4 bg-muted rounded-full" />
                      <Star className="h-4 w-4 text-primary/50" />
                    </div>
                    <div className="h-4 w-full bg-muted/50 rounded-full" />
                    <div className="h-4 w-2/3 bg-muted/30 rounded-full" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Milestone Bonus Program Section */}
      <section className="py-20 sm:py-28 relative overflow-hidden mesh-gradient" data-testid="section-milestone-bonus">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-bold mb-6">
              <Gift className="h-4 w-4" />
              Creator Rewards
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
              Milestone <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-cyan-300">Bonus Program</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Complete campaigns and unlock milestone bonuses. Earn up to <span className="text-cyan-400 font-bold">$1,150</span> in rewards as you grow!
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6"
          >
            {[
              { tier: "New Creator", icon: Star, bonus: 0, campaigns: "0-2", color: "from-gray-500/20 to-gray-400/10", borderColor: "border-gray-500/30", textColor: "text-gray-400" },
              { tier: "Rising Star", icon: Star, bonus: 100, campaigns: "3-9", color: "from-green-500/20 to-green-400/10", borderColor: "border-green-500/30", textColor: "text-green-400" },
              { tier: "Creator Pro", icon: Zap, bonus: 200, campaigns: "10-19", color: "from-blue-500/20 to-blue-400/10", borderColor: "border-blue-500/30", textColor: "text-blue-400" },
              { tier: "Top Performer", icon: Trophy, bonus: 350, campaigns: "20-34", color: "from-purple-500/20 to-purple-400/10", borderColor: "border-purple-500/30", textColor: "text-purple-400" },
              { tier: "Elite Creator", icon: Crown, bonus: 500, campaigns: "35+", color: "from-cyan-500/20 to-cyan-400/10", borderColor: "border-cyan-500/30", textColor: "text-cyan-400" }
            ].map((level, i) => (
              <motion.div
                key={level.tier}
                variants={itemVariants}
                initial="rest"
                whileHover="hover"
                animate="rest"
                className="group"
              >
                <motion.div
                  variants={cardHoverVariants}
                  className={`bg-gradient-to-br ${level.color} backdrop-blur-sm rounded-2xl p-6 border ${level.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 h-full text-center`}
                  data-testid={`card-tier-${level.tier.toLowerCase().replace(' ', '-')}`}
                >
                  <div className={`w-14 h-14 rounded-full bg-background/50 border ${level.borderColor} flex items-center justify-center mx-auto mb-4`}>
                    <level.icon className={`h-7 w-7 ${level.textColor}`} />
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${level.textColor}`}>{level.tier}</h3>
                  <p className="text-3xl font-black mb-2">
                    {level.bonus > 0 ? (
                      <span className="text-green-400">${level.bonus}</span>
                    ) : (
                      <span className="text-muted-foreground">Start</span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {level.campaigns} campaigns
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center mt-10"
          >
            <p className="text-muted-foreground mb-6">
              Bonuses are cumulative. Complete 35+ campaigns and you'll have earned <span className="text-cyan-400 font-bold">$1,150</span> in total milestone rewards!
            </p>
            <a href="/api/login" target="_top">
              <Button size="lg" className="rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-600 hover:to-cyan-500 shadow-xl shadow-cyan-500/20" data-testid="button-start-earning">
                Start Earning Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-background via-secondary/20 to-background relative overflow-hidden" data-testid="section-testimonials">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
              <Star className="h-4 w-4 fill-primary" />
              Success Stories
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
              What Our <span className="text-primary">Community</span> Says
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from creators and brands who have found success through TrueNorthUGC
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
          >
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={prefersReducedMotion ? {} : { y: -4 }}
                className="group"
                data-testid={`card-testimonial-${idx}`}
              >
                <Card className="h-full border-2 hover:border-primary/30 transition-all duration-200 rounded-3xl overflow-hidden">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        loading="lazy"
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-primary/20"
                        data-testid={`img-testimonial-${idx}`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-bold text-lg" data-testid={`text-testimonial-name-${idx}`}>{testimonial.name}</h4>
                          <Badge 
                            variant={testimonial.type === "creator" ? "default" : "secondary"}
                            className="text-xs"
                            data-testid={`badge-testimonial-type-${idx}`}
                          >
                            {testimonial.type === "creator" ? "Creator" : "Brand"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground" data-testid={`text-testimonial-role-${idx}`}>{testimonial.role}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          <span data-testid={`text-testimonial-location-${idx}`}>{testimonial.location}</span>
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/10" />
                      <p className="text-muted-foreground leading-relaxed pl-6 italic" data-testid={`text-testimonial-quote-${idx}`}>
                        "{testimonial.quote}"
                      </p>
                    </div>
                    <div className="flex items-center gap-1 mt-4 pl-6" data-testid={`rating-testimonial-${idx}`}>
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Campaigns Section */}
      <section className="py-20 sm:py-28 bg-background relative overflow-hidden" data-testid="section-campaigns">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
              <Briefcase className="h-4 w-4" />
              Active Opportunities
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
              Featured <span className="text-primary">Campaigns</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore active brand campaigns looking for talented Canadian creators
            </p>
          </motion.div>

          {featuredCampaigns.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center py-16"
              data-testid="campaigns-empty-state"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Briefcase className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No Active Campaigns Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Brands are getting ready to post exciting opportunities. Check back soon or register to be notified when new campaigns launch.
              </p>
              <a href="/api/login" target="_top">
                <Button size="lg" className="rounded-xl" data-testid="button-register-brand">
                  Register as a Brand
                </Button>
              </a>
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {featuredCampaigns.map((campaign) => (
                  <motion.div
                    key={campaign.id}
                    variants={itemVariants}
                    whileHover={prefersReducedMotion ? {} : { y: -4, scale: 1.01 }}
                    className="group"
                    data-testid={`card-campaign-${campaign.id}`}
                  >
                    <Card className="h-full border-2 hover:border-primary/30 transition-all duration-200 rounded-3xl overflow-hidden bg-gradient-to-br from-background to-secondary/20">
                      <CardContent className="p-6 sm:p-8">
                        <div className="flex items-start justify-between mb-4 gap-2 flex-wrap">
                          <Badge 
                            variant="default"
                            className="bg-green-500/10 text-green-600 border-green-500/20"
                            data-testid={`badge-campaign-status-${campaign.id}`}
                          >
                            Active
                          </Badge>
                          {campaign.budget && (
                            <span className="flex items-center gap-1 text-sm font-bold text-primary" data-testid={`text-campaign-budget-${campaign.id}`}>
                              <DollarSign className="h-4 w-4" />
                              {campaign.budget}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2" data-testid={`text-campaign-title-${campaign.id}`}>
                          {campaign.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3" data-testid={`text-campaign-description-${campaign.id}`}>
                          {campaign.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {campaign.niches?.slice(0, 3).map((niche) => (
                            <Badge key={niche} variant="secondary" className="text-xs" data-testid={`badge-campaign-niche-${campaign.id}`}>
                              {niche}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
                          {campaign.location && (
                            <span className="flex items-center gap-1" data-testid={`text-campaign-location-${campaign.id}`}>
                              <MapPin className="h-3 w-3" />
                              {campaign.location}
                            </span>
                          )}
                          {campaign.deadline && (
                            <span className="flex items-center gap-1" data-testid={`text-campaign-deadline-${campaign.id}`}>
                              <Calendar className="h-3 w-3" />
                              {new Date(campaign.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center mt-10"
              >
                <Link href="/campaigns">
                  <Button size="lg" variant="outline" className="rounded-xl" data-testid="link-view-all-campaigns">
                    View All Campaigns
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-secondary/20 to-background relative overflow-hidden" data-testid="section-newsletter">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-pink-400 text-sm font-bold mb-6">
              <Mail className="h-4 w-4" />
              Stay Updated
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">
              Join the TrueNorthUGC Community
            </h2>
            <p className="text-muted-foreground mb-8">
              Get exclusive campaign opportunities, creator tips, and platform updates delivered to your inbox.
            </p>
            
            {subscribed ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 text-green-400 font-medium"
              >
                <CheckCircle className="h-5 w-5" />
                You're subscribed! Check your inbox for updates.
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 rounded-xl bg-card/50 border-white/10 focus:border-pink-500/50"
                  data-testid="input-newsletter-email"
                  required
                />
                <Button 
                  type="submit" 
                  className="rounded-xl shadow-lg shadow-pink-500/20"
                  disabled={newsletterMutation.isPending}
                  data-testid="button-subscribe"
                >
                  {newsletterMutation.isPending ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Referral Program Section */}
      <section className="py-16 sm:py-20 relative overflow-hidden" data-testid="section-referral">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10 rounded-3xl border border-white/10 p-8 sm:p-12 max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                  <Share2 className="h-10 w-10 text-purple-400" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl sm:text-3xl font-black mb-2">
                  Refer & Earn <span className="text-purple-400">$25</span>
                </h3>
                <p className="text-muted-foreground mb-4">
                  Know a creator or brand that would love TrueNorthUGC? Refer them and earn $25 for every successful signup that completes their first campaign!
                </p>
                <a href="/api/login" target="_top">
                  <Button variant="outline" className="rounded-xl border-purple-500/30 hover:border-purple-500/60" data-testid="button-start-referring">
                    Start Referring
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-primary via-primary to-blue-700 text-primary-foreground relative overflow-hidden">
        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg sm:text-xl opacity-90 mb-10 leading-relaxed max-w-2xl mx-auto">
              Whether you're a creator looking to grow your business or a brand seeking authentic content, TrueNorthUGC is your platform.
            </p>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.a 
                href="/api/login"
                target="_top"
                variants={itemVariants}
              >
                <Button size="lg" variant="secondary" className="text-lg px-10 py-7 rounded-2xl w-full sm:w-auto shadow-xl">
                  Join as Creator
                </Button>
              </motion.a>
              <motion.div variants={itemVariants}>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="text-lg px-10 py-7 rounded-2xl border-white/30 hover:bg-white/10 w-full sm:w-auto">
                    View Pricing
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 sm:py-24 border-t bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16"
          >
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <img 
                  src={newLogoPng} 
                  alt="TrueNorthUGC Logo" 
                  width={48}
                  height={48}
                  className="h-12 w-auto mix-blend-lighten"
                  loading="lazy"
                />
                <span className="text-2xl font-black tracking-tighter">TrueNorthUGC</span>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
                Canada's premier platform connecting authentic UGC creators with brands looking for genuine content that resonates.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Platform</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/creators" className="hover:text-primary transition-colors animated-underline">Discover Creators</Link></li>
                <li><Link href="/pricing" className="hover:text-primary transition-colors animated-underline">Pricing</Link></li>
                <li><a href="/api/login" target="_top" className="hover:text-primary transition-colors animated-underline">Join as Creator</a></li>
                <li><a href="mailto:TrueNorthUGCcanada@gmail.com" className="hover:text-primary transition-colors animated-underline">Contact Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Legal</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><a href="mailto:TrueNorthUGCcanada@gmail.com?subject=Privacy%20Policy%20Request" className="hover:text-primary transition-colors animated-underline">Privacy Policy</a></li>
                <li><a href="mailto:TrueNorthUGCcanada@gmail.com?subject=Terms%20of%20Service%20Request" className="hover:text-primary transition-colors animated-underline">Terms of Service</a></li>
              </ul>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground"
          >
            <p>© 2026 TrueNorthUGC. All rights reserved.</p>
            <p className="font-medium">Founded by Daniel Young.</p>
            <p className="flex items-center gap-1">Made with <span className="text-red-500">🍁</span> in Canada</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
