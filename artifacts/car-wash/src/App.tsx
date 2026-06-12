import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "sonner";
import { AuthProvider } from "@/lib/auth";
import { CustomerAuthProvider } from "@/lib/customerAuth";
import { useEffect } from "react";
import MyAccount from "@/pages/MyAccount";
import CustomerDashboard from "@/pages/CustomerDashboard";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Booking from "@/pages/Booking";
import Reviews from "@/pages/Reviews";
import About from "@/pages/About";
import Gallery from "@/pages/Gallery";
import Contact from "@/pages/Contact";
import PrivateValeting from "@/pages/PrivateValeting";
import CarDetailing from "@/pages/CarDetailing";
import CommercialValeting from "@/pages/CommercialValeting";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminBookings from "@/pages/admin/Bookings";
import AdminServices from "@/pages/admin/Services";
import AdminAnalytics from "@/pages/admin/Analytics";
import AdminSettings from "@/pages/admin/Settings";
import AdminContent from "@/pages/admin/Content";
import AdminMessages from "@/pages/admin/Messages";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/booking" component={Booking} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/about" component={About} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/contact" component={Contact} />
      <Route path="/private-valeting" component={PrivateValeting} />
      <Route path="/car-vehicle-detailing-service" component={CarDetailing} />
      <Route path="/commercial-valeting" component={CommercialValeting} />
      <Route path="/my-account" component={MyAccount} />
      <Route path="/my-account/dashboard" component={CustomerDashboard} />
      <Route path="/admin" component={() => <Redirect to="/admin/login" />} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/bookings" component={AdminBookings} />
      <Route path="/admin/services" component={AdminServices} />
      <Route path="/admin/analytics" component={AdminAnalytics} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/content" component={AdminContent} />
      <Route path="/admin/messages" component={AdminMessages} />
      <Route component={NotFound} />
    </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CustomerAuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
          <Sonner position="top-right" richColors />
        </TooltipProvider>
        </CustomerAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
