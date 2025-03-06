
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
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/Dashboard";
import PremiumProfiles from "@/pages/PremiumProfiles";

export default function App() {
  return (
    <div className="dark">
      <RouterProvider
        router={createBrowserRouter([
          {
            path: "/",
            element: <Index />,
          },
          {
            path: "/premium",
            element: <PremiumProfiles />,
          },
          {
            path: "/profile/:id",
            element: <ProfileDetail />,
          },
          {
            path: "/videos",
            element: <Videos />,
          },
          {
            path: "/chat",
            element: <Chat />,
          },
          {
            path: "/contact",
            element: <Contact />,
          },
          {
            path: "/country/:country",
            element: <CountryProfiles />,
          },
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/admin-login",
            element: <AdminLogin />,
          },
          {
            path: "/admin-signup",
            element: <AdminSignup />,
          },
          {
            path: "/signup",
            element: <Signup />,
          },
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
        ])}
      />
      <Toaster />
    </div>
  );
}
