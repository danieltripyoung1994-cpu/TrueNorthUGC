import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateCampaign, useUpdateCampaign } from "@/hooks/use-campaigns";
import { type Campaign } from "@shared/schema";
import { Loader2, Plus, X, ChevronDown, ChevronUp, Video, Instagram, Youtube, Hash, AtSign, Sparkles, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const NICHES = ["Fitness", "Beauty", "Tech", "Travel", "Food", "Fashion", "Lifestyle", "Gaming", "Parenting", "Wellness", "Home", "Pets"];
const PLATFORMS = [
  { id: "tiktok", label: "TikTok", icon: Video },
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "youtube", label: "YouTube", icon: Youtube },
  { id: "twitter", label: "X (Twitter)", icon: null },
  { id: "facebook", label: "Facebook", icon: null },
];

const CAMPAIGN_TYPES = [
  { value: "product_review", label: "Product Review" },
  { value: "testimonial", label: "Testimonial" },
  { value: "unboxing", label: "Unboxing" },
  { value: "tutorial", label: "Tutorial / How-To" },
  { value: "lifestyle", label: "Lifestyle Integration" },
  { value: "brand_awareness", label: "Brand Awareness" },
  { value: "challenge", label: "Challenge / Trend" },
  { value: "giveaway", label: "Giveaway Promo" },
];

const EXPERIENCE_LEVELS = [
  { value: "any", label: "Any Level" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "pro", label: "Pro" },
  { value: "elite", label: "Elite Only" },
];

const COMPENSATION_TYPES = [
  { value: "fixed", label: "Fixed Payment" },
  { value: "product_gifting", label: "Product Gifting Only" },
  { value: "commission", label: "Commission Based" },
  { value: "hybrid", label: "Payment + Product" },
  { value: "negotiable", label: "Negotiable" },
];

const CONTENT_STYLES = [
  { value: "professional", label: "Professional / Polished" },
  { value: "casual", label: "Casual / Relatable" },
  { value: "authentic", label: "Raw / Authentic UGC" },
  { value: "cinematic", label: "Cinematic" },
  { value: "comedic", label: "Comedic / Fun" },
];

const USAGE_RIGHTS = [
  { value: "30_days", label: "30 Days" },
  { value: "90_days", label: "90 Days" },
  { value: "6_months", label: "6 Months" },
  { value: "1_year", label: "1 Year" },
  { value: "perpetual", label: "Perpetual / Forever" },
  { value: "negotiable", label: "Negotiable" },
];

const EXCLUSIVITY_OPTIONS = [
  { value: "none", label: "No Exclusivity" },
  { value: "category", label: "Category Exclusive" },
  { value: "full", label: "Full Exclusivity" },
];

const campaignFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().optional(),
  budget: z.string().optional(),
  deadline: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["active", "paused", "closed"]),
  campaignType: z.string().optional(),
  experienceLevel: z.string().optional(),
  compensationType: z.string().optional(),
  contentStyle: z.string().optional(),
  usageRights: z.string().optional(),
  exclusivity: z.string().optional(),
  productProvided: z.string().optional(),
  creatorCount: z.preprocess((val) => val === "" || val === undefined ? undefined : Number(val), z.number().optional()),
  applicationDeadline: z.string().optional(),
  briefDocument: z.string().optional(),
});

type CampaignFormValues = z.infer<typeof campaignFormSchema>;

interface CampaignFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign?: Campaign | null;
}

