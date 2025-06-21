import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Mail, Chrome, Zap, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const magicLinkSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type MagicLinkFormValues = z.infer<typeof magicLinkSchema>;

interface FastLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FastLoginModal({ isOpen, onClose }: FastLoginModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const { toast } = useToast();

  const form = useForm<MagicLinkFormValues>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const handleMagicLink = async (data: MagicLinkFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setLinkSent(true);
        toast({
          title: 'Magic link sent!',
          description: 'Check your email for a secure login link.',
        });
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to send magic link',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900 border border-purple-400/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center mb-2">
            Quick Sign In
          </DialogTitle>
          <p className="text-slate-300 text-center text-sm">
            Choose your preferred way to access your cosmic wellness journey
          </p>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Google OAuth Button */}
          <Button
            onClick={handleGoogleLogin}
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
            disabled={isSubmitting}
          >
            <Chrome className="w-5 h-5 mr-3" />
            Continue with Google
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-400">Or use magic link</span>
            </div>
          </div>

          {/* Magic Link Form */}
          {!linkSent ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleMagicLink)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          className="h-12 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/30"
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
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-3" />
                      Send Magic Link
                    </>
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-400/30">
                <Mail className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Check your email</h3>
                <p className="text-slate-300 text-sm mt-2">
                  We've sent a secure login link to {form.getValues('email')}
                </p>
              </div>
              <Button
                onClick={() => setLinkSent(false)}
                variant="ghost"
                className="text-purple-400 hover:text-purple-300"
              >
                Send another link
              </Button>
            </div>
          )}

          {/* Info Section */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Lightning-fast access</p>
                <p className="text-slate-300 text-xs mt-1">
                  No passwords to remember. Just one click to access your personalized wellness insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}