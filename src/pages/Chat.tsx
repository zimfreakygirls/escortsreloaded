import { Header } from "@/components/Header";

export default function Chat() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Chat Room</h1>
          <p className="text-muted-foreground">Chat feature coming soon...</p>
        </div>
      </main>
    </div>
  );
}