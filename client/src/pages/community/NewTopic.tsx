import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/context/LanguageContext";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title cannot exceed 100 characters"),
  content: z.string().min(20, "Content must be at least 20 characters").max(5000, "Content cannot exceed 5000 characters"),
  category: z.string().min(1, "Please select a category"),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewTopic() {
  const { user } = useAuth();
  const { sign } = useParams<{ sign: string }>();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: t('auth.required') || "Authentication Required",
        description: t('auth.loginToCreateTopic') || "Please log in to create a topic",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [user, navigate, toast, t]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "general",
    },
  });
  
  const createTopicMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("POST", "/api/community/topics", {
        ...data,
        zodiacSign: sign,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create topic");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: t('common.success') || "Success",
        description: t('community.topicCreated') || "Topic created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/community/topics', sign] });
      navigate(`/community/${sign}`);
    },
    onError: (error: Error) => {
      toast({
        title: t('common.error') || "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: FormValues) => {
    createTopicMutation.mutate(data);
  };
  
  if (!user) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(`/community/${sign}`)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('navigation.backToForum') || 'Back to Forum'}
      </Button>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t('community.createNewTopic') || 'Create New Topic'}</CardTitle>
          <CardDescription>
            {t('community.shareThoughts') || 
             `Share your thoughts with the ${sign?.charAt(0).toUpperCase() + sign?.slice(1)} community`}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.title') || 'Title'}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.topicTitlePlaceholder') || "Topic title"} {...field} />
                    </FormControl>
                    <FormDescription>
                      {t('form.titleDescription') || 'A clear, concise title that describes your topic'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.category') || 'Category'}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('form.selectCategoryPlaceholder') || "Select a category"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">{t('categories.general') || 'General'}</SelectItem>
                        <SelectItem value="wellness">{t('categories.wellness') || 'Wellness'}</SelectItem>
                        <SelectItem value="nutrition">{t('categories.nutrition') || 'Nutrition'}</SelectItem>
                        <SelectItem value="fitness">{t('categories.fitness') || 'Fitness'}</SelectItem>
                        <SelectItem value="relationships">{t('categories.relationships') || 'Relationships'}</SelectItem>
                        <SelectItem value="career">{t('categories.career') || 'Career'}</SelectItem>
                        <SelectItem value="spirituality">{t('categories.spirituality') || 'Spirituality'}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t('form.categoryDescription') || 'Select the most appropriate category for your topic'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.content') || 'Content'}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t('form.contentPlaceholder') || "Share your thoughts or questions..."} 
                        className="min-h-[200px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {t('form.contentDescription') || 'Provide detailed information to encourage meaningful responses'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={createTopicMutation.isPending}
              >
                {createTopicMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Post Topic
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}