import { auth0 } from 'lib/auth0';
import { Theme, updateThemeSchema } from 'models/theme';
import { cookies } from 'next/headers';
import { getSubscription } from 'services/api/subscription';
import { stripe } from 'services/payment';
import Stripe from 'stripe';

export async function getThemeFromCookie(): Promise<Theme> {
  const cookieStore = await cookies();
  const schemaParseResult = updateThemeSchema.safeParse({
    theme: cookieStore.get('theme')?.value,
  });

  return schemaParseResult.data?.theme ?? 'light';
}

export async function getSubscriptionInfo() {
  const session = await auth0.getSession();
  if (!session?.user.email) {
    return {
      nextPaymentDate: null,
      packageId: null,
    };
  }

  const subscription = await getSubscription();
  const stripeSubscription = subscription
    ? await stripe.subscriptions.retrieve(subscription.subscriptionId, {
        expand: ['latest_invoice'],
      })
    : null;

  const nextPaymentDate = getNextPaymentDate(stripeSubscription);
  const isActive = getIsActive(stripeSubscription);

  return {
    nextPaymentDate,
    packageId: isActive ? subscription?.packageId : null,
  };
}

export function getNextPaymentDate(subscription: Stripe.Subscription | null) {
  let nextPaymentDate: Date | null = null;
  if (subscription) {
    const firstItem = subscription.items.data[0];

    if (firstItem && firstItem.current_period_end) {
      nextPaymentDate = new Date(firstItem.current_period_end * 1000);
    }
  }

  return nextPaymentDate;
}

function getIsActive(subscription: Stripe.Subscription | null) {
  if (!subscription) {
    return false;
  }

  const { status } = subscription;

  const hasActiveSubscription = status === 'active' || status === 'trialing';
  return hasActiveSubscription;
}
