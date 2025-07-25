import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Country {
  name: string;
  flag?: string;
}

interface CountrySelectionDialogProps {
  open: boolean;
  onCountrySelect: (country: string) => void;
}

export function CountrySelectionDialog({ open, onCountrySelect }: CountrySelectionDialogProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchAvailableCountries();
    }
  }, [open]);

  const fetchAvailableCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('country')
        .not('country', 'is', null)
        .neq('country', '');

      if (error) throw error;

      // Get unique countries and sort them
      const uniqueCountries = [...new Set(data.map(item => item.country))]
        .filter(country => country && country.trim().length > 0)
        .sort()
        .map(country => ({ name: country }));

      setCountries(uniqueCountries);
    } catch (error) {
      console.error('Error fetching countries:', error);
      // Fallback to some default countries
      setCountries([
        { name: 'Zambia' },
        { name: 'Zimbabwe' },
        { name: 'South Africa' },
        { name: 'Nigeria' },
        { name: 'Kenya' },
        { name: 'Ghana' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCountrySelect = (country: string) => {
    onCountrySelect(country);
    // Mark that user has seen the country selection
    localStorage.setItem('countrySelectionShown', 'true');
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Choose Your Country
          </DialogTitle>
          <DialogDescription>
            Select your country to see profiles from your area first
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            countries.map((country) => (
              <Button
                key={country.name}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-primary/10 hover:border-primary/50"
                onClick={() => handleCountrySelect(country.name)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-primary" />
                  </div>
                  <span>{country.name}</span>
                </div>
              </Button>
            ))
          )}
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => handleCountrySelect('All Countries')}
          >
            View All Countries
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}