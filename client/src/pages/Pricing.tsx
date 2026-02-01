import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Star, Crown, Zap, ArrowRight, Trophy } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Offer } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Pricing() {
  usePageMeta({ 
    title: "Pricing Plans for Creators & Brands", 
    description: "Affordable pricing plans for Canadian UGC creators and brands. Start free or upgrade for premium features. Join Canada's leading UGC marketplace today.",
    keywords: "UGC marketplace pricing, creator subscription plans, brand marketing costs, TrueNorthUGC plans, affordable UGC platform, creator economy pricing",
    canonicalPath: "/pricing"
  });
  const [, setLocation] = useLocation();
  const { data: offers } = useQuery<Offer[]>({
    queryKey: ["/api/offers"],
  });

  const creatorOffers = offers?.filter(o => o.target === "creator") || [];
  const brandOffers = offers?.filter(o => o.target === "brand") || [];

  const creatorTiers = [
    {
      name: "Free Forever",
      price: "$0",
      description: "Start earning with no upfront costs",
      features: [
        "Unlimited access to brand deals",
        "Create and showcase your portfolio",
        "Apply to unlimited campaigns",
        "Direct messaging with brands",
        "Performance analytics dashboard",
        "Secure payment processing"
      ],
      buttonText: "Join Free",
      variant: "default" as const,
      popular: true,
      highlight: true,
      commission: "Earn milestone bonuses up to $1,150 as you complete campaigns"
    },
    {
      name: "Pro Creator",
      price: "$50",
      description: "Premium features for serious creators",
      features: [
        "Everything in Free Forever",
        "Verification badge",
        "Priority visibility to brands",
        "Exclusive creator community",
        "Personal brand manager",
        "Milestone bonus rewards program"
      ],
      buttonText: "Get Started",
      variant: "outline" as const,
      commission: "Earn milestone bonuses up to $1,150 as you complete campaigns"
    }
  ];

  const brandTiers = [
    {
      name: "Campaign Starter",
      price: "$299",
      description: "Get high-quality UGC for your brand",
      features: [
        "Full access to creator network",
        "Vetted Canadian creators only",
        "Spark Ad codes on submissions",
        "Lifetime content ownership",
        "Custom content brief assistance",
        "Dedicated campaign manager",
        "Transparent 20% platform fee"
      ],
      buttonText: "Launch Campaign",
      variant: "default" as const,
      popular: true,
      highlight: true,
      commission: "20% platform fee on creator payments (80% goes directly to creators)"
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Scale your UGC strategy",
      features: [
        "Unlimited campaigns",
        "Advanced creator filtering",
        "Custom content briefs",
        "Dedicated account manager",
        "Volume discounts available",
        "Custom payment terms"
      ],
      buttonText: "Contact Sales",
      variant: "outline" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      <main className="container mx-auto px-4 py-16 sm:py-24 relative">
        {/* Background decorations */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 -right-32 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl -z-10"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -left-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -z-10"
        />
        
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-24 space-y-6"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center rounded-full border border-pink-500/30 bg-pink-500/10 px-5 py-2 text-sm font-semibold text-pink-400 backdrop-blur-xl shadow-lg shadow-pink-500/20 animate-pulse-glow"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Star className="mr-2 h-4 w-4" />
            </motion.div>
            Official Partnership Programs
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter"
          >
            Choose Your{" "}
            <motion.span 
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: "200% auto" }}
              className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 inline-block italic"
            >
              Success
            </motion.span>
            {" "}Path
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed"
          >
            Whether you're a creator looking to showcase your work or a brand looking to scale, our official programs offer exclusive tools for elite performance.
          </motion.p>
        </motion.div>

        <div className="space-y-16 sm:space-y-24 md:space-y-32">
          {/* Creators Section */}
          <section>
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/10 flex items-center justify-center flex-shrink-0 shadow-lg shadow-pink-500/10"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-pink-500" />
                </motion.div>
              </motion.div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">For Creators</h2>
                <p className="text-sm sm:text-base text-muted-foreground">Monetize your talent with elite brand deals</p>
              </div>
            </motion.div>
            
            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto"
            >
              {creatorTiers.map((tier) => (
                <motion.div 
                  key={tier.name} 
                  variants={item}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`flex flex-col h-full relative overflow-hidden transition-all duration-500 rounded-2xl sm:rounded-[2.5rem] group bg-card/50 backdrop-blur-sm border-white/10 ${tier.popular ? 'border-pink-500/50 shadow-2xl shadow-pink-500/20 md:scale-105 z-10' : 'hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/20'}`}>
                    {/* Animated gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {tier.popular && (
                      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold px-3 sm:px-4 py-1 rounded-full uppercase tracking-widest text-[10px] shadow-lg shadow-pink-500/30">
                            Popular
                          </Badge>
                        </motion.div>
                      </div>
                    )}
                    <CardHeader className="p-6 sm:p-10 pb-4 sm:pb-6">
                      <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-black">{tier.name}</CardTitle>
                      <CardDescription className="text-base sm:text-lg font-medium">{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-6 sm:space-y-10 px-6 sm:px-10">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl sm:text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 tracking-tighter">{tier.price}</span>
                        {tier.price === "$0" && <span className="text-sm sm:text-base text-muted-foreground font-semibold">forever</span>}
                      </div>

                      {(tier as any).commission && (
                        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">Transparent Pricing</p>
                          <p className="text-sm font-medium text-muted-foreground">{(tier as any).commission}</p>
                        </div>
                      )}

                      {tier.name === "Enterprise" && (
                        <div className="p-6 rounded-3xl bg-secondary/30 border border-border/50">
                          <p className="text-sm font-medium text-muted-foreground mb-4">For custom enterprise solutions and payment links, please contact our official support team.</p>
                          <a 
                            href="mailto:TrueNorthUGCcanada@gmail.com" 
                            className="text-primary font-bold hover:underline break-all text-sm"
                          >
                            TrueNorthUGCcanada@gmail.com
                          </a>
                          <div className="mt-6">
                            <Button 
                              variant="outline" 
                              className="w-full h-12 rounded-xl border-2 font-bold"
                              onClick={() => window.location.href = "mailto:TrueNorthUGCcanada@gmail.com"}
                            >
                              Request Payment Link
                            </Button>
                          </div>
                        </div>
                      )}

                      {tier.name === "Exclusive" && creatorOffers.length > 0 && (
                        <div className="p-6 rounded-3xl bg-pink-500/5 border border-pink-500/20 relative overflow-hidden group backdrop-blur-sm">
                          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Crown size={80} />
                          </div>
                          <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] mb-2">Limited Time Offer</p>
                          {creatorOffers.map(offer => (
                            <div key={offer.id}>
                              <p className="font-bold text-lg leading-tight mb-1">{offer.title}</p>
                              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{offer.description}</p>
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-3xl font-black text-pink-500">{offer.discount}</span>
                                <div className="bg-background/50 backdrop-blur-sm px-4 py-2 rounded-xl border-2 border-pink-500/30 text-sm font-mono font-bold tracking-wider">
                                  {offer.code}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <ul className="space-y-5">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-4 text-sm font-medium leading-relaxed">
                            <div className="mt-0.5 h-5 w-5 rounded-full bg-pink-500/10 flex items-center justify-center shrink-0">
                              <Check className="h-3 w-3 text-pink-500 stroke-[4]" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="p-10 pt-6">
                      <Button 
                        className={`w-full h-16 text-xl font-black rounded-3xl transition-all ${tier.popular ? 'bg-gradient-to-r from-pink-500 to-purple-500 border-0 shadow-2xl shadow-pink-500/40 hover:scale-[1.02] hover:shadow-pink-500/50' : ''}`} 
                        variant={tier.variant}
                        onClick={() => window.location.href = "/api/login"}
                      >
                        {tier.buttonText}
                        <ArrowRight className="ml-2 h-6 w-6" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Creator Rewards Program Section */}
          <section data-testid="section-creator-rewards">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/10"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-cyan-400" />
                </motion.div>
              </motion.div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Milestone Bonus Program</h2>
                <p className="text-sm sm:text-base text-muted-foreground">Earn bonus rewards on top of your campaign payments</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 p-4 sm:p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 max-w-5xl mx-auto"
            >
              <p className="text-sm sm:text-base text-muted-foreground text-center">
                <span className="text-green-400 font-semibold">Earn bonus rewards on top of your campaign payments!</span> Complete campaigns, hit milestones, and receive cash bonuses up to <span className="text-green-400 font-semibold">$1,150 total</span>.
              </p>
            </motion.div>
            
            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto"
            >
              {[
                {
                  name: "Rising Star",
                  campaigns: "3-9 completed campaigns",
                  bonus: "$100",
                  icon: Star,
                  description: "Start your journey and build your portfolio"
                },
                {
                  name: "Creator Pro",
                  campaigns: "10-19 completed campaigns",
                  bonus: "$200",
                  icon: Zap,
                  description: "Proven track record with consistent quality"
                },
                {
                  name: "Top Performer",
                  campaigns: "20-34 completed campaigns",
                  bonus: "$350",
                  icon: Trophy,
                  description: "Elite creator with exceptional results"
                },
                {
                  name: "Elite Creator",
                  campaigns: "35+ completed campaigns",
                  bonus: "$500",
                  icon: Crown,
                  description: "Industry leader with maximum rewards"
                }
              ].map((tier, index) => (
                <motion.div 
                  key={tier.name} 
                  variants={item}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  data-testid={`incentive-tier-${tier.name.toLowerCase().replace(' ', '-')}`}
                >
                  <Card className="flex flex-col h-full relative overflow-hidden transition-all duration-500 rounded-2xl group bg-card/50 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4 text-center">
                      <motion.div 
                        className="mx-auto mb-3 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-cyan-500/10 flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                      >
                        <tier.icon className="h-6 w-6 sm:h-7 sm:w-7 text-cyan-400" />
                      </motion.div>
                      <CardTitle className="text-lg sm:text-xl font-black">{tier.name}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">{tier.campaigns}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6 text-center space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300 tracking-tighter">{tier.bonus}</span>
                        <span className="text-sm text-muted-foreground font-medium">bonus</span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-bold">
                        Paid at milestone
                      </Badge>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{tier.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Brands Section */}
          <section>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-12"
            >
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/10 flex items-center justify-center shadow-lg shadow-pink-500/10">
                <Crown className="h-6 w-6 text-pink-500" />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight">For Brands</h2>
                <p className="text-muted-foreground">Scale your impact with top-tier Canadian creators</p>
              </div>
            </motion.div>

            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            >
              {brandTiers.map((tier) => (
                <motion.div key={tier.name} variants={item}>
                  <Card className={`flex flex-col h-full relative overflow-hidden transition-all duration-500 rounded-[2.5rem] bg-card/50 backdrop-blur-sm border-white/10 ${tier.popular ? 'border-pink-500/50 shadow-2xl shadow-pink-500/20 scale-105 z-10' : 'hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/20'}`}>
                    {tier.popular && (
                      <div className="absolute top-6 right-6">
                        <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold px-4 py-1 rounded-full uppercase tracking-widest text-[10px] shadow-lg shadow-pink-500/30">
                          Best Value
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="p-10 pb-6">
                      <CardTitle className="text-4xl font-black">{tier.name}</CardTitle>
                      <CardDescription className="text-lg font-medium">{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-10 px-10">
                      <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 tracking-tighter">{tier.price}</span>
                        {tier.price !== "Custom" && <span className="text-muted-foreground font-semibold">/month</span>}
                      </div>

                      {tier.name === "Campaign Starter" && brandOffers.length > 0 && (
                        <div className="p-6 rounded-3xl bg-pink-500/5 border border-pink-500/20 relative overflow-hidden group backdrop-blur-sm">
                          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Star size={80} />
                          </div>
                          <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] mb-2">Exclusive Partner Program</p>
                          {brandOffers.map(offer => (
                            <div key={offer.id}>
                              <p className="font-bold text-lg leading-tight mb-1">{offer.title}</p>
                              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{offer.description}</p>
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-3xl font-black text-pink-500">{offer.discount}</span>
                                <div className="bg-background/50 backdrop-blur-sm px-4 py-2 rounded-xl border-2 border-pink-500/30 text-sm font-mono font-bold tracking-wider">
                                  {offer.code}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {tier.name === "Enterprise" && (
                        <div className="p-6 rounded-3xl bg-secondary/30 border border-border/50">
                          <p className="text-sm font-medium text-muted-foreground mb-4">For custom enterprise solutions and payment links, please contact our official support team.</p>
                          <a 
                            href="mailto:TrueNorthUGCcanada@gmail.com" 
                            className="text-primary font-bold hover:underline break-all text-sm"
                          >
                            TrueNorthUGCcanada@gmail.com
                          </a>
                          <div className="mt-6">
                            <Button 
                              variant="outline" 
                              className="w-full h-12 rounded-xl border-2 font-bold"
                              onClick={() => window.location.href = "mailto:TrueNorthUGCcanada@gmail.com"}
                            >
                              Request Payment Link
                            </Button>
                          </div>
                        </div>
                      )}

                      <ul className="space-y-5">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-4 text-sm font-medium leading-relaxed">
                            <div className="mt-0.5 h-5 w-5 rounded-full bg-pink-500/10 flex items-center justify-center shrink-0">
                              <Check className="h-3 w-3 text-pink-500 stroke-[4]" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="p-10 pt-6">
                      <Button 
                        className={`w-full h-16 text-xl font-black rounded-3xl transition-all ${tier.popular ? 'bg-gradient-to-r from-pink-500 to-purple-500 border-0 shadow-2xl shadow-pink-500/40 hover:scale-[1.02] hover:shadow-pink-500/50' : ''}`} 
                        variant={tier.variant}
                        onClick={() => {
                          if (tier.name === "Campaign Starter") {
                            setLocation("/launch");
                          } else {
                            window.location.href = "/api/login";
                          }
                        }}
                      >
                        {tier.buttonText}
                        <ArrowRight className="ml-2 h-6 w-6" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>
        </div>
      </main>
    </div>
  );
}
