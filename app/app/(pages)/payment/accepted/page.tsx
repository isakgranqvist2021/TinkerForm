import {
  CheckoutFailed,
  CheckoutSuccess,
} from 'components/checkout-completed-screen';
import React from 'react';
import { verifyAndCompletePayment } from 'services/payment';
import type { PageProps } from 'types/page';
import { getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'Payment Accepted',
  description: 'Your payment has been successfully processed.',
});

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
    return <CheckoutFailed checkoutSessionId={checkoutSessionId} />;
  }

  return <CheckoutSuccess />;
}
