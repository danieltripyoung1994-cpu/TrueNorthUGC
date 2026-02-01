import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useMyCreatorProfile, useUpdateCreatorProfile } from "@/hooks/use-creators";
import { useBrand } from "@/hooks/use-brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LogOut, Building, User, Instagram, Music2, Globe, Camera, Mail, Settings, Megaphone, Plus, Pencil, Trash2, Calendar, DollarSign, MapPin, Package, Upload, TrendingUp, Users, Star, Zap, Trophy, Crown } from "lucide-react";
import { DashboardSkeleton } from "@/components/ui/skeleton-loaders";
import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCreatorSchema, insertBrandSchema, type Campaign, type Transaction, type Brand, type Creator } from "@shared/schema";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Messages } from "@/components/Messages";
import { CampaignFormModal } from "@/components/CampaignFormModal";
import { useMyCampaigns, useDeleteCampaign } from "@/hooks/use-campaigns";
import { Badge } from "@/components/ui/badge";
import { useUpload } from "@/hooks/use-upload";
import { useToast } from "@/hooks/use-toast";
import { useTransactions } from "@/hooks/use-transactions";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { data: creatorProfile, isLoading: loadingCreator } = useMyCreatorProfile();
  const { brand: brandProfile, isLoading: loadingBrand } = useBrand();
  const updateCreator = useUpdateCreatorProfile();
  const { updateBrand } = useBrand();
  const { data: myCampaigns, isLoading: loadingCampaigns } = useMyCampaigns();
  const deleteCampaign = useDeleteCampaign();
  const { data: transactions, isLoading: loadingTransactions } = useTransactions();
  const [roleSelection, setRoleSelection] = useState<"creator" | "brand" | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deletingCampaignId, setDeletingCampaignId] = useState<number | null>(null);
  const { toast } = useToast();
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const brandLogoInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading: isUploadingProfileImage } = useUpload({
    onSuccess: (response) => {
      creatorForm.setValue("profileImage", response.objectPath, { shouldValidate: true });
      toast({ title: "Image uploaded successfully!" });
    },
    onError: (error) => {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    },
  });
  const { uploadFile: uploadBrandLogo, isUploading: isUploadingBrandLogo } = useUpload({
    onSuccess: (response) => {
      brandForm.setValue("logo", response.objectPath, { shouldValidate: true });
      toast({ title: "Logo uploaded successfully!" });
    },
    onError: (error) => {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    },
  });

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleBrandLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadBrandLogo(file);
    }
  };

  const isLoading = loadingCreator || loadingBrand;

  const [activeTab, setActiveTab] = useState("profile");
  const [, navigate] = useLocation();

  // Check URL for tab parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "messages") setActiveTab("messages");
    if (tab === "campaigns") setActiveTab("campaigns");
    if (tab === "earnings") setActiveTab("earnings");
  }, []);

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsCampaignModalOpen(true);
  };

  const handleCreateCampaign = () => {
    setEditingCampaign(null);
    setIsCampaignModalOpen(true);
  };

  const handleDeleteCampaign = async () => {
    if (deletingCampaignId) {
      await deleteCampaign.mutateAsync(deletingCampaignId);
      setDeletingCampaignId(null);
    }
  };

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    return date.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
  };

  const creatorForm = useForm({
    resolver: zodResolver(insertCreatorSchema.omit({ userId: true })),
    defaultValues: {
      handle: "",
      name: "",
      bio: "",
      profileImage: "",
      niches: [] as string[],
      socialLinks: { tiktok: "", instagram: "", youtube: "", twitter: "", facebook: "", canva: "" } as Record<string, string>,
      portfolio: [] as any[],
      location: "",
      languages: [] as string[],
      experienceLevel: "Beginner"
    }
  });

  const brandForm = useForm({
    resolver: zodResolver(insertBrandSchema.omit({ userId: true })),
    defaultValues: {
      name: "",
      industry: "",
      description: "",
      logo: "",
      website: "",
      niches: [] as string[],
      location: "",
      socialLinks: { instagram: "", twitter: "", linkedin: "", facebook: "", canva: "" }
    }
  });

  useEffect(() => {
    if (creatorProfile) {
      creatorForm.reset({
        handle: creatorProfile.handle,
        name: creatorProfile.name,
        bio: creatorProfile.bio || "",
        profileImage: creatorProfile.profileImage || "",
        niches: creatorProfile.niches || [],
        socialLinks: creatorProfile.socialLinks || { tiktok: "", instagram: "", youtube: "", twitter: "", facebook: "", canva: "" },
        portfolio: creatorProfile.portfolio || [],
        location: (creatorProfile as any).location || "",
        languages: (creatorProfile as any).languages || [],
        experienceLevel: (creatorProfile as any).experienceLevel || "Beginner"
      });
    }
  }, [creatorProfile, creatorForm]);

  useEffect(() => {
    if (brandProfile) {
      brandForm.reset({
        name: brandProfile.name,
        industry: brandProfile.industry || "",
        description: brandProfile.description || "",
        logo: brandProfile.logo || "",
        website: brandProfile.website || "",
        niches: brandProfile.niches || [],
        location: (brandProfile as any).location || "",
        socialLinks: (brandProfile as any).socialLinks || { instagram: "", twitter: "", linkedin: "", facebook: "", canva: "" }
      });
    }
  }, [brandProfile, brandForm]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-6 sm:py-12">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  const hasProfile = !!creatorProfile || !!brandProfile;

  const onCreatorSubmit = async (data: any) => {
    try {
      // Filter out empty social links
      const socialLinks = { ...data.socialLinks };
      Object.keys(socialLinks).forEach(key => {
        if (!socialLinks[key]) delete socialLinks[key];
      });

      await updateCreator.mutateAsync({
        ...data,
        socialLinks
      });
      setIsEditDialogOpen(false);
    } catch (e) {}
  };

  const onBrandSubmit = async (data: any) => {
    try {
      // Filter out empty social links
      const socialLinks = { ...data.socialLinks };
      Object.keys(socialLinks).forEach(key => {
        if (!socialLinks[key]) delete socialLinks[key];
      });

      await updateBrand({
        ...data,
        socialLinks
      });
      setIsEditDialogOpen(false);
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6 sm:py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6 sm:space-y-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">Dashboard</h1>
            <Button variant="outline" onClick={() => logout()} data-testid="button-logout" className="hover-elevate rounded-xl px-4 sm:px-6 font-bold border-white/10 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/20">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          {hasProfile && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4 sm:mb-6 w-full sm:w-auto">
                <TabsTrigger value="profile" className="gap-1 sm:gap-2 flex-1 sm:flex-none" data-testid="tab-profile">
                  <Settings className="h-4 w-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="messages" className="gap-1 sm:gap-2 flex-1 sm:flex-none" data-testid="tab-messages">
                  <Mail className="h-4 w-4" />
                  <span>Messages</span>
                </TabsTrigger>
                {brandProfile && (
                  <TabsTrigger value="campaigns" className="gap-1 sm:gap-2 flex-1 sm:flex-none" data-testid="tab-campaigns">
                    <Megaphone className="h-4 w-4" />
                    <span>Campaigns</span>
                  </TabsTrigger>
                )}
                <TabsTrigger value="earnings" className="gap-1 sm:gap-2 flex-1 sm:flex-none" data-testid="tab-earnings">
                  <DollarSign className="h-4 w-4" />
                  <span>Earnings</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="messages">
                <Messages />
              </TabsContent>
              {brandProfile && (
                <TabsContent value="campaigns">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">My Campaigns</h2>
                        <p className="text-muted-foreground text-sm">Manage your brand campaigns</p>
                      </div>
                      <Button onClick={handleCreateCampaign} data-testid="button-create-campaign" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Campaign
                      </Button>
                    </div>

                    {loadingCampaigns ? (
                      <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                      </div>
                    ) : myCampaigns && myCampaigns.length > 0 ? (
                      <div className="space-y-4">
                        {myCampaigns.map((campaign) => (
                          <Card key={campaign.id} className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/20 transition-all" data-testid={`card-my-campaign-${campaign.id}`}>
                            <CardContent className="p-4 sm:p-6">
                              <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="flex-1 min-w-0 space-y-2">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-bold text-lg" data-testid={`text-my-campaign-title-${campaign.id}`}>{campaign.title}</h3>
                                    <Badge 
                                      variant={campaign.status === "active" ? "default" : campaign.status === "paused" ? "secondary" : "outline"}
                                      data-testid={`badge-my-campaign-status-${campaign.id}`}
                                    >
                                      {campaign.status}
                                    </Badge>
                                  </div>
                                  <p className="text-muted-foreground text-sm line-clamp-2" data-testid={`text-my-campaign-description-${campaign.id}`}>
                                    {campaign.description}
                                  </p>
                                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                    {campaign.budget && (
                                      <span className="flex items-center gap-1">
                                        <DollarSign className="h-3 w-3 text-green-500" />
                                        {campaign.budget}
                                      </span>
                                    )}
                                    {campaign.deadline && (
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3 text-blue-500" />
                                        {formatDeadline(campaign.deadline)}
                                      </span>
                                    )}
                                    {campaign.location && (
                                      <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3 text-orange-500" />
                                        {campaign.location}
                                      </span>
                                    )}
                                    {campaign.deliverables && campaign.deliverables.length > 0 && (
                                      <span className="flex items-center gap-1">
                                        <Package className="h-3 w-3 text-purple-500" />
                                        {campaign.deliverables.length} deliverable(s)
                                      </span>
                                    )}
                                  </div>
                                  {campaign.niches && campaign.niches.length > 0 && (
                                    <div className="flex flex-wrap gap-1 pt-1">
                                      {campaign.niches.map((niche) => (
                                        <Badge key={niche} variant="outline" className="text-xs font-normal">
                                          {niche}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="flex sm:flex-col gap-2 sm:justify-start">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleEditCampaign(campaign)}
                                    data-testid={`button-edit-campaign-${campaign.id}`}
                                  >
                                    <Pencil className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => setDeletingCampaignId(campaign.id)}
                                    data-testid={`button-delete-campaign-${campaign.id}`}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="border-2 border-dashed border-white/10 bg-card/50 backdrop-blur-sm">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                          <Megaphone className="h-12 w-12 text-pink-500/50 mb-4" />
                          <h3 className="font-bold text-lg">No campaigns yet</h3>
                          <p className="text-muted-foreground text-sm mb-4">Create your first campaign to start connecting with creators</p>
                          <Button onClick={handleCreateCampaign} data-testid="button-create-first-campaign" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Your First Campaign
                          </Button>
                        </CardContent>
                      </Card>
                    )}

                    <CampaignFormModal
                      open={isCampaignModalOpen}
                      onOpenChange={setIsCampaignModalOpen}
                      campaign={editingCampaign}
                    />

                    <AlertDialog open={!!deletingCampaignId} onOpenChange={(open) => !open && setDeletingCampaignId(null)}>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this campaign? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDeleteCampaign}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            data-testid="button-confirm-delete"
                          >
                            {deleteCampaign.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </motion.div>
                </TabsContent>
              )}
              <TabsContent value="earnings">
                <EarningsTab 
                  transactions={transactions || []}
                  isLoading={loadingTransactions}
                  creatorProfile={creatorProfile}
                  brandProfile={brandProfile}
                  userId={user?.id || ""}
                />
              </TabsContent>
              <TabsContent value="profile">
                <AnimatePresence mode="wait">
            {!hasProfile && !roleSelection ? (
              <motion.div
                key="choice"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="border-2 border-dashed border-white/10 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">Choose your path</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                    <Button 
                      variant="outline" 
                      className="h-auto py-8 flex-col gap-4 text-xl hover-elevate group transition-all border-white/10 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/20"
                      onClick={() => setRoleSelection("creator")}
                      data-testid="button-select-creator"
                    >
                      <User className="h-12 w-12 text-pink-500 group-hover:scale-110 transition-transform" />
                      I am a Creator
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto py-8 flex-col gap-4 text-xl hover-elevate group transition-all border-white/10 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/20"
                      onClick={() => setRoleSelection("brand")}
                      data-testid="button-select-brand"
                    >
                      <Building className="h-12 w-12 text-pink-500 group-hover:scale-110 transition-transform" />
                      I am a Brand
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : !hasProfile && (roleSelection === "creator" || roleSelection === "brand") ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="shadow-lg bg-card/50 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">{roleSelection === "creator" ? "Create Creator Profile" : "Create Brand Profile"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {roleSelection === "creator" ? (
                      <Form {...creatorForm}>
                        <form onSubmit={creatorForm.handleSubmit(onCreatorSubmit)} className="space-y-4" data-testid="form-creator-profile">
                          <FormField
                            control={creatorForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name / Company Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your Stage Name" {...field} className="h-12" data-testid="input-creator-name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={creatorForm.control}
                            name="handle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Unique Handle</FormLabel>
                                <FormControl>
                                  <Input placeholder="username (e.g. creative_creator)" {...field} className="h-12" data-testid="input-creator-handle" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button size="lg" type="submit" className="w-full text-lg shadow-lg shadow-pink-500/20 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0" disabled={updateCreator.isPending} data-testid="button-create-creator-profile">
                            {updateCreator.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Official Profile
                          </Button>
                          <Button type="button" variant="ghost" className="w-full" onClick={() => setRoleSelection(null)} data-testid="button-creator-form-back">Back</Button>
                        </form>
                      </Form>
                    ) : (
                      <Form {...brandForm}>
                        <form onSubmit={brandForm.handleSubmit(onBrandSubmit)} className="space-y-4" data-testid="form-brand-profile">
                          <FormField
                            control={brandForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name / Company Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Company Name" {...field} className="h-12" data-testid="input-brand-name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={brandForm.control}
                            name="industry"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Industry</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Beauty, Tech, Fitness" {...field} className="h-12" data-testid="input-brand-industry" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button size="lg" type="submit" className="w-full text-lg shadow-lg shadow-pink-500/20 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0" disabled={updateCreator.isPending} data-testid="button-create-brand-profile">
                            {updateCreator.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Official Profile
                          </Button>
                          <Button type="button" variant="ghost" className="w-full" onClick={() => setRoleSelection(null)} data-testid="button-brand-form-back">Back</Button>
                        </form>
                      </Form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : creatorProfile ? (
              <motion.div
                key="creator-dash"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-white/10 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/20 transition-all">
                  <CardHeader>
                    <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">Creator Profile Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-muted overflow-hidden border shadow-inner">
                        {creatorProfile.profileImage ? (
                          <img src={creatorProfile.profileImage} className="h-full w-full object-cover" alt="" />
                        ) : (
                          <User className="h-full w-full p-4 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-lg">{creatorProfile.name}</p>
                        <p className="text-sm text-muted-foreground">@{creatorProfile.handle}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/creators/${creatorProfile.handle}`}>
                        <Button variant="outline" className="hover-elevate border-white/10 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/20" data-testid="link-view-profile">View Public Profile</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full text-lg font-bold shadow-xl shadow-pink-500/20 hover:scale-[1.01] transition-transform bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0" data-testid="button-edit-creator">
                      Edit Profile & Socials
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card/80 backdrop-blur-xl border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">Customize Your Profile</DialogTitle>
                    </DialogHeader>
                    <Form {...creatorForm}>
                      <form onSubmit={creatorForm.handleSubmit(onCreatorSubmit)} className="space-y-6 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <FormField
                              control={creatorForm.control}
                              name="profileImage"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Camera className="h-4 w-4" /> Profile Picture
                                  </FormLabel>
                                  <div className="flex gap-2">
                                    <FormControl>
                                      <Input placeholder="https://... or upload" {...field} value={field.value || ""} className="flex-1" data-testid="input-profile-image" />
                                    </FormControl>
                                    <input
                                      ref={profileImageInputRef}
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={handleProfileImageUpload}
                                      data-testid="input-profile-image-file"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => profileImageInputRef.current?.click()}
                                      disabled={isUploadingProfileImage}
                                      data-testid="button-upload-profile-image"
                                    >
                                      {isUploadingProfileImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                    </Button>
                                  </div>
                                  {field.value && (
                                    <div className="mt-2 flex items-center gap-2">
                                      <div className="h-12 w-12 rounded-full overflow-hidden border">
                                        <img src={field.value} className="h-full w-full object-cover" alt="Preview" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                      </div>
                                      <span className="text-xs text-muted-foreground">Preview</span>
                                    </div>
                                  )}
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={creatorForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Display Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={creatorForm.control}
                              name="bio"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bio</FormLabel>
                                  <FormControl>
                                    <Textarea className="h-32 resize-none" placeholder="Tell brands about yourself..." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={creatorForm.control}
                              name="location"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Location (City, Province)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Toronto, ON" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={creatorForm.control}
                              name="experienceLevel"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Experience Level</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Beginner, Pro, etc." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="space-y-4">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Social Media</h3>
                            <FormField
                              control={creatorForm.control}
                              name="socialLinks.instagram"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Instagram className="h-4 w-4" /> Instagram URL
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://instagram.com/..." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={creatorForm.control}
                              name="socialLinks.tiktok"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Music2 className="h-4 w-4" /> TikTok URL
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://tiktok.com/@..." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={creatorForm.control}
                              name="socialLinks.youtube"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Globe className="h-4 w-4" /> YouTube Channel
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://youtube.com/..." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={creatorForm.control}
                              name="socialLinks.twitter"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Globe className="h-4 w-4" /> Twitter/X URL
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://twitter.com/..." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={creatorForm.control}
                              name="socialLinks.facebook"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Globe className="h-4 w-4" /> Facebook URL
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://facebook.com/..." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={creatorForm.control}
                              name="socialLinks.canva"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Camera className="h-4 w-4" /> Canva Portfolio
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://canva.com/..." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4 pt-4 border-t">
                          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Portfolio Videos</h3>
                          <p className="text-sm text-muted-foreground">Add video URLs to showcase your work (YouTube, TikTok, Vimeo, etc.)</p>
                          <div className="space-y-2">
                            {(creatorForm.watch("portfolio") || []).map((video: any, index: number) => (
                              <div key={video.id || index} className="flex gap-2 items-center">
                                <Input 
                                  value={video.title} 
                                  onChange={(e) => {
                                    const portfolio = [...(creatorForm.getValues("portfolio") || [])];
                                    portfolio[index] = { ...portfolio[index], title: e.target.value };
                                    creatorForm.setValue("portfolio", portfolio, { shouldValidate: true });
                                  }}
                                  placeholder="Video title"
                                  className="flex-1"
                                  data-testid={`input-portfolio-title-${index}`}
                                />
                                <Input 
                                  value={video.url} 
                                  onChange={(e) => {
                                    const portfolio = [...(creatorForm.getValues("portfolio") || [])];
                                    portfolio[index] = { ...portfolio[index], url: e.target.value };
                                    creatorForm.setValue("portfolio", portfolio, { shouldValidate: true });
                                  }}
                                  placeholder="Video URL"
                                  className="flex-1"
                                  data-testid={`input-portfolio-url-${index}`}
                                />
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    const portfolio = creatorForm.getValues("portfolio") || [];
                                    creatorForm.setValue("portfolio", portfolio.filter((_: any, i: number) => i !== index), { shouldValidate: true });
                                  }}
                                  data-testid={`button-remove-portfolio-${index}`}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            ))}
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const portfolio = creatorForm.getValues("portfolio") || [];
                                creatorForm.setValue("portfolio", [...portfolio, { id: Date.now().toString(), title: "", url: "" }], { shouldValidate: true });
                              }}
                              className="w-full"
                              data-testid="button-add-portfolio-video"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Video
                            </Button>
                          </div>
                        </div>
                        
                        <Button size="lg" type="submit" className="w-full font-bold bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0" disabled={updateCreator.isPending}>
                          {updateCreator.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Save Changes
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </motion.div>
            ) : (
              <motion.div
                key="brand-dash"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-white/10 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/20 transition-all">
                  <CardHeader>
                    <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">Brand Profile Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-xl bg-muted overflow-hidden border shadow-inner">
                        {brandProfile?.logo ? (
                          <img src={brandProfile.logo} className="h-full w-full object-cover" alt="" />
                        ) : (
                          <Building className="h-full w-full p-4 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-lg">{brandProfile?.name}</p>
                        <p className="text-sm text-muted-foreground">{brandProfile?.industry || "Brand"}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="hover-elevate border-white/10 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/20" data-testid="button-view-brand">Brand Dashboard</Button>
                  </CardContent>
                </Card>

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full text-lg font-bold shadow-xl shadow-pink-500/20 hover:scale-[1.01] transition-transform bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0" data-testid="button-edit-brand">
                      Edit Brand Settings
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl rounded-3xl bg-card/80 backdrop-blur-xl border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">Brand Details</DialogTitle>
                    </DialogHeader>
                    <Form {...brandForm}>
                      <form onSubmit={brandForm.handleSubmit(onBrandSubmit)} className="space-y-4 pt-4">
                        <FormField
                          control={brandForm.control}
                          name="logo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Logo</FormLabel>
                              <div className="flex gap-2">
                                <FormControl>
                                  <Input placeholder="https://... or upload" {...field} className="flex-1" data-testid="input-brand-logo" />
                                </FormControl>
                                <input
                                  ref={brandLogoInputRef}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleBrandLogoUpload}
                                  data-testid="input-brand-logo-file"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => brandLogoInputRef.current?.click()}
                                  disabled={isUploadingBrandLogo}
                                  data-testid="button-upload-brand-logo"
                                >
                                  {isUploadingBrandLogo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                </Button>
                              </div>
                              {field.value && (
                                <div className="mt-2 flex items-center gap-2">
                                  <div className="h-12 w-12 rounded-full overflow-hidden border">
                                    <img src={field.value} className="h-full w-full object-cover" alt="Preview" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                  </div>
                                  <span className="text-xs text-muted-foreground">Preview</span>
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={brandForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={brandForm.control}
                          name="industry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Industry</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Beauty, Tech, Fitness" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={brandForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Headquarters Location</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Vancouver, BC" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={brandForm.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={brandForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>About the Brand</FormLabel>
                              <FormControl>
                                <Textarea className="resize-none h-32" placeholder="What kind of content are you looking for?" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="space-y-3 pt-2">
                          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Social Media</h3>
                          <FormField
                            control={brandForm.control}
                            name="socialLinks.instagram"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Instagram className="h-4 w-4" /> Instagram URL
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="https://instagram.com/..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={brandForm.control}
                            name="socialLinks.twitter"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Globe className="h-4 w-4" /> Twitter/X URL
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="https://twitter.com/..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={brandForm.control}
                            name="socialLinks.facebook"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Globe className="h-4 w-4" /> Facebook URL
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="https://facebook.com/..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={brandForm.control}
                            name="socialLinks.linkedin"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Globe className="h-4 w-4" /> LinkedIn URL
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="https://linkedin.com/company/..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={brandForm.control}
                            name="socialLinks.canva"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Camera className="h-4 w-4" /> Canva Portfolio
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="https://canva.com/..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button size="lg" type="submit" className="w-full font-bold bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0">
                          Update Brand Profile
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </motion.div>
            )}
                </AnimatePresence>
              </TabsContent>
            </Tabs>
          )}

          {!hasProfile && (
            <AnimatePresence mode="wait">
              {!roleSelection ? (
                <motion.div
                  key="choice"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="border-2 border-dashed border-white/10 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">Choose your path</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                      <Button 
                        variant="outline" 
                        className="h-auto py-8 flex-col gap-4 text-xl hover-elevate group transition-all border-white/10 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/20"
                        onClick={() => setRoleSelection("creator")}
                        data-testid="button-select-creator"
                      >
                        <User className="h-12 w-12 text-pink-500 group-hover:scale-110 transition-transform" />
                        I am a Creator
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-auto py-8 flex-col gap-4 text-xl hover-elevate group transition-all border-white/10 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/20"
                        onClick={() => setRoleSelection("brand")}
                        data-testid="button-select-brand"
                      >
                        <Building className="h-12 w-12 text-pink-500 group-hover:scale-110 transition-transform" />
                        I am a Brand
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="shadow-lg bg-card/50 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">{roleSelection === "creator" ? "Create Creator Profile" : "Create Brand Profile"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {roleSelection === "creator" ? (
                        <Form {...creatorForm}>
                          <form onSubmit={creatorForm.handleSubmit(onCreatorSubmit)} className="space-y-4" data-testid="form-creator-profile">
                            <FormField
                              control={creatorForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name / Stage Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your Name" {...field} className="h-12" data-testid="input-creator-name" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={creatorForm.control}
                              name="handle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Unique Handle</FormLabel>
                                  <FormControl>
                                    <Input placeholder="username (e.g. creative_creator)" {...field} className="h-12" data-testid="input-creator-handle" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button size="lg" type="submit" className="w-full text-lg shadow-lg shadow-pink-500/20 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0" disabled={updateCreator.isPending} data-testid="button-create-creator-profile">
                              {updateCreator.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Create Official Profile
                            </Button>
                            <Button type="button" variant="ghost" className="w-full" onClick={() => setRoleSelection(null)} data-testid="button-creator-form-back">Back</Button>
                          </form>
                        </Form>
                      ) : (
                        <Form {...brandForm}>
                          <form onSubmit={brandForm.handleSubmit(onBrandSubmit)} className="space-y-4" data-testid="form-brand-profile">
                            <FormField
                              control={brandForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Company Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Company Name" {...field} className="h-12" data-testid="input-brand-name" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={brandForm.control}
                              name="industry"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Industry</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Beauty, Tech, Fitness" {...field} className="h-12" data-testid="input-brand-industry" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button size="lg" type="submit" className="w-full text-lg shadow-lg shadow-pink-500/20 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0" disabled={updateCreator.isPending} data-testid="button-create-brand-profile">
                              {updateCreator.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Create Official Profile
                            </Button>
                            <Button type="button" variant="ghost" className="w-full" onClick={() => setRoleSelection(null)} data-testid="button-brand-form-back">Back</Button>
                          </form>
                        </Form>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </main>
    </div>
  );
}

interface EarningsTabProps {
  transactions: Transaction[];
  isLoading: boolean;
  creatorProfile: Creator | null | undefined;
  brandProfile: Brand | null | undefined;
  userId: string;
}

function getTierInfo(completedCount: number) {
  if (completedCount >= 31) {
    return { name: "Elite Creator", icon: Crown, rate: 88, min: 31, max: null, nextTier: null };
  } else if (completedCount >= 16) {
    return { name: "Top Performer", icon: Trophy, rate: 85, min: 16, max: 30, nextTier: "Elite Creator" };
  } else if (completedCount >= 6) {
    return { name: "Creator Pro", icon: Zap, rate: 82, min: 6, max: 15, nextTier: "Top Performer" };
  } else {
    return { name: "Rising Star", icon: Star, rate: 80, min: 0, max: 5, nextTier: "Creator Pro" };
  }
}

function getProgressToNextTier(completedCount: number): { progress: number; remaining: number } {
  if (completedCount >= 31) {
    return { progress: 100, remaining: 0 };
  } else if (completedCount >= 16) {
    const tierStart = 16;
    const tierEnd = 31;
    const progress = ((completedCount - tierStart) / (tierEnd - tierStart)) * 100;
    return { progress, remaining: tierEnd - completedCount };
  } else if (completedCount >= 6) {
    const tierStart = 6;
    const tierEnd = 16;
    const progress = ((completedCount - tierStart) / (tierEnd - tierStart)) * 100;
    return { progress, remaining: tierEnd - completedCount };
  } else {
    const tierStart = 0;
    const tierEnd = 6;
    const progress = ((completedCount - tierStart) / (tierEnd - tierStart)) * 100;
    return { progress, remaining: tierEnd - completedCount };
  }
}

function EarningsTab({ transactions, isLoading, creatorProfile, brandProfile, userId }: EarningsTabProps) {
  const isCreator = !!creatorProfile;
  const isBrand = !!brandProfile;

  const completedTransactions = transactions.filter(t => t.status === "completed");
  
  const creatorTransactions = completedTransactions.filter(t => t.recipientUserId === userId);
  const brandTransactions = completedTransactions.filter(t => t.payerUserId === userId);

  const totalCreatorEarnings = creatorTransactions.reduce((sum, t) => sum + parseFloat(t.creatorPayout || "0"), 0);
  const totalBrandSpent = brandTransactions.reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);
  const totalPlatformFees = brandTransactions.reduce((sum, t) => sum + parseFloat(t.platformFee || "0"), 0);
  const uniqueCreatorsPaid = new Set(brandTransactions.map(t => t.recipientUserId)).size;

  const tierInfo = getTierInfo(creatorTransactions.length);
  const { progress, remaining } = getProgressToNextTier(creatorTransactions.length);
  const TierIcon = tierInfo.icon;

  const { data: brandNamesMap } = useQuery<Record<string, string>>({
    queryKey: ["/api/brands/names", creatorTransactions.map(t => t.payerUserId).join(",")],
    queryFn: async () => {
      const uniquePayerIds = Array.from(new Set(creatorTransactions.map(t => t.payerUserId)));
      const names: Record<string, string> = {};
      await Promise.all(uniquePayerIds.map(async (id) => {
        try {
          const res = await fetch(`/api/brands/${id}`, { credentials: "include" });
          if (res.ok) {
            const brand = await res.json();
            names[id] = brand.name;
          }
        } catch {}
      }));
      return names;
    },
    enabled: isCreator && creatorTransactions.length > 0,
  });

  const { data: creatorNamesMap } = useQuery<Record<string, string>>({
    queryKey: ["/api/creators/names", brandTransactions.map(t => t.recipientUserId).join(",")],
    queryFn: async () => {
      const uniqueRecipientIds = Array.from(new Set(brandTransactions.map(t => t.recipientUserId)));
      const names: Record<string, string> = {};
      const creators = await fetch("/api/creators", { credentials: "include" }).then(r => r.json());
      creators.forEach((c: Creator) => {
        if (uniqueRecipientIds.includes(c.userId)) {
          names[c.userId] = c.name;
        }
      });
      return names;
    },
    enabled: isBrand && brandTransactions.length > 0,
  });

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
        data-testid="earnings-loading"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-sm border-white/10">
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-card/50 backdrop-blur-sm border-white/10">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!isCreator && !isBrand) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-bold text-lg mb-2">No Profile Found</h3>
        <p className="text-muted-foreground">Create a profile to start tracking your earnings.</p>
      </motion.div>
    );
  }

  if (isCreator) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
        data-testid="earnings-creator-view"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/20 transition-all" data-testid="card-total-earnings">
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black" data-testid="text-total-earnings">
                ${totalCreatorEarnings.toFixed(2)} CAD
              </div>
              <p className="text-xs text-muted-foreground">
                {creatorTransactions.length} completed transaction{creatorTransactions.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10 transition-all" data-testid="card-current-tier">
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Tier</CardTitle>
              <TierIcon className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-cyan-300" data-testid="text-current-tier">
                {tierInfo.name}
              </div>
              <p className="text-xs text-muted-foreground">
                {tierInfo.rate}% commission rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/20 transition-all" data-testid="card-completed-campaigns">
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed Campaigns</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black" data-testid="text-completed-campaigns">
                {creatorTransactions.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Total paid collaborations
              </p>
            </CardContent>
          </Card>
        </div>

        {tierInfo.nextTier && (
          <Card className="bg-card/50 backdrop-blur-sm border-cyan-500/20" data-testid="card-tier-progress">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Zap className="h-5 w-5 text-cyan-400" />
                Progress to {tierInfo.nextTier}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{creatorTransactions.length} completed</span>
                  <span className="text-cyan-400 font-semibold">{remaining} more to go</span>
                </div>
                <div className="relative">
                  <Progress value={progress} className="h-3 bg-cyan-500/10" data-testid="progress-tier" />
                  <div 
                    className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Complete {remaining} more campaign{remaining !== 1 ? "s" : ""} to unlock <span className="text-cyan-400 font-semibold">{tierInfo.nextTier}</span> tier and earn a higher commission rate!
              </p>
            </CardContent>
          </Card>
        )}

        {tierInfo.nextTier === null && (
          <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-400/5 backdrop-blur-sm border-cyan-500/30" data-testid="card-max-tier">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Crown className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Congratulations!</h3>
                <p className="text-sm text-muted-foreground">You've reached the highest tier and earn the maximum 88% commission rate.</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-card/50 backdrop-blur-sm border-white/10" data-testid="card-recent-transactions">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {creatorTransactions.length === 0 ? (
              <div className="text-center py-8" data-testid="empty-transactions">
                <DollarSign className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground/70">Complete campaigns to start earning!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {creatorTransactions.slice(0, 10).map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 rounded-lg bg-background/50 border border-white/5"
                    data-testid={`transaction-row-${transaction.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-green-500" data-testid={`text-transaction-amount-${transaction.id}`}>
                          +${parseFloat(transaction.creatorPayout).toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          from {brandNamesMap?.[transaction.payerUserId] || "Brand"}
                        </span>
                      </div>
                      {transaction.description && (
                        <p className="text-sm text-muted-foreground truncate" data-testid={`text-transaction-description-${transaction.id}`}>
                          {transaction.description}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground" data-testid={`text-transaction-date-${transaction.id}`}>
                      {new Date(transaction.createdAt).toLocaleDateString("en-CA", { 
                        month: "short", 
                        day: "numeric", 
                        year: "numeric" 
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
      data-testid="earnings-brand-view"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/20 transition-all" data-testid="card-total-spent">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black" data-testid="text-total-spent">
              ${totalBrandSpent.toFixed(2)} CAD
            </div>
            <p className="text-xs text-muted-foreground">
              {brandTransactions.length} payment{brandTransactions.length !== 1 ? "s" : ""} made
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/20 transition-all" data-testid="card-platform-fees">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Platform Fees</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black" data-testid="text-platform-fees">
              ${totalPlatformFees.toFixed(2)} CAD
            </div>
            <p className="text-xs text-muted-foreground">
              20% platform fee
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/20 transition-all" data-testid="card-creators-paid">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Creators Paid</CardTitle>
            <Users className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black" data-testid="text-creators-paid">
              {uniqueCreatorsPaid}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique creator{uniqueCreatorsPaid !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-white/10" data-testid="card-recent-payments">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {brandTransactions.length === 0 ? (
            <div className="text-center py-8" data-testid="empty-payments">
              <DollarSign className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">No payments yet</p>
              <p className="text-sm text-muted-foreground/70">Pay creators to see your transaction history here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {brandTransactions.slice(0, 10).map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 rounded-lg bg-background/50 border border-white/5"
                  data-testid={`payment-row-${transaction.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold" data-testid={`text-payment-amount-${transaction.id}`}>
                        ${parseFloat(transaction.amount).toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        to {creatorNamesMap?.[transaction.recipientUserId] || "Creator"}
                      </span>
                    </div>
                    {transaction.description && (
                      <p className="text-sm text-muted-foreground truncate" data-testid={`text-payment-description-${transaction.id}`}>
                        {transaction.description}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground" data-testid={`text-payment-date-${transaction.id}`}>
                    {new Date(transaction.createdAt).toLocaleDateString("en-CA", { 
                      month: "short", 
                      day: "numeric", 
                      year: "numeric" 
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
