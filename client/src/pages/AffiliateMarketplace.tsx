import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Star,
  Filter,
  Search,
  Tag,
  ChevronDown,
  Info,
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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { zodiacSignNames, zodiacElementColors } from '@/data/zodiacData';
import { ZodiacSign } from '@shared/types';
import { useToast } from '@/hooks/use-toast';

interface MarketplaceProps {
  user?: {
    email: string;
    zodiacSign: ZodiacSign;
    firstName?: string;
  } | null;
}

// Affiliate product types
type ProductCategory = 'supplements' | 'teas' | 'books' | 'tools' | 'crystals' | 'all';

// Wellness categories for filtering
type WellnessCategory = 'nutrition' | 'sleep' | 'stress' | 'fitness' | 'mindfulness' | 'all';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: ProductCategory;
  wellnessCategories: WellnessCategory[];
  rating: number;
  recommendedSigns: ZodiacSign[];
  bestSeller?: boolean;
  stockLevel: 'in_stock' | 'low_stock' | 'out_of_stock';
  element?: 'Fire' | 'Earth' | 'Air' | 'Water' | 'All';
  featured?: boolean;
  discountPercentage?: number;
}

// Sample affiliate products data
const products: Product[] = [
  {
    id: 'p1',
    name: 'Horoscope Health Balance Multivitamin',
    price: 39.99,
    image: 'supplements',
    description: 'A comprehensive multivitamin formula designed to support overall wellness with astrology-inspired herbal blends.',
    category: 'supplements',
    wellnessCategories: ['nutrition', 'stress'],
    rating: 4.5,
    recommendedSigns: ['aries', 'leo', 'sagittarius'],
    bestSeller: true,
    stockLevel: 'in_stock',
    element: 'Fire',
    featured: true
  },
  {
    id: 'p2',
    name: 'Tranquility Tea Blend',
    price: 18.99,
    image: 'teas',
    description: 'Calming herbal tea blend with chamomile, lavender, and valerian root to help water signs find balance and peace.',
    category: 'teas',
    wellnessCategories: ['sleep', 'stress'],
    rating: 4.8,
    recommendedSigns: ['cancer', 'scorpio', 'pisces'],
    stockLevel: 'in_stock',
    element: 'Water',
    discountPercentage: 15
  },
  {
    id: 'p3',
    name: 'Grounding Crystal Set',
    price: 49.99,
    image: 'crystals',
    description: 'Collection of earth-attuned crystals including jade, emerald, and moss agate to support earth signs in finding stability.',
    category: 'crystals',
    wellnessCategories: ['stress', 'mindfulness'],
    rating: 4.2,
    recommendedSigns: ['taurus', 'virgo', 'capricorn'],
    stockLevel: 'low_stock',
    element: 'Earth',
    featured: true
  },
  {
    id: 'p4',
    name: 'Mental Clarity Supplements',
    price: 34.99,
    image: 'supplements',
    description: 'Brain-supporting formula with ginkgo biloba, bacopa, and lion\'s mane mushroom, perfect for enhancing air signs\' mental acuity.',
    category: 'supplements',
    wellnessCategories: ['stress', 'mindfulness'],
    rating: 4.6,
    recommendedSigns: ['gemini', 'libra', 'aquarius'],
    stockLevel: 'in_stock',
    element: 'Air'
  },
  {
    id: 'p5',
    name: 'Zodiac Wellness Journal',
    price: 24.99,
    image: 'books',
    description: 'Guided wellness journal with astrological insights for tracking health, habits, and personal growth through cosmic cycles.',
    category: 'books',
    wellnessCategories: ['mindfulness', 'stress', 'sleep'],
    rating: 4.7,
    recommendedSigns: ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'],
    bestSeller: true,
    stockLevel: 'in_stock',
    element: 'All',
    discountPercentage: 10
  },
  {
    id: 'p6',
    name: 'Fire Sign Energy Boosting Tea',
    price: 16.99,
    image: 'teas',
    description: 'Invigorating blend with ginseng, cinnamon, and citrus designed to enhance natural fire sign energy and vitality.',
    category: 'teas',
    wellnessCategories: ['fitness', 'nutrition'],
    rating: 4.3,
    recommendedSigns: ['aries', 'leo', 'sagittarius'],
    stockLevel: 'in_stock',
    element: 'Fire'
  },
  {
    id: 'p7',
    name: 'Celestial Meditation Cushion',
    price: 59.99,
    image: 'tools',
    description: 'Ergonomic meditation cushion with zodiac constellation designs to support proper posture during mindfulness practices.',
    category: 'tools',
    wellnessCategories: ['mindfulness', 'stress'],
    rating: 4.4,
    recommendedSigns: ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'],
    stockLevel: 'in_stock',
    element: 'All',
    featured: true
  },
  {
    id: 'p8',
    name: 'Astro-Herbalism Guide',
    price: 29.99,
    image: 'books',
    description: 'Comprehensive guide to plant medicine through the lens of astrology, with personalized herbal recommendations for each sign.',
    category: 'books',
    wellnessCategories: ['nutrition', 'mindfulness'],
    rating: 4.9,
    recommendedSigns: ['taurus', 'virgo', 'capricorn'],
    stockLevel: 'in_stock',
    element: 'Earth'
  }
];

