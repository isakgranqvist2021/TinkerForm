'use client';

import { PackageId } from 'config/packages';
import { useBuyNow } from 'hooks/use-buy-now';

interface BuyNowButtonProps extends React.ComponentProps<'button'> {
  id: PackageId;
}

export function BuyNowButton(props: BuyNowButtonProps) {
  const { id, ...rest } = props;

  const buyNow = useBuyNow(id);

  return <button onClick={buyNow} {...rest} />;
}
