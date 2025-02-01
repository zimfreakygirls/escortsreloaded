import { Header } from "@/components/Header";

export default function Contact() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container px-4 sm:px-6 pt-20 pb-12">
        <div className="max-w-4xl mx-auto bg-card rounded-lg p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Contact Us</h1>
          <div className="space-y-6">
            <div className="bg-secondary/50 rounded-lg p-6">
              <p className="text-base sm:text-lg text-muted-foreground mb-6">
                Have questions or need assistance? We're here to help! Feel free to reach out to us through any of the following channels.
              </p>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <span className="font-semibold min-w-24">Email:</span>
                  <a href="mailto:contact@onenight.com" className="text-primary hover:underline">
                    contact@onenight.com
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <span className="font-semibold min-w-24">Phone:</span>
                  <a href="tel:+12345678901" className="text-primary hover:underline">
                    +1 234 567 8901
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <span className="font-semibold min-w-24">Hours:</span>
                  <span>24/7 Support Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}