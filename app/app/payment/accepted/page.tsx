import {
  CheckoutFailed,
  CheckoutSuccess,
} from 'components/checkout-completed-screen';
import { auth0 } from 'lib/auth0';
import Link from 'next/link';
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
    return <CheckoutFailed checkoutSessionId={checkoutSessionId} />;
  }

  return <CheckoutSuccess />;
}
