import { Header } from "@/components/Header";

export default function Contact() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          <p className="text-muted-foreground mb-4">
            Have questions or need assistance? Feel free to reach out to us.
          </p>
          <div className="space-y-2">
            <p>Email: contact@onenight.com</p>
            <p>Phone: +1 234 567 890</p>
          </div>
        </div>
      </main>
    </div>
  );
}