const getCategoryIcon = (category: ProductCategory) => {
  switch (category) {
    case 'supplements':
      return (
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-full flex items-center justify-center shadow-md">
          <div className="bg-white rounded-full p-2">
            <CheckCircle2 className="h-8 w-8 text-blue-600" strokeWidth={2} />
          </div>
        </div>
      );
    case 'teas':
      return (
        <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-full flex items-center justify-center shadow-md">
          <div className="bg-white rounded-full p-2">
            <Heart className="h-8 w-8 text-green-600" strokeWidth={2} fill="rgba(34, 197, 94, 0.2)" />
          </div>
        </div>
      );
    case 'books':
      return (
        <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-4 rounded-full flex items-center justify-center shadow-md">
          <div className="bg-white rounded-full p-2">
            <Info className="h-8 w-8 text-amber-600" strokeWidth={2} />
          </div>
        </div>
      );
    case 'tools':
      return (
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-full flex items-center justify-center shadow-md">
          <div className="bg-white rounded-full p-2">
            <Star className="h-8 w-8 text-purple-600" strokeWidth={2} fill="rgba(147, 51, 234, 0.2)" />
          </div>
        </div>
      );
    case 'crystals':
      return (
        <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-4 rounded-full flex items-center justify-center shadow-md">
          <div className="bg-white rounded-full p-2">
            <Star className="h-8 w-8 text-pink-600" strokeWidth={2} fill="rgba(219, 39, 119, 0.2)" />
          </div>
        </div>
      );
    default:
      return (
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-full flex items-center justify-center shadow-md">
          <div className="bg-white rounded-full p-2">
            <ShoppingBag className="h-8 w-8 text-gray-600" strokeWidth={2} />
          </div>
        </div>
      );
  }
};

