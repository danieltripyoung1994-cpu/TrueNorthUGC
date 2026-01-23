import { Link } from "wouter";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Sparkles, TrendingUp, Users } from "lucide-react";
import banffBg from "@assets/stock_images/scenic_background_of_f3c6840b.jpg";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center pt-16">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${banffBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background z-0" />
        </div>
        
        <div className="container relative mx-auto px-4 z-10">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-xl shadow-[0_0_20px_rgba(var(--primary),0.3)] animate-pulse"
            >
              <Sparkles className="mr-2 h-4 w-4 text-primary-foreground" />
              Made for Canadian Creators
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl font-black tracking-tight sm:text-8xl lg:text-9xl text-white drop-shadow-2xl leading-[1.1]"
            >
              Connect with Canada's <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-foreground to-white/80">Top UGC Creators</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl text-balance font-medium leading-relaxed drop-shadow-lg"
            >
              TrueNorthUGC is the premier platform for discovering authentic Canadian user-generated content creators. Find the perfect creator for your brand or showcase your talents to top companies.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto justify-center"
            >
              <Link href="/creators">
                <Button size="lg" className="text-xl px-10 py-8 rounded-3xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                  Browse Creators
                  <Search className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-xl px-10 py-8 rounded-3xl border-2 bg-white/5 hover:bg-white/10 text-white border-white/30 backdrop-blur-xl hover:scale-105 transition-all">
                  View Pricing
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Creators Across Every Niche</h2>
          <p className="text-xl text-muted-foreground">From fitness to tech, find specialists in any content category</p>
        </div>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 mb-24">
            {["Fitness", "Wellness", "Travel", "Tech", "Beauty", "Fashion", "Food", "Lifestyle", "Gaming", "Parenting"].map((niche) => (
              <div key={niche} className="px-6 py-3 bg-background rounded-full border border-border/50 shadow-sm font-bold text-lg hover-elevate cursor-default">
                {niche}
              </div>
            ))}
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Why TrueNorthUGC?</h2>
            <p className="text-xl text-muted-foreground">We're building the bridge between Canadian creators and the brands that need them.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Canadian Focus",
                description: "Exclusively featuring creators from across Canada, understanding local culture and markets."
              },
              {
                title: "Niche Matching",
                description: "Filter by niche, location, and platform to find the perfect creator for your campaign."
              },
              {
                title: "Quality Content",
                description: "Every creator is vetted to ensure high-quality, authentic content that resonates."
              },
              {
                title: "Secure Platform",
                description: "Direct communication with creators in a safe, professional environment."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background rounded-3xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-all"
              >
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Empowering <span className="text-primary">Brands</span> to Find the Perfect Voice
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Stop scrolling and start scaling. TrueNorthUGC is where top Canadian brands find vetted creators who deliver high-converting content.
              </p>
              
              <div className="space-y-4">
                <div className="p-6 bg-secondary/30 rounded-3xl border border-border/50">
                  <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    For Brands: Showcase Your Vision
                  </h3>
                  <p className="text-muted-foreground">
                    Build your brand profile, post your requirements, and let the best Canadian creators come to you. Show creators exactly what your brand is about.
                  </p>
                </div>
                
                {[
                  "Create a dedicated brand profile",
                  "Showcase your previous UGC collaborations",
                  "Direct access to creator portfolios and contact info",
                  "Find creators who actually match your brand's aesthetic"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
              
            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/api/login">
                  <Button size="lg" className="text-lg px-8 py-6 rounded-2xl shadow-xl shadow-primary/20">
                    Register as a Brand
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-2xl border-2">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 relative"
            >
              <div className="aspect-square rounded-3xl bg-secondary/30 relative overflow-hidden border border-border/50 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 space-y-4">
                   <div className="w-full h-1/2 bg-background rounded-2xl shadow-lg border p-6 space-y-4">
                      <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
                      <div className="h-8 w-full bg-muted/50 rounded animate-pulse" />
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-20 bg-muted/30 rounded-lg animate-pulse" />
                        <div className="h-20 bg-muted/30 rounded-lg animate-pulse delay-75" />
                        <div className="h-20 bg-muted/30 rounded-lg animate-pulse delay-150" />
                      </div>
                   </div>
                   <div className="w-4/5 h-1/3 bg-background/80 rounded-2xl shadow-md border p-6 space-y-3 backdrop-blur-sm translate-x-8 -translate-y-4">
                      <div className="h-3 w-1/4 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-full bg-muted/50 rounded animate-pulse" />
                      <div className="h-4 w-2/3 bg-muted/50 rounded animate-pulse" />
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-6"
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl opacity-90 mb-10 leading-relaxed"
          >
            Whether you're a creator looking to grow your business or a brand seeking authentic content, TrueNorthUGC is your platform.
          </motion.p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/api/login">
                  <Button size="lg" variant="secondary" className="text-lg px-10 py-7 rounded-2xl w-full sm:w-auto">
                    Join as Creator
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="text-lg px-10 py-7 rounded-2xl border-white/30 hover:bg-white/10 w-full sm:w-auto">
                    View Pricing
                  </Button>
                </Link>
              </div>
        </div>
      </section>

      <footer className="py-24 border-t bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-xl">T</div>
                <span className="text-2xl font-black tracking-tighter">TrueNorthUGC</span>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
                Canada's premier platform connecting authentic UGC creators with brands looking for genuine content that resonates.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Platform</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/creators" className="hover:text-primary transition-colors">Discover Creators</Link></li>
                <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><a href="/api/login" className="hover:text-primary transition-colors">Join as Creator</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Legal</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground">
            <p>© 2026 TrueNorthUGC. All rights reserved.</p>
            <p className="font-medium">Founded by Daniel Young.</p>
            <p className="flex items-center gap-1">Made with 🍁 in Canada</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
