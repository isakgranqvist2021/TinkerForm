export type PackageId = 'starter' | 'pro' | 'enterprise';

export interface Package {
  id: PackageId;
  name: string;
  price: number;
  features: { name: string; available: boolean }[];
  badge?: string;
}

export function canScoreApplications(packageId?: PackageId): boolean {
  if (!packageId) {
    return false;
  }

  return packageId !== 'starter';
}

export const packages: Record<PackageId, Package> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 100,
    features: [
      {
        name: 'Cancel anytime',
        available: true,
      },
      {
        name: 'Up to 100 responses per month',
        available: true,
      },
      {
        name: 'Export to CSV',
        available: false,
      },
      {
        name: 'Choose form theme',
        available: false,
      },
      {
        name: 'Score responses with AI',
        available: false,
      },
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 2900,
    badge: 'Most popular',
    features: [
      {
        name: 'Cancel anytime',
        available: true,
      },
      {
        name: 'Up to 10,000 responses per month',
        available: true,
      },
      {
        name: 'Export to CSV',
        available: true,
      },
      {
        name: 'Choose form theme',
        available: true,
      },
      {
        name: 'Score responses with AI',
        available: true,
      },
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99900,
    features: [
      {
        name: 'Cancel anytime',
        available: true,
      },
      {
        name: 'Unlimited responses',
        available: true,
      },
      {
        name: 'Export to CSV',
        available: true,
      },
      {
        name: 'Choose form theme',
        available: true,
      },
      {
        name: 'Score responses with AI',
        available: true,
      },
    ],
  },
};
