import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Star, Crown, Zap, ArrowRight } from "lucide-react";
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
    title: "Pricing", 
    description: "Flexible pricing plans for creators and brands. Choose the perfect plan to grow your UGC business on TrueNorthUGC." 
  });
  const [, setLocation] = useLocation();
  const { data: offers } = useQuery<Offer[]>({
    queryKey: ["/api/offers"],
  });

  const creatorOffers = offers?.filter(o => o.target === "creator") || [];
  const brandOffers = offers?.filter(o => o.target === "brand") || [];

  const creatorTiers = [
    {
      name: "Free",
      price: "$0",
      description: "Start your creator journey",
      features: [
        "Make content",
        "Access to all brands",
        "Monetize your content",
        "Explore paid opportunities"
      ],
      buttonText: "Join for Free",
      variant: "outline" as const
    },
    {
      name: "Exclusive",
      price: "$19.99",
      description: "Maximize your earnings and visibility",
      features: [
        "Unlimited access to brand deals",
        "Verification badge",
        "Top picks for brands",
        "Top priority for all content",
        "Retainer agreements",
        "Tiered bonuses",
        "Exclusive creator community access",
        "Personal brand manager",
        "Advanced performance analytics"
      ],
      buttonText: "Go Exclusive",
      variant: "default" as const,
      popular: true,
      highlight: true
    }
  ];

  const brandTiers = [
    {
      name: "Campaign Starter",
      price: "$499",
      description: "Get high-quality UGC for your brand",
      features: [
        "Full access to contests and deals",
        "Vetted network of creators",
        "Spark Ad codes on winning submissions",
        "Lifetime Access to Winning Submissions",
        "Achieve Content-Market Fit Faster",
        "Validate content organically",
        "Dedicated campaign manager",
        "Custom content brief assistance"
      ],
      buttonText: "Start Campaign",
      variant: "default" as const,
      popular: true,
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Scale your UGC strategy",
      features: ["Unlimited Messaging", "Advanced Filtering", "Custom Briefs", "Dedicated Support"],
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
                        {tier.price !== "Custom" && <span className="text-sm sm:text-base text-muted-foreground font-semibold">/month</span>}
                      </div>

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
