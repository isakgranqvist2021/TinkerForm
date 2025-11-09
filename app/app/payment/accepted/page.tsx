import React from 'react';
import { verifyAndCompletePayment } from 'services/payment';
import type { PageProps } from 'types/page';

export const metadata = {
  title: 'Payment Accepted',
};

export default async function Page(
  props: PageProps<undefined, { checkoutSessionId: string }>,
) {
  const searchParams = await props.searchParams;

  const checkoutSessionId = searchParams.checkoutSessionId;
  if (typeof checkoutSessionId !== 'string') {
    throw new Error('Invalid checkout session id');
  }

  const isSubscribed = await verifyAndCompletePayment(checkoutSessionId);
  if (!isSubscribed) {
    return <p>Subscription not completed</p>;
  }

  return <p>Subscription confirmed</p>;
}
