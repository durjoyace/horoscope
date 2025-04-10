import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useUser } from '@/context/UserContext';
import { SuccessModal } from './SuccessModal';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  smsOptIn: z.boolean().default(false),
  phone: z.string().optional().refine(
    (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val),
    { message: 'Please enter a valid phone number.' }
  ),
});

type FormValues = z.infer<typeof formSchema>;

export const CallToAction: React.FC = () => {
  const { signUp } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPhoneField, setShowPhoneField] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      smsOptIn: false,
      phone: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const result = await signUp({
        email: data.email,
        // Default zodiac sign until they select one
        zodiacSign: 'aries',
        smsOptIn: data.smsOptIn,
        phone: data.phone,
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
    <section className="py-16 bg-gradient-to-r from-indigo-900 to-indigo-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
            Wellness isn't a trend. It's your future.
          </h2>
          <p className="text-xl max-w-2xl mx-auto">Get your free daily health horoscope.</p>
        </div>
        
        <div className="max-w-md mx-auto">
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
                        className="bg-white/10 border-white/20 text-white placeholder-white/70"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center space-x-2 text-white/90">
                <FormField
                  control={form.control}
                  name="smsOptIn"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            setShowPhoneField(!!checked);
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormItem>Add My Phone Number for SMS Alerts (Optional)</FormItem>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              {showPhoneField && (
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Your phone number"
                          className="bg-white/10 border-white/20 text-white placeholder-white/70"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-400 text-white font-semibold shadow hover:shadow-lg"
              >
                {isSubmitting ? 'Submitting...' : 'Start My Cosmic Health Journey'}
              </Button>
            </form>
          </Form>
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
