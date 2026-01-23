import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

export default function Pricing() {
  const [, setLocation] = useLocation();

  const creatorTiers = [
    {
      name: "Starter",
      price: "$0",
      description: "Basic profile for new creators",
      features: ["Public Portfolio", "Up to 5 Portfolio Items", "Basic Analytics"],
      buttonText: "Join for Free",
      variant: "outline" as const
    },
    {
      name: "Pro",
      price: "$19",
      description: "Advanced tools for growing creators",
      features: ["Unlimited Portfolio Items", "Detailed Performance Insights", "Verified Badge", "Priority Directory Listing"],
      buttonText: "Upgrade to Pro",
      variant: "default" as const,
      popular: true
    }
  ];

  const brandTiers = [
    {
      name: "Brand Basic",
      price: "$49",
      description: "Find your first UGC creators",
      features: ["Search Directory", "Message up to 10 Creators/mo", "Basic Campaign Briefs"],
      buttonText: "Get Access",
      variant: "outline" as const
    },
    {
      name: "Enterprise",
      price: "$199",
      description: "Scale your UGC strategy",
      features: ["Unlimited Messaging", "Advanced Filtering", "Custom Briefs", "Dedicated Support"],
      buttonText: "Contact Sales",
      variant: "default" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Simple, Transparent <span className="text-primary">Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Whether you're a creator looking to showcase your work or a brand looking to scale, we have a plan for you.
          </p>
        </div>

        <div className="space-y-24">
          <section>
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">For Creators</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {creatorTiers.map((tier) => (
                <Card key={tier.name} className={`flex flex-col relative ${tier.popular ? 'border-primary shadow-lg shadow-primary/10' : ''}`}>
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={tier.variant}
                      onClick={() => setLocation("/api/login")}
                    >
                      {tier.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">For Brands</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {brandTiers.map((tier) => (
                <Card key={tier.name} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={tier.variant}
                      onClick={() => setLocation("/api/login")}
                    >
                      {tier.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
