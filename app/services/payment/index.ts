import { env } from 'config';
import Stripe from 'stripe';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
});

export async function verifyAndCompletePayment(checkoutSessionId: string) {
  const checkoutSession =
    await stripe.checkout.sessions.retrieve(checkoutSessionId);
  if (checkoutSession.payment_status !== 'paid') {
    throw new Error('Payment not completed');
  }
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
