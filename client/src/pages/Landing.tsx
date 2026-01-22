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
              className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-xl"
            >
              <Sparkles className="mr-2 h-4 w-4 text-primary-foreground" />
              The #1 Platform for UGC Creators
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl font-black tracking-tight sm:text-8xl lg:text-9xl text-white drop-shadow-2xl leading-[1.1]"
            >
              Showcase your <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-foreground to-white/80">Creative Genius</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl text-balance font-medium leading-relaxed drop-shadow-lg"
            >
              Build a stunning portfolio, connect with top brands, and grow your UGC career. 
              The premium directory for elite content creators.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
            >
              <Link href="/creators">
                <Button size="lg" className="text-xl px-10 py-8 rounded-3xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                  Browse Creators
                  <Search className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <a href="/api/login">
                <Button size="lg" variant="outline" className="text-xl px-10 py-8 rounded-3xl border-2 bg-white/5 hover:bg-white/10 text-white border-white/30 backdrop-blur-xl hover:scale-105 transition-all">
                  Join as Creator
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Public Profile",
                description: "Get a beautiful, shareable profile page that highlights your best work and social stats."
              },
              {
                icon: TrendingUp,
                title: "Brand Discovery",
                description: "Get discovered by brands looking for authentic creators in your specific niche."
              },
              {
                icon: Sparkles,
                title: "Showcase Portfolio",
                description: "Display your best UGC videos and content in a high-quality, professional grid."
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
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2026 TrueNorthUGC. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
