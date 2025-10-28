import getStripe from 'services/stripe';
import type { Cart, CartItem } from 'types/cart';

export function useBuyNow(cartItem: CartItem) {
  return async () => {
    const stripe = await getStripe();
    if (!stripe) {
      console.error(`Stripe is ${stripe}`);
      return;
    }

    const cart: Cart = {
      items: [cartItem],
    };

    const body = JSON.stringify(cart);

    const res = await fetch('/api/cart/checkout', {
      body,
      method: 'POST',
    }).then((res) => res.json());

    await stripe.redirectToCheckout({ sessionId: res.sessionId });
  };
}
