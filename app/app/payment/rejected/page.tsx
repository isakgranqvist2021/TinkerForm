import { CheckoutFailed } from 'components/checkout-completed-screen';
import React from 'react';
import { getMetadata } from 'utils';

export const metadata = getMetadata({
  title: 'Payment Rejected',
  description: 'Your payment was not successful.',
});

export default function Page() {
  return <CheckoutFailed />;
}
