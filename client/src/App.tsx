import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Directory from "@/pages/Directory";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import Pricing from "@/pages/Pricing";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/creators" component={Directory} />
      <Route path="/creators/:handle" component={Profile} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/pricing" component={Pricing} />
      <Route component={NotFound} />
    </Switch>
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
