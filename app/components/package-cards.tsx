'use client';

import { Package, PackageId, packages } from 'config/packages';
import { cn, formatCurrency } from 'utils';
import useMutation from 'swr/mutation';
import { toast } from 'sonner';
import getStripe from 'services/stripe';
import { useUser } from '@auth0/nextjs-auth0';
import { CheckIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useRouter } from 'next/navigation';
import { HoverCard } from './hover-card';

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
  const { onClick, className, text, disabled } = usePricingCard(props);

  return (
    <HoverCard className={onClick ? 'cursor-pointer' : ''} onClick={onClick}>
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
                    <CheckIcon className="size-4 me-2 inline-block text-success" />
                    <span>{feature.name}</span>
                  </li>
                );
              }

              return (
                <li className="opacity-50" key={index}>
                  <CheckIcon className="size-4 me-2 inline-block text-base-content/50" />
                  <span className="line-through">{feature.name}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-6">
            <button
              disabled={disabled}
              className={cn('btn btn-block', className)}
            >
              {text}
            </button>
          </div>
        </div>
      </div>
    </HoverCard>
  );
}

function usePricingCard(props: PricingCardProps) {
  const { user, isLoading } = useUser();

  const cancelSubscription = useCancelSubscription();
  const startCheckout = useStartCheckout(props.pkg.id);
  const router = useRouter();

  if (props.pkg.price === 0) {
    if (user || isLoading) {
      return {
        onClick: undefined,
        text: 'Subscribe',
        className: 'btn-primary',
        disabled: true,
      };
    }

    return {
      onClick: () => router.push('/dashboard/forms'),
      className: 'btn-primary',
      text: 'Subscribe',
      disabled: false,
    };
  }

  if (props.activePackageId === props.pkg.id) {
    return {
      onClick: () => cancelSubscription.trigger(),
      className: 'btn-neutral',
      text: 'Cancel Subscription',
      disabled: false,
    };
  }

  return {
    onClick: startCheckout,
    className: 'btn-primary',
    text: 'Subscribe',
    disabled: false,
  };
}

function useCancelSubscription() {
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

  return { isMutating, trigger };
}

function useStartCheckout(id: PackageId) {
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
