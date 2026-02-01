import { useState } from "react";
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
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, LogOut, User, LayoutDashboard, Menu, X } from "lucide-react";
import { Notifications } from "@/components/Notifications";
import logoPng from "@/assets/logo.png";

export function Navbar() {
  const [location] = useLocation();
  const { user, isLoading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavLinks = ({ mobile = false, onLinkClick }: { mobile?: boolean; onLinkClick?: () => void }) => (
    <>
      <Link 
        href="/creators" 
        className={`${mobile ? 'text-lg py-3 w-full' : 'text-sm'} font-medium transition-colors hover:text-pink-500 ${location === '/creators' || location === '/directory' ? 'text-pink-500' : 'text-muted-foreground'}`}
        onClick={onLinkClick}
        data-testid={mobile ? "link-mobile-browse-creators" : "link-browse-creators"}
      >
        Browse Creators
      </Link>
      <Link 
        href="/campaigns" 
        className={`${mobile ? 'text-lg py-3 w-full' : 'text-sm'} font-medium transition-colors hover:text-pink-500 ${location === '/campaigns' ? 'text-pink-500' : 'text-muted-foreground'}`}
        onClick={onLinkClick}
        data-testid={mobile ? "link-mobile-campaigns" : "link-campaigns"}
      >
        Campaigns
      </Link>
      <Link 
        href="/contact" 
        className={`${mobile ? 'text-lg py-3 w-full' : 'text-sm'} font-medium transition-colors hover:text-pink-500 ${location === '/contact' ? 'text-pink-500' : 'text-muted-foreground'}`}
        onClick={onLinkClick}
        data-testid={mobile ? "link-mobile-contact" : "link-contact"}
      >
        Contact
      </Link>
      {mobile && user && (
        <>
          <Link 
            href="/dashboard" 
            className="text-lg py-3 w-full font-medium transition-colors hover:text-pink-500 text-muted-foreground"
            onClick={onLinkClick}
            data-testid="link-mobile-dashboard"
          >
            Dashboard
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group relative">
          <div className="absolute -inset-4 bg-pink-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute -inset-2 bg-purple-500/10 blur-lg rounded-full animate-pulse pointer-events-none" />
          <img src={logoPng} alt="TrueNorthUGC Logo" className="h-8 sm:h-10 w-auto group-hover:rotate-6 transition-transform drop-shadow-[0_0_8px_rgba(255,0,128,0.3)]" />
          <span className="text-lg sm:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 drop-shadow-[0_0_8px_rgba(255,0,128,0.3)]">TrueNorthUGC</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <NavLinks />
          
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Notifications />
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full" data-testid="button-user-menu">
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
                <Link href="/dashboard">
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
            </div>
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

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          {user && <Notifications />}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <img src={logoPng} alt="TrueNorthUGC" className="h-8 w-auto" />
                  <span>TrueNorthUGC</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-8">
                <NavLinks mobile onLinkClick={() => setMobileMenuOpen(false)} />
                
                <div className="border-t pt-6 mt-4">
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto" />
                  ) : user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Avatar className="h-12 w-12 border border-border">
                          <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                          <AvatarFallback>{user.firstName?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-destructive hover:text-destructive" 
                        onClick={() => { logout(); setMobileMenuOpen(false); }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <a href="/api/login" className="block">
                        <Button className="w-full shadow-lg shadow-primary/20">
                          Join as Creator
                        </Button>
                      </a>
                      <a href="/api/login" className="block">
                        <Button variant="outline" className="w-full border-primary/30">
                          Join as Brand
                        </Button>
                      </a>
                      <a href="/api/login" className="block">
                        <Button variant="ghost" className="w-full text-muted-foreground">
                          Sign In
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
