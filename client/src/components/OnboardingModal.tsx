import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useMyCreatorProfile } from "@/hooks/use-creators";
import { useBrand } from "@/hooks/use-brand";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Camera,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  Users,
  Star,
} from "lucide-react";

const NICHES = ["Fitness", "Beauty", "Tech", "Travel", "Food", "Fashion", "Lifestyle", "Gaming", "Health", "Finance", "Pets", "Parenting"];
const INDUSTRIES = ["Beauty & Skincare", "Fashion & Apparel", "Food & Beverage", "Tech & Electronics", "Health & Wellness", "Home & Lifestyle", "Fitness & Sports", "Pet Products", "Finance & Fintech", "Travel & Tourism", "Gaming", "Education"];

const STORAGE_KEY = "tn_onboarding_done";

const fadeSlide = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export function OnboardingModal() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: creatorProfile, isLoading: creatorLoading } = useMyCreatorProfile();
  const { brand: brandProfile, isLoading: brandLoading } = useBrand();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<"creator" | "brand" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [creatorForm, setCreatorForm] = useState({
    name: "",
    handle: "",
    bio: "",
    location: "",
    niches: [] as string[],
    experienceLevel: "Beginner",
  });

  const [brandForm, setBrandForm] = useState({
    name: "",
    industry: "",
    description: "",
    website: "",
    location: "",
  });

  useEffect(() => {
    if (authLoading || creatorLoading || brandLoading) return;
    if (!isAuthenticated) return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    if (creatorProfile || brandProfile) {
      localStorage.setItem(STORAGE_KEY, "1");
      return;
    }
    const timer = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(timer);
  }, [isAuthenticated, authLoading, creatorProfile, brandProfile, creatorLoading, brandLoading]);

  useEffect(() => {
    if (user?.firstName || user?.lastName) {
      const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
      setCreatorForm((f) => ({ ...f, name: fullName }));
      setBrandForm((f) => ({ ...f, name: fullName }));
    }
  }, [user]);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  function toggleNiche(niche: string) {
    setCreatorForm((f) => ({
      ...f,
      niches: f.niches.includes(niche)
        ? f.niches.filter((n) => n !== niche)
        : [...f.niches, niche],
    }));
  }

  async function submitCreator() {
    if (!creatorForm.name.trim() || !creatorForm.handle.trim()) {
      toast({ title: "Please fill in your name and handle.", variant: "destructive" });
      return;
    }
    const slug = creatorForm.handle.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (!slug) {
      toast({ title: "Handle can only contain letters, numbers, and underscores.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await apiRequest("PUT", "/api/creators/me", {
        name: creatorForm.name.trim(),
        handle: slug,
        bio: creatorForm.bio.trim() || null,
        location: creatorForm.location.trim() || null,
        niches: creatorForm.niches,
        experienceLevel: creatorForm.experienceLevel,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/creators/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/creators"] });
      setStep(3);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Could not create your profile.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitBrand() {
    if (!brandForm.name.trim()) {
      toast({ title: "Please enter your brand name.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await apiRequest("PUT", "/api/brands/me", {
        name: brandForm.name.trim(),
        industry: brandForm.industry || null,
        description: brandForm.description.trim() || null,
        website: brandForm.website.trim() || null,
        location: brandForm.location.trim() || null,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/brands/me"] });
      setStep(3);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Could not create your brand profile.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  function finish() {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
    navigate("/dashboard");
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) dismiss(); }}>
      <DialogContent className="max-w-lg w-full bg-[#0d0d14] border border-white/10 p-0 overflow-hidden rounded-2xl">
        {/* Progress bar */}
        <div className="h-1 bg-white/10 w-full">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
            style={{ width: `${step === 0 ? 10 : step === 1 ? 40 : step === 2 ? 75 : 100}%` }}
          />
        </div>

        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">

            {/* Step 0 — Welcome + Role choice */}
            {step === 0 && (
              <motion.div key="step0" {...fadeSlide} transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  <span className="text-xs font-semibold text-pink-400 uppercase tracking-widest">Welcome to TrueNorthUGC</span>
                </div>
                <h2 className="text-2xl font-black text-white mt-2 mb-1">
                  Let's set up your account
                </h2>
                <p className="text-white/50 text-sm mb-8">
                  Takes 60 seconds. Tell us who you are so we can personalize your experience.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => { setRole("creator"); setStep(1); }}
                    data-testid="onboard-choose-creator"
                    className="group relative rounded-2xl border border-white/10 bg-white/5 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all p-6 text-left"
                  >
                    <Camera className="w-8 h-8 text-pink-400 mb-3" />
                    <h3 className="font-bold text-white text-lg leading-tight">I'm a Creator</h3>
                    <p className="text-white/50 text-xs mt-1 leading-relaxed">I create UGC content for brands</p>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 text-pink-400" />
                    </div>
                  </button>

                  <button
                    onClick={() => { setRole("brand"); setStep(1); }}
                    data-testid="onboard-choose-brand"
                    className="group relative rounded-2xl border border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all p-6 text-left"
                  >
                    <Building2 className="w-8 h-8 text-purple-400 mb-3" />
                    <h3 className="font-bold text-white text-lg leading-tight">I'm a Brand</h3>
                    <p className="text-white/50 text-xs mt-1 leading-relaxed">I want to hire Canadian creators</p>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 text-purple-400" />
                    </div>
                  </button>
                </div>

                <button
                  onClick={dismiss}
                  className="w-full mt-6 text-xs text-white/30 hover:text-white/50 transition-colors text-center"
                >
                  Skip for now
                </button>
              </motion.div>
            )}

            {/* Step 1 — Creator basic info */}
            {step === 1 && role === "creator" && (
              <motion.div key="step1-creator" {...fadeSlide} transition={{ duration: 0.3 }}>
                <h2 className="text-xl font-black text-white mb-1">Build your creator profile</h2>
                <p className="text-white/50 text-sm mb-6">This is what brands see when they discover you.</p>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5 block">Full Name *</label>
                    <Input
                      value={creatorForm.name}
                      onChange={(e) => setCreatorForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Your full name"
                      data-testid="onboard-creator-name"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5 block">Creator Handle *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">@</span>
                      <Input
                        value={creatorForm.handle}
                        onChange={(e) => setCreatorForm((f) => ({ ...f, handle: e.target.value.replace(/[^a-zA-Z0-9_]/g, "") }))}
                        placeholder="yourhandle"
                        data-testid="onboard-creator-handle"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl pl-7"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5 block">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <Input
                        value={creatorForm.location}
                        onChange={(e) => setCreatorForm((f) => ({ ...f, location: e.target.value }))}
                        placeholder="e.g. Toronto, ON"
                        data-testid="onboard-creator-location"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2 block">Your Niches</label>
                    <div className="flex flex-wrap gap-2">
                      {NICHES.map((n) => (
                        <Badge
                          key={n}
                          onClick={() => toggleNiche(n)}
                          data-testid={`onboard-niche-${n.toLowerCase()}`}
                          className={`cursor-pointer text-xs transition-all ${
                            creatorForm.niches.includes(n)
                              ? "bg-pink-500/30 text-pink-300 border-pink-500/50"
                              : "bg-white/5 text-white/50 border-white/10 hover:border-white/20"
                          }`}
                        >
                          {n}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="ghost"
                    onClick={() => setStep(0)}
                    className="text-white/40 hover:text-white"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!creatorForm.name.trim() || !creatorForm.handle.trim()}
                    data-testid="onboard-creator-next"
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold"
                  >
                    Next <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2 — Creator bio */}
            {step === 2 && role === "creator" && (
              <motion.div key="step2-creator" {...fadeSlide} transition={{ duration: 0.3 }}>
                <h2 className="text-xl font-black text-white mb-1">One last thing</h2>
                <p className="text-white/50 text-sm mb-6">Write a short bio. Brands read this before reaching out.</p>

                <Textarea
                  value={creatorForm.bio}
                  onChange={(e) => setCreatorForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="I create authentic UGC content for Canadian brands in the beauty and wellness space. 3 years experience, fast turnaround, and conversion-focused content."
                  data-testid="onboard-creator-bio"
                  rows={5}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl resize-none"
                />
                <p className="text-xs text-white/30 mt-1">{creatorForm.bio.length}/300 characters</p>

                <div className="flex gap-3 mt-6">
                  <Button variant="ghost" onClick={() => setStep(1)} className="text-white/40 hover:text-white">Back</Button>
                  <Button
                    onClick={submitCreator}
                    disabled={isSubmitting}
                    data-testid="onboard-creator-submit"
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold"
                  >
                    {isSubmitting ? "Creating profile..." : "Create My Profile"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 1 — Brand basic info */}
            {step === 1 && role === "brand" && (
              <motion.div key="step1-brand" {...fadeSlide} transition={{ duration: 0.3 }}>
                <h2 className="text-xl font-black text-white mb-1">Set up your brand profile</h2>
                <p className="text-white/50 text-sm mb-6">Creators see this when you reach out to them.</p>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5 block">Brand / Company Name *</label>
                    <Input
                      value={brandForm.name}
                      onChange={(e) => setBrandForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Your brand name"
                      data-testid="onboard-brand-name"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5 block">Industry</label>
                    <div className="flex flex-wrap gap-2">
                      {INDUSTRIES.map((ind) => (
                        <Badge
                          key={ind}
                          onClick={() => setBrandForm((f) => ({ ...f, industry: f.industry === ind ? "" : ind }))}
                          data-testid={`onboard-industry-${ind.toLowerCase().replace(/[^a-z]/g, "")}`}
                          className={`cursor-pointer text-xs transition-all ${
                            brandForm.industry === ind
                              ? "bg-purple-500/30 text-purple-300 border-purple-500/50"
                              : "bg-white/5 text-white/50 border-white/10 hover:border-white/20"
                          }`}
                        >
                          {ind}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5 block">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <Input
                        value={brandForm.location}
                        onChange={(e) => setBrandForm((f) => ({ ...f, location: e.target.value }))}
                        placeholder="e.g. Vancouver, BC"
                        data-testid="onboard-brand-location"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1.5 block">Website</label>
                    <Input
                      value={brandForm.website}
                      onChange={(e) => setBrandForm((f) => ({ ...f, website: e.target.value }))}
                      placeholder="https://yourbrand.ca"
                      data-testid="onboard-brand-website"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="ghost" onClick={() => setStep(0)} className="text-white/40 hover:text-white">Back</Button>
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!brandForm.name.trim()}
                    data-testid="onboard-brand-next"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl font-bold"
                  >
                    Next <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2 — Brand description */}
            {step === 2 && role === "brand" && (
              <motion.div key="step2-brand" {...fadeSlide} transition={{ duration: 0.3 }}>
                <h2 className="text-xl font-black text-white mb-1">Describe your brand</h2>
                <p className="text-white/50 text-sm mb-6">A short description helps creators understand what you're about.</p>

                <Textarea
                  value={brandForm.description}
                  onChange={(e) => setBrandForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="We're a Canadian skincare brand focused on clean, science-backed formulations. We're looking for authentic UGC creators who love beauty and wellness."
                  data-testid="onboard-brand-description"
                  rows={5}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl resize-none"
                />

                <div className="flex gap-3 mt-6">
                  <Button variant="ghost" onClick={() => setStep(1)} className="text-white/40 hover:text-white">Back</Button>
                  <Button
                    onClick={submitBrand}
                    disabled={isSubmitting}
                    data-testid="onboard-brand-submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl font-bold"
                  >
                    {isSubmitting ? "Creating profile..." : "Create Brand Profile"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3 — Success */}
            {step === 3 && (
              <motion.div key="step3" {...fadeSlide} transition={{ duration: 0.3 }} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-pink-400" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">You're all set! 🎉</h2>
                <p className="text-white/50 text-sm mb-8">
                  {role === "creator"
                    ? "Your creator profile is live. Brands can now discover and message you."
                    : "Your brand profile is ready. Start browsing Canadian creators now."}
                </p>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {role === "creator" ? (
                    <>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                        <Users className="w-5 h-5 text-pink-400 mx-auto mb-1" />
                        <p className="text-xs text-white/50">Complete your profile</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                        <Camera className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                        <p className="text-xs text-white/50">Add portfolio videos</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                        <Star className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                        <p className="text-xs text-white/50">Browse active deals</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                        <Users className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                        <p className="text-xs text-white/50">Browse creators</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                        <Sparkles className="w-5 h-5 text-pink-400 mx-auto mb-1" />
                        <p className="text-xs text-white/50">Post a campaign</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                        <Star className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                        <p className="text-xs text-white/50">Upgrade your plan</p>
                      </div>
                    </>
                  )}
                </div>

                <Button
                  onClick={finish}
                  data-testid="onboard-finish"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold"
                >
                  Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
