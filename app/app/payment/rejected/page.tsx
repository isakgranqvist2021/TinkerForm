import { CheckoutFailed } from 'components/checkout-completed-screen';
import React from 'react';

export const metadata = {
  title: 'Payment Rejected',
};

export default function Page() {
  return <CheckoutFailed />;
}
