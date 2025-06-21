import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Star,
  Filter,
  Search,
  ExternalLink,
  Heart,
  ShoppingCart,
  CheckCircle2
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodiacSignNames } from '@/data/zodiacData';
import { ZodiacSign } from '@shared/types';
import { useToast } from '@/hooks/use-toast';
import { affiliateProducts, ProductCategory, AffiliateProduct } from '@/data/affiliateProducts';

interface MarketplaceProps {
  user?: {
    email: string;
    zodiacSign: ZodiacSign;
    firstName?: string | null;
  } | null;
}

export default function AffiliateMarketplace({ user }: MarketplaceProps) {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedZodiacSign, setSelectedZodiacSign] = useState<ZodiacSign | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const itemsPerPage = 12;
  const { toast } = useToast();

  // Filter products based on search, category, price, and zodiac sign
  const filteredProducts = affiliateProducts.filter(product => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (activeCategory !== 'all' && product.category !== activeCategory) {
      return false;
    }
    
    // Price filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    // Zodiac sign filter
    if (selectedZodiacSign !== 'all' && !product.recommendedSigns.includes(selectedZodiacSign)) {
      return false;
    }
    
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, priceRange, selectedZodiacSign]);

  const getCategoryIcon = (category: ProductCategory) => {
    switch (category) {
      case 'supplements':
        return <CheckCircle2 className="h-5 w-5 text-blue-600" />;
      case 'nutrition':
        return <Heart className="h-5 w-5 text-green-600" />;
      case 'fitness':
        return <Star className="h-5 w-5 text-purple-600" />;
      case 'skincare':
        return <Star className="h-5 w-5 text-pink-600" />;
      case 'meditation':
        return <Star className="h-5 w-5 text-indigo-600" />;
      case 'selfcare':
        return <Heart className="h-5 w-5 text-rose-600" />;
      default:
        return <ShoppingBag className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriceUnit = (product: AffiliateProduct): string => {
    const name = product.name.toLowerCase();
    if (name.includes('ring') || name.includes('tracker') || name.includes('device')) return 'each';
    if (name.includes('app') || name.includes('subscription') || name.includes('membership')) return 'monthly';
    if (name.includes('powder') || name.includes('protein') || name.includes('greens')) return 'per container';
    if (name.includes('coffee') || name.includes('tea') || name.includes('drink')) return 'per pack';
    if (name.includes('vitamin') || name.includes('supplement') || name.includes('capsule')) return 'per bottle';
    if (name.includes('cream') || name.includes('scrub') || name.includes('serum')) return 'per tube';
    if (name.includes('meal') || name.includes('kit') || name.includes('box')) return 'per box';
    return 'each';
  };

  const getBrandName = (productName: string): string => {
    const brandMappings: Record<string, string> = {
      'Athletic Greens': 'AG1',
      'Bloom Nutrition': 'BLOOM',
      'Ritual Essential': 'RITUAL',
      'Four Sigmatic': '4SIGMATIC',
      'Thorne Health': 'THORNE',
      'Seed Daily': 'SEED',
      'Huel Complete': 'HUEL',
      'Liquid IV': 'LIQUID IV',
      'Goop Beauty': 'GOOP',
      'Oura Ring': 'OURA',
      'Nutrafol': 'NUTRAFOL',
      'Theragun': 'THERABODY',
      'Organifi': 'ORGANIFI',
      'MUD\\WTR': 'MUDWTR',
      'Whoop': 'WHOOP',
      'Ancient Nutrition': 'ANCIENT',
      'Peloton': 'PELOTON',
      'Sakara Life': 'SAKARA',
      'Headspace': 'HEADSPACE',
      'Calm': 'CALM'
    };

    for (const [key, brand] of Object.entries(brandMappings)) {
      if (productName.includes(key)) {
        return brand;
      }
    }
    
    return productName.split(' ')[0].toUpperCase();
  };

  const handleSaveProduct = (productId: string) => {
    toast({
      title: "Product saved",
      description: "Added to your wellness wishlist for later",
    });
  };

  const getZodiacElement = (sign: ZodiacSign): string => {
    const signData = zodiacSignNames.find(s => s.value === sign);
    return signData ? signData.element : '';
  };

  const getHoroscopeHealthRecommendation = (product: AffiliateProduct, userSign?: ZodiacSign): string => {
    if (product.horoscopeHealthReason) {
      return product.horoscopeHealthReason;
    }

    // Generate highly specific personalized recommendations based on zodiac sign
    const isRecommendedForUser = userSign && product.recommendedSigns.includes(userSign);
    
    if (isRecommendedForUser && userSign) {
      // Specific recommendations based on both sign and product
      const signSpecificRecommendations: Record<ZodiacSign, Record<string, string>> = {
        aries: {
          'Athletic Greens AG1': 'Your Mars-ruled energy demands peak nutrition. AG1\'s 75 bioavailable nutrients fuel your competitive drive and support recovery from intense workouts.',
          'supplements': 'Fast-acting formulas match your need for immediate results and sustained energy throughout your action-packed days.',
          'fitness': 'High-intensity solutions designed for your naturally competitive spirit and need to push physical boundaries.',
          'default': 'Bold, results-driven wellness that matches your pioneering spirit and dynamic lifestyle.'
        },
        taurus: {
          'Bloom Nutrition Greens & Superfoods': 'Venus-ruled Taurus values quality ingredients. This organic blend supports your earth-sign need for digestive wellness and natural beauty from within.',
          'skincare': 'Luxurious, natural formulations that align with your appreciation for sensual self-care and lasting beauty.',
          'supplements': 'Premium, earth-based nutrition that supports your steady, methodical approach to long-term health.',
          'default': 'Indulgent yet effective wellness products that honor your love of quality and comfort.'
        },
        gemini: {
          'Ritual Essential for Women': 'Your Mercury-ruled mind craves transparency. Ritual\'s traceable ingredients and clear labeling satisfy your need to understand exactly what you\'re consuming.',
          'supplements': 'Scientifically-backed formulas that support your active mind and adaptable lifestyle.',
          'fitness': 'Versatile routines that prevent boredom and match your need for mental stimulation during exercise.',
          'default': 'Innovative wellness solutions that keep pace with your curious, ever-changing interests.'
        },
        cancer: {
          'Bloom Nutrition Greens & Superfoods': 'Your Moon-ruled intuition guides you toward gentle, nurturing nutrition. This digestive support honors your sensitive system and emotional well-being.',
          'selfcare': 'Comforting rituals that create the safe, nurturing environment your water sign craves.',
          'supplements': 'Gentle, gut-healing formulas that support your intuitive connection between emotional and physical health.',
          'default': 'Nurturing wellness products that honor your deep connection to family, tradition, and emotional balance.'
        },
        leo: {
          'Athletic Greens AG1': 'Your Sun-ruled vitality deserves premium nutrition. AG1\'s comprehensive formula supports your natural radiance and keeps you performing at your magnificent best.',
          'skincare': 'Luxury formulations that enhance your natural glow and support your desire to look and feel radiant.',
          'fitness': 'Premium performance products that help you shine in any physical challenge or social setting.',
          'default': 'High-quality wellness products worthy of your regal standards and vibrant personality.'
        },
        virgo: {
          'Ritual Essential for Women': 'Your Mercury-ruled perfectionism appreciates Ritual\'s meticulous sourcing and third-party testing. Every ingredient serves a specific, research-backed purpose.',
          'supplements': 'Clean, precisely-dosed formulations that meet your exacting standards for purity and effectiveness.',
          'nutrition': 'Thoughtfully crafted nutrition that supports your detailed approach to health optimization.',
          'default': 'Meticulously researched wellness products that align with your analytical approach to health.'
        },
        libra: {
          'skincare': 'Harmonious formulations that balance effectiveness with gentle care, supporting your Venus-ruled desire for beauty and equilibrium.',
          'supplements': 'Balanced nutrition that supports your quest for internal harmony and external radiance.',
          'meditation': 'Elegant mindfulness tools that create the peaceful, aesthetically pleasing environment you crave.',
          'default': 'Beautifully crafted wellness products that bring balance and harmony to your daily routine.'
        },
        scorpio: {
          'supplements': 'Transformative formulas that support your intense approach to health and your body\'s natural regenerative powers.',
          'fitness': 'Deep-acting recovery products that match your all-or-nothing approach to physical transformation.',
          'skincare': 'Powerful, results-driven formulations that support your desire for complete skin renewal.',
          'default': 'Potent wellness products that support your journey of continuous transformation and regeneration.'
        },
        sagittarius: {
          'Athletic Greens AG1': 'Your Jupiter-ruled wanderlust needs portable nutrition. AG1\'s travel-friendly format fuels your adventures while supporting optimal health on the go.',
          'supplements': 'Adventure-ready nutrition that supports your active lifestyle and global wellness exploration.',
          'fitness': 'Performance products that fuel your love of outdoor activities and physical challenges.',
          'default': 'Versatile wellness solutions that support your adventurous spirit and love of exploration.'
        },
        capricorn: {
          'Athletic Greens AG1': 'Your Saturn-ruled discipline appreciates AG1\'s long-term health investment. This comprehensive formula supports your methodical approach to peak performance.',
          'supplements': 'Professional-grade nutrition that supports your ambitious goals and disciplined wellness routine.',
          'fitness': 'Results-driven products that align with your systematic approach to achieving fitness milestones.',
          'default': 'Premium wellness investments that support your long-term health goals and professional demands.'
        },
        aquarius: {
          'Ritual Essential for Women': 'Your Uranus-ruled innovation resonates with Ritual\'s transparent, science-forward approach. This cutting-edge nutrition matches your progressive wellness values.',
          'supplements': 'Innovative formulations that support your unique approach to health and humanitarian lifestyle.',
          'fitness': 'Forward-thinking wellness products that align with your unconventional approach to fitness.',
          'default': 'Revolutionary wellness products that support your visionary approach to health and social consciousness.'
        },
        pisces: {
          'Bloom Nutrition Greens & Superfoods': 'Your Neptune-ruled intuition draws you to gentle, holistic nutrition. This organic blend supports your sensitive system and spiritual wellness practices.',
          'meditation': 'Transcendent wellness tools that support your natural connection to higher consciousness.',
          'skincare': 'Gentle, intuitive formulations that honor your sensitive skin and empathetic nature.',
          'default': 'Compassionate wellness products that support your intuitive approach to holistic healing.'
        }
      };

      const signRecs = signSpecificRecommendations[userSign];
      return signRecs[product.name] || signRecs[product.category] || signRecs.default;
    }

    // Premium general recommendations
    const premiumRecommendations: Record<string, string> = {
      'supplements': 'Clinically-studied formulations backed by rigorous third-party testing and transparent sourcing.',
      'nutrition': 'Artisanally crafted nutrition featuring premium, bioavailable ingredients for optimal absorption.',
      'fitness': 'Professional-grade performance products trusted by elite athletes and wellness professionals.',
      'skincare': 'Clean beauty featuring ethically-sourced botanicals and scientifically-proven active ingredients.',
      'meditation': 'Expertly-designed mindfulness tools created in collaboration with leading meditation teachers.',
      'selfcare': 'Luxury wellness essentials crafted with the finest natural ingredients and sustainable practices.'
    };

    return premiumRecommendations[product.category] || 'Premium wellness products curated for discerning health enthusiasts.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Premium Hero Section */}
        <div className="relative overflow-hidden py-16 mb-12">
          {/* Sophisticated background effects */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${1 + Math.random() * 2}px`,
                  height: `${1 + Math.random() * 2}px`,
                  background: `radial-gradient(circle, ${['#ffffff88', '#a78bfa88', '#ec4899aa'][Math.floor(Math.random() * 3)]} 0%, transparent 70%)`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>
          
          <div className="relative text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/10 via-violet-500/15 to-purple-500/10 border border-purple-400/30 text-purple-200 text-sm font-medium mb-8 backdrop-blur-sm shadow-lg shadow-purple-500/10">
              <ShoppingBag className="w-5 h-5 text-purple-300" />
              <span>Cosmic Wellness Collection</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="drop-shadow-2xl">Premium Wellness</span>
              <span className="block bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 bg-clip-text text-transparent mt-2 animate-pulse" style={{animationDuration: '3s'}}>
                Marketplace
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Curated premium wellness products aligned with your astrological profile. 
              Every recommendation is personalized to enhance your cosmic well-being journey.
            </p>
            
            {user && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200">
                <Star className="w-4 h-4 text-amber-400" />
                <span className="text-sm">Personalized for {user.zodiacSign}</span>
              </div>
            )}
          </div>
        </div>

        {/* Premium Personalized Banner */}
        {user && (
          <div className="relative group mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-violet-600/20 to-purple-600/20 rounded-xl blur-xl"></div>
            <div className="relative bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-purple-500/10 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6 md:p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2 justify-center md:justify-start">
                    <Star className="h-6 w-6 text-amber-400 animate-pulse" />
                    Welcome{user.firstName ? ` ${user.firstName}` : ''} - {zodiacSignNames.find(s => s.value === user.zodiacSign)?.symbol} {user.zodiacSign.charAt(0).toUpperCase() + user.zodiacSign.slice(1)}
                  </h2>
                  <p className="text-slate-300">
                    Discover products specially matched to your {getZodiacElement(user.zodiacSign)} element and wellness needs.
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-emerald-300 font-medium">
                    {filteredProducts.filter(p => p.recommendedSigns.includes(user.zodiacSign)).length} Recommended for You
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Mobile-First Filters */}
        <div className="mb-8">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-4">
            <Button
              variant="outline"
              className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters & Search
              {filteredProducts.length !== affiliateProducts.length && (
                <Badge className="ml-2 bg-purple-500">
                  {filteredProducts.length}
                </Badge>
              )}
            </Button>
          </div>

          {/* Desktop Filters Always Visible, Mobile Collapsible */}
          <div className={`space-y-4 ${!showMobileFilters ? 'hidden md:block' : 'block'}`}>
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search cosmic wellness products..." 
                className="pl-12 h-12 bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select value={activeCategory} onValueChange={(value) => setActiveCategory(value as ProductCategory | 'all')}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="supplements">Supplements</SelectItem>
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="skincare">Skincare</SelectItem>
                  <SelectItem value="meditation">Meditation</SelectItem>
                  <SelectItem value="selfcare">Self Care</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedZodiacSign} onValueChange={(value) => setSelectedZodiacSign(value as ZodiacSign | 'all')}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                  <SelectValue placeholder="Zodiac Sign" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="all">All Signs</SelectItem>
                  {zodiacSignNames.map((sign) => (
                    <SelectItem key={sign.value} value={sign.value}>
                      {sign.symbol} {sign.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/20 rounded-md">
                <span className="text-sm text-slate-300 whitespace-nowrap">Price: ${priceRange[0]} - ${priceRange[1]}</span>
                <input
                  type="range"
                  min="0"
                  max="600"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div className="flex items-center justify-between text-slate-300 text-sm">
                <span>{filteredProducts.length} products</span>
                {(searchQuery || activeCategory !== 'all' || selectedZodiacSign !== 'all' || priceRange[1] !== 200) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                      setSelectedZodiacSign('all');
                      setPriceRange([0, 200]);
                    }}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>



        {/* Premium Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-purple-400/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Premium gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative p-6">
                {/* Header with badges */}
                <div className="flex items-start justify-between mb-4">
                  <Badge className="bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                    {product.category.toUpperCase()}
                  </Badge>
                  {user && product.recommendedSigns.includes(user.zodiacSign) && (
                    <Badge className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-400/30 text-xs px-3 py-1 rounded-full backdrop-blur-sm animate-pulse">
                      ⭐ RECOMMENDED
                    </Badge>
                  )}
                </div>

                {/* Premium brand section */}
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 border border-purple-400/20">
                    {getCategoryIcon(product.category)}
                  </div>
                  <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                    {getBrandName(product.name)}
                  </div>
                </div>

                {/* Product info */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white mb-2 leading-tight min-h-[3rem] flex items-start">
                    {product.name}
                  </h3>
                  <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-slate-400 text-sm">({product.rating})</span>
                  </div>
                </div>

                {/* Personalized recommendation */}
                {user && product.recommendedSigns.includes(user.zodiacSign) && (
                  <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-400/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-emerald-300 text-xs leading-relaxed">
                        {getHoroscopeHealthRecommendation(product, user.zodiacSign)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      ${product.price}
                    </div>
                    <div className="text-slate-400 text-xs">
                      {getPriceUnit(product)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-300 hover:text-white hover:bg-white/10"
                      onClick={() => handleSaveProduct(product.id)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-medium px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      onClick={() => window.open(product.affiliateUrl, '_blank')}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Shop Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-400/30">
              <ShoppingBag className="h-8 w-8 text-purple-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No cosmic matches found</h3>
            <p className="text-slate-300 mb-6">Try adjusting your search or filter criteria to discover more wellness products</p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setPriceRange([0, 200]);
                setSelectedZodiacSign('all');
              }}
              className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Premium Featured Brands Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-violet-600/10 to-purple-600/10 rounded-xl blur-xl"></div>
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-center mb-8 text-white">
              Featured Premium Brands
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
              {['Athletic Greens', 'Bloom Nutrition', 'Ritual', 'Four Sigmatic', 'Thorne Health', 'Oura Ring'].map((brand) => (
                <div key={brand} className="group p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-purple-400/30 hover:shadow-lg hover:shadow-purple-500/10">
                  <div className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{brand}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Premium Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mb-8">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={page === currentPage 
                    ? "bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white border-none" 
                    : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                  }
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        )}

        {/* Premium Results Summary */}
        <div className="text-center text-slate-400 text-sm">
          <p>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} cosmic wellness products
            {filteredProducts.length !== affiliateProducts.length && ` (filtered from ${affiliateProducts.length} total)`}
          </p>
        </div>
      </div>
    </div>
  );
}