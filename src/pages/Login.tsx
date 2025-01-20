import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center auth-container">
      <div className="w-full max-w-md space-y-8 p-8 bg-black/40 backdrop-blur rounded-xl">
        <div className="flex flex-col items-center">
          <Heart className="w-12 h-12 text-primary" fill="currentColor" />
          <h2 className="mt-6 text-3xl font-bold">Log In</h2>
        </div>

        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email address"
              className="bg-white/10"
            />
            <Input
              type="password"
              placeholder="Password"
              className="bg-white/10"
            />
          </div>

          <Button className="w-full" size="lg">
            Sign in
          </Button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}