import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";

const Landing = lazy(() => import("@/pages/Landing"));
const Directory = lazy(() => import("@/pages/Directory"));
const Profile = lazy(() => import("@/pages/Profile"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const LaunchCampaign = lazy(() => import("@/pages/LaunchCampaign"));
const Campaigns = lazy(() => import("@/pages/Campaigns"));
const NotFound = lazy(() => import("@/pages/not-found"));

function PageLoader() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/directory" component={Directory} />
        <Route path="/creators" component={Directory} />
        <Route path="/creators/:handle" component={Profile} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/launch" component={LaunchCampaign} />
        <Route path="/campaigns" component={Campaigns} />
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
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
