import { auth0 } from 'lib/auth0';
import { Theme, updateThemeSchema } from 'models/theme';
import { cookies } from 'next/headers';
import { getSubscription } from 'services/api/subscription';
import { stripe } from 'services/payment';

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
      hasActiveSubscription: false,
      subscription: null,
      stripeSubscription: null,
    };
  }

  const subscription = await getSubscription();
  const stripeSubscription = subscription
    ? await stripe.subscriptions.retrieve(subscription.subscriptionId, {
        expand: ['latest_invoice'],
      })
    : null;

  let nextPaymentDate: Date | null = null;
  if (stripeSubscription) {
    const firstItem = stripeSubscription.items.data[0];

    if (firstItem && firstItem.current_period_end) {
      nextPaymentDate = new Date(firstItem.current_period_end * 1000);
    }
  }
  const hasActiveSubscription =
    (stripeSubscription?.status === 'active' ||
      stripeSubscription?.status === 'trialing') &&
    subscription;

  return {
    nextPaymentDate,
    hasActiveSubscription,
    subscription,
    stripeSubscription,
  };
}
