
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimationWrapper } from "@/components/ui/animation-wrapper";
import { Users, Award, MapPin } from "lucide-react";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

export function DashboardStats() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>({
    countryData: [],
    verificationData: [],
    premiumData: [],
    cityData: []
  });
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');

        if (profilesError) throw profilesError;

        if (!profiles) {
          setChartData({
            countryData: [],
            verificationData: [],
            premiumData: [],
            cityData: []
          });
          return;
        }

        // Process data for country distribution
        const countryMap = new Map();
        profiles.forEach(profile => {
          const country = profile.country || "Unknown";
          countryMap.set(country, (countryMap.get(country) || 0) + 1);
        });
        const countryData = Array.from(countryMap.entries()).map(([name, value]) => ({ name, value }));
        
        // Process data for verification status
        const verifiedCount = profiles.filter(p => p.is_verified).length;
        const notVerifiedCount = profiles.length - verifiedCount;
        const verificationData = [
          { name: "Verified", value: verifiedCount },
          { name: "Not Verified", value: notVerifiedCount }
        ];
        
        // Process data for premium status
        const premiumCount = profiles.filter(p => p.is_premium).length;
        const regularCount = profiles.length - premiumCount;
        const premiumData = [
          { name: "Premium", value: premiumCount },
          { name: "Regular", value: regularCount }
        ];
        
        // Process data for city distribution (top 5 cities)
        const cityMap = new Map();
        profiles.forEach(profile => {
          const city = profile.city || "Unknown";
          cityMap.set(city, (cityMap.get(city) || 0) + 1);
        });
        
        // Get top 5 cities by count
        const cityData = Array.from(cityMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, value]) => ({ name, value }));

        setChartData({
          countryData,
          verificationData,
          premiumData,
          cityData
        });
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const renderPieChart = (data: any[], title: string) => (
    <Card className="bg-[#1e1c2e] border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="w-full h-[200px] flex items-center justify-center">
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : data.length > 0 ? (
          <AnimationWrapper animation="scale" duration={0.7}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </AnimationWrapper>
        ) : (
          <div className="w-full h-[200px] flex items-center justify-center text-gray-400">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderBarChart = (data: any[], title: string) => (
    <Card className="bg-[#1e1c2e] border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="w-full h-[200px] flex items-center justify-center">
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : data.length > 0 ? (
          <AnimationWrapper animation="slide" duration={0.7}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" tick={{ fill: '#aaa' }} />
                <YAxis tick={{ fill: '#aaa' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#292741', border: '1px solid #555', borderRadius: '4px' }}
                  labelStyle={{ color: 'white' }}
                />
                <Bar dataKey="value" fill="#9b87f5" />
              </BarChart>
            </ResponsiveContainer>
          </AnimationWrapper>
        ) : (
          <div className="w-full h-[200px] flex items-center justify-center text-gray-400">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderChart = (data: any[], title: string) => {
    return chartType === "pie" 
      ? renderPieChart(data, title) 
      : renderBarChart(data, title);
  };

  return (
    <AnimationWrapper animation="fade" duration={0.5}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">User Statistics</h2>
          <Tabs defaultValue="bar" onValueChange={(v) => setChartType(v as "bar" | "pie")}>
            <TabsList className="bg-[#1e1c2e] border border-[#9b87f5]/20">
              <TabsTrigger value="bar">Bar Charts</TabsTrigger>
              <TabsTrigger value="pie">Pie Charts</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {error && (
          <div className="p-4 mb-4 bg-red-500/20 text-red-400 rounded-md">
            Error loading statistics: {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderChart(chartData.countryData, "Profiles by Country")}
          {renderChart(chartData.cityData, "Top 5 Cities")}
          {renderChart(chartData.verificationData, "Verification Status")}
          {renderChart(chartData.premiumData, "Premium vs Regular")}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <AnimationWrapper animation="fade" delay={0.1} duration={0.6}>
            <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 border-none text-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Total Profiles</p>
                  <h3 className="text-3xl font-bold">{loading ? "--" : chartData.countryData.reduce((sum: number, item: any) => sum + item.value, 0)}</h3>
                </div>
              </CardContent>
            </Card>
          </AnimationWrapper>

          <AnimationWrapper animation="fade" delay={0.2} duration={0.6}>
            <Card className="bg-gradient-to-br from-amber-500 to-orange-600 border-none text-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Award className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Premium Profiles</p>
                  <h3 className="text-3xl font-bold">{loading ? "--" : chartData.premiumData.find((item: any) => item.name === "Premium")?.value || 0}</h3>
                </div>
              </CardContent>
            </Card>
          </AnimationWrapper>

          <AnimationWrapper animation="fade" delay={0.3} duration={0.6}>
            <Card className="bg-gradient-to-br from-pink-500 to-rose-600 border-none text-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <MapPin className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Countries</p>
                  <h3 className="text-3xl font-bold">{loading ? "--" : chartData.countryData.length}</h3>
                </div>
              </CardContent>
            </Card>
          </AnimationWrapper>
        </div>
      </div>
    </AnimationWrapper>
  );
}
