
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, currencies, saveSettings } from "@/services/settings";

interface SettingsManagerProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export function SettingsManager({ settings, onSettingsChange }: SettingsManagerProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [localPrice, setLocalPrice] = useState(settings.signup_price ?? 49.99);

  const handleProfilesPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      onSettingsChange({ ...settings, profiles_per_page: value });
    }
  };

  const handleCurrencyChange = (value: string) => {
    onSettingsChange({ ...settings, currency: value });
  };

  const handleSignupPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setLocalPrice(value);
      onSettingsChange({ ...settings, signup_price: value });
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await saveSettings({ ...settings, signup_price: localPrice });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-[#292741] backdrop-blur-sm text-white">
      <CardHeader className="border-b border-gray-800 pb-6">
        <CardTitle className="text-xl font-medium flex items-center">
          <DollarSign className="w-5 h-5 text-[#9b87f5] mr-2" />
          General Settings
        </CardTitle>
        <CardDescription className="text-gray-400">
          Configure global settings for your website
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="profiles_per_page" className="block text-sm font-medium text-gray-300">
                Profiles per page
              </label>
              <Input
                id="profiles_per_page"
                type="number"
                min="1"
                value={settings.profiles_per_page}
                onChange={handleProfilesPerPageChange}
                className="w-full bg-[#1e1c2e] border-gray-700 focus:border-[#9b87f5] focus:ring-1 focus:ring-[#7E69AB]"
              />
              <p className="text-xs text-gray-400">
                Number of profiles to show before the "Load More" button
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="currency" className="block text-sm font-medium text-gray-300">
                Currency
              </label>
              <Select 
                value={settings.currency} 
                onValueChange={handleCurrencyChange}
              >
                <SelectTrigger 
                  id="currency" 
                  className="w-full bg-[#1e1c2e] border-gray-700 focus:border-[#9b87f5] focus:ring-1 focus:ring-[#7E69AB]"
                >
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-[#292741] border-gray-700 text-white">
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">
                Select the currency to display throughout the site
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="signup_price" className="block text-sm font-medium text-gray-300">
                Signup Price
              </label>
              <Input 
                id="signup_price"
                type="number"
                min="0"
                step="0.01"
                value={localPrice}
                onChange={handleSignupPriceChange}
                className="w-full bg-[#1e1c2e] border-gray-700 focus:border-[#9b87f5] focus:ring-1 focus:ring-[#7E69AB]"
              />
              <p className="text-xs text-gray-400">
                Amount users must pay to activate their account during signup
              </p>
            </div>
          </div>
          <Button 
            onClick={handleSaveSettings} 
            disabled={isSaving}
            className="bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] hover:from-[#8b77e5] hover:to-[#5E49A5] border-0 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
