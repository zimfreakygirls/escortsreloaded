
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

interface Country {
  id: string;
  name: string;
  active: boolean;
}

export function CountryManager() {
  const [newCountry, setNewCountry] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const fetchCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCountries(data || []);
    } catch (error: any) {
      console.error('Error fetching countries:', error);
      toast({
        title: "Error",
        description: "Failed to fetch countries list",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleAddCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCountry.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('countries')
        .insert([{ name: newCountry.trim(), active: true }])
        .select()
        .single();

      if (error) throw error;

      setCountries(prev => [...prev, data]);
      setNewCountry("");
      
      toast({
        title: "Success",
        description: `${data.name} has been added to the countries list.`,
      });
    } catch (error: any) {
      console.error('Error adding country:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveCountry = async (id: string) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('countries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCountries(prev => prev.filter(country => country.id !== id));
      
      toast({
        title: "Success",
        description: "Country has been removed from the list.",
      });
    } catch (error: any) {
      console.error('Error removing country:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddCountry} className={`flex gap-4 ${isMobile ? 'flex-col' : ''}`}>
        <Input
          placeholder="Enter country name..."
          value={newCountry}
          onChange={(e) => setNewCountry(e.target.value)}
          className={isMobile ? 'w-full' : 'max-w-xs'}
          disabled={isSubmitting}
        />
        <Button type="submit" disabled={isSubmitting} className={isMobile ? 'w-full' : ''}>
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Country
            </>
          )}
        </Button>
      </form>

      <div className="space-y-2">
        {countries.map((country) => (
          <div 
            key={country.id}
            className={`flex items-center justify-between p-3 bg-card rounded-lg ${isMobile ? 'flex-col gap-2' : ''}`}
          >
            <span className={`font-medium ${isMobile ? 'text-center' : ''}`}>{country.name}</span>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleRemoveCountry(country.id)}
              disabled={isSubmitting}
              className={isMobile ? 'w-full' : ''}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
