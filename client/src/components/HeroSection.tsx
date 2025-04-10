import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Star } from 'lucide-react';
import { SuccessModal } from './SuccessModal';
import { ZodiacSign } from '@shared/types';

// Form validation schema
const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof formSchema>;

export const HeroSection: React.FC = () => {
  const { signUp } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const result = await signUp({
        email: data.email,
        // Default zodiac sign until they select one
        zodiacSign: 'aries' as ZodiacSign, 
        smsOptIn: false,
        newsletterOptIn: true
      });
      
      if (result.success) {
        form.reset();
        setSuccessMessage(result.message);
        setIsSuccessModalOpen(true);
      } else {
        // Handle error
        form.setError('email', { 
          type: 'manual', 
          message: result.message 
        });
      }
    } catch (error) {
      console.error('Error during signup:', error);
      form.setError('email', { 
        type: 'manual', 
        message: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className="w-full pt-8 pb-12 bg-gradient-to-r from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-4">
              Your Daily Health Horoscope
            </h1>
            <p className="text-xl text-gray-700 mb-6 max-w-lg">
              Personalized wellness guidance aligned with your zodiac sign, delivered daily to your inbox.
            </p>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Sign up for your free daily health horoscope
              </h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing up...' : 'Get My Horoscope'}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md animate-[float_6s_ease-in-out_infinite]">
              <img
                src="https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg"
                alt="Cosmic wellness illustration"
                className="rounded-lg shadow-lg w-full h-auto"
                width="600"
                height="400"
              />
              <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-500/10 text-amber-500 mr-3">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Personalized Insights</p>
                    <p className="text-xs text-gray-600">Updated daily for your sign</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <SuccessModal
        isOpen={isSuccessModalOpen}
        message={successMessage}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </section>
  );
};