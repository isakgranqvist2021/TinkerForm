import { env } from 'config';
import { PackageId } from 'config/packages';
import { auth0 } from 'lib/auth0';

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

export async function getSubscription(): Promise<SubscriptionDto | null> {
  try {
    const { token } = await auth0.getAccessToken();

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

    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function deleteSubscription(): Promise<boolean> {
  try {
    const { token } = await auth0.getAccessToken();

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

export async function getSubscriptions(): Promise<SubscriptionDto[]> {
  try {
    const { token } = await auth0.getAccessToken();

    const res = await fetch(`${env.API_URL}/subscriptions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch subscriptions');
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}
