import { useState } from 'react';
import { Mail, MessageSquare, User, MapPin, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { zodiacSignNames } from '@/data/zodiacData';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [zodiacSign, setZodiacSign] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name || !email || !message) {
      toast({
        title: 'Missing information',
        description: 'Please fill out all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: 'Message sent!',
        description: 'We\'ll get back to you as soon as possible.',
      });
      
      // Reset form
      setName('');
      setEmail('');
      setZodiacSign('');
      setSubject('');
      setMessage('');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-4">
          <MessageSquare className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Contact Us
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have questions about your horoscope wellness journey? We're here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-6">Get in Touch</h2>
          <p className="text-muted-foreground mb-8">
            Our team of astrologers and wellness experts are ready to assist you with any questions about your horoscope, subscription, or personalized health insights.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Email Us</h3>
                <p className="text-muted-foreground">support@horoscopehealth.com</p>
                <p className="text-sm text-muted-foreground mt-1">We respond within 24 hours</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Call Us</h3>
                <p className="text-muted-foreground">(123) 456-7890</p>
                <p className="text-sm text-muted-foreground mt-1">Mon-Fri, 9am-5pm EST</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Our Office</h3>
                <p className="text-muted-foreground">123 Celestial Way</p>
                <p className="text-muted-foreground">Astral City, AC 12345</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h3 className="text-lg font-medium mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">When do I receive my daily horoscope?</h4>
                <p className="text-sm text-muted-foreground">Daily horoscopes are delivered at midnight in your local time zone.</p>
              </div>
              <div>
                <h4 className="font-medium">How can I upgrade to premium?</h4>
                <p className="text-sm text-muted-foreground">Visit your dashboard and click on the Premium tab to view subscription options.</p>
              </div>
              <div>
                <h4 className="font-medium">Are consultations available?</h4>
                <p className="text-sm text-muted-foreground">Yes, premium members can book one-on-one consultations with our astrologers.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="bg-card border rounded-lg p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <User className="h-4 w-4" />
                  </span>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </span>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="zodiac">
                  Your Zodiac Sign
                </label>
                <Select value={zodiacSign} onValueChange={setZodiacSign}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your sign (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {zodiacSignNames.map((sign) => (
                      <SelectItem key={sign.value} value={sign.value}>
                        {sign.symbol} {sign.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="subject">
                  Subject
                </label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="What is this regarding?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="message">
                  Message <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="message"
                  placeholder="How can we help you?"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Sending</span>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
      
      {/* Map Placeholder */}
      <div className="bg-muted rounded-lg h-[400px] flex items-center justify-center mb-16">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">Interactive map would be displayed here</p>
        </div>
      </div>
      
      {/* Newsletter Signup */}
      <div className="bg-primary/5 rounded-xl p-8 md:p-12 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Stay Connected with Horoscope Health Updates
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Join our newsletter to receive the latest astrological insights and wellness tips tailored to your zodiac sign.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input placeholder="Your email address" type="email" />
          <Button>Subscribe</Button>
        </div>
      </div>
    </div>
  );
}