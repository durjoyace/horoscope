import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/UserContext';
import { SuccessModal } from './SuccessModal';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type FormValues = z.infer<typeof formSchema>;

export const HeroSection: React.FC = () => {
  const { signUp } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

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
        zodiacSign: 'aries', 
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
      console.error('Error submitting form:', error);
      form.setError('root', { 
        type: 'manual', 
        message: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold leading-tight mb-6">
              Your Future Self <span className="text-indigo-900">Will Thank You.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Get your daily health horoscope — free. Small actions. Big energy.
            </p>
            <div className="max-w-md">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            className="bg-white/10 border border-teal-600/30 shadow-sm p-3 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-400 text-white font-semibold shadow hover:shadow-lg transition-all py-6"
                  >
                    {isSubmitting ? 'Submitting...' : 'Get My Daily Health Horoscope'}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md animate-[float_6s_ease-in-out_infinite]">
              <img
                src="https://images.unsplash.com/photo-1611001440648-0719d362e69c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Cosmic wellness illustration"
                className="rounded-lg shadow-lg"
                width="600"
                height="400"
              />
              <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-500/10 text-amber-500 mr-3">
                    <i className="fas fa-sun"></i>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-800 font-medium">Today's Insight for Leo</p>
                    <p className="text-sm">Focus on hydration and stretching today</p>
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
