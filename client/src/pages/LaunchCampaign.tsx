import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ShieldCheck, Clock, Video, Zap, ArrowRight } from "lucide-react";
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

export default function LaunchCampaign() {
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
    footer: "Cancel anytime"
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Launch Your <span className="text-primary">UGC Campaign</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get high-performing video content from vetted creators in less than two weeks.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Package details */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-8"
            >
              <Card className="border-primary shadow-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl font-black">{packageDetails.name} Package</CardTitle>
                      <CardDescription>Everything you need to start scaling with UGC</CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="text-4xl font-black text-primary">{packageDetails.price}</span>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{packageDetails.footer}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="font-bold flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Included Features
                      </h3>
                      <ul className="space-y-4">
                        {packageDetails.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <Check className="h-3.5 w-3.5 text-primary stroke-[3]" />
                            </div>
                            <span className="text-sm font-semibold">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 border-t flex flex-col sm:flex-row gap-6 p-8">
                  <Button size="lg" className="w-full sm:w-auto px-12 text-lg h-14 font-bold shadow-primary/30 shadow-2xl hover:scale-[1.02] transition-transform" onClick={() => window.location.href = "/api/login"}>
                    Start Campaign <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <div className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Secure Checkout by Stripe
                  </div>
                </CardFooter>
              </Card>

              {/* How it works */}
              <motion.div 
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid md:grid-cols-3 gap-8"
              >
                <motion.div variants={item} className="space-y-3 p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2 shadow-inner">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-lg">Fast Matching</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">We match you with the best-fit creators for your specific niche within 48 hours.</p>
                </motion.div>
                <motion.div variants={item} className="space-y-3 p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2 shadow-inner">
                    <Video className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-lg">Content Creation</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Creators receive your product and brief, then film high-energy content optimized for conversion.</p>
                </motion.div>
                <motion.div variants={item} className="space-y-3 p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2 shadow-inner">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-lg">Quick Delivery</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Receive your edited, ready-to-use videos directly in your dashboard within 10 days.</p>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Sidebar / Trust builders */}
            <motion.aside 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-6 p-6 border rounded-3xl bg-muted/20 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-sm">Vetted Creators Only</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">We manually review every creator. Only the top 5% of applicants make it onto our platform.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Clock className="h-6 w-6 text-primary shrink-0" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-sm">Reshoot Guarantee</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">If the content doesn't meet your brief, we'll arrange a reshoot or a full refund. No questions asked.</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </main>
    </div>
  );
}
