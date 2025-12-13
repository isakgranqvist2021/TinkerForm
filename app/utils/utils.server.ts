import { put } from '@vercel/blob';
import { defaultTheme, Theme } from 'config/theme';
import { updateThemeSchema } from 'models/theme';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

export async function getThemeFromCookie(): Promise<Theme> {
  const cookieStore = await cookies();
  const schemaParseResult = updateThemeSchema.safeParse({
    theme: cookieStore.get('theme')?.value,
  });

  return schemaParseResult.data?.theme ?? defaultTheme;
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

export async function uploadFile(file: File) {
  const { url } = await put(`files/${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true,
  });

  return url;
}
