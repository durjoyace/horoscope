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
import { affiliateProducts, ProductCategory } from '@/data/affiliateProducts';

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
  const { toast } = useToast();

  // Filter products based on search, category, and price
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

  const handleAddToCart = (productId: string) => {
    toast({
      title: "Added to cart",
      description: "Item has been added to your shopping cart",
    });
  };

  const getZodiacElement = (sign: ZodiacSign): string => {
    const signData = zodiacSignNames.find(s => s.value === sign);
    return signData ? signData.element : '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8">
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
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
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
                  <CardTitle className="text-lg font-bold group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.rating})</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-4">
                <CardDescription className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {product.description}
                </CardDescription>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-purple-600">
                    ${product.price}
                  </div>
                  {Math.random() > 0.8 && (
                    <Badge variant="destructive" className="text-xs">
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
                    onClick={() => handleAddToCart(product.id)}
                    className="flex-1"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Buy Now
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
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Premium Wellness Brands
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
            {['Athletic Greens', 'Bloom Nutrition', 'Ritual', 'Four Sigmatic', 'Thorne Health', 'Oura Ring'].map((brand) => (
              <div key={brand} className="p-4 rounded-lg bg-white/80 hover:bg-white transition-colors">
                <div className="text-sm font-medium text-gray-700">{brand}</div>
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