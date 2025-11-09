export type PackageId = 'free' | 'pro' | 'enterprise';

export interface Package {
  id: PackageId;
  name: string;
  price: number;
  features: { name: string; available: boolean }[];
  badge?: string;
}

export const packages: Package[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      { name: 'Basic support', available: true },
      { name: 'Limited access to features', available: true },
      { name: 'No custom branding', available: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 2900,
    badge: 'Most popular',
    features: [
      { name: 'Priority support', available: true },
      { name: 'Full access to features', available: true },
      { name: 'Custom branding', available: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Custom',
    price: 99900,
    features: [
      { name: 'Dedicated account manager', available: true },
      { name: 'Custom integrations', available: true },
      { name: 'Advanced security features', available: true },
    ],
  },
];
