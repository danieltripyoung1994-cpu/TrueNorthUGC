import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useCreators } from "@/hooks/use-creators";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, LogOut } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { data: creatorProfile, isLoading } = useCreators({ search: user?.id }); // Placeholder logic

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Creator Dashboard</h1>
            <Button variant="outline" onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          {!creatorProfile?.[0] ? (
            <Card>
              <CardHeader>
                <CardTitle>Welcome, {user?.firstName}!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  You haven't created a public profile yet. Set up your portfolio to start getting discovered by brands.
                </p>
                <Button className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Profile
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Overview</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">@{creatorProfile[0].handle}</p>
                    <p className="text-sm text-muted-foreground">Your profile is public and active.</p>
                  </div>
                  <Link href={`/creators/${creatorProfile[0].handle}`}>
                    <Button variant="outline">View Public Profile</Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Button size="lg" className="w-full">
                Edit Profile Details
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
