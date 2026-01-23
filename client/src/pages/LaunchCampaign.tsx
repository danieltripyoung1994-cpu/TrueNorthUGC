import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ShieldCheck, Clock, Video, Zap, ArrowRight, Play } from "lucide-react";
import { useLocation } from "wouter";

export default function LaunchCampaign() {
  const [, setLocation] = useLocation();

  const packageDetails = {
    name: "Starter",
    price: "$499",
    features: [
      "3 short-form UGC videos (15–30s)",
      "Optimized for TikTok, Reels & ads",
      "Creator matching included",
      "1 light revision",
      "Delivery in 7–10 days"
    ],
    upsells: [
      { name: "Extra Video", price: "+$150" },
      { name: "Raw Footage", price: "+$100" },
      { name: "Ad Usage Rights", price: "+$200" }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Launch Your <span className="text-primary">UGC Campaign</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get high-performing video content from vetted creators in less than two weeks.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Package details */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-primary shadow-lg overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl">{packageDetails.name} Package</CardTitle>
                      <CardDescription>Everything you need to start scaling with UGC</CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-primary">{packageDetails.price}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                        Included in this package
                      </h3>
                      <ul className="space-y-3">
                        {packageDetails.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                        Available Add-ons
                      </h3>
                      <ul className="space-y-3">
                        {packageDetails.upsells.map((upsell) => (
                          <li key={upsell.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border">
                            <span className="text-sm font-medium">{upsell.name}</span>
                            <span className="text-sm font-bold text-primary">{upsell.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 border-t flex flex-col sm:flex-row gap-4 p-6">
                  <Button size="lg" className="w-full sm:w-auto px-12 text-lg h-12 shadow-primary/20 shadow-lg" onClick={() => setLocation("/api/login")}>
                    Start Campaign <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <ShieldCheck className="h-4 w-4" />
                    Secure Checkout by Stripe
                  </div>
                </CardFooter>
              </Card>

              {/* How it works */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Zap className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold">Fast Matching</h4>
                  <p className="text-sm text-muted-foreground">We match you with the best-fit creators for your specific niche within 48 hours.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Video className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold">Content Creation</h4>
                  <p className="text-sm text-muted-foreground">Creators receive your product and brief, then film high-energy content optimized for conversion.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Clock className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold">Quick Delivery</h4>
                  <p className="text-sm text-muted-foreground">Receive your edited, ready-to-use videos directly in your dashboard within 10 days.</p>
                </div>
              </div>
            </div>

            {/* Sidebar / Trust builders */}
            <aside className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">See Example Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-[9/16] bg-muted rounded-xl relative group overflow-hidden cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&h=533&fit=crop" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="UGC Example" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Play className="h-6 w-6 text-white fill-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm border-0">SAMPLE - WATERMARKED</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4 p-4 border rounded-xl bg-muted/30">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
                  <div className="space-y-1">
                    <h5 className="font-bold text-sm">Vetted Creators Only</h5>
                    <p className="text-xs text-muted-foreground">We manually review every creator. Only the top 5% of applicants make it onto our platform.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-6 w-6 text-primary shrink-0" />
                  <div className="space-y-1">
                    <h5 className="font-bold text-sm">Reshoot Guarantee</h5>
                    <p className="text-xs text-muted-foreground">If the content doesn't meet your brief, we'll arrange a reshoot or a full refund. No questions asked.</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
