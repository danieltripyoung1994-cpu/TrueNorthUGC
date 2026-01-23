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
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Button variant="outline" onClick={() => logout()} data-testid="button-logout">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          {!hasProfile && !roleSelection ? (
            <Card className="border-2 border-dashed">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Choose your path</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                <Button 
                  variant="outline" 
                  className="h-auto py-8 flex-col gap-4 text-xl hover-elevate"
                  onClick={() => setRoleSelection("creator")}
                  data-testid="button-select-creator"
                >
                  <User className="h-12 w-12 text-primary" />
                  I am a Creator
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-8 flex-col gap-4 text-xl hover-elevate"
                  onClick={() => setRoleSelection("brand")}
                  data-testid="button-select-brand"
                >
                  <Building className="h-12 w-12 text-primary" />
                  I am a Brand
                </Button>
              </CardContent>
            </Card>
          ) : !hasProfile && (roleSelection === "creator" || roleSelection === "brand") ? (
            <Card>
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
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder={roleSelection === "creator" ? "Your Stage Name" : "Company Name"} {...field} />
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
                            <FormLabel>Handle</FormLabel>
                            <FormControl>
                              <Input placeholder="username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    <Button type="submit" className="w-full" disabled={updateCreator.isPending}>
                      {updateCreator.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Start Profile
                    </Button>
                    <Button variant="ghost" className="w-full" onClick={() => setRoleSelection(null)}>Back</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : creatorProfile ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Creator Profile Overview</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-muted overflow-hidden border">
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
                      <Button variant="outline" data-testid="link-view-profile">View Public Profile</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full shadow-lg shadow-primary/20" data-testid="button-edit-creator">
                    Edit Profile & Socials
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Customize Your Profile</DialogTitle>
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
                                  <Textarea className="h-32" placeholder="Tell brands about yourself..." {...field} />
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
                      <Button type="submit" className="w-full" disabled={updateCreator.isPending}>
                        {updateCreator.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Profile Overview</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl bg-muted overflow-hidden border">
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
                  <Button variant="outline" data-testid="button-view-brand">Brand Dashboard</Button>
                </CardContent>
              </Card>

              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full shadow-lg shadow-primary/20" data-testid="button-edit-brand">
                    Edit Brand Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Brand Details</DialogTitle>
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
                              <Textarea placeholder="What kind of content are you looking for?" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">
                        Update Brand Profile
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
