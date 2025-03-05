
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Check, Loader2 } from "lucide-react";
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

export function ContactManager() {
  const [form, setForm] = useState<ContactInfo>(defaultContactInfo);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('contact_info')
          .select('*')
          .eq('id', 'contact_info')
          .single();

        if (error) {
          if (error.code === 'PGRST116') { // No data found
            // Create default contact info if not exists
            await createDefaultContactInfo();
          } else {
            console.error("Error fetching contact info:", error);
            toast({
              title: "Error",
              description: "Failed to load contact information",
              variant: "destructive",
            });
          }
          return;
        }

        if (data) {
          setForm(data);
        }
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
        toast({
          title: "Error",
          description: "Failed to load contact information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, [toast]);

  const createDefaultContactInfo = async () => {
    try {
      const { error } = await supabase
        .from('contact_info')
        .insert([defaultContactInfo]);

      if (error) throw error;
      
      setForm(defaultContactInfo);
    } catch (error) {
      console.error("Error creating default contact info:", error);
      toast({
        title: "Error",
        description: "Failed to initialize contact information",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('contact_info')
        .upsert([form], {
          onConflict: 'id'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contact information updated successfully",
      });
    } catch (error) {
      console.error("Error updating contact info:", error);
      toast({
        title: "Error",
        description: "Failed to update contact information",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">Email Address</label>
          <Input
            id="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            className="bg-[#1e1c2e] border-gray-700"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="phone">Phone Number</label>
          <Input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            className="bg-[#1e1c2e] border-gray-700"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="hours">Support Hours</label>
          <Input
            id="hours"
            name="hours"
            value={form.hours}
            onChange={handleInputChange}
            className="bg-[#1e1c2e] border-gray-700"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="disclaimer">Disclaimer Text</label>
          <Textarea
            id="disclaimer"
            name="disclaimer"
            value={form.disclaimer}
            onChange={handleInputChange}
            rows={6}
            className="bg-[#1e1c2e] border-gray-700 resize-y"
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={saving}
        className="bg-gradient-to-r from-[#ff719A] to-[#f97316] hover:from-[#ff719A]/90 hover:to-[#f97316]/90"
      >
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving Changes...
          </>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" />
            Save Changes
          </>
        )}
      </Button>
    </form>
  );
}
