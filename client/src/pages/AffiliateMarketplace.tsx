import { useState } from 'react';
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <ShoppingBag className="h-12 w-12 text-purple-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Premium Wellness Marketplace
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Curated products from top wellness brands, personalized for your astrological profile
          </p>
        </div>

        {/* Personalized Banner */}
        {user && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 md:p-8 mb-12 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome{user.firstName ? ` ${user.firstName}` : ''} - {zodiacSignNames.find(s => s.value === user.zodiacSign)?.symbol} {user.zodiacSign.charAt(0).toUpperCase() + user.zodiacSign.slice(1)}
                </h2>
                <p className="text-purple-100">
                  Discover products specially matched to your {getZodiacElement(user.zodiacSign)} element and wellness needs.
                </p>
              </div>
              <Badge className="bg-white text-purple-600 px-4 py-2">
                {filteredProducts.filter(p => p.recommendedSigns.includes(user.zodiacSign)).length} Recommended for You
              </Badge>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search premium wellness products..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Select value={activeCategory} onValueChange={(value) => setActiveCategory(value as ProductCategory | 'all')}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
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
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Zodiac Sign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Signs</SelectItem>
              {zodiacSignNames.map((sign) => (
                <SelectItem key={sign.value} value={sign.value}>
                  {sign.symbol} {sign.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Price: ${priceRange[0]} - ${priceRange[1]}</span>
            <input
              type="range"
              min="0"
              max="600"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-24"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as ProductCategory | 'all')} className="mb-8">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              All ({affiliateProducts.length})
            </TabsTrigger>
            <TabsTrigger value="supplements" className="flex items-center gap-2">
              {getCategoryIcon('supplements')}
              Supplements
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="flex items-center gap-2">
              {getCategoryIcon('nutrition')}
              Nutrition
            </TabsTrigger>
            <TabsTrigger value="fitness" className="flex items-center gap-2">
              {getCategoryIcon('fitness')}
              Fitness
            </TabsTrigger>
            <TabsTrigger value="skincare" className="flex items-center gap-2">
              {getCategoryIcon('skincare')}
              Skincare
            </TabsTrigger>
            <TabsTrigger value="meditation" className="flex items-center gap-2">
              {getCategoryIcon('meditation')}
              Meditation
            </TabsTrigger>
            <TabsTrigger value="selfcare" className="flex items-center gap-2">
              {getCategoryIcon('selfcare')}
              Self Care
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white rounded-2xl overflow-hidden shadow-lg hover:scale-105 transform">
              <div className="relative">
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-white/90 text-gray-700 border border-gray-200 backdrop-blur-sm text-xs px-3 py-1 rounded-full">
                    {product.category.toUpperCase()}
                  </Badge>
                </div>
                {user && product.recommendedSigns.includes(user.zodiacSign) && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                      RECOMMENDED
                    </Badge>
                  </div>
                )}
                <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundColor: 'white' }}
                    loading="lazy"
                    onError={(e) => {
                      console.log('Image failed to load:', product.imageUrl);
                      // Fallback to icon if image fails to load
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-full h-full flex items-center justify-center absolute inset-0">
                    <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
                      {getCategoryIcon(product.category)}
                    </div>
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-3 pt-6">
                <CardTitle className="text-xl font-bold text-gray-900 mb-3 leading-tight min-h-[3rem] flex items-start">
                  {product.name}
                </CardTitle>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-4">
                <CardDescription className="text-sm text-gray-800 line-clamp-3 mb-4 leading-relaxed">
                  {product.description}
                </CardDescription>

                {/* Horoscope Health Recommendation */}
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-400 rounded-r-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-purple-700 mb-2">Our Cosmic Curation</p>
                      <p className="text-sm text-purple-900 leading-relaxed font-medium">
                        {getHoroscopeHealthRecommendation(product, user?.zodiacSign)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                    <span className="text-sm text-gray-500">per bottle</span>
                  </div>
                  {user?.zodiacSign && product.recommendedSigns.includes(user.zodiacSign) && (
                    <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-3 py-1">
                      ⭐ COSMIC MATCH
                    </Badge>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-6 pb-6">
                <Button
                  size="lg"
                  asChild
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg"
                >
                  <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3">
                    <span>Shop {product.name.split(' ')[0]}</span>
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setPriceRange([0, 200]);
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Featured Brands Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
            Featured Premium Brands
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {['Athletic Greens', 'Bloom Nutrition', 'Ritual', 'Four Sigmatic', 'Thorne Health', 'Oura Ring'].map((brand) => (
              <div key={brand} className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
                <div className="text-sm font-semibold text-gray-800">{brand}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="text-center text-gray-600">
          <p>Showing {filteredProducts.length} of {affiliateProducts.length} premium wellness products</p>
        </div>
      </div>
    </div>
  );
}