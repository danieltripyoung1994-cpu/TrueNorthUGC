import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { AiChatWidget } from "@/components/AiChatWidget";
import logoImage from "@assets/Photoroom_20260131_221621_1769915813253.png";

const Landing = lazy(() => import("@/pages/Landing"));
const Directory = lazy(() => import("@/pages/Directory"));
const Profile = lazy(() => import("@/pages/Profile"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const LaunchCampaign = lazy(() => import("@/pages/LaunchCampaign"));
const Campaigns = lazy(() => import("@/pages/Campaigns"));
const Contact = lazy(() => import("@/pages/Contact"));
const Brands = lazy(() => import("@/pages/Brands"));
const About = lazy(() => import("@/pages/About"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const UGCRateCalculator = lazy(() => import("@/pages/UGCRateCalculator"));
const ProgrammaticSEO = lazy(() => import("@/pages/ProgrammaticSEO"));
const NotFound = lazy(() => import("@/pages/not-found"));

function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col justify-center items-center bg-background">
      <div className="relative flex flex-col items-center gap-6">
        <div className="absolute -inset-20 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl rounded-full animate-pulse" />
        <div className="relative">
          <img 
            src={logoImage} 
            alt="TrueNorthUGC" 
            width={144}
            height={144}
            loading="eager"
            className="w-28 h-28 sm:w-36 sm:h-36 object-contain animate-ios-breathe mix-blend-lighten drop-shadow-[0_0_30px_rgba(255,0,128,0.4)]" 
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">
            TrueNorthUGC
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Landing} />
        {/* SEO programmatic pages — must come before /creators/:handle */}
        <Route path="/city/:slug" component={ProgrammaticSEO} />
        <Route path="/niche/:slug" component={ProgrammaticSEO} />
        <Route path="/hire/:slug" component={ProgrammaticSEO} />
        {/* Main pages */}
        <Route path="/directory" component={Directory} />
        <Route path="/creators" component={Directory} />
        <Route path="/creators/:handle" component={Profile} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/launch" component={LaunchCampaign} />
        <Route path="/campaigns" component={Campaigns} />
        <Route path="/brands" component={Brands} />
        <Route path="/contact" component={Contact} />
        {/* New pages */}
        <Route path="/about" component={About} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/tools/ugc-rate-calculator" component={UGCRateCalculator} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <FeedbackWidget />
        <AiChatWidget />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
