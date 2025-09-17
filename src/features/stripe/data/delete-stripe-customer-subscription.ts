import Stripe from 'stripe';
import prisma from '@/lib/prisma';

export const deleteStripeCustomerSubscription = async (
  subscription: Stripe.Subscription,
  eventAt: number
) => {
  try {
    await prisma.stripeCustomer.update({
      where: {
        customerId: subscription.customer as string,
      },
      data: {
        subscriptionId: null,
        subscriptionStatus: null,
        productId: null,
        priceId: null,
        eventAt,
      },
    });
  } catch (error) {
    throw error;
  }
};
