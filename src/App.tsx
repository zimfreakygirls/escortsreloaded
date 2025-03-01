import Index from "@/pages/Index";
import ProfileDetail from "@/pages/ProfileDetail";
import Videos from "@/pages/Videos";
import Chat from "@/pages/Chat";
import Contact from "@/pages/Contact";
import Country from "@/pages/Country";
import Login from "@/pages/Login";
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
            path: "/country/:name",
            element: <Country />,
          },
          {
            path: "/login",
            element: <Login />,
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
