import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

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
      <main className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Simple, Transparent <span className="text-primary">Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Whether you're a creator looking to showcase your work or a brand looking to scale, we have a plan for you.
          </p>
        </motion.div>

        <div className="space-y-24">
          <section>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-8"
            >
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">For Creators</h2>
            </motion.div>
            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
              {creatorTiers.map((tier) => (
                <motion.div key={tier.name} variants={item}>
                  <Card className={`flex flex-col h-full relative transition-all duration-300 ${tier.popular ? 'border-primary shadow-2xl shadow-primary/20 scale-105 z-10' : 'hover:border-primary/50'}`}>
                    {tier.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase shadow-lg">
                        Recommended
                      </div>
                    )}
                    <CardHeader className={`${tier.popular ? 'bg-primary/5' : ''}`}>
                      <CardTitle className="text-3xl font-black">{tier.name}</CardTitle>
                      <CardDescription className="text-base">{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-8 pt-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black text-primary">{tier.price}</span>
                        <span className="text-muted-foreground font-medium">/month</span>
                      </div>
                      <ul className="space-y-4">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${tier.popular ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            </div>
                            <span className={`text-sm ${tier.popular ? 'font-semibold' : 'font-medium'}`}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className={`pt-6 ${tier.popular ? 'bg-primary/5' : ''}`}>
                      <Button 
                        className={`w-full h-14 text-lg font-bold rounded-2xl transition-all ${tier.popular ? 'shadow-xl shadow-primary/30 hover:scale-[1.02]' : ''}`} 
                        variant={tier.variant}
                        onClick={() => setLocation("/api/login")}
                      >
                        {tier.buttonText}
                        {tier.popular && <Sparkles className="ml-2 h-5 w-5" />}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>

          <section>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-8"
            >
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">For Brands</h2>
            </motion.div>
            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
              {brandTiers.map((tier) => (
                <motion.div key={tier.name} variants={item}>
                  <Card className={`flex flex-col h-full relative transition-all duration-300 ${tier.popular ? 'border-primary shadow-2xl shadow-primary/20 scale-105 z-10' : 'hover:border-primary/50'}`}>
                    {tier.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase shadow-lg">
                        Best Value
                      </div>
                    )}
                    <CardHeader className={`${tier.popular ? 'bg-primary/5' : ''}`}>
                      <CardTitle className="text-3xl font-black">{tier.name}</CardTitle>
                      <CardDescription className="text-base">{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-8 pt-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black text-primary">{tier.price}</span>
                        {tier.price !== "Custom" && <span className="text-muted-foreground font-medium">/month</span>}
                      </div>
                      <ul className="space-y-4">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${tier.popular ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            </div>
                            <span className={`text-sm ${tier.popular ? 'font-semibold' : 'font-medium'}`}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className={`pt-6 ${tier.popular ? 'bg-primary/5' : ''}`}>
                      <Button 
                        className={`w-full h-14 text-lg font-bold rounded-2xl transition-all ${tier.popular ? 'shadow-xl shadow-primary/30 hover:scale-[1.02]' : ''}`} 
                        variant={tier.variant}
                        onClick={() => setLocation(tier.name === "Campaign Starter" ? "/launch" : "/api/login")}
                      >
                        {tier.buttonText}
                        {tier.popular && <Sparkles className="ml-2 h-5 w-5" />}
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
