'use client';

import { useBuyNow } from 'hooks/use-buy-now';
import type { CartItem } from 'types/cart';

interface BuyNowButtonProps {
  cartItem: CartItem;
}
export function BuyNowButton(props: BuyNowButtonProps) {
  const buyNow = useBuyNow(props.cartItem);

  return (
    <button onClick={buyNow} className="btn btn-primary">
      Buy Now
    </button>
  );
}
