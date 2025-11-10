import { auth0 } from 'lib/auth0';
import { Theme, updateThemeSchema } from 'models/theme';
import { cookies } from 'next/headers';
import { stripe } from 'services/payment';
import Stripe from 'stripe';

export async function getThemeFromCookie(): Promise<Theme> {
  const cookieStore = await cookies();
  const schemaParseResult = updateThemeSchema.safeParse({
    theme: cookieStore.get('theme')?.value,
  });

  return schemaParseResult.data?.theme ?? 'light';
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

export function getIsActive(subscription: Stripe.Subscription | null) {
  if (!subscription) {
    return false;
  }

  const { status } = subscription;

  const hasActiveSubscription = status === 'active' || status === 'trialing';
  return hasActiveSubscription;
}
