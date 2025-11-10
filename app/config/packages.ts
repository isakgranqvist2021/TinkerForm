export type PackageId = 'starter' | 'pro' | 'enterprise';

export interface Package {
  id: PackageId;
  name: string;
  price: number;
  features: { name: string; available: boolean }[];
  badge?: string;
}

export const packages: Record<PackageId, Package> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 100,
    features: [
      { name: 'Basic support', available: true },
      { name: 'Cancel anytime', available: true },
      { name: 'Limited access to features', available: true },
      { name: 'No custom branding', available: false },
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 2900,
    badge: 'Most popular',
    features: [
      { name: 'Priority support', available: true },
      { name: 'Cancel anytime', available: true },
      { name: 'Full access to features', available: true },
      { name: 'Custom branding', available: true },
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Custom',
    price: 99900,
    features: [
      { name: 'Dedicated account manager', available: true },
      { name: 'Cancel anytime', available: true },
      { name: 'Custom integrations', available: true },
      { name: 'Advanced security features', available: true },
    ],
  },
};
