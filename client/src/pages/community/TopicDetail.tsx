import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Heart, ArrowLeft, Send, Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { queryClient, apiRequest } from "@/lib/queryClient";
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

// Helper function to capitalize first letter
const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Helper function to get user initials
const getUserInitials = (userId: number): string => {
  return `U${userId}`;
};

// Helper function to get user avatar color
const getUserAvatarColor = (userId: number): string => {
  const colors = [
    "bg-red-500", 
    "bg-blue-500", 
    "bg-green-500", 
    "bg-yellow-500", 
    "bg-purple-500", 
    "bg-pink-500", 
    "bg-indigo-500", 
    "bg-teal-500"
  ];
  return colors[userId % colors.length];
};

export default function TopicDetail() {
  const { user } = useAuth();
  const { sign, topicId } = useParams<{ sign: string; topicId: string }>();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [replyContent, setReplyContent] = useState("");
  
  // Get topic details
  const { 
    data: topicData,
    isLoading: isLoadingTopic,
    error: topicError
  } = useQuery({
    queryKey: ['/api/community/topics/detail', topicId],
    queryFn: async () => {
      const res = await fetch(`/api/community/topics/detail/${topicId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch topic");
      }
      return res.json();
    }
  });
  
  // Get topic replies
  const {
    data: repliesData,
    isLoading: isLoadingReplies,
    error: repliesError
  } = useQuery({
    queryKey: ['/api/community/topics/replies', topicId],
    queryFn: async () => {
      const res = await fetch(`/api/community/topics/${topicId}/replies`);
      if (!res.ok) {
        throw new Error("Failed to fetch replies");
      }
      return res.json();
    }
  });
  
  // Like topic mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/community/topics/${topicId}/like`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to like topic");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community/topics/detail', topicId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Like reply mutation
  const likeReplyMutation = useMutation({
    mutationFn: async (replyId: number) => {
      const res = await apiRequest("POST", `/api/community/replies/${replyId}/like`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to like reply");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community/topics/replies', topicId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Add reply mutation
  const addReplyMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", `/api/community/topics/${topicId}/replies`, { 
        content 
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add reply");
      }
      return await res.json();
    },
    onSuccess: () => {
      setReplyContent("");
      queryClient.invalidateQueries({ queryKey: ['/api/community/topics/replies', topicId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const handleAddReply = () => {
    if (!user) {
      toast({
        title: t('auth.authRequired') || "Authentication Required",
        description: t('auth.loginToReply') || "Please log in to reply to topics",
        variant: "destructive"
      });
      return;
    }
    
    if (!replyContent.trim()) {
      toast({
        title: t('community.emptyReply') || "Empty Reply",
        description: t('community.enterContent') || "Please enter some content for your reply",
        variant: "destructive"
      });
      return;
    }
    
    addReplyMutation.mutate(replyContent);
  };
  
  const handleLikeTopic = () => {
    if (!user) {
      toast({
        title: t('auth.authRequired') || "Authentication Required",
        description: t('auth.loginToLike') || "Please log in to like topics",
        variant: "destructive"
      });
      return;
    }
    
    likeMutation.mutate();
  };
  
  const handleLikeReply = (replyId: number) => {
    if (!user) {
      toast({
        title: t('auth.authRequired') || "Authentication Required",
        description: t('auth.loginToLikeReplies') || "Please log in to like replies",
        variant: "destructive"
      });
      return;
    }
    
    likeReplyMutation.mutate(replyId);
  };
  
  if (isLoadingTopic || isLoadingReplies) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (topicError || repliesError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(`/community/${sign}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forum
        </Button>
        
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <p className="text-lg text-red-500 mb-4">Error loading topic or replies</p>
            <Button 
              variant="outline" 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/community/topics/detail', topicId] })}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const topic: ForumTopic = topicData?.data;
  const replies: ForumReply[] = repliesData?.data || [];
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(`/community/${sign}`)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('community.backToForum') || 'Back to Forum'}
      </Button>
      
      {/* Topic */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">{topic.title}</CardTitle>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Avatar className={`h-6 w-6 ${getUserAvatarColor(topic.userId)}`}>
                    <AvatarFallback>{getUserInitials(topic.userId)}</AvatarFallback>
                  </Avatar>
                  {t('community.user', { id: topic.userId.toString() }) || `User ${topic.userId}`}
                </span>
                <span>
                  {format(new Date(topic.createdAt), "PPp")}
                </span>
                <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs">
                  {capitalizeFirstLetter(topic.category)}
                </span>
              </div>
            </div>
            
            {user && user.id === topic.userId && (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/community/${sign}/edit-topic/${topic.id}`)}
                  aria-label={t('community.editTopic') || 'Edit Topic'}
                  title={t('community.editTopic') || 'Edit Topic'}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  aria-label={t('community.deleteTopic') || 'Delete Topic'}
                  title={t('community.deleteTopic') || 'Delete Topic'}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-line">{topic.content}</p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center pt-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>{topic.viewCount} {t('community.views') || 'views'}</span>
            <span>{replies.length} {t('community.replies') || 'replies'}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center hover:text-red-500 p-0"
              onClick={handleLikeTopic}
            >
              <Heart className={`h-4 w-4 mr-1 ${likeMutation.isPending ? 'animate-pulse' : ''}`} />
              <span>{topic.likeCount} {t('community.likes') || 'likes'}</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Reply Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">{t('community.replyToTopic') || 'Reply to this topic'}</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Textarea
            placeholder={t('community.shareThoughtsPlaceholder') || "Share your thoughts..."}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={4}
            className="mb-4"
          />
          
          <Button 
            onClick={handleAddReply} 
            disabled={addReplyMutation.isPending || !replyContent.trim()}
            className="w-full"
          >
            {addReplyMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {t('community.postReply') || 'Post Reply'}
          </Button>
        </CardContent>
      </Card>
      
      {/* Replies */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold mb-4">
          {replies.length > 0 
            ? `${replies.length} ${t('community.replies') || 'Replies'}` 
            : t('community.noRepliesYet') || "No Replies Yet"}
        </h3>
        
        {replies.map((reply) => (
          <Card key={reply.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Avatar className={`h-8 w-8 ${getUserAvatarColor(reply.userId)}`}>
                    <AvatarFallback>{getUserInitials(reply.userId)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{t('community.user', { id: reply.userId.toString() }) || `User ${reply.userId}`}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                
                {user && user.id === reply.userId && (
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      aria-label={t('community.editReply') || 'Edit Reply'}
                      title={t('community.editReply') || 'Edit Reply'}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      aria-label={t('community.deleteReply') || 'Delete Reply'}
                      title={t('community.deleteReply') || 'Delete Reply'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="py-2">
              <p className="whitespace-pre-line">{reply.content}</p>
            </CardContent>
            
            <CardFooter className="pt-0">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center text-muted-foreground hover:text-red-500 p-0"
                onClick={() => handleLikeReply(reply.id)}
              >
                <Heart className="h-4 w-4 mr-1" />
                <span className="text-sm">{reply.likeCount} {t('community.likes') || 'likes'}</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}