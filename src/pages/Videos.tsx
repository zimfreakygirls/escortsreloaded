import { Header } from "@/components/Header";

export default function Videos() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container pt-24 pb-12">
        <h1 className="text-2xl font-bold mb-6">Videos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Video content will be added here */}
          <div className="text-muted-foreground">Coming soon...</div>
        </div>
      </main>
    </div>
  );
}