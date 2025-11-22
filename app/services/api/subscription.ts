import { env } from 'config';
import { PackageId } from 'config/packages';
import { stripe } from 'services/payment';
import { getIsActive, getNextPaymentDate } from 'utils/utils.server';
import { getAccessToken } from './access-token';

export interface CreateSubscriptionDto {
  email: string;
  packageId: PackageId;
  subscriptionId: string;
}

export interface SubscriptionDto {
  email: string;
  subscriptionId: string;
  packageId: PackageId;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionDetails = Awaited<ReturnType<typeof getSubscription>>;

export async function createSubscription(dto: CreateSubscriptionDto) {
  try {
    const res = await fetch(`${env.API_URL}/subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });

    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function getSubscription() {
  try {
    const { token } = await getAccessToken();

    const res = await fetch(`${env.API_URL}/subscription`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return null;
    }

    const subscription: SubscriptionDto = await res.json();
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.subscriptionId,
      {
        expand: ['latest_invoice'],
      },
    );

    const isActive = getIsActive(stripeSubscription);
    if (!isActive) {
      return null;
    }

    const nextPaymentDate = getNextPaymentDate(stripeSubscription);

    return {
      nextPaymentDate,
      packageId: subscription.packageId,
      subscriptionId: subscription.subscriptionId,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function deleteSubscription(): Promise<boolean> {
  try {
    const { token } = await getAccessToken();

    const res = await fetch(`${env.API_URL}/subscription`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
}
