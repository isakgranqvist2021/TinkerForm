import React from 'react';
import { stripe } from 'services/payment';
import type { PageProps } from 'types/page';
import { getMetadata } from 'utils';
import { CheckoutSuccess } from './checkout-success';
import { CheckoutFailed } from '../rejected/checkout-failed';
import {
  createSubscription,
  deleteSubscription,
  getSubscription,
} from 'services/api/subscription';
import { createSubscriptionSchema } from 'models/subscribe';
import { auth0 } from 'lib/auth0';
import { SessionData } from '@auth0/nextjs-auth0/types';

export const metadata = getMetadata({
  title: 'Payment Accepted',
  description: 'Your payment has been successfully processed.',
});

export default async function Page(
  props: PageProps<undefined, { checkoutSessionId: string }>,
) {
  const session = await auth0.getSession();
  const searchParams = await props.searchParams;

  const checkoutSessionId = searchParams.checkoutSessionId;
  if (typeof checkoutSessionId !== 'string') {
    throw new Error('Invalid checkout session id');
  }

  const isSubscribed = await verifyAndCompletePayment(
    checkoutSessionId,
    session,
  );
  if (!isSubscribed) {
    return <CheckoutFailed checkoutSessionId={checkoutSessionId} />;
  }

  return <CheckoutSuccess />;
}

async function verifyAndCompletePayment(
  checkoutSessionId: string,
  session: SessionData | null,
) {
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

  if (session) {
    const currentSubscription = await getSubscription(session);
    if (currentSubscription) {
      await stripe.subscriptions.cancel(currentSubscription.subscriptionId);
      await deleteSubscription(session);
    }
  }

  const parsedData = createSubscriptionSchema.parse(checkoutSession.metadata);

  return createSubscription({
    email,
    packageId: parsedData.id,
    subscriptionId: subscriptionId,
  });
}
