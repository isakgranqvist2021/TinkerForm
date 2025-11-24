import React from 'react';
import { getMetadata } from 'utils';
import { CheckoutFailed } from './checkout-failed';

export const metadata = getMetadata({
  title: 'Payment Rejected',
  description: 'Your payment was not successful.',
});

export default function Page() {
  return <CheckoutFailed />;
}
