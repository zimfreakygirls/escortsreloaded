import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Country {
  name: string;
  flag?: string;
}

interface CountrySelectionDialogProps {
  open: boolean;
  onCountrySelect: (country: string) => void;
  onCancel?: () => void;
}

export function CountrySelectionDialog({ open, onCountrySelect, onCancel }: CountrySelectionDialogProps) {
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
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel?.()}>
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
        
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Select onValueChange={handleCountrySelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.name} value={country.name}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      {country.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="mt-4 pt-4 border-t space-y-2">
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => handleCountrySelect('All Countries')}
          >
            View All Countries
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}