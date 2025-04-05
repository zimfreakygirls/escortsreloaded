
import { useEffect } from "react";
import Index from "@/pages/Index";
import ProfileDetail from "@/pages/ProfileDetail";
import Videos from "@/pages/Videos";
import Chat from "@/pages/Chat";
import Contact from "@/pages/Contact";
import CountryProfiles from "@/pages/CountryProfiles";
import Login from "@/pages/Login";
import AdminLogin from "@/pages/AdminLogin";
import AdminSignup from "@/pages/AdminSignup";
import Signup from "@/pages/Signup";
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/Dashboard";
import PremiumProfiles from "@/pages/PremiumProfiles";
import { gsap } from "gsap";

// Page transition component
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Create page transition animation
    const timeline = gsap.timeline();
    
    // Exit animation (fade out)
    timeline.to("main", { 
      opacity: 0, 
      y: 20, 
      duration: 0.3, 
      ease: "power1.out" 
    });
    
    // Enter animation (fade in)
    timeline.fromTo(
      "main",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      0.3
    );
    
    // Run animation
    timeline.play();
  }, [location]);
  
  return <main>{children}</main>;
};

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <PageTransition><Index /></PageTransition>,
  },
  {
    path: "/premium",
    element: <PageTransition><PremiumProfiles /></PageTransition>,
  },
  {
    path: "/profile/:id",
    element: <PageTransition><ProfileDetail /></PageTransition>,
  },
  {
    path: "/videos",
    element: <PageTransition><Videos /></PageTransition>,
  },
  {
    path: "/chat",
    element: <PageTransition><Chat /></PageTransition>,
  },
  {
    path: "/contact",
    element: <PageTransition><Contact /></PageTransition>,
  },
  {
    path: "/country/:country",
    element: <PageTransition><CountryProfiles /></PageTransition>,
  },
  {
    path: "/login",
    element: <PageTransition><Login /></PageTransition>,
  },
  {
    path: "/admin-login",
    element: <PageTransition><AdminLogin /></PageTransition>,
  },
  {
    path: "/admin-signup",
    element: <PageTransition><AdminSignup /></PageTransition>,
  },
  {
    path: "/signup",
    element: <PageTransition><Signup /></PageTransition>,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);

export default function App() {
  return (
    <div className="dark">
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}
