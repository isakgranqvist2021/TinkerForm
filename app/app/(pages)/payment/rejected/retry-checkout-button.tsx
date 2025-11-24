'use client';

import getStripe from 'services/stripe';

interface RetryCheckoutButtonProps extends React.ComponentProps<'button'> {
  checkoutSessionId: string;
}
export function RetryCheckoutButton(props: RetryCheckoutButtonProps) {
  const { checkoutSessionId, ...rest } = props;

  const retryCheckout = useRetryCheckout(checkoutSessionId);

  return <button onClick={retryCheckout} {...rest} />;
}

function useRetryCheckout(checkoutSessionId: string) {
  return async () => {
    const stripe = await getStripe();
    if (!stripe) {
      console.error(`Stripe is ${stripe}`);
      return;
    }

    await stripe.redirectToCheckout({ sessionId: checkoutSessionId });
  };
}
