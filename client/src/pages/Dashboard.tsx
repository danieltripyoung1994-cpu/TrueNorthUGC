import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useMyCreatorProfile } from "@/hooks/use-creators";
import { useBrand } from "@/hooks/use-brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, LogOut, Building, User } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { data: creatorProfile, isLoading: loadingCreator } = useMyCreatorProfile();
  const { brand: brandProfile, isLoading: loadingBrand } = useBrand();
  const [roleSelection, setRoleSelection] = useState<"creator" | "brand" | null>(null);

  const isLoading = loadingCreator || loadingBrand;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const hasProfile = !!creatorProfile || !!brandProfile;
  const activeRole = creatorProfile ? "creator" : brandProfile ? "brand" : roleSelection;

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
          ) : !hasProfile && roleSelection === "creator" ? (
            <Card>
              <CardHeader>
                <CardTitle>Create Creator Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Set up your portfolio to start getting discovered by brands.
                </p>
                <Button className="w-full sm:w-auto" data-testid="button-create-creator">
                  <Plus className="mr-2 h-4 w-4" />
                  Start Creator Profile
                </Button>
                <Button variant="ghost" onClick={() => setRoleSelection(null)}>Back</Button>
              </CardContent>
            </Card>
          ) : !hasProfile && roleSelection === "brand" ? (
            <Card>
              <CardHeader>
                <CardTitle>Create Brand Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Complete your brand profile to find and collaborate with creators.
                </p>
                <Button className="w-full sm:w-auto" data-testid="button-create-brand">
                  <Plus className="mr-2 h-4 w-4" />
                  Start Brand Profile
                </Button>
                <Button variant="ghost" onClick={() => setRoleSelection(null)}>Back</Button>
              </CardContent>
            </Card>
          ) : creatorProfile ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Creator Profile Overview</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">@{creatorProfile.handle}</p>
                    <p className="text-sm text-muted-foreground">Your portfolio is live.</p>
                  </div>
                  <Link href={`/creators/${creatorProfile.handle}`}>
                    <Button variant="outline" data-testid="link-view-profile">View Public Profile</Button>
                  </Link>
                </CardContent>
              </Card>
              <Button size="lg" className="w-full" data-testid="button-edit-creator">
                Edit Creator Portfolio
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Profile Overview</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{brandProfile?.name}</p>
                    <p className="text-sm text-muted-foreground">{brandProfile?.industry || "Brand"}</p>
                  </div>
                  <Button variant="outline" data-testid="button-view-brand">View Dashboard</Button>
                </CardContent>
              </Card>
              <Button size="lg" className="w-full" data-testid="button-edit-brand">
                Edit Brand Settings
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
