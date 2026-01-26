import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useMyCreatorProfile, useUpdateCreatorProfile } from "@/hooks/use-creators";
import { useBrand } from "@/hooks/use-brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, LogOut, Building, User, Instagram, Music2, Globe, Camera } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCreatorSchema, insertBrandSchema } from "@shared/schema";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { data: creatorProfile, isLoading: loadingCreator } = useMyCreatorProfile();
  const { brand: brandProfile, isLoading: loadingBrand } = useBrand();
  const updateCreator = useUpdateCreatorProfile();
  const { updateBrand } = useBrand();
  const [roleSelection, setRoleSelection] = useState<"creator" | "brand" | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const isLoading = loadingCreator || loadingBrand;

  const creatorForm = useForm({
    resolver: zodResolver(insertCreatorSchema.omit({ userId: true })),
    defaultValues: {
      handle: "",
      name: "",
      bio: "",
      profileImage: "",
      niches: [],
      socialLinks: { tiktok: "", instagram: "", youtube: "", twitter: "" },
      portfolio: []
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
      niches: []
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
        socialLinks: creatorProfile.socialLinks || { tiktok: "", instagram: "", youtube: "", twitter: "" },
        portfolio: creatorProfile.portfolio || []
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
        niches: brandProfile.niches || []
      });
    }
  }, [brandProfile, brandForm]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const hasProfile = !!creatorProfile || !!brandProfile;

  const onCreatorSubmit = async (data: any) => {
    try {
      await updateCreator.mutateAsync(data);
      setIsEditDialogOpen(false);
    } catch (e) {}
  };

  const onBrandSubmit = async (data: any) => {
    try {
      await updateBrand(data);
      setIsEditDialogOpen(false);
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-black tracking-tighter">Dashboard</h1>
            <Button variant="outline" onClick={() => logout()} data-testid="button-logout" className="hover-elevate rounded-xl px-6 h-11 font-bold">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {!hasProfile && !roleSelection ? (
              <motion.div
                key="choice"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="border-2 border-dashed">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Choose your path</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                    <Button 
                      variant="outline" 
                      className="h-auto py-8 flex-col gap-4 text-xl hover-elevate group transition-all"
                      onClick={() => setRoleSelection("creator")}
                      data-testid="button-select-creator"
                    >
                      <User className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
                      I am a Creator
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto py-8 flex-col gap-4 text-xl hover-elevate group transition-all"
                      onClick={() => setRoleSelection("brand")}
                      data-testid="button-select-brand"
                    >
                      <Building className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
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
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>{roleSelection === "creator" ? "Create Creator Profile" : "Create Brand Profile"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Form {...(roleSelection === "creator" ? creatorForm : brandForm)}>
                      <form onSubmit={(roleSelection === "creator" ? creatorForm : brandForm).handleSubmit(roleSelection === "creator" ? onCreatorSubmit : onBrandSubmit)} className="space-y-4">
                        <FormField
                          control={(roleSelection === "creator" ? creatorForm : brandForm).control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name / Company Name</FormLabel>
                              <FormControl>
                                <Input placeholder={roleSelection === "creator" ? "Your Stage Name" : "Company Name"} {...field} className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {roleSelection === "creator" && (
                          <FormField
                            control={creatorForm.control}
                            name="handle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Unique Handle</FormLabel>
                                <FormControl>
                                  <Input placeholder="username (e.g. creative_creator)" {...field} className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        {roleSelection === "brand" && (
                          <FormField
                            control={brandForm.control}
                            name="industry"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Industry</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Beauty, Tech, Fitness" {...field} className="h-12" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                        <Button type="submit" className="w-full h-12 text-lg shadow-lg shadow-primary/20" disabled={updateCreator.isPending}>
                          {updateCreator.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Create Official Profile
                        </Button>
                        <Button variant="ghost" className="w-full" onClick={() => setRoleSelection(null)}>Back</Button>
                      </form>
                    </Form>
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
                <Card className="overflow-hidden hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle>Creator Profile Overview</CardTitle>
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
                        <Button variant="outline" className="hover-elevate" data-testid="link-view-profile">View Public Profile</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform" data-testid="button-edit-creator">
                      Edit Profile & Socials
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-black">Customize Your Profile</DialogTitle>
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
                                    <Camera className="h-4 w-4" /> Profile Picture URL
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                  </FormControl>
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
                          </div>
                        </div>
                        <Button type="submit" className="w-full h-12 font-bold" disabled={updateCreator.isPending}>
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
                <Card className="overflow-hidden hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle>Brand Profile Overview</CardTitle>
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
                    <Button variant="outline" className="hover-elevate" data-testid="button-view-brand">Brand Dashboard</Button>
                  </CardContent>
                </Card>

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform" data-testid="button-edit-brand">
                      Edit Brand Settings
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl rounded-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-black">Brand Details</DialogTitle>
                    </DialogHeader>
                    <Form {...brandForm}>
                      <form onSubmit={brandForm.handleSubmit(onBrandSubmit)} className="space-y-4 pt-4">
                        <FormField
                          control={brandForm.control}
                          name="logo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Logo URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://..." {...field} />
                              </FormControl>
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
                        <Button type="submit" className="w-full h-12 font-bold">
                          Update Brand Profile
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
