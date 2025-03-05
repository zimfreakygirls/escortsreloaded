
import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ContactInfo {
  id: string;
  email: string;
  phone: string;
  hours: string;
  disclaimer: string;
}

const defaultContactInfo: ContactInfo = {
  id: "contact_info",
  email: "escortsreloaded@gmail.com",
  phone: "+1 234 567 8901",
  hours: "24/7 Support Available",
  disclaimer: "This website only allows adult individuals to advertise their time and companionship to other adult individuals. We do not provide a booking service nor arrange meetings. Any price indicated relates to time only and nothing else. Any service offered or whatever else that may occur is the choice of consenting adults and a private matter between them. In some countries, individuals do not legally have the choice to decide this; it is your responsibility to comply with local laws."
};

export default function Contact() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_info')
          .select('*')
          .eq('id', 'contact_info')
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
          console.error("Error fetching contact info:", error);
          return;
        }

        if (data) {
          setContactInfo(data);
        }
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
      }
    };

    fetchContactInfo();
  }, []);

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
                  <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline">
                    {contactInfo.email}
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <span className="font-semibold min-w-24">Phone:</span>
                  <a href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`} className="text-primary hover:underline">
                    {contactInfo.phone}
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <span className="font-semibold min-w-24">Hours:</span>
                  <span>{contactInfo.hours}</span>
                </div>
              </div>
            </div>
            
            {/* Disclaimer */}
            <div className="bg-secondary/30 rounded-lg p-6 border border-border">
              <h2 className="text-lg font-semibold mb-3">Disclaimer</h2>
              <p className="text-sm text-muted-foreground">
                {contactInfo.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
