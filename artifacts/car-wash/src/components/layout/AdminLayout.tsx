import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useAdminLogout } from "@workspace/api-client-react";
import {
  LayoutDashboard,
  CalendarCheck,
  Settings,
  LogOut,
  Droplets,
  BarChart,
  Car,
  Menu,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/services", label: "Services", icon: Car },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function NavItem({ href, label, icon: Icon }: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }) {
  const [location] = useLocation();
  const isActive = location === href;
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function Sidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center px-5 border-b border-border flex-shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Droplets className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold tracking-tight text-base text-card-foreground">Admin Pro</span>
        </Link>
      </div>
      <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>
      <div className="p-3 border-t border-border flex-shrink-0">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/5"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const logoutMutation = useAdminLogout();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, setLocation]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        logout();
        setLocation("/admin/login");
      },
      onError: () => {
        logout();
        setLocation("/admin/login");
      },
    });
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen w-full bg-muted/30 dark">
      {/* Desktop Sidebar */}
      <aside className="w-56 border-r border-border bg-card hidden md:flex flex-col flex-shrink-0">
        <Sidebar onLogout={handleLogout} />
      </aside>

      {/* Mobile */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 md:hidden flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Droplets className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-card-foreground">Admin Pro</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-56 p-0 bg-card border-border dark">
              <Sidebar onLogout={handleLogout} />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 overflow-auto p-5 md:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
