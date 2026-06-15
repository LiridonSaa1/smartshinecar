import { Link, useLocation } from "wouter";
import { useCustomerAuth } from "@/lib/customerAuth";
import {
  CalendarCheck,
  LogOut,
  Droplets,
  Menu,
  Star,
  User,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/my-account/dashboard", label: "My Bookings", icon: CalendarCheck },
  { href: "/my-account/reviews", label: "Write a Review", icon: Star },
  { href: "/my-account/quote", label: "Request a Quote", icon: FileText },
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
          ? "bg-blue-600 text-white"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function Sidebar({ customer, onLogout }: { customer: { name: string; email: string } | null; onLogout: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center px-5 border-b border-gray-200 flex-shrink-0">
        <Link href="/my-account/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Droplets className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold tracking-tight text-base text-gray-900">My Account</span>
        </Link>
      </div>

      {customer && (
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{customer.name}</p>
              <p className="text-xs text-gray-500 truncate">{customer.email}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      <div className="p-3 border-t border-gray-200 flex-shrink-0 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        >
          <Droplets className="h-4 w-4" />
          Back to Website
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-500 hover:text-red-600 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { customer, logout } = useCustomerAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/my-account");
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="w-56 border-r border-gray-200 bg-white hidden md:flex flex-col flex-shrink-0">
        <Sidebar customer={customer} onLogout={handleLogout} />
      </aside>

      {/* Mobile */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 md:hidden flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
              <Droplets className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">My Account</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-56 p-0 bg-white border-gray-200">
              <Sidebar customer={customer} onLogout={handleLogout} />
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
