import Stripe from 'stripe';
import { SubscriptionStatus, SubscriptionTier, PricingPlan } from '@shared/types';
import { storage } from './storage';
import { User } from '@shared/schema';

// Initialize Stripe with the secret key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Pricing plans configuration
export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    description: 'Daily health horoscope delivered to your inbox',
    price: 0,
    interval: 'month',
    features: [
      'Daily health horoscope by email',
      'Basic wellness recommendations',
      'Access to standard horoscope archive'
    ],
    stripePriceId: '', // No price ID for free plan
    tier: 'free'
  },
  {
    id: 'premium-monthly',
    name: 'Premium Monthly',
    description: 'Enhanced weekly reports with personalized wellness insights',
    price: 9.99,
    interval: 'month',
    features: [
      'All Free Plan features',
      'Weekly in-depth wellness reports',
      'Personalized recommendations',
      'Element compatibility insights',
      'Monthly wellness forecasts'
    ],
    stripePriceId: 'price_1OqWXXXXXXXXXXXXXXXXXXXX', // This would be replaced with a real Stripe price ID
    tier: 'premium'
  },
  {
    id: 'premium-yearly',
    name: 'Premium Yearly',
    description: 'Enhanced weekly reports with personalized wellness insights',
    price: 99.99,
    interval: 'year',
    features: [
      'All Premium Monthly features',
      '2 months free compared to monthly plan',
      'Annual wellness almanac'
    ],
    stripePriceId: 'price_1OqWYYYYYYYYYYYYYYYYYYYY', // This would be replaced with a real Stripe price ID
    tier: 'premium'
  }
];

// Create a Stripe customer for a user
export async function createStripeCustomer(user: User): Promise<string> {
  try {
    // Check if user already has a Stripe customer ID
    if (user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    // Create a new customer in Stripe
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : undefined,
      metadata: {
        userId: user.id.toString(),
        zodiacSign: user.zodiacSign
      }
    });

    // Update user with Stripe customer ID
    await storage.updateUser(user.id, {
      stripeCustomerId: customer.id
    });

    return customer.id;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw new Error('Failed to create customer account');
  }
}

// Create a subscription for a user
export async function createSubscription(
  customerId: string,
  priceId: string,
  paymentMethodId?: string
): Promise<Stripe.Subscription> {
  try {
    // If payment method is provided, attach it to the customer
    if (paymentMethodId) {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
      
      // Set as default payment method
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    }

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw new Error('Failed to create subscription');
  }
}

// Cancel a subscription
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  try {
    return await stripe.subscriptions.cancel(subscriptionId);
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
}

// Update user's subscription status in our database
export async function updateUserSubscriptionStatus(
  userId: number,
  status: SubscriptionStatus,
  tier: SubscriptionTier,
  subscriptionId?: string,
  endDate?: Date
): Promise<User> {
  try {
    const updatedUser = await storage.updateUser(userId, {
      subscriptionStatus: status,
      subscriptionTier: tier,
      stripeSubscriptionId: subscriptionId || null,
      subscriptionEndDate: endDate ? endDate : null
    });
    
    if (!updatedUser) {
      throw new Error(`User ${userId} not found`);
    }
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating user subscription status:', error);
    throw new Error('Failed to update subscription status');
  }
}

// Create a subscription checkout session
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}

// Create a Stripe payment intent for collecting card details
export async function createPaymentIntent(
  amount: number,
  customerId: string
): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: customerId,
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to create payment intent');
  }
}

// Map Stripe subscription status to our internal status
export function mapStripeStatus(stripeStatus: string): SubscriptionStatus {
  switch (stripeStatus) {
    case 'active':
    case 'trialing':
      return stripeStatus;
    case 'past_due':
    case 'unpaid':
    case 'incomplete':
    case 'incomplete_expired':
    case 'canceled':
      return stripeStatus as SubscriptionStatus;
    default:
      return 'none';
  }
}

// Get subscription details from Stripe
export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    throw new Error('Failed to retrieve subscription');
  }
}

// Process webhook events from Stripe
export async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;
          
          // Find user by customer ID
          const users = await storage.getUsersByStripeCustomerId(customerId);
          if (!users || users.length === 0) {
            console.error(`No user found for Stripe customer ${customerId}`);
            return;
          }
          
          const user = users[0];
          const status = mapStripeStatus(subscription.status);
          // Get the current period end as a timestamp (if available)
          const currentPeriodEnd = (subscription as any).current_period_end;
          const endDate = currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : undefined;
          
          // Determine subscription tier based on the product or price
          // This is a simplified example, you may need to map products to tiers
          const tier: SubscriptionTier = subscription.status === 'active' ? 'premium' : 'free';
          
          await updateUserSubscriptionStatus(
            user.id,
            status,
            tier,
            subscription.id,
            endDate
          );
        }
        break;
        
      case 'customer.subscription.deleted':
        {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;
          
          // Find user by customer ID
          const users = await storage.getUsersByStripeCustomerId(customerId);
          if (!users || users.length === 0) {
            console.error(`No user found for Stripe customer ${customerId}`);
            return;
          }
          
          const user = users[0];
          
          // Update user to free tier
          await updateUserSubscriptionStatus(
            user.id,
            'canceled',
            'free',
            undefined
          );
        }
        break;
        
      // Handle other webhook events as needed
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error handling webhook event:', error);
    throw new Error('Failed to process webhook event');
  }
}