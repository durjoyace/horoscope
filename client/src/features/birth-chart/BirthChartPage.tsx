/**
 * Birth Chart Page - Main page for viewing and creating natal charts
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Moon,
  Sun,
  ArrowUp,
  Loader2,
  Info,
  Settings2,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import BirthChartCanvas from './BirthChartCanvas';
import PlanetDetailPanel from './PlanetDetailPanel';
import { BirthChartData, PlanetKey, ZODIAC_INFO, TransitData, LunarPhaseData } from './types';

// API functions
async function fetchBirthChart(): Promise<BirthChartData | null> {
  const res = await fetch('/api/v2/birth-charts/me', { credentials: 'include' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch birth chart');
  const data = await res.json();
  return data.data;
}

async function createBirthChart(input: any): Promise<BirthChartData> {
  const res = await fetch('/api/v2/birth-charts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to create birth chart');
  const data = await res.json();
  return data.data;
}

async function fetchTransits(): Promise<TransitData[]> {
  const res = await fetch('/api/v2/birth-charts/transits', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch transits');
  const data = await res.json();
  return data.data.significantTransits;
}

async function fetchLunarData(): Promise<LunarPhaseData> {
  const res = await fetch('/api/v2/lunar/current', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch lunar data');
  const data = await res.json();
  return data.data;
}

export function BirthChartPage() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetKey | null>(null);
  const [showAspects, setShowAspects] = useState(true);
  const [showHouses, setShowHouses] = useState(true);
  const [activeTab, setActiveTab] = useState('chart');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch birth chart
  const { data: chart, isLoading, error } = useQuery({
    queryKey: ['birth-chart'],
    queryFn: fetchBirthChart,
  });

  // Fetch transits
  const { data: transits } = useQuery({
    queryKey: ['transits'],
    queryFn: fetchTransits,
    enabled: !!chart,
  });

  // Fetch lunar data
  const { data: lunarData } = useQuery({
    queryKey: ['lunar-current'],
    queryFn: fetchLunarData,
  });

  // Create chart mutation
  const createMutation = useMutation({
    mutationFn: createBirthChart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['birth-chart'] });
      toast({
        title: 'Birth chart created',
        description: 'Your natal chart has been calculated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create birth chart. Please try again.',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!chart) {
    return <BirthChartSetup onSubmit={(data) => createMutation.mutate(data)} isLoading={createMutation.isPending} />;
  }

  const selectedPosition = selectedPlanet ? chart.planets[selectedPlanet] : null;

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Your Birth Chart
          </h1>
          <p className="text-muted-foreground">
            Explore your natal chart and current cosmic influences
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Chart controls */}
          <div className="flex items-center gap-2">
            <Label htmlFor="show-aspects" className="text-sm">Aspects</Label>
            <Switch
              id="show-aspects"
              checked={showAspects}
              onCheckedChange={setShowAspects}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="show-houses" className="text-sm">Houses</Label>
            <Switch
              id="show-houses"
              checked={showHouses}
              onCheckedChange={setShowHouses}
            />
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickStatCard
          icon={<Sun className="h-5 w-5" />}
          label="Sun Sign"
          value={chart.sunSign}
          color={ZODIAC_INFO[chart.sunSign]?.color}
        />
        <QuickStatCard
          icon={<Moon className="h-5 w-5" />}
          label="Moon Sign"
          value={chart.moonSign || 'Unknown'}
          color={chart.moonSign ? ZODIAC_INFO[chart.moonSign]?.color : undefined}
        />
        <QuickStatCard
          icon={<ArrowUp className="h-5 w-5" />}
          label="Rising Sign"
          value={chart.risingSign || 'Unknown'}
          color={chart.risingSign ? ZODIAC_INFO[chart.risingSign]?.color : undefined}
        />
        <QuickStatCard
          icon={<Sparkles className="h-5 w-5" />}
          label="Dominant Planet"
          value={chart.dominantPlanets[0] || 'Sun'}
        />
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chart">Natal Chart</TabsTrigger>
          <TabsTrigger value="transits">Current Transits</TabsTrigger>
          <TabsTrigger value="elements">Elements & Balance</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chart Visualization */}
            <div className="lg:col-span-2 relative">
              <Card className="p-4">
                <div className="flex justify-center">
                  <BirthChartCanvas
                    chart={chart}
                    size={Math.min(500, window.innerWidth - 80)}
                    showAspects={showAspects}
                    showHouses={showHouses}
                    selectedPlanet={selectedPlanet}
                    onPlanetClick={(planet) =>
                      setSelectedPlanet(selectedPlanet === planet ? null : planet)
                    }
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Click on any planet to see details
                </p>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {selectedPlanet ? (
                  <PlanetDetailPanel
                    key={selectedPlanet}
                    planet={selectedPlanet}
                    position={selectedPosition}
                    aspects={chart.aspects}
                    onClose={() => setSelectedPlanet(null)}
                  />
                ) : (
                  <motion.div
                    key="lunar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {lunarData && <LunarPhaseCard data={lunarData} />}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Aspect Summary */}
              {!selectedPlanet && (
                <AspectSummaryCard aspects={chart.aspects} />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transits" className="mt-6">
          <TransitsView transits={transits || []} chart={chart} />
        </TabsContent>

        <TabsContent value="elements" className="mt-6">
          <ElementsView chart={chart} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Quick stat card
function QuickStatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}) {
  const displayValue = value.charAt(0).toUpperCase() + value.slice(1);

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: color ? `${color}20` : 'hsl(var(--muted))' }}
        >
          <span style={{ color: color || 'hsl(var(--foreground))' }}>{icon}</span>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-semibold" style={{ color }}>{displayValue}</p>
        </div>
      </div>
    </Card>
  );
}

