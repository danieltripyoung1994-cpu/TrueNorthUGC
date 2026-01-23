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
      "Full access to contests and deals",
      "Access a vetted network of creators",
      "Access Spark Ad codes on winning submissions",
      "Lifetime Access to Winning Submissions",
      "Achieve Content-Market Fit Faster",
      "Validate content organically"
    ],
    bonus: "Book a free onboarding call to get expert tips and maximize ROI by only paying for top-performing content.",
    footer: "Cancel anytime"
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
                      <p className="text-xs text-muted-foreground">{packageDetails.footer}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                        Here's what you'll get
                      </h3>
                      <ul className="space-y-3">
                        {packageDetails.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary shrink-0" />
                            <span className="text-sm font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                        <h3 className="font-bold text-primary flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          BONUS
                        </h3>
                        <p className="text-sm leading-relaxed">
                          {packageDetails.bonus}
                        </p>
                      </div>
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