export default function AffiliateMarketplace({ user }: MarketplaceProps) {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [elementFilter, setElementFilter] = useState<string>('All');
  const [wellnessFilter, setWellnessFilter] = useState<WellnessCategory>('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showDiscounted, setShowDiscounted] = useState(false);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [showCartNotification, setShowCartNotification] = useState(false);
  
  const { toast } = useToast();

  const addToCart = (productId: string) => {
    setCartItems([...cartItems, productId]);
    setShowCartNotification(true);
    
    toast({
      title: "Added to cart",
      description: "Item has been added to your shopping cart",
    });
    
    setTimeout(() => {
      setShowCartNotification(false);
    }, 3000);
  };

  const filteredProducts = products.filter(product => {
    // Filter by category
    if (activeCategory !== 'all' && product.category !== activeCategory) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by price range
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    // Filter by element
    if (elementFilter !== 'All' && product.element !== elementFilter && product.element !== 'All') {
      return false;
    }
    
    // Filter by wellness category
    if (wellnessFilter !== 'all' && !product.wellnessCategories.includes(wellnessFilter)) {
      return false;
    }
    
    // Filter by featured products
    if (showFeaturedOnly && !product.featured) {
      return false;
    }
    
    // Filter by discounted products
    if (showDiscounted && !product.discountPercentage) {
      return false;
    }
    
    // Filter by user's zodiac sign (if user is logged in)
    if (user?.zodiacSign && !product.recommendedSigns.includes(user.zodiacSign) && 
        product.recommendedSigns.length !== 12) { // 12 means recommended for all signs
      return false;
    }
    
    return true;
  });

  const getZodiacElement = (sign: ZodiacSign): string => {
    const signData = zodiacSignNames.find(s => s.value === sign);
    return signData ? signData.element : '';
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-4">
          <ShoppingBag className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Horoscope Health Marketplace
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Curated products aligned with your astrological profile for optimal wellbeing
        </p>
      </div>

      {/* Personalized Banner (if user is logged in) */}
      {user && (
        <div className="bg-primary/10 rounded-lg p-6 md:p-8 mb-12 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome{user.firstName ? ` ${user.firstName}` : ''} - {zodiacSignNames.find(s => s.value === user.zodiacSign)?.symbol} {user.zodiacSign.charAt(0).toUpperCase() + user.zodiacSign.slice(1)}
              </h2>
              <p className="text-muted-foreground">
                We've curated products specially matched to your {getZodiacElement(user.zodiacSign)} element and astrological profile.
              </p>
            </div>
            <Button>View Your Recommendations</Button>
          </div>
        </div>
      )}

      {/* Filters and Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5" /> Filters
            </h2>
            
            <div className="space-y-6">
              {/* Search */}
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search products..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Products' },
                    { value: 'supplements', label: 'Supplements' },
                    { value: 'teas', label: 'Herbal Teas' },
                    { value: 'books', label: 'Books & Guides' },
                    { value: 'tools', label: 'Wellness Tools' },
                    { value: 'crystals', label: 'Crystals & Stones' }
                  ].map((category) => (
                    <Button
                      key={category.value}
                      variant={activeCategory === category.value ? "default" : "ghost"}
                      className="w-full justify-start text-left"
                      onClick={() => setActiveCategory(category.value as ProductCategory)}
                    >
                      {category.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Price Range</label>
                  <span className="text-sm text-muted-foreground">
                    ${priceRange[0]} - ${priceRange[1]}
                  </span>
                </div>
                <Slider
                  defaultValue={[0, 100]}
                  min={0}
                  max={100}
                  step={5}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="my-4"
                />
              </div>
              
              {/* Element Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Element</label>
                <Select value={elementFilter} onValueChange={setElementFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by element" />
                  </SelectTrigger>
                  <SelectContent>
                    {['All', 'Fire', 'Earth', 'Air', 'Water'].map((element) => (
                      <SelectItem key={element} value={element}>
                        {element}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Wellness Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Wellness Focus</label>
                <Select value={wellnessFilter} onValueChange={(val) => setWellnessFilter(val as WellnessCategory)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by wellness focus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Wellness Areas</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                    <SelectItem value="sleep">Sleep & Rest</SelectItem>
                    <SelectItem value="stress">Stress Management</SelectItem>
                    <SelectItem value="fitness">Fitness & Energy</SelectItem>
                    <SelectItem value="mindfulness">Mindfulness & Focus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Special Filters */}
              <div className="space-y-3">
                <label className="text-sm font-medium mb-2 block">Special Filters</label>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="featured-only" 
                    checked={showFeaturedOnly} 
                    onCheckedChange={(checked) => 
                      setShowFeaturedOnly(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="featured-only"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Featured products only
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="discounted" 
                    checked={showDiscounted} 
                    onCheckedChange={(checked) => 
                      setShowDiscounted(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="discounted"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    On sale items
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recommended For You */}
          {user && (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-3">Recommended For You</h3>
              <p className="text-sm text-muted-foreground mb-4">
                As a{' '}
                <span className="font-medium text-foreground">
                  {user.zodiacSign.charAt(0).toUpperCase() + user.zodiacSign.slice(1)}
                </span>
                , these product categories align with your astrological profile:
              </p>
              <div className="space-y-2">
                {['Supplements', 'Herbal Teas', 'Meditation Tools'].map((cat) => (
                  <div key={cat} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{cat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Sort Bar */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} products
            </p>
            <div className="flex items-center gap-2">
              <label className="text-sm">Sort by:</label>
              <Select defaultValue="recommended">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Products */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="flex flex-col h-full">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      {getCategoryIcon(product.category)}
                      <div className="flex gap-1">
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
                    </div>
                    <div className="relative">
                      {product.featured && (
                        <div className="absolute -top-1 -right-1">
                          <Badge variant="destructive" className="px-2 py-1">Featured</Badge>
                        </div>
                      )}
                      <CardTitle className="text-xl truncate">{product.name}</CardTitle>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={product.element === 'All' 
                          ? 'outline' 
                          : 'secondary'}
                        className={
                          product.element !== 'All'
                            ? `bg-opacity-10 ${zodiacElementColors[product.element as keyof typeof zodiacElementColors]}`
                            : ''
                        }
                      >
                        {product.element} Element
                      </Badge>
                      {product.bestSeller && (
                        <Badge variant="default">Best Seller</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.wellnessCategories.map(category => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow pb-2">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {product.description}
                    </p>
                    
                    <div className="mt-4">
                      <div className="text-sm text-muted-foreground mb-1">Recommended for:</div>
                      <div className="flex flex-wrap gap-1">
                        {product.recommendedSigns.length === 12 ? (
                          <Badge variant="outline">All Signs</Badge>
                        ) : (
                          product.recommendedSigns.map((sign) => {
                            const signData = zodiacSignNames.find(s => s.value === sign);
                            return (
                              <Badge key={sign} variant="outline">
                                {signData?.symbol} {sign.charAt(0).toUpperCase() + sign.slice(1)}
                              </Badge>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between items-center">
                    <div>
                      {product.discountPercentage ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-green-600">
                            ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.price.toFixed(2)}
                          </span>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            {product.discountPercentage}% off
                          </Badge>
                        </div>
                      ) : (
                        <div className="text-lg font-bold">${product.price.toFixed(2)}</div>
                      )}
                    </div>
                    <Button
                      onClick={() => addToCart(product.id)}
                      disabled={product.stockLevel === 'out_of_stock'}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search query
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                  setPriceRange([0, 100]);
                  setElementFilter('All');
                  setWellnessFilter('all');
                  setShowFeaturedOnly(false);
                  setShowDiscounted(false);
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Product Categories */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Shop by Category</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of astrologically-aligned wellness products
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { name: 'Supplements', icon: <CheckCircle2 className="h-8 w-8" />, color: 'bg-blue-100 text-blue-600' },
            { name: 'Herbal Teas', icon: <Heart className="h-8 w-8" />, color: 'bg-green-100 text-green-600' },
            { name: 'Books & Guides', icon: <Info className="h-8 w-8" />, color: 'bg-amber-100 text-amber-600' },
            { name: 'Wellness Tools', icon: <Star className="h-8 w-8" />, color: 'bg-purple-100 text-purple-600' },
            { name: 'Crystals & Stones', icon: <Star className="h-8 w-8" />, color: 'bg-pink-100 text-pink-600' }
          ].map((category) => (
            <Button
              key={category.name}
              variant="outline"
              className="h-auto py-8 flex flex-col gap-4 hover:bg-transparent hover:border-primary"
              onClick={() => setActiveCategory(category.name.toLowerCase().split(' ')[0] as ProductCategory)}
            >
              <div className={`${category.color} p-4 rounded-full`}>
                {category.icon}
              </div>
              <span>{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Customer Testimonials */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">What Our Customers Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real results from astrologically-aligned wellness products
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: 'Emily T.',
              sign: 'Cancer',
              text: 'The water element tea blend has been amazing for my emotional balance. As a Cancer, I\'ve always struggled with mood fluctuations, and this has become my daily ritual for centering.'
            },
            {
              name: 'Michael R.',
              sign: 'Leo',
              text: 'I was skeptical about astrologically-aligned supplements, but the Fire Sign Energy formula has noticeably improved my workouts and overall vitality. It\'s like it was formulated specifically for my Leo constitution!'
            },
            {
              name: 'Sarah K.',
              sign: 'Virgo',
              text: 'The Zodiac Wellness Journal has transformed my health tracking. The earth sign recommendations are perfectly aligned with my Virgo need for organization and analytical insights into my wellbeing.'
            }
          ].map((testimonial, i) => (
            <Card key={i} className="text-center">
              <CardContent className="pt-6">
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 inline-block text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">"{testimonial.text}"</p>
                <div className="font-medium">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.sign}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-primary/5 rounded-xl p-8 md:p-12 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Get Personalized Product Recommendations
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Join our newsletter to receive personalized wellness product recommendations based on your zodiac sign and current cosmic cycles.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
          <Input placeholder="Your email address" type="email" />
          <Button>Subscribe</Button>
        </div>
      </div>

      {/* Cart Notification */}
      {showCartNotification && (
        <div className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <ShoppingCart className="h-5 w-5" />
          <div>
            <p className="font-medium">Item added to cart</p>
            <p className="text-sm text-gray-300">You have {cartItems.length} items in your cart</p>
          </div>
          <Button variant="outline" size="sm" className="text-white border-white">
            View Cart
          </Button>
        </div>
      )}
    </div>
  );
}