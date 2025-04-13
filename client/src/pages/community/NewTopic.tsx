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
  
  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a topic",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [user, navigate, toast]);
  
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
        title: "Success",
        description: "Topic created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/community/topics', sign] });
      navigate(`/community/${sign}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
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
        Back to Forum
      </Button>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Topic</CardTitle>
          <CardDescription>
            Share your thoughts with the {sign?.charAt(0).toUpperCase() + sign?.slice(1)} community
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
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Topic title" {...field} />
                    </FormControl>
                    <FormDescription>
                      A clear, concise title that describes your topic
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
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="wellness">Wellness</SelectItem>
                        <SelectItem value="nutrition">Nutrition</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="relationships">Relationships</SelectItem>
                        <SelectItem value="career">Career</SelectItem>
                        <SelectItem value="spirituality">Spirituality</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the most appropriate category for your topic
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
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Share your thoughts or questions..." 
                        className="min-h-[200px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide detailed information to encourage meaningful responses
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