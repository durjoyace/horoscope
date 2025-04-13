import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { zodiacSignNames } from "@/data/zodiacData";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiRequest } from "@/lib/queryClient";

// Schema for creating/editing horoscopes
const horoscopeSchema = z.object({
  zodiacSign: z.string().min(1, "Zodiac sign is required"),
  date: z.string().min(1, "Date is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  wellness: z.string().min(1, "Wellness tip is required"),
  nutrition: z.string().optional(),
  fitness: z.string().optional(),
  mindfulness: z.string().optional(),
  isPremium: z.boolean().default(false),
  isAiGenerated: z.boolean().default(true),
});

type HoroscopeFormValues = z.infer<typeof horoscopeSchema>;

// Schema for ad configurations
const adSchema = z.object({
  name: z.string().min(1, "Ad name is required"),
  content: z.string().min(10, "Ad content is required"),
  linkUrl: z.string().url("Must be a valid URL"),
  position: z.enum(["top", "middle", "bottom"]),
  isActive: z.boolean().default(true),
});

type AdFormValues = z.infer<typeof adSchema>;

export default function ContentManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("horoscopes");
  const [editingHoroscopeId, setEditingHoroscopeId] = useState<number | null>(null);
  const [editingAdId, setEditingAdId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Horoscope form
  const horoscopeForm = useForm<HoroscopeFormValues>({
    resolver: zodResolver(horoscopeSchema),
    defaultValues: {
      zodiacSign: "",
      date: new Date().toISOString().split("T")[0],
      title: "",
      content: "",
      wellness: "",
      nutrition: "",
      fitness: "",
      mindfulness: "",
      isPremium: false,
      isAiGenerated: true,
    },
  });

  // Ad form
  const adForm = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      name: "",
      content: "",
      linkUrl: "https://",
      position: "bottom",
      isActive: true,
    },
  });

  // Fetch horoscopes
  const {
    data: horoscopes = { data: [] },
    isLoading: horoscopesLoading,
    error: horoscopesError,
  } = useQuery<{ data: any[] }>({
    queryKey: ["/api/admin/horoscopes"],
    retry: 1,
  });

  // Fetch ads
  const {
    data: ads = { data: [] },
    isLoading: adsLoading,
    error: adsError,
  } = useQuery<{ data: any[] }>({
    queryKey: ["/api/admin/ads"],
    retry: 1,
  });

  // Create/Update horoscope mutation
  const horoscopeMutation = useMutation({
    mutationFn: async (data: HoroscopeFormValues) => {
      const url = editingHoroscopeId
        ? `/api/admin/horoscopes/${editingHoroscopeId}`
        : "/api/admin/horoscopes";
      const method = editingHoroscopeId ? "PUT" : "POST";
      const res = await apiRequest(method, url, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/horoscopes"] });
      toast({
        title: `Horoscope ${editingHoroscopeId ? "updated" : "created"} successfully`,
        variant: "default",
      });
      resetHoroscopeForm();
    },
    onError: (error: any) => {
      toast({
        title: `Failed to ${editingHoroscopeId ? "update" : "create"} horoscope`,
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Create/Update ad mutation
  const adMutation = useMutation({
    mutationFn: async (data: AdFormValues) => {
      const url = editingAdId
        ? `/api/admin/ads/${editingAdId}`
        : "/api/admin/ads";
      const method = editingAdId ? "PUT" : "POST";
      const res = await apiRequest(method, url, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ads"] });
      toast({
        title: `Ad ${editingAdId ? "updated" : "created"} successfully`,
        variant: "default",
      });
      resetAdForm();
    },
    onError: (error: any) => {
      toast({
        title: `Failed to ${editingAdId ? "update" : "create"} ad`,
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Delete horoscope mutation
  const deleteHoroscopeMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/horoscopes/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/horoscopes"] });
      toast({
        title: "Horoscope deleted successfully",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete horoscope",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Delete ad mutation
  const deleteAdMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/ads/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ads"] });
      toast({
        title: "Ad deleted successfully",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete ad",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Generate AI horoscope mutation
  const generateAiHoroscopeMutation = useMutation({
    mutationFn: async (data: { zodiacSign: string, date: string }) => {
      const res = await apiRequest("POST", "/api/admin/generate-horoscope", data);
      return await res.json();
    },
    onSuccess: (data) => {
      horoscopeForm.setValue("title", data.title);
      horoscopeForm.setValue("content", data.content);
      horoscopeForm.setValue("wellness", data.wellness);
      horoscopeForm.setValue("nutrition", data.nutrition || "");
      horoscopeForm.setValue("fitness", data.fitness || "");
      horoscopeForm.setValue("mindfulness", data.mindfulness || "");
      toast({
        title: "Horoscope generated successfully",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to generate horoscope",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Handle horoscope submission
  const onHoroscopeSubmit = (values: HoroscopeFormValues) => {
    horoscopeMutation.mutate(values);
  };

  // Handle ad submission
  const onAdSubmit = (values: AdFormValues) => {
    adMutation.mutate(values);
  };

  // Reset forms
  const resetHoroscopeForm = () => {
    horoscopeForm.reset({
      zodiacSign: "",
      date: new Date().toISOString().split("T")[0],
      title: "",
      content: "",
      wellness: "",
      nutrition: "",
      fitness: "",
      mindfulness: "",
      isPremium: false,
      isAiGenerated: true,
    });
    setEditingHoroscopeId(null);
  };

  const resetAdForm = () => {
    adForm.reset({
      name: "",
      content: "",
      linkUrl: "https://",
      position: "bottom",
      isActive: true,
    });
    setEditingAdId(null);
  };

  // Edit a horoscope
  const editHoroscope = (horoscope: any) => {
    setEditingHoroscopeId(horoscope.id);
    horoscopeForm.reset({
      zodiacSign: horoscope.zodiacSign,
      date: horoscope.date,
      title: horoscope.title,
      content: horoscope.content,
      wellness: horoscope.wellness || "",
      nutrition: horoscope.nutrition || "",
      fitness: horoscope.fitness || "",
      mindfulness: horoscope.mindfulness || "",
      isPremium: horoscope.isPremium,
      isAiGenerated: horoscope.isAiGenerated,
    });
  };

  // Edit an ad
  const editAd = (ad: any) => {
    setEditingAdId(ad.id);
    adForm.reset({
      name: ad.name,
      content: ad.content,
      linkUrl: ad.linkUrl,
      position: ad.position,
      isActive: ad.isActive,
    });
  };

  // Generate horoscope with AI
  const generateHoroscope = () => {
    const zodiacSign = horoscopeForm.getValues("zodiacSign");
    const date = horoscopeForm.getValues("date");
    
    if (!zodiacSign || !date) {
      toast({
        title: "Missing information",
        description: "Please select a zodiac sign and date first",
        variant: "destructive",
      });
      return;
    }
    
    generateAiHoroscopeMutation.mutate({ zodiacSign, date });
  };

  return (
    <AdminLayout title="Content Management">
      <div className="space-y-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage horoscopes and advertisements
          </p>
        </div>

        <Tabs defaultValue="horoscopes" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 max-w-md">
            <TabsTrigger value="horoscopes">Horoscopes</TabsTrigger>
            <TabsTrigger value="ads">Advertisements</TabsTrigger>
          </TabsList>

          {/* Horoscopes Tab */}
          <TabsContent value="horoscopes" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Horoscope Form */}
              <Card className="lg:col-span-1 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle>{editingHoroscopeId ? "Edit Horoscope" : "Create Horoscope"}</CardTitle>
                  <CardDescription>
                    {editingHoroscopeId
                      ? "Update the details of an existing horoscope"
                      : "Create a new horoscope for a specific zodiac sign"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...horoscopeForm}>
                    <form onSubmit={horoscopeForm.handleSubmit(onHoroscopeSubmit)} className="space-y-4">
                      <div className="flex gap-4">
                        <FormField
                          control={horoscopeForm.control}
                          name="zodiacSign"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Zodiac Sign</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a zodiac sign" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {zodiacSignNames.map((sign) => (
                                    <SelectItem key={sign.value} value={sign.value}>
                                      {sign.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={horoscopeForm.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={horoscopeForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter horoscope title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={horoscopeForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter horoscope content"
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={horoscopeForm.control}
                        name="wellness"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Wellness Tip</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter wellness tip"
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={horoscopeForm.control}
                          name="nutrition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nutrition</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Nutrition advice"
                                  className="min-h-[60px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={horoscopeForm.control}
                          name="fitness"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fitness</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Fitness advice"
                                  className="min-h-[60px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={horoscopeForm.control}
                          name="mindfulness"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mindfulness</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Mindfulness advice"
                                  className="min-h-[60px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex gap-4">
                        <FormField
                          control={horoscopeForm.control}
                          name="isPremium"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Premium Content</FormLabel>
                                <FormDescription>
                                  This content is only available to premium subscribers.
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={horoscopeForm.control}
                          name="isAiGenerated"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>AI Generated</FormLabel>
                                <FormDescription>
                                  This content was generated with AI assistance.
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex flex-col gap-2 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="gap-1"
                          onClick={generateHoroscope}
                          disabled={generateAiHoroscopeMutation.isPending}
                        >
                          {generateAiHoroscopeMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <PlusCircle className="h-4 w-4" />
                          )}
                          Generate with AI
                        </Button>

                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            className="flex-1"
                            disabled={horoscopeMutation.isPending}
                          >
                            {horoscopeMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            {editingHoroscopeId ? "Update" : "Create"} Horoscope
                          </Button>
                          
                          {editingHoroscopeId && (
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={resetHoroscopeForm}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Horoscopes List */}
              <Card className="lg:col-span-2 overflow-hidden">
                <CardHeader>
                  <CardTitle>Horoscopes</CardTitle>
                  <CardDescription>
                    Manage all horoscopes in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {horoscopesLoading ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                  ) : horoscopesError ? (
                    <div className="text-center py-10 text-red-500">
                      Failed to load horoscopes
                    </div>
                  ) : (
                    <div className="rounded-md border max-h-[600px] overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Sign</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Premium</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {horoscopes?.data?.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center">
                                No horoscopes found
                              </TableCell>
                            </TableRow>
                          ) : (
                            horoscopes?.data?.map((horoscope: any) => (
                              <TableRow key={horoscope.id}>
                                <TableCell className="font-medium">
                                  {horoscope.zodiacSign.charAt(0).toUpperCase() + 
                                    horoscope.zodiacSign.slice(1)}
                                </TableCell>
                                <TableCell>{horoscope.date}</TableCell>
                                <TableCell>{horoscope.title}</TableCell>
                                <TableCell>
                                  {horoscope.isPremium ? "Yes" : "No"}
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => editHoroscope(horoscope)}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => 
                                        deleteHoroscopeMutation.mutate(horoscope.id)
                                      }
                                      disabled={deleteHoroscopeMutation.isPending}
                                    >
                                      {deleteHoroscopeMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Advertisements Tab */}
          <TabsContent value="ads" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Ad Form */}
              <Card className="lg:col-span-1 bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-amber-500/20">
                <CardHeader>
                  <CardTitle>{editingAdId ? "Edit Advertisement" : "Create Advertisement"}</CardTitle>
                  <CardDescription>
                    {editingAdId
                      ? "Update the details of an existing advertisement"
                      : "Create a new advertisement for email campaigns"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...adForm}>
                    <form onSubmit={adForm.handleSubmit(onAdSubmit)} className="space-y-4">
                      <FormField
                        control={adForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ad Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter ad name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={adForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ad Content</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter ad content (HTML supported)"
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={adForm.control}
                        name="linkUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Link URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={adForm.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="top">Top</SelectItem>
                                <SelectItem value="middle">Middle</SelectItem>
                                <SelectItem value="bottom">Bottom</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={adForm.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Active</FormLabel>
                              <FormDescription>
                                This ad will be included in email campaigns.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-2 pt-2">
                        <Button
                          type="submit"
                          className="flex-1"
                          disabled={adMutation.isPending}
                        >
                          {adMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : null}
                          {editingAdId ? "Update" : "Create"} Advertisement
                        </Button>
                        
                        {editingAdId && (
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={resetAdForm}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Ads List */}
              <Card className="lg:col-span-2 overflow-hidden">
                <CardHeader>
                  <CardTitle>Advertisements</CardTitle>
                  <CardDescription>
                    Manage all advertisements for email campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {adsLoading ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                  ) : adsError ? (
                    <div className="text-center py-10 text-red-500">
                      Failed to load advertisements
                    </div>
                  ) : (
                    <div className="rounded-md border max-h-[600px] overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Active</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ads?.data?.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center">
                                No advertisements found
                              </TableCell>
                            </TableRow>
                          ) : (
                            ads?.data?.map((ad: any) => (
                              <TableRow key={ad.id}>
                                <TableCell className="font-medium">
                                  {ad.name}
                                </TableCell>
                                <TableCell>
                                  {ad.position.charAt(0).toUpperCase() + ad.position.slice(1)}
                                </TableCell>
                                <TableCell>
                                  {ad.isActive ? "Yes" : "No"}
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => editAd(ad)}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => 
                                        deleteAdMutation.mutate(ad.id)
                                      }
                                      disabled={deleteAdMutation.isPending}
                                    >
                                      {deleteAdMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}