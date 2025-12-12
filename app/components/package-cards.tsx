'use client';

import { Package, PackageId, packages } from 'config/packages';
import { cn, formatCurrency } from 'utils';
import useMutation from 'swr/mutation';
import { toast } from 'sonner';
import getStripe from 'services/stripe';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0';

interface PackageCardsProps extends React.ComponentProps<'div'> {
  activePackageId?: PackageId | null;
}
export function PackageCards(props: PackageCardsProps) {
  const { activePackageId, className, ...rest } = props;

  return (
    <div
      className={cn(
        'flex gap-4 lg:flex-row flex-col justify-center items-center',
        className,
      )}
      {...rest}
    >
      {Object.values(packages).map((pkg) => (
        <PricingCard key={pkg.id} pkg={pkg} activePackageId={activePackageId} />
      ))}
    </div>
  );
}

interface PricingCardProps {
  pkg: Package;
  activePackageId?: PackageId | null;
}
function PricingCard(props: PricingCardProps) {
  return (
    <div className="card bg-base-100 shadow-sm w-96">
      <div className="card-body flex flex-col justify-between">
        {props.pkg.badge && (
          <span className="badge badge-xs badge-warning">
            {props.pkg.badge}
          </span>
        )}

        <div className="flex justify-between">
          <h2 className="text-3xl font-bold">{props.pkg.name}</h2>
          <span className="text-xl">
            {!props.pkg.price ? 'Free' : formatCurrency(props.pkg.price)}
          </span>
        </div>
        <ul className="mt-6 flex flex-col gap-2 text-xs">
          {props.pkg.features.map((feature, index) => {
            if (feature.available) {
              return (
                <li key={index}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4 me-2 inline-block text-success"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{feature.name}</span>
                </li>
              );
            }

            return (
              <li className="opacity-50" key={index}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 me-2 inline-block text-base-content/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="line-through">{feature.name}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-6">
          <PricingCardActionButton {...props} />
        </div>
      </div>
    </div>
  );
}

function PricingCardActionButton(props: PricingCardProps) {
  const { user, isLoading } = useUser();

  if (props.pkg.price === 0) {
    if (user || isLoading) {
      return (
        <button className="btn btn-primary btn-block" disabled>
          Subscribe
        </button>
      );
    }

    return (
      <Link className="btn btn-primary btn-block" href="/dashboard/forms">
        Subscribe
      </Link>
    );
  }

  if (props.activePackageId === props.pkg.id) {
    return (
      <CancelSubscriptionButton className="btn btn-neutral btn-block">
        Cancel Subscription
      </CancelSubscriptionButton>
    );
  }

  return (
    <SubscribeButton id={props.pkg.id} className="btn btn-primary btn-block">
      Subscribe
    </SubscribeButton>
  );
}

interface SubscribeButtonProps extends React.ComponentProps<'button'> {
  id: PackageId;
}

function SubscribeButton(props: SubscribeButtonProps) {
  const { id, ...rest } = props;

  const buyNow = useStartCheckout(id);

  return <button onClick={buyNow} {...rest} />;
}

function CancelSubscriptionButton(props: React.ComponentProps<'button'>) {
  const { isMutating, trigger } = useMutation(
    '/api/subscription',
    async (url) => {
      const res = await fetch(url, { method: 'PATCH' });

      if (!res.ok) {
        throw new Error('Could not cancel subscription');
      }
    },
    {
      onSuccess: () => window.location.reload(),
      onError: () => {
        toast.error("Couldn't cancel subscription. Please try again.");
      },
    },
  );

  return <button {...props} disabled={isMutating} onClick={() => trigger()} />;
}

export function useStartCheckout(id: PackageId) {
  return async () => {
    const stripe = await getStripe();
    if (!stripe) {
      console.error(`Stripe is ${stripe}`);
      return;
    }

    const body = JSON.stringify({
      id,
    });

    const res = await fetch('/api/cart/checkout', {
      body,
      method: 'POST',
    }).then((res) => res.json());

    await stripe.redirectToCheckout({ sessionId: res.sessionId });
  };
}
