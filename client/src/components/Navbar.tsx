import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Loader2, Menu, LayoutDashboard, User } from "lucide-react";
import { Notifications } from "@/components/Notifications";
import { useAuth } from "@/hooks/use-auth";
import newLogoPng from "@assets/Photoroom_20260131_221621_1769915813253.png";

export function Navbar() {
  const [location] = useLocation();
  const { isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavLinks = ({
    mobile = false,
    onLinkClick,
  }: {
    mobile?: boolean;
    onLinkClick?: () => void;
  }) => (
    <>
      <Link
        href="/creators"
        className={`${mobile ? "text-lg py-3 w-full" : "text-sm"} font-medium transition-colors hover:text-pink-500 ${location === "/creators" || location === "/directory" ? "text-pink-500" : "text-muted-foreground"}`}
        onClick={onLinkClick}
        data-testid={mobile ? "link-mobile-browse-creators" : "link-browse-creators"}
      >
        Browse Creators
      </Link>
      <Link
        href="/brands"
        className={`${mobile ? "text-lg py-3 w-full" : "text-sm"} font-medium transition-colors hover:text-pink-500 ${location === "/brands" ? "text-pink-500" : "text-muted-foreground"}`}
        onClick={onLinkClick}
        data-testid={mobile ? "link-mobile-brands" : "link-brands"}
      >
        Brands
      </Link>
      <Link
        href="/campaigns"
        className={`${mobile ? "text-lg py-3 w-full" : "text-sm"} font-medium transition-colors hover:text-pink-500 ${location === "/campaigns" ? "text-pink-500" : "text-muted-foreground"}`}
        onClick={onLinkClick}
        data-testid={mobile ? "link-mobile-campaigns" : "link-campaigns"}
      >
        Deals
      </Link>
      <Link
        href="/pricing"
        className={`${mobile ? "text-lg py-3 w-full" : "text-sm"} font-medium transition-colors hover:text-pink-500 ${location === "/pricing" ? "text-pink-500" : "text-muted-foreground"}`}
        onClick={onLinkClick}
        data-testid={mobile ? "link-mobile-pricing" : "link-pricing"}
      >
        Pricing
      </Link>
      <Link
        href="/contact"
        className={`${mobile ? "text-lg py-3 w-full" : "text-sm"} font-medium transition-colors hover:text-pink-500 ${location === "/contact" ? "text-pink-500" : "text-muted-foreground"}`}
        onClick={onLinkClick}
        data-testid={mobile ? "link-mobile-contact" : "link-contact"}
      >
        Contact
      </Link>
      {mobile && (
        <SignedIn>
          <Link
            href="/dashboard"
            className="text-lg py-3 w-full font-medium transition-colors hover:text-pink-500 text-muted-foreground"
            onClick={onLinkClick}
            data-testid="link-mobile-dashboard"
          >
            Dashboard
          </Link>
        </SignedIn>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group relative">
          <div className="absolute -inset-4 bg-pink-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute -inset-2 bg-purple-500/10 blur-lg rounded-full animate-pulse pointer-events-none" />
          <img
            src={newLogoPng}
            alt="TrueNorthUGC Logo"
            width={40}
            height={40}
            loading="eager"
            className="h-8 sm:h-10 w-auto group-hover:rotate-6 transition-transform drop-shadow-[0_0_8px_rgba(255,0,128,0.3)] mix-blend-lighten"
          />
          <span className="text-lg sm:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 drop-shadow-[0_0_8px_rgba(255,0,128,0.3)]">
            TrueNorthUGC
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <NavLinks />

          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <>
              {/* --- Signed-in desktop --- */}
              <SignedIn>
                <div className="flex items-center gap-3">
                  <Notifications />
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "h-9 w-9 border border-border",
                      },
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label="Dashboard"
                        labelIcon={<LayoutDashboard className="h-4 w-4" />}
                        href="/dashboard"
                      />
                      <UserButton.Link
                        label="My Profile"
                        labelIcon={<User className="h-4 w-4" />}
                        href="/creators/me"
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                </div>
              </SignedIn>

              {/* --- Signed-out desktop --- */}
              <SignedOut>
                <div className="flex items-center gap-3">
                  <SignInButton mode="redirect" fallbackRedirectUrl="/dashboard">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="redirect" fallbackRedirectUrl="/dashboard">
                    <Button size="sm" className="shadow-lg shadow-primary/20">
                      Join as Creator
                    </Button>
                  </SignUpButton>
                  <SignInButton mode="redirect" fallbackRedirectUrl="/dashboard">
                    <Button size="sm" variant="outline" className="border-primary/30 hover:bg-primary/5">
                      Join as Brand
                    </Button>
                  </SignInButton>
                </div>
              </SignedOut>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden items-center gap-2">
          <SignedIn>
            <Notifications />
          </SignedIn>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <img
                    src={newLogoPng}
                    alt="TrueNorthUGC"
                    width={32}
                    height={32}
                    loading="lazy"
                    className="h-8 w-auto mix-blend-lighten"
                  />
                  <span>TrueNorthUGC</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-8">
                <NavLinks mobile onLinkClick={() => setMobileMenuOpen(false)} />

                <div className="border-t pt-6 mt-4">
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto" />
                  ) : (
                    <>
                      <SignedIn>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mb-4">
                          <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                              elements: { avatarBox: "h-12 w-12 border border-border" },
                            }}
                          />
                          <span className="text-sm font-medium text-muted-foreground">
                            Manage account
                          </span>
                        </div>
                      </SignedIn>

                      <SignedOut>
                        <div className="space-y-3">
                          <SignUpButton mode="redirect" fallbackRedirectUrl="/dashboard">
                            <Button className="w-full shadow-lg shadow-primary/20">
                              Join as Creator
                            </Button>
                          </SignUpButton>
                          <SignInButton mode="redirect" fallbackRedirectUrl="/dashboard">
                            <Button variant="outline" className="w-full border-primary/30">
                              Join as Brand
                            </Button>
                          </SignInButton>
                          <SignInButton mode="redirect" fallbackRedirectUrl="/dashboard">
                            <Button variant="ghost" className="w-full text-muted-foreground">
                              Sign In
                            </Button>
                          </SignInButton>
                        </div>
                      </SignedOut>
                    </>
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

export default Navbar;
