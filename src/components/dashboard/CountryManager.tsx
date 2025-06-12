
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Country {
  id: string;
  name: string;
  currency: string;
  signup_price: number;
  payment_phone: string;
  payment_name: string;
  active: boolean;
}

export function CountryManager() {
  const { toast } = useToast();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCountry, setNewCountry] = useState({
    name: '',
    currency: 'USD',
    signup_price: 49.99,
    payment_phone: '',
    payment_name: 'Escorts Reloaded'
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast({
        title: "Error",
        description: "Failed to fetch countries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (country: Country) => {
    try {
      const { error } = await supabase
        .from('countries')
        .update({
          name: country.name,
          currency: country.currency,
          signup_price: country.signup_price,
          payment_phone: country.payment_phone,
          payment_name: country.payment_name,
          active: country.active
        })
        .eq('id', country.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Country updated successfully",
      });
      
      setEditingId(null);
      fetchCountries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this country?')) return;

    try {
      const { error } = await supabase
        .from('countries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Country deleted successfully",
      });
      
      fetchCountries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddCountry = async () => {
    try {
      const { error } = await supabase
        .from('countries')
        .insert([newCountry]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Country added successfully",
      });
      
      setNewCountry({
        name: '',
        currency: 'USD',
        signup_price: 49.99,
        payment_phone: '',
        payment_name: 'Escorts Reloaded'
      });
      
      fetchCountries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'ZMW': return 'K';
      default: return '$';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading countries...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#1e1c2e] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Add New Country</CardTitle>
          <CardDescription className="text-gray-400">
            Add a new country with local pricing and payment details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Country Name"
              value={newCountry.name}
              onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
              className="bg-[#292741] border-gray-700 text-white"
            />
            <Select value={newCountry.currency} onValueChange={(value) => setNewCountry({ ...newCountry, currency: value })}>
              <SelectTrigger className="bg-[#292741] border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="ZMW">ZMW (K)</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              step="0.01"
              placeholder="Signup Price"
              value={newCountry.signup_price}
              onChange={(e) => setNewCountry({ ...newCountry, signup_price: parseFloat(e.target.value) || 0 })}
              className="bg-[#292741] border-gray-700 text-white"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Payment Phone"
              value={newCountry.payment_phone}
              onChange={(e) => setNewCountry({ ...newCountry, payment_phone: e.target.value })}
              className="bg-[#292741] border-gray-700 text-white"
            />
            <Input
              placeholder="Payment Name"
              value={newCountry.payment_name}
              onChange={(e) => setNewCountry({ ...newCountry, payment_name: e.target.value })}
              className="bg-[#292741] border-gray-700 text-white"
            />
          </div>
          <Button 
            onClick={handleAddCountry}
            disabled={!newCountry.name || !newCountry.payment_phone}
            className="bg-gradient-to-r from-[#ff719A] to-[#f97316] hover:from-[#ff719A]/90 hover:to-[#f97316]/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Country
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#1e1c2e] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Countries</CardTitle>
          <CardDescription className="text-gray-400">
            Manage countries and their pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-300">Country</TableHead>
                <TableHead className="text-gray-300">Currency</TableHead>
                <TableHead className="text-gray-300">Price</TableHead>
                <TableHead className="text-gray-300">Payment Phone</TableHead>
                <TableHead className="text-gray-300">Payment Name</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {countries.map((country) => (
                <TableRow key={country.id} className="border-gray-800">
                  <TableCell className="text-white">{country.name}</TableCell>
                  <TableCell className="text-white">{country.currency}</TableCell>
                  <TableCell className="text-white">
                    {getCurrencySymbol(country.currency)}{country.signup_price?.toFixed(2) || '0.00'}
                  </TableCell>
                  <TableCell className="text-white">{country.payment_phone}</TableCell>
                  <TableCell className="text-white">{country.payment_name}</TableCell>
                  <TableCell>
                    <Badge variant={country.active ? "default" : "secondary"}>
                      {country.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingId(country.id)}
                        className="h-8 w-8 text-blue-400 hover:text-blue-300"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(country.id)}
                        className="h-8 w-8 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
