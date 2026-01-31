import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Sparkles, Star, Zap, Users, Shield, Globe, ChevronDown } from "lucide-react";
import banffBg from "@assets/stock_images/scenic_background_of_f3c6840b.jpg";
import logoPng from "@assets/Photoroom_20260124_081931_1769558537558.png";
import { useRef } from "react";

const FloatingShape = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 1, ease: "easeOut" }}
    className={className}
  >
    <motion.div
      animate={{ 
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{ 
        duration: 6 + delay * 2, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className="w-full h-full"
    />
  </motion.div>
);

const GlowOrb = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: [0.3, 0.6, 0.3] }}
    transition={{ 
      duration: 4, 
      repeat: Infinity, 
      delay,
      ease: "easeInOut" 
    }}
    className={`absolute rounded-full blur-3xl ${className}`}
  />
);

export default function Landing() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: { 
      scale: 1.02, 
      y: -8,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const niches = ["Fitness", "Wellness", "Travel", "Tech", "Beauty", "Fashion", "Food", "Lifestyle", "Gaming", "Parenting"];

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
      <section ref={heroRef} className="relative overflow-hidden min-h-[100vh] flex items-center">
        {/* Animated Background */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${banffBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background z-0" />
          
          {/* Animated glow orbs */}
          <GlowOrb className="w-96 h-96 bg-primary/30 top-20 -left-48" delay={0} />
          <GlowOrb className="w-64 h-64 bg-blue-500/20 top-40 right-20" delay={1} />
          <GlowOrb className="w-80 h-80 bg-purple-500/20 bottom-20 right-1/4" delay={2} />
        </motion.div>
        
        <motion.div 
          className="container relative mx-auto px-4 z-10"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-8 sm:space-y-10">
            {/* Animated Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2
              }}
              className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-pulse-glow"
            >
              <motion.img
                src={logoPng}
                alt=""
                className="mr-2 h-6 w-auto"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              Made for Canadian Creators
            </motion.div>
            
            {/* Animated Hero Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 60, filter: "blur(20px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight text-white drop-shadow-2xl leading-[1.05]"
            >
              Canada's <br className="hidden sm:block" />
              <motion.span 
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "300% auto" }}
                className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-300 via-white to-primary inline-block"
              >
                UGC Marketplace
              </motion.span>
            </motion.h1>
            
            {/* Animated Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl text-balance font-medium leading-relaxed drop-shadow-lg px-4 sm:px-0"
            >
              TrueNorthUGC is the premier platform for discovering authentic Canadian user-generated content creators. Find the perfect creator for your brand or showcase your talents to top companies.
            </motion.p>
            
            {/* Animated CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto justify-center px-4 sm:px-0"
            >
              <Link href="/creators" className="w-full sm:w-auto group">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto text-base sm:text-lg md:text-xl px-8 sm:px-12 py-7 sm:py-8 rounded-2xl sm:rounded-3xl shadow-2xl shadow-primary/40 relative overflow-hidden group"
                    data-testid="button-browse-creators"
                  >
                    <span className="relative z-10 flex items-center">
                      Browse Creators
                      <motion.div
                        animate={{ x: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="ml-3"
                      >
                        <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                      </motion.div>
                    </span>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-primary via-blue-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ backgroundSize: "200% 100%" }}
                    />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto group">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto text-base sm:text-lg md:text-xl px-8 sm:px-12 py-7 sm:py-8 rounded-2xl sm:rounded-3xl border-2 bg-white/5 hover:bg-white/15 text-white border-white/30 backdrop-blur-xl relative overflow-hidden"
                    data-testid="button-exclusive-offers"
                  >
                    <span className="relative z-10 flex items-center">
                      Exclusive Offers
                      <motion.div
                        animate={{ 
                          scale: [1, 1.3, 1],
                          rotate: [0, 15, -15, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="ml-3"
                      >
                        <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                      </motion.div>
                    </span>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
            
            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-white/60"
              >
                <ChevronDown className="h-8 w-8" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Niches Section with Stagger Animation */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -right-1/2 w-full h-full opacity-5"
          >
            <div className="w-full h-full bg-gradient-to-r from-primary to-transparent rounded-full" />
          </motion.div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6"
            >
              <Users className="h-8 w-8 text-primary" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">Creators Across Every Niche</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">From fitness to tech, find specialists in any content category</p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-20 sm:mb-28"
          >
            {niches.map((niche, i) => (
              <motion.div
                key={niche}
                variants={itemVariants}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 sm:px-7 py-3 sm:py-4 bg-background rounded-full border border-border/50 shadow-lg font-bold text-base sm:text-lg cursor-pointer hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
              >
                {niche}
              </motion.div>
            ))}
          </motion.div>

          {/* Why TrueNorthUGC Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">Why TrueNorthUGC?</h2>
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
                  className="bg-background rounded-3xl p-6 sm:p-8 border border-border/50 shadow-lg hover:shadow-2xl hover:border-primary/30 transition-all duration-500 h-full card-shine"
                >
                  <motion.div 
                    className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="h-7 w-7 text-primary" />
                  </motion.div>
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
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex-1 space-y-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10"
              >
                <Zap className="h-8 w-8 text-primary" />
              </motion.div>
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
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-5 w-5 text-primary" />
                    </motion.div>
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
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-3 group cursor-default"
                  >
                    <motion.div 
                      className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all"
                      whileHover={{ scale: 1.1 }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
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
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button size="lg" className="text-lg px-8 py-6 rounded-2xl shadow-xl shadow-primary/20 w-full sm:w-auto">
                    Register as a Brand
                  </Button>
                </motion.a>
                <motion.div variants={itemVariants}>
                  <Link href="/pricing">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                      <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-2xl border-2 w-full sm:w-auto">
                        View Pricing
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 relative w-full"
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="aspect-square rounded-3xl bg-gradient-to-br from-secondary/50 via-secondary/30 to-primary/10 relative overflow-hidden border border-border/50 shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
                
                {/* Animated dashboard mockup */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 sm:p-12 space-y-4">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="w-full h-1/2 bg-background rounded-2xl shadow-xl border p-4 sm:p-6 space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-3 w-3 rounded-full bg-green-500"
                      />
                      <div className="h-4 w-1/3 bg-muted rounded-full" />
                    </div>
                    <motion.div 
                      animate={{ width: ["0%", "100%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="h-2 bg-primary/30 rounded-full"
                    />
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="h-16 sm:h-20 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl"
                        />
                      ))}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    animate={{ y: [0, -5, 0] }}
                    className="w-4/5 h-1/3 bg-background/90 rounded-2xl shadow-lg border p-4 sm:p-6 space-y-3 backdrop-blur-sm translate-x-4 sm:translate-x-8 -translate-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-1/4 bg-muted rounded-full" />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <Star className="h-4 w-4 text-primary/50" />
                      </motion.div>
                    </div>
                    <div className="h-4 w-full bg-muted/50 rounded-full" />
                    <div className="h-4 w-2/3 bg-muted/30 rounded-full" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-primary via-primary to-blue-700 text-primary-foreground relative overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/4 w-full h-full opacity-10"
        >
          <div className="w-full h-full bg-gradient-to-r from-white to-transparent rounded-full" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/4 w-full h-full opacity-10"
        >
          <div className="w-full h-full bg-gradient-to-l from-white to-transparent rounded-full" />
        </motion.div>
        
        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-black mb-6"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Ready to Get Started?
            </motion.h2>
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
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button size="lg" variant="secondary" className="text-lg px-10 py-7 rounded-2xl w-full sm:w-auto shadow-xl">
                  Join as Creator
                </Button>
              </motion.a>
              <motion.div variants={itemVariants}>
                <Link href="/pricing">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Button size="lg" variant="outline" className="text-lg px-10 py-7 rounded-2xl border-white/30 hover:bg-white/10 w-full sm:w-auto">
                      View Pricing
                    </Button>
                  </motion.div>
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16"
          >
            <div className="col-span-1 md:col-span-2 space-y-6">
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
              >
                <motion.img 
                  src={logoPng} 
                  alt="TrueNorthUGC Logo" 
                  className="h-12 w-auto"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                />
                <span className="text-2xl font-black tracking-tighter">TrueNorthUGC</span>
              </motion.div>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
                Canada's premier platform connecting authentic UGC creators with brands looking for genuine content that resonates.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Platform</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/creators" className="hover:text-primary transition-colors animated-underline">Discover Creators</Link></li>
                <li><Link href="/pricing" className="hover:text-primary transition-colors animated-underline">Pricing</Link></li>
                <li><a href="/api/login" className="hover:text-primary transition-colors animated-underline">Join as Creator</a></li>
                <li><a href="mailto:TrueNorthUGCcanada@gmail.com" className="hover:text-primary transition-colors animated-underline">Contact Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Legal</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors animated-underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors animated-underline">Terms of Service</a></li>
              </ul>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
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
