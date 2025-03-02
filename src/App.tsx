
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Videos from "./pages/Videos";
import ProfileDetail from "./pages/ProfileDetail";
import CountryProfiles from "./pages/CountryProfiles";
import Chat from "./pages/Chat";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import PremiumProfiles from "./pages/PremiumProfiles";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/profile/:id" element={<ProfileDetail />} />
          <Route path="/country/:country" element={<CountryProfiles />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/premium" element={<PremiumProfiles />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