export function CampaignFormModal({ open, onOpenChange, campaign }: CampaignFormModalProps) {
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const isEditing = !!campaign;
  const { toast } = useToast();
  
  const [niches, setNiches] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [mentions, setMentions] = useState<string[]>([]);
  const [newDeliverable, setNewDeliverable] = useState("");
  const [newHashtag, setNewHashtag] = useState("");
  const [newMention, setNewMention] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [aiProductName, setAiProductName] = useState("");
  const [aiProductDesc, setAiProductDesc] = useState("");
  const [aiGoal, setAiGoal] = useState("");
  const [aiAudience, setAiAudience] = useState("");

  const generateBriefMutation = useMutation({
    mutationFn: async (data: { productName: string; productDescription: string; campaignGoal: string; targetAudience: string; budget: string; platforms: string[] }) => {
      return apiRequest("/api/ai/generate-brief", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (response: any) => {
      const brief = response.brief;
      if (brief) {
        form.setValue("title", brief.title || "");
        form.setValue("description", brief.description || "");
        form.setValue("requirements", brief.requirements || "");
        form.setValue("contentStyle", brief.contentStyle || "");
        if (brief.deliverables?.length) {
          setDeliverables(brief.deliverables);
        }
        if (brief.hashtags?.length) {
          setHashtags(brief.hashtags);
        }
        setShowAiGenerator(false);
        toast({ title: "Brief generated!", description: "AI has created your campaign brief. Feel free to customize it." });
      }
    },
    onError: () => {
      toast({ title: "Generation failed", description: "Please try again or fill in the form manually.", variant: "destructive" });
    }
  });

  const handleGenerateBrief = () => {
    if (!aiProductName || !aiGoal) {
      toast({ title: "Missing info", description: "Please enter product name and campaign goal.", variant: "destructive" });
      return;
    }
    generateBriefMutation.mutate({
      productName: aiProductName,
      productDescription: aiProductDesc,
      campaignGoal: aiGoal,
      targetAudience: aiAudience,
      budget: form.getValues("budget") || "",
      platforms,
    });
  };

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      budget: "",
      deadline: "",
      location: "",
      status: "active",
      campaignType: "",
      experienceLevel: "any",
      compensationType: "fixed",
      contentStyle: "",
      usageRights: "",
      exclusivity: "none",
      productProvided: "",
      creatorCount: undefined,
      applicationDeadline: "",
      briefDocument: "",
    },
  });

  useEffect(() => {
    if (campaign) {
      form.reset({
        title: campaign.title,
        description: campaign.description,
        requirements: campaign.requirements || "",
        budget: campaign.budget || "",
        deadline: campaign.deadline ? campaign.deadline.split("T")[0] : "",
        location: campaign.location || "",
        status: campaign.status as "active" | "paused" | "closed",
        campaignType: campaign.campaignType || "",
        experienceLevel: campaign.experienceLevel || "any",
        compensationType: campaign.compensationType || "fixed",
        contentStyle: campaign.contentStyle || "",
        usageRights: campaign.usageRights || "",
        exclusivity: campaign.exclusivity || "none",
        productProvided: campaign.productProvided || "",
        creatorCount: campaign.creatorCount || undefined,
        applicationDeadline: campaign.applicationDeadline ? campaign.applicationDeadline.split("T")[0] : "",
        briefDocument: campaign.briefDocument || "",
      });
      setNiches(campaign.niches || []);
      setPlatforms(campaign.platforms || []);
      setDeliverables(campaign.deliverables || []);
      setHashtags(campaign.hashtags || []);
      setMentions(campaign.mentions || []);
    } else {
      form.reset({
        title: "",
        description: "",
        requirements: "",
        budget: "",
        deadline: "",
        location: "",
        status: "active",
        campaignType: "",
        experienceLevel: "any",
        compensationType: "fixed",
        contentStyle: "",
        usageRights: "",
        exclusivity: "none",
        productProvided: "",
        creatorCount: undefined,
        applicationDeadline: "",
        briefDocument: "",
      });
      setNiches([]);
      setPlatforms([]);
      setDeliverables([]);
      setHashtags([]);
      setMentions([]);
    }
  }, [campaign, form]);

  const toggleNiche = (niche: string) => {
    setNiches(prev => 
      prev.includes(niche) 
        ? prev.filter(n => n !== niche)
        : [...prev, niche]
    );
  };

  const togglePlatform = (platform: string) => {
    setPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      setDeliverables(prev => [...prev, newDeliverable.trim()]);
      setNewDeliverable("");
    }
  };

  const removeDeliverable = (index: number) => {
    setDeliverables(prev => prev.filter((_, i) => i !== index));
  };

  const addHashtag = () => {
    if (newHashtag.trim()) {
      const tag = newHashtag.startsWith("#") ? newHashtag.trim() : `#${newHashtag.trim()}`;
      setHashtags(prev => [...prev, tag]);
      setNewHashtag("");
    }
  };

  const removeHashtag = (index: number) => {
    setHashtags(prev => prev.filter((_, i) => i !== index));
  };

  const addMention = () => {
    if (newMention.trim()) {
      const mention = newMention.startsWith("@") ? newMention.trim() : `@${newMention.trim()}`;
      setMentions(prev => [...prev, mention]);
      setNewMention("");
    }
  };

  const removeMention = (index: number) => {
    setMentions(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CampaignFormValues) => {
    const campaignData = {
      ...data,
      niches,
      platforms,
      deliverables,
      hashtags,
      mentions,
      deadline: data.deadline || null,
      requirements: data.requirements || null,
      budget: data.budget || null,
      location: data.location || null,
      campaignType: data.campaignType || null,
      experienceLevel: data.experienceLevel || null,
      compensationType: data.compensationType || null,
      contentStyle: data.contentStyle || null,
      usageRights: data.usageRights || null,
      exclusivity: data.exclusivity || null,
      productProvided: data.productProvided || null,
      creatorCount: data.creatorCount || null,
      applicationDeadline: data.applicationDeadline || null,
      briefDocument: data.briefDocument || null,
    };

    try {
      if (isEditing && campaign) {
        await updateCampaign.mutateAsync({ id: campaign.id, data: campaignData });
      } else {
        await createCampaign.mutateAsync(campaignData);
      }
      onOpenChange(false);
    } catch (e) {}
  };

  const isPending = createCampaign.isPending || updateCampaign.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" data-testid="text-campaign-form-title">
            {isEditing ? "Edit Campaign" : "Create New Campaign"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Update your campaign details" : "Customize your campaign to find the perfect creators"}
          </DialogDescription>
        </DialogHeader>

        {!isEditing && (
          <div className="mb-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAiGenerator(!showAiGenerator)}
              className="w-full border-dashed border-pink-500/50 hover:border-pink-500 text-pink-500 hover:bg-pink-500/10"
              data-testid="button-ai-generator-toggle"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {showAiGenerator ? "Hide AI Brief Generator" : "Generate Brief with AI"}
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
            
            <AnimatePresence>
              {showAiGenerator && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-pink-400">
                      <Sparkles className="h-4 w-4" />
                      AI Campaign Brief Generator
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tell us about your product and goals, and AI will create a professional campaign brief for you.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium">Product/Brand Name *</label>
                        <Input
                          placeholder="e.g. GlowSkin Serum"
                          value={aiProductName}
                          onChange={(e) => setAiProductName(e.target.value)}
                          className="h-9"
                          data-testid="input-ai-product-name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium">Campaign Goal *</label>
                        <Input
                          placeholder="e.g. Drive product awareness"
                          value={aiGoal}
                          onChange={(e) => setAiGoal(e.target.value)}
                          className="h-9"
                          data-testid="input-ai-goal"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Product Description</label>
                      <Textarea
                        placeholder="Brief description of your product..."
                        value={aiProductDesc}
                        onChange={(e) => setAiProductDesc(e.target.value)}
                        className="resize-none h-16"
                        data-testid="textarea-ai-product-desc"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Target Audience</label>
                      <Input
                        placeholder="e.g. Women 25-40 interested in skincare"
                        value={aiAudience}
                        onChange={(e) => setAiAudience(e.target.value)}
                        className="h-9"
                        data-testid="input-ai-audience"
                      />
                    </div>
                    
                    <Button
                      type="button"
                      onClick={handleGenerateBrief}
                      disabled={generateBriefMutation.isPending}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                      data-testid="button-generate-brief"
                    >
                      {generateBriefMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Campaign Brief
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <Tabs defaultValue="basics" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basics" data-testid="tab-basics">Basics</TabsTrigger>
                <TabsTrigger value="requirements" data-testid="tab-requirements">Requirements</TabsTrigger>
                <TabsTrigger value="advanced" data-testid="tab-advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="basics" className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Title *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Summer Product Launch Video" 
                          {...field} 
                          data-testid="input-campaign-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what you're looking for in this campaign..." 
                          className="resize-none h-24"
                          {...field} 
                          data-testid="textarea-campaign-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="campaignType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-campaign-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CAMPAIGN_TYPES.map(type => (
                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="compensationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compensation Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-compensation-type">
                              <SelectValue placeholder="Select compensation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {COMPENSATION_TYPES.map(type => (
                              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. $500 - $1000" 
                            {...field} 
                            data-testid="input-campaign-budget"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Deadline</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            data-testid="input-campaign-deadline"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormLabel>Target Platforms</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {PLATFORMS.map((platform) => (
                      <motion.div
                        key={platform.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge
                          variant={platforms.includes(platform.id) ? "default" : "outline"}
                          className="cursor-pointer px-3 py-1.5"
                          onClick={() => togglePlatform(platform.id)}
                          data-testid={`badge-platform-${platform.id}`}
                        >
                          {platform.label}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <FormLabel>Niches</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {NICHES.map((niche) => (
                      <motion.div
                        key={niche}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge
                          variant={niches.includes(niche) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleNiche(niche)}
                          data-testid={`badge-niche-${niche}`}
                        >
                          {niche}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="requirements" className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed Requirements</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Specific requirements for creators applying..." 
                          className="resize-none h-24"
                          {...field} 
                          data-testid="textarea-campaign-requirements"
                        />
                      </FormControl>
                      <FormDescription>
                        Include any specific requirements like follower count, previous experience, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Creator Experience Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-experience-level">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {EXPERIENCE_LEVELS.map(level => (
                              <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contentStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Style</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-content-style">
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CONTENT_STYLES.map(style => (
                              <SelectItem key={style.value} value={style.value}>{style.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Creator Location</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Ontario, Canada" 
                            {...field} 
                            data-testid="input-campaign-location"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="creatorCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Creators Needed</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="1"
                            placeholder="e.g. 5"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            value={field.value || ""}
                            data-testid="input-creator-count"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormLabel>Deliverables</FormLabel>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="e.g. 1 TikTok video (30-60 seconds)"
                      value={newDeliverable}
                      onChange={(e) => setNewDeliverable(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDeliverable())}
                      data-testid="input-new-deliverable"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={addDeliverable}
                      data-testid="button-add-deliverable"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <AnimatePresence>
                    {deliverables.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-2 mt-3"
                      >
                        {deliverables.map((d, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                          >
                            <Badge variant="secondary" className="pr-1">
                              {d}
                              <button
                                type="button"
                                className="ml-1 hover:text-destructive"
                                onClick={() => removeDeliverable(i)}
                                data-testid={`button-remove-deliverable-${i}`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <FormField
                  control={form.control}
                  name="productProvided"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Provided to Creators?</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-product-provided">
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Yes - Product will be shipped</SelectItem>
                          <SelectItem value="no">No - Creators use their own</SelectItem>
                          <SelectItem value="digital">Digital product / access provided</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="usageRights"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Usage Rights</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-usage-rights">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {USAGE_RIGHTS.map(right => (
                              <SelectItem key={right.value} value={right.value}>{right.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>How long you can use the content</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="exclusivity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exclusivity</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-exclusivity">
                              <SelectValue placeholder="Select exclusivity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {EXCLUSIVITY_OPTIONS.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Can creators work with competitors?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="applicationDeadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Deadline</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            data-testid="input-application-deadline"
                          />
                        </FormControl>
                        <FormDescription>When to stop accepting applications</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-campaign-status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="paused">Paused</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormLabel className="flex items-center gap-2">
                    <Hash className="h-4 w-4" /> Required Hashtags
                  </FormLabel>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="e.g. #TrueNorthUGC"
                      value={newHashtag}
                      onChange={(e) => setNewHashtag(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHashtag())}
                      data-testid="input-new-hashtag"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={addHashtag}
                      data-testid="button-add-hashtag"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <AnimatePresence>
                    {hashtags.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-wrap gap-2 mt-3"
                      >
                        {hashtags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="pr-1 text-primary">
                            {tag}
                            <button
                              type="button"
                              className="ml-1 hover:text-destructive"
                              onClick={() => removeHashtag(i)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <FormLabel className="flex items-center gap-2">
                    <AtSign className="h-4 w-4" /> Required Mentions
                  </FormLabel>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="e.g. @TrueNorthUGC"
                      value={newMention}
                      onChange={(e) => setNewMention(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMention())}
                      data-testid="input-new-mention"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={addMention}
                      data-testid="button-add-mention"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <AnimatePresence>
                    {mentions.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-wrap gap-2 mt-3"
                      >
                        {mentions.map((mention, i) => (
                          <Badge key={i} variant="secondary" className="pr-1 text-blue-500">
                            {mention}
                            <button
                              type="button"
                              className="ml-1 hover:text-destructive"
                              onClick={() => removeMention(i)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <FormField
                  control={form.control}
                  name="briefDocument"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Brief URL (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Link to your detailed brief document" 
                          {...field} 
                          data-testid="input-brief-document"
                        />
                      </FormControl>
                      <FormDescription>
                        Link to a Google Doc, Notion page, or PDF with your full campaign brief
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-campaign"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isPending}
                data-testid="button-submit-campaign"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update Campaign" : "Create Campaign"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
