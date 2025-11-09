'use client';

import { PackageId } from 'config/packages';
import { useBuyNow, useRetryCheckout } from 'hooks/use-buy-now';

interface BuyNowButtonProps extends React.ComponentProps<'button'> {
  id: PackageId;
}

export function BuyNowButton(props: BuyNowButtonProps) {
  const { id, ...rest } = props;

  const buyNow = useBuyNow(id);

  return <button onClick={buyNow} {...rest} />;
}

interface TryAgainButtonProps extends React.ComponentProps<'button'> {
  checkoutSessionId: string;
}
export function TryAgainButton(props: TryAgainButtonProps) {
  const { checkoutSessionId, ...rest } = props;

  const retryCheckout = useRetryCheckout(checkoutSessionId);

  return <button onClick={retryCheckout} {...rest} />;
}
