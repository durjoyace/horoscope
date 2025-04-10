import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useUser } from '@/context/UserContext';
import { zodiacSigns, getZodiacFromDate } from '@/utils/zodiac';
import { ZodiacSign } from '@shared/types';
import { SuccessModal } from './SuccessModal';

interface AuthModalsProps {
  isLoginOpen: boolean;
  isSignupOpen: boolean;
  onLoginClose: () => void;
  onSignupClose: () => void;
  onSwitchToSignup: () => void;
  onSwitchToLogin: () => void;
}

// Login form schema
const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  rememberMe: z.boolean().default(false),
});

// Signup form schema
const signupFormSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  birthdate: z.string().refine(val => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, { message: 'Please enter a valid date.' }),
  zodiacSign: z.string(),
  smsOptIn: z.boolean().default(false),
  phone: z.string().optional().refine(
    (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val),
    { message: 'Please enter a valid phone number.' }
  ),
  termsAgreed: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions.',
  }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type SignupFormValues = z.infer<typeof signupFormSchema>;

export const AuthModals: React.FC<AuthModalsProps> = ({
  isLoginOpen,
  isSignupOpen,
  onLoginClose,
  onSignupClose,
  onSwitchToSignup,
  onSwitchToLogin,
}) => {
  const { signUp } = useUser();
  const [showPhoneField, setShowPhoneField] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Signup form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      birthdate: '',
      zodiacSign: '',
      smsOptIn: false,
      phone: '',
      termsAgreed: false,
    },
  });

  // Update zodiac sign when birthdate changes
  React.useEffect(() => {
    const subscription = signupForm.watch((value, { name }) => {
      if (name === 'birthdate' && value.birthdate) {
        try {
          const sign = getZodiacFromDate(value.birthdate as string);
          signupForm.setValue('zodiacSign', sign);
        } catch (error) {
          console.error('Error determining zodiac sign:', error);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [signupForm]);

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real application, this would authenticate the user
      // For now, we'll show a success message
      onLoginClose();
      setSuccessMessage('Login successful!');
      setIsSuccessModalOpen(true);
      loginForm.reset();
    } catch (error) {
      console.error('Login error:', error);
      loginForm.setError('root', {
        type: 'manual',
        message: 'Invalid email or password.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignupSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    console.log('Signup form data:', data);
    
    // Check for validation errors
    if (Object.keys(signupForm.formState.errors).length > 0) {
      console.log('Form validation errors:', signupForm.formState.errors);
      setIsSubmitting(false);
      return;
    }
    
    // Make sure the zodiac sign is selected
    if (!data.zodiacSign) {
      console.error('Zodiac sign is required');
      signupForm.setError('zodiacSign', {
        type: 'manual',
        message: 'Please select your zodiac sign'
      });
      setIsSubmitting(false);
      return;
    }
    
    // Make sure terms are agreed
    if (!data.termsAgreed) {
      console.error('Terms must be agreed to');
      signupForm.setError('termsAgreed', {
        type: 'manual',
        message: 'You must agree to the terms and conditions'
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      console.log('Attempting signup with data:', {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        zodiacSign: data.zodiacSign,
        birthdate: data.birthdate,
        smsOptIn: data.smsOptIn,
      });
      
      const result = await signUp({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        zodiacSign: data.zodiacSign as ZodiacSign,
        birthdate: data.birthdate,
        phone: data.phone,
        smsOptIn: data.smsOptIn,
        newsletterOptIn: true,
        password: data.password,
      });
      
      console.log('Signup result:', result);
      
      if (result.success) {
        onSignupClose();
        setSuccessMessage('Account created successfully! Your first horoscope will arrive tomorrow morning.');
        setIsSuccessModalOpen(true);
        signupForm.reset();
      } else {
        console.error('Signup failed:', result.message);
        signupForm.setError('root', {
          type: 'manual',
          message: result.message
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      signupForm.setError('root', {
        type: 'manual',
        message: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Login Modal */}
      <Dialog open={isLoginOpen} onOpenChange={onLoginClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-playfair font-bold">Welcome Back</DialogTitle>
            <DialogDescription>
              Sign in to access your personalized health horoscopes.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        className="bg-white/10 border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        className="bg-white/10 border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between">
                <FormField
                  control={loginForm.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Remember me</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <a href="#" className="text-sm text-teal-600 hover:text-teal-500">
                  Forgot password?
                </a>
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-400 text-white font-semibold"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
              
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Button
                  type="button"
                  variant="link"
                  className="text-teal-600 hover:text-teal-500 p-0"
                  onClick={onSwitchToSignup}
                >
                  Sign up
                </Button>
              </p>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Signup Modal */}
      <Dialog open={isSignupOpen} onOpenChange={onSignupClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-playfair font-bold">Create Your Account</DialogTitle>
            <DialogDescription>
              Sign up to receive personalized daily health horoscopes.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={signupForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First name"
                          className="bg-white/10 border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Last name"
                          className="bg-white/10 border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        className="bg-white/10 border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signupForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Create a password"
                        className="bg-white/10 border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signupForm.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Date (for accurate horoscope)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="bg-white/10 border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signupForm.control}
                name="zodiacSign"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zodiac Sign</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        console.log('Zodiac sign selected:', value);
                        field.onChange(value);
                      }}
                      defaultValue={field.value || undefined}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/10 border-gray-300">
                          <SelectValue placeholder="Select your sign" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {zodiacSigns.map((sign) => (
                          <SelectItem key={sign.sign} value={sign.sign}>
                            {sign.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {field.value ? `Selected: ${field.value}` : 'Required for your daily horoscope'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signupForm.control}
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
                      <FormLabel>Receive SMS alerts (optional)</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              {showPhoneField && (
                <FormField
                  control={signupForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your phone number"
                          className="bg-white/10 border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={signupForm.control}
                name="termsAgreed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the <a href="#" className="text-teal-600 hover:text-teal-500">Terms</a> and <a href="#" className="text-teal-600 hover:text-teal-500">Privacy Policy</a>
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-400 text-white font-semibold"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
              
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Button
                  type="button"
                  variant="link"
                  className="text-teal-600 hover:text-teal-500 p-0"
                  onClick={onSwitchToLogin}
                >
                  Sign in
                </Button>
              </p>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <SuccessModal
        isOpen={isSuccessModalOpen}
        message={successMessage}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </>
  );
};
