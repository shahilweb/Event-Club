import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Rocket, ShieldCheck, Calendar, Bell, Search, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/25">
              <Rocket className="h-5 w-5" />
            </div>
            <span className="hidden font-bold sm:inline-block font-display text-lg tracking-tight">
              EventClub
              <span className="text-primary ml-1">OS</span>
            </span>
          </Link>
          
          {isAdmin && (
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              Admin Mode
            </span>
          )}
        </div>

        <div className="flex items-center gap-6">
          {isAdmin ? (
            // Admin Nav
            <div className="flex items-center gap-1">
              <NavItem href="/admin/dashboard" active={location === "/admin/dashboard"} icon={<LayoutDashboard className="h-4 w-4" />}>
                Overview
              </NavItem>
              <NavItem href="/admin/events" active={location.startsWith("/admin/events")} icon={<Calendar className="h-4 w-4" />}>
                Events
              </NavItem>
              <Link href="/">
                <button className="ml-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Exit
                </button>
              </Link>
            </div>
          ) : (
            // Participant Nav
            <div className="flex items-center gap-1">
              <NavItem href="/events" active={location === "/events" || location.startsWith("/events/")} icon={<Calendar className="h-4 w-4" />}>
                Events
              </NavItem>
              <NavItem href="/status" active={location === "/status"} icon={<Search className="h-4 w-4" />}>
                My Status
              </NavItem>
              <NavItem href="/announcements" active={location === "/announcements"} icon={<Bell className="h-4 w-4" />}>
                Updates
              </NavItem>
              <Link href="/admin/dashboard">
                <button className="ml-4 flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavItem({ href, active, children, icon }: { href: string; active: boolean; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <Link href={href} className={cn(
      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
      active 
        ? "bg-primary/10 text-primary" 
        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
    )}>
      {icon}
      <span className="hidden sm:inline-block">{children}</span>
    </Link>
  );
}
