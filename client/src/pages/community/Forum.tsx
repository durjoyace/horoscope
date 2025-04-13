import { useEffect, useState } from "react";
import { useLocation, Link, useParams, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2, MessageSquare, Heart, Eye, Edit, Trash2, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/context/LanguageContext";

interface ForumTopic {
  id: number;
  title: string;
  content: string;
  userId: number;
  zodiacSign: string;
  category: string;
  viewCount: number;
  likeCount: number;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ForumReply {
  id: number;
  topicId: number;
  userId: number;
  content: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Helper function to get zodiac sign emoji
const getZodiacEmoji = (sign: string): string => {
  const emojis: Record<string, string> = {
    aries: "♈️",
    taurus: "♉️",
    gemini: "♊️",
    cancer: "♋️",
    leo: "♌️",
    virgo: "♍️",
    libra: "♎️",
    scorpio: "♏️",
    sagittarius: "♐️",
    capricorn: "♑️",
    aquarius: "♒️",
    pisces: "♓️",
  };
  return emojis[sign.toLowerCase()] || "✨";
};

// Helper function to capitalize first letter
const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function Forum() {
  const { user } = useAuth();
  const { sign } = useParams<{ sign: string }>();
  const [_, navigate] = useLocation();
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Convert URL parameter to proper zodiac sign format
  const zodiacSign = sign?.toLowerCase();
  
  // Redirect if no zodiac sign is provided
  useEffect(() => {
    if (!zodiacSign) {
      const userZodiacSign = user?.zodiacSign || "aries";
      navigate(`/community/${userZodiacSign}`);
    }
  }, [zodiacSign, user, navigate]);
  
  // Fetch forum topics for the current zodiac sign
  const { 
    data: topicsData, 
    isLoading: isLoadingTopics,
    error: topicsError,
    refetch: refetchTopics
  } = useQuery({
    queryKey: ['/api/community/topics', zodiacSign, page],
    queryFn: () => fetch(`/api/community/topics/${zodiacSign}?page=${page}&pageSize=10`).then(res => res.json()),
    enabled: !!zodiacSign
  });
  
  // Like topic mutation
  const likeMutation = useMutation({
    mutationFn: async (topicId: number) => {
      const res = await fetch(`/api/community/topics/${topicId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to like topic");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate topics query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/community/topics', zodiacSign] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Filter topics by category if a category is selected
  const filteredTopics = topicsData?.data ? 
    (selectedCategory === "all" ? 
      topicsData.data : 
      topicsData.data.filter((topic: ForumTopic) => topic.category === selectedCategory)
    ) : [];
  
  // Categories from topics
  const categories = topicsData?.data ? 
    Array.from(new Set(topicsData.data.map((topic: ForumTopic) => topic.category)))
      .filter((category): category is string => typeof category === 'string') : 
    [];
  
  const handleLikeTopic = async (topicId: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like topics",
        variant: "destructive"
      });
      return;
    }
    
    likeMutation.mutate(topicId);
  };
  
  if (isLoadingTopics) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (topicsError) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error loading forum topics</p>
        <Button variant="outline" onClick={() => refetchTopics()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            {getZodiacEmoji(zodiacSign)} {capitalizeFirstLetter(zodiacSign)} {t('community.community') || 'Community'}
          </h1>
          <p className="text-muted-foreground">
            {t('community.connect') || `Connect with fellow ${capitalizeFirstLetter(zodiacSign)} members to share insights and experiences`}
          </p>
        </div>
        
        <Button 
          variant="default" 
          className="mt-4 md:mt-0"
          onClick={() => navigate(`/community/${zodiacSign}/new-topic`)}
        >
          <Plus className="mr-2 h-4 w-4" /> {t('community.newTopic') || 'New Topic'}
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger 
            value="all" 
            onClick={() => setSelectedCategory("all")}
          >
            {t('community.all') || 'All'}
          </TabsTrigger>
          
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              onClick={() => setSelectedCategory(category)}
            >
              {capitalizeFirstLetter(category)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      {filteredTopics.length === 0 ? (
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              {t('community.noTopics') || 'No topics found for this category'}
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate(`/community/${zodiacSign}/new-topic`)}
            >
              <Plus className="mr-2 h-4 w-4" /> {t('community.startDiscussion') || 'Start the First Discussion'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {filteredTopics.map((topic: ForumTopic) => (
            <Card key={topic.id} className="mb-4 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  <Link 
                    href={`/community/${zodiacSign}/topics/${topic.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {topic.title}
                  </Link>
                </CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="mr-4">
                    {formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}
                  </span>
                  <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs">
                    {capitalizeFirstLetter(topic.category)}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="pb-2">
                <p className="line-clamp-2 text-muted-foreground">
                  {topic.content}
                </p>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-muted-foreground">
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="text-sm">{topic.viewCount}</span>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span className="text-sm">0</span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center text-muted-foreground hover:text-red-500 p-0"
                    onClick={() => handleLikeTopic(topic.id)}
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    <span className="text-sm">{topic.likeCount}</span>
                  </Button>
                </div>
                
                {user && user.id === topic.userId && (
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/community/${zodiacSign}/edit-topic/${topic.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
          
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              disabled={page === 1} 
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            
            <Button 
              variant="outline" 
              disabled={!topicsData?.pagination?.hasMore} 
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}