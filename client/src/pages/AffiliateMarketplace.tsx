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

    // Generate personalized recommendation based on zodiac sign
    const isRecommendedForUser = userSign && product.recommendedSigns.includes(userSign);
    
    if (isRecommendedForUser) {
      const element = getZodiacElement(userSign);
      switch (product.category) {
        case 'supplements':
          return `Perfect for ${element} signs who value comprehensive wellness routines and prefer science-backed nutrition.`;
        case 'nutrition':
          return `Ideal for ${element} signs seeking balanced nutrition that supports their natural energy patterns.`;
        case 'fitness':
          return `Designed for ${element} signs who prioritize strength and endurance in their wellness journey.`;
        case 'skincare':
          return `Crafted for ${element} signs who appreciate natural beauty routines that enhance their radiant energy.`;
        case 'meditation':
          return `Perfect for ${element} signs seeking mindfulness practices that align with their spiritual nature.`;
        case 'selfcare':
          return `Ideal for ${element} signs who value self-care rituals that nurture their well-being.`;
        default:
          return `Recommended for ${element} signs who embrace holistic wellness approaches.`;
      }
    }

    // General recommendations for non-targeted users
    switch (product.category) {
      case 'supplements':
        return "Scientifically formulated to support comprehensive daily wellness and nutritional needs.";
      case 'nutrition':
        return "Premium nutrition designed to fuel your body with clean, effective ingredients.";
      case 'fitness':
        return "Professional-grade fitness support for achieving your strength and performance goals.";
      case 'skincare':
        return "Clean beauty formulated with natural ingredients for healthy, glowing skin.";
      case 'meditation':
        return "Mindfulness tools to enhance your mental clarity and emotional balance.";
      case 'selfcare':
        return "Luxurious self-care essentials for nurturing your overall well-being.";
      default:
        return "Premium wellness product designed to support your health journey.";
    }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border border-gray-200 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(product.category)}
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  {user && product.recommendedSigns.includes(user.zodiacSign) && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                      For You
                    </Badge>
                  )}
                </div>
                
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center">
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
                    </div>
                    <span className="text-sm text-gray-700 font-medium">({product.rating})</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-4">
                <CardDescription className="text-sm text-gray-800 line-clamp-3 mb-4 leading-relaxed">
                  {product.description}
                </CardDescription>

                {/* Horoscope Health Recommendation */}
                <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-purple-700 mb-1">Why Horoscope Health Recommends This</p>
                      <p className="text-xs text-purple-800 leading-relaxed">
                        {getHoroscopeHealthRecommendation(product, user?.zodiacSign)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-900">
                    ${product.price}
                  </div>
                  {Math.random() > 0.8 && (
                    <Badge className="bg-red-500 text-white text-xs">
                      {Math.floor(Math.random() * 20) + 10}% OFF
                    </Badge>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-4 border-t border-gray-100">
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveProduct(product.id)}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
                  >
                    <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Shop Now
                    </a>
                  </Button>
                </div>
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