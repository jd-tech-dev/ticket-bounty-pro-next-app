import Stripe from 'stripe';
import * as stripeData from '@/features/stripe/data';

export const onSubscriptionDeleted = async (
  subscription: Stripe.Subscription,
  eventAt: number
) => {
  await stripeData.deleteStripeCustomerSubscription(subscription, eventAt);
};
