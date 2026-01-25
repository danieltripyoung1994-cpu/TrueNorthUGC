import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Star, Crown, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Offer } from "@shared/schema";

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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-24 space-y-6"
        >
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-xl shadow-sm">
            <Star className="mr-2 h-4 w-4" />
            Official Partnership Programs
          </div>
          <h1 className="text-5xl font-black tracking-tighter sm:text-7xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
            Choose Your <span className="text-primary italic">Success</span> Path
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Whether you're a creator looking to showcase your work or a brand looking to scale, our official programs offer exclusive tools for elite performance.
          </p>
        </motion.div>

        <div className="space-y-32">
          {/* Creators Section */}
          <section>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-12"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight">For Creators</h2>
                <p className="text-muted-foreground">Monetize your talent with elite brand deals</p>
              </div>
            </motion.div>
            
            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            >
              {creatorTiers.map((tier) => (
                <motion.div key={tier.name} variants={item}>
                  <Card className={`flex flex-col h-full relative overflow-hidden transition-all duration-500 rounded-[2.5rem] ${tier.popular ? 'border-primary/20 shadow-2xl shadow-primary/10 scale-105 z-10' : 'hover:border-primary/50'}`}>
                    {tier.popular && (
                      <div className="absolute top-6 right-6">
                        <Badge className="bg-primary text-primary-foreground font-bold px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">
                          Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="p-10 pb-6">
                      <CardTitle className="text-4xl font-black">{tier.name}</CardTitle>
                      <CardDescription className="text-lg font-medium">{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-10 px-10">
                      <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-black text-primary tracking-tighter">{tier.price}</span>
                        <span className="text-muted-foreground font-semibold">/month</span>
                      </div>

                      {tier.name === "Exclusive" && creatorOffers.length > 0 && (
                        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden group">
                          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Crown size={80} />
                          </div>
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Limited Time Offer</p>
                          {creatorOffers.map(offer => (
                            <div key={offer.id}>
                              <p className="font-bold text-lg leading-tight mb-1">{offer.title}</p>
                              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{offer.description}</p>
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-3xl font-black text-primary">{offer.discount}</span>
                                <div className="bg-background px-4 py-2 rounded-xl border-2 border-primary/20 text-sm font-mono font-bold tracking-wider">
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
                            <div className="mt-0.5 h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                              <Check className="h-3 w-3 text-green-500 stroke-[4]" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="p-10 pt-6">
                      <Button 
                        className={`w-full h-16 text-xl font-black rounded-3xl transition-all ${tier.popular ? 'shadow-2xl shadow-primary/40 hover:scale-[1.02]' : ''}`} 
                        variant={tier.variant}
                        onClick={() => setLocation("/api/login")}
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
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Crown className="h-6 w-6 text-primary" />
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
                  <Card className={`flex flex-col h-full relative overflow-hidden transition-all duration-500 rounded-[2.5rem] ${tier.popular ? 'border-primary/20 shadow-2xl shadow-primary/10 scale-105 z-10' : 'hover:border-primary/50'}`}>
                    {tier.popular && (
                      <div className="absolute top-6 right-6">
                        <Badge className="bg-primary text-primary-foreground font-bold px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">
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
                        <span className="text-6xl font-black text-primary tracking-tighter">{tier.price}</span>
                        {tier.price !== "Custom" && <span className="text-muted-foreground font-semibold">/month</span>}
                      </div>

                      {tier.name === "Campaign Starter" && brandOffers.length > 0 && (
                        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden group">
                          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Star size={80} />
                          </div>
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Exclusive Partner Program</p>
                          {brandOffers.map(offer => (
                            <div key={offer.id}>
                              <p className="font-bold text-lg leading-tight mb-1">{offer.title}</p>
                              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{offer.description}</p>
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-3xl font-black text-primary">{offer.discount}</span>
                                <div className="bg-background px-4 py-2 rounded-xl border-2 border-primary/20 text-sm font-mono font-bold tracking-wider">
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
                            <div className="mt-0.5 h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                              <Check className="h-3 w-3 text-green-500 stroke-[4]" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="p-10 pt-6">
                      <Button 
                        className={`w-full h-16 text-xl font-black rounded-3xl transition-all ${tier.popular ? 'shadow-2xl shadow-primary/40 hover:scale-[1.02]' : ''}`} 
                        variant={tier.variant}
                        onClick={() => setLocation(tier.name === "Campaign Starter" ? "/launch" : "/api/login")}
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
