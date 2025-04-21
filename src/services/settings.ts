
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Settings {
  id: string;
  profiles_per_page: number;
  currency: string;
  signup_price?: number;
  created_at?: string;
}

export const currencies = [
  { value: "USD", label: "US Dollar ($)", symbol: "$" },
  { value: "EUR", label: "Euro (€)", symbol: "€" },
  { value: "GBP", label: "British Pound (£)", symbol: "£" },
  { value: "JPY", label: "Japanese Yen (¥)", symbol: "¥" },
  { value: "AUD", label: "Australian Dollar (A$)", symbol: "A$" },
  { value: "CAD", label: "Canadian Dollar (C$)", symbol: "C$" },
  { value: "CHF", label: "Swiss Franc (CHF)", symbol: "CHF" },
  { value: "ZMW", label: "Zambian Kwacha (K)", symbol: "K" },
];

export const fetchSettings = async (): Promise<Settings> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'global_settings')
      .single();

    if (error) {
      // If settings don't exist yet, we'll create them with default values
      if (error.code === 'PGRST116') {
        return {
          id: 'global_settings',
          profiles_per_page: 6,
          currency: 'USD',
          signup_price: 49.99
        };
      }
      throw error;
    }

    const settingsData = data as Settings;
    // Set default currency if not present
    if (!settingsData.currency) {
      settingsData.currency = 'USD';
    }
    
    return settingsData;
  } catch (error: any) {
    console.error("Failed to fetch settings:", error);
    // Continue with default values
    return {
      id: 'global_settings',
      profiles_per_page: 6,
      currency: 'USD',
      signup_price: 49.99
    };
  }
};

export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    const { error } = await supabase
      .from('settings')
      .upsert(settings, { onConflict: 'id' });

    if (error) throw error;

    toast({
      title: "Success",
      description: "Settings saved successfully",
    });
  } catch (error: any) {
    console.error("Failed to save settings:", error);
    toast({
      title: "Error",
      description: "Failed to save settings: " + error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const getCurrencySymbol = (currencyCode: string): string => {
  const found = currencies.find(c => c.value === currencyCode);
  return found ? found.symbol : '$';
};
