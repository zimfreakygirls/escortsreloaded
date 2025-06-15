
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProfileDetail from "./pages/ProfileDetail";
import CountryProfiles from "./pages/CountryProfiles";
import PremiumProfiles from "./pages/PremiumProfiles";
import Videos from "./pages/Videos";
import Chat from "./pages/Chat";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import Dashboard from "./pages/Dashboard";
import { MaintenanceCheck } from "./components/MaintenanceCheck";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MaintenanceCheck>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/profile/:id" element={<ProfileDetail />} />
            <Route path="/country/:country" element={<CountryProfiles />} />
            <Route path="/premium" element={<PremiumProfiles />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-signup" element={<AdminSignup />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </MaintenanceCheck>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
