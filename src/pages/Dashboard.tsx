import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Video, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container px-4 sm:px-6 pt-20 pb-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">Welcome Back!</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="p-6 hover:bg-secondary/50 transition-colors">
              <div className="flex flex-col items-center text-center space-y-4">
                <Heart className="w-12 h-12 text-primary" />
                <h2 className="text-xl font-semibold">Your Matches</h2>
                <p className="text-muted-foreground">View and connect with your latest matches</p>
                <Button className="w-full" asChild>
                  <Link to="/matches">View Matches</Link>
                </Button>
              </div>
            </Card>

            <Card className="p-6 hover:bg-secondary/50 transition-colors">
              <div className="flex flex-col items-center text-center space-y-4">
                <MessageSquare className="w-12 h-12 text-primary" />
                <h2 className="text-xl font-semibold">Messages</h2>
                <p className="text-muted-foreground">Check your conversations and chat history</p>
                <Button className="w-full" asChild>
                  <Link to="/chat">Open Chat</Link>
                </Button>
              </div>
            </Card>

            <Card className="p-6 hover:bg-secondary/50 transition-colors">
              <div className="flex flex-col items-center text-center space-y-4">
                <Video className="w-12 h-12 text-primary" />
                <h2 className="text-xl font-semibold">Videos</h2>
                <p className="text-muted-foreground">Watch and share video content</p>
                <Button className="w-full" asChild>
                  <Link to="/videos">Watch Videos</Link>
                </Button>
              </div>
            </Card>

            <Card className="p-6 hover:bg-secondary/50 transition-colors">
              <div className="flex flex-col items-center text-center space-y-4">
                <Settings className="w-12 h-12 text-primary" />
                <h2 className="text-xl font-semibold">Settings</h2>
                <p className="text-muted-foreground">Manage your account preferences</p>
                <Button className="w-full" asChild>
                  <Link to="/settings">Open Settings</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}