// Lunar phase card
function LunarPhaseCard({ data }: { data: LunarPhaseData }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-2xl">{data.symbol}</span>
          {data.phaseName}
        </CardTitle>
        <CardDescription>
          Moon in {data.moonSign.charAt(0).toUpperCase() + data.moonSign.slice(1)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium">Illumination</p>
          <div className="w-full bg-muted rounded-full h-2 mt-1">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${data.illumination}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{data.illumination}%</p>
        </div>
        <div>
          <p className="text-sm font-medium">Energy</p>
          <p className="text-xs text-muted-foreground">{data.wellness.energy}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Aspect summary card
function AspectSummaryCard({ aspects }: { aspects: any[] }) {
  const harmonious = aspects.filter((a) =>
    ['trine', 'sextile'].includes(a.type)
  ).length;
  const challenging = aspects.filter((a) =>
    ['square', 'opposition'].includes(a.type)
  ).length;
  const neutral = aspects.filter((a) =>
    ['conjunction', 'semisextile', 'quincunx'].includes(a.type)
  ).length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Aspect Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm">Harmonious</span>
          <Badge variant="default" className="bg-green-500">{harmonious}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Challenging</span>
          <Badge variant="destructive">{challenging}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Neutral</span>
          <Badge variant="secondary">{neutral}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// Transits view
function TransitsView({ transits, chart }: { transits: TransitData[]; chart: BirthChartData }) {
  if (transits.length === 0) {
    return (
      <Card className="p-8 text-center">
        <RefreshCw className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Major Transits</h3>
        <p className="text-muted-foreground">
          Currently, there are no significant planetary aspects to your natal positions.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {transits.map((transit, idx) => (
        <Card key={idx} className="p-4">
          <div className="flex items-start gap-4">
            <div className="text-3xl">{/* Planet symbol */}</div>
            <div>
              <h4 className="font-semibold">
                Transit {transit.planet.charAt(0).toUpperCase() + transit.planet.slice(1)}
              </h4>
              {transit.aspect && (
                <>
                  <Badge className="mt-1">{transit.aspect.type}</Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    {transit.aspect.interpretation}
                  </p>
                </>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Elements view
function ElementsView({ chart }: { chart: BirthChartData }) {
  const elements = [
    { name: 'Fire', count: chart.elementBalance.fire, color: '#FF4136', emoji: '🔥' },
    { name: 'Earth', count: chart.elementBalance.earth, color: '#2ECC40', emoji: '🌍' },
    { name: 'Air', count: chart.elementBalance.air, color: '#7FDBFF', emoji: '💨' },
    { name: 'Water', count: chart.elementBalance.water, color: '#0074D9', emoji: '💧' },
  ];

  const modalities = [
    { name: 'Cardinal', count: chart.modalityBalance.cardinal, desc: 'Initiative & Leadership' },
    { name: 'Fixed', count: chart.modalityBalance.fixed, desc: 'Stability & Persistence' },
    { name: 'Mutable', count: chart.modalityBalance.mutable, desc: 'Adaptability & Change' },
  ];

  const total = 12; // Total planets

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Element Balance</h3>
        <div className="space-y-4">
          {elements.map((el) => (
            <div key={el.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="flex items-center gap-2">
                  <span>{el.emoji}</span>
                  <span className="font-medium">{el.name}</span>
                </span>
                <span className="text-sm text-muted-foreground">
                  {el.count} planets
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: `${(el.count / total) * 100}%`,
                    backgroundColor: el.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Modality Balance</h3>
        <div className="space-y-4">
          {modalities.map((mod) => (
            <div key={mod.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{mod.name}</span>
                <span className="text-sm text-muted-foreground">
                  {mod.count} planets
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all bg-primary"
                  style={{ width: `${(mod.count / total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{mod.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="md:col-span-2 p-6">
        <h3 className="text-lg font-semibold mb-4">Chart Interpretation</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Dominant Element</h4>
            <p className="text-lg font-semibold">
              {elements.sort((a, b) => b.count - a.count)[0].name}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Dominant Modality</h4>
            <p className="text-lg font-semibold">
              {modalities.sort((a, b) => b.count - a.count)[0].name}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Dominant Planets</h4>
            <p className="text-lg font-semibold">
              {chart.dominantPlanets.slice(0, 2).map((p) =>
                p.charAt(0).toUpperCase() + p.slice(1)
              ).join(', ')}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Birth chart setup form
function BirthChartSetup({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    birthCity: '',
    birthState: '',
    birthCountry: '',
    latitude: '',
    longitude: '',
    birthTimeAccuracy: 'exact' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Create Your Birth Chart
            </CardTitle>
            <CardDescription>
              Enter your birth details to generate your natal chart
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Birth Date
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    required
                    value={formData.birthDate}
                    onChange={(e) =>
                      setFormData({ ...formData, birthDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthTime">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Birth Time
                  </Label>
                  <Input
                    id="birthTime"
                    type="time"
                    value={formData.birthTime}
                    onChange={(e) =>
                      setFormData({ ...formData, birthTime: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional, but needed for accurate Rising sign
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Label>
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Birth Location
                </Label>
                <div className="grid md:grid-cols-3 gap-4">
                  <Input
                    placeholder="City"
                    required
                    value={formData.birthCity}
                    onChange={(e) =>
                      setFormData({ ...formData, birthCity: e.target.value })
                    }
                  />
                  <Input
                    placeholder="State/Province"
                    value={formData.birthState}
                    onChange={(e) =>
                      setFormData({ ...formData, birthState: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Country"
                    required
                    value={formData.birthCountry}
                    onChange={(e) =>
                      setFormData({ ...formData, birthCountry: e.target.value })
                    }
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Latitude (e.g., 40.7128)"
                    required
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Longitude (e.g., -74.0060)"
                    required
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: e.target.value })
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  You can find coordinates on Google Maps
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate My Chart
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default BirthChartPage;
