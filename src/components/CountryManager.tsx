
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Country {
  id: string;
  name: string;
  active: boolean;
}

export function CountryManager() {
  const [newCountry, setNewCountry] = useState("");
  const [countries, setCountries] = useState<Country[]>([
    { id: '1', name: 'Zambia', active: true },
    { id: '2', name: 'Zimbabwe', active: true },
    { id: '3', name: 'Malawi', active: true }
  ]);
  const { toast } = useToast();

  const handleAddCountry = () => {
    if (!newCountry.trim()) return;
    
    const country = {
      id: crypto.randomUUID(),
      name: newCountry.trim(),
      active: true
    };
    
    setCountries([...countries, country]);
    setNewCountry("");
    
    toast({
      title: "Success",
      description: `${country.name} has been added to the countries list.`,
    });
  };

  const handleRemoveCountry = (id: string) => {
    setCountries(countries.filter(country => country.id !== id));
    
    toast({
      title: "Success",
      description: "Country has been removed from the list.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          placeholder="Enter country name..."
          value={newCountry}
          onChange={(e) => setNewCountry(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={handleAddCountry}>
          <Plus className="w-4 h-4 mr-2" />
          Add Country
        </Button>
      </div>

      <div className="space-y-2">
        {countries.map((country) => (
          <div 
            key={country.id}
            className="flex items-center justify-between p-3 bg-card rounded-lg"
          >
            <span className="font-medium">{country.name}</span>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleRemoveCountry(country.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
