import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, LogOut, User, LayoutDashboard, Sparkles } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const { user, isLoading, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group relative">
          <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute -inset-2 bg-primary/10 blur-lg rounded-full animate-pulse pointer-events-none" />
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:rotate-6 transition-transform shadow-[0_0_15px_rgba(var(--primary),0.5)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 drop-shadow-[0_0_8px_rgba(var(--primary),0.3)]">TrueNorthUGC</span>
        </Link>

        <div className="flex items-center gap-8">
          <Link href="/creators" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/creators' ? 'text-primary' : 'text-muted-foreground'}`}>
            Browse Creators
          </Link>
          <Link href="/pricing" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/pricing' ? 'text-primary' : 'text-muted-foreground'}`}>
            Pricing
          </Link>
          
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                    <AvatarFallback>{user.firstName?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.firstName && <p className="font-medium">{user.firstName} {user.lastName}</p>}
                    <p className="w-[200px] truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <Link href="/dashboard">
                  <DropdownMenuItem className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </Link>
                <Link href={`/creators/me`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-4">
              <a href="/api/login">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  Sign In
                </Button>
              </a>
              <div className="flex items-center gap-2">
                <a href="/api/login">
                  <Button className="shadow-lg shadow-primary/20">
                    Join as Creator
                  </Button>
                </a>
                <a href="/api/login">
                  <Button variant="outline" className="border-primary/30 hover:bg-primary/5">
                    Join as Brand
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
