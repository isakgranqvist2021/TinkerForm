import { env } from 'config';
import { createSubscriptionSchema } from 'models/subscribe';
import {
  createSubscription,
  deleteSubscription,
  getSubscription,
} from 'services/api/subscription';
import Stripe from 'stripe';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
});

export async function verifyAndCompletePayment(checkoutSessionId: string) {
  const checkoutSession =
    await stripe.checkout.sessions.retrieve(checkoutSessionId);

  if (checkoutSession.status !== 'complete') {
    return false;
  }

  const subscriptionId =
    typeof checkoutSession.subscription === 'string'
      ? checkoutSession.subscription
      : checkoutSession.subscription?.id;

  if (!subscriptionId) {
    return false;
  }

  const email = checkoutSession.customer_details?.email;
  if (!email) {
    return false;
  }

  const currentSubscription = await getSubscription();
  if (currentSubscription) {
    await stripe.subscriptions.cancel(currentSubscription.subscriptionId);
    await deleteSubscription();
  }

  const parsedData = createSubscriptionSchema.parse(checkoutSession.metadata);

  return createSubscription({
    email,
    packageId: parsedData.id,
    subscriptionId: subscriptionId,
  });
}

export async function createCheckoutSession(
  params: Stripe.Checkout.SessionCreateParams,
) {
  const checkoutSession = await stripe.checkout.sessions.create(params);

  return checkoutSession;
}

export async function getCheckoutSession(
  checkoutSessionId: string,
): Promise<Stripe.Checkout.Session> {
  const checkoutSession =
    await stripe.checkout.sessions.retrieve(checkoutSessionId);

  if (!checkoutSession) {
    throw new Error('Checkout session not found');
  }

  return checkoutSession;
}
