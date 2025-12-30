export type PackageId = 'starter' | 'plus' | 'pro';

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
    price: 0,
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
        name: 'Choose form theme',
        available: false,
      },
      {
        name: 'Analyze responses with AI',
        available: false,
      },
      {
        name: 'Export to CSV',
        available: false,
      },
    ],
  },
  plus: {
    id: 'plus',
    name: 'Plus',
    price: 2999,
    badge: 'Most popular',
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
        name: 'Choose form theme',
        available: true,
      },
      {
        name: 'Analyze responses with AI',
        available: true,
      },
      {
        name: 'Export to CSV',
        available: false,
      },
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 7999,
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
        name: 'Choose form theme',
        available: true,
      },
      {
        name: 'Analyze responses with AI',
        available: true,
      },
      {
        name: 'Export to CSV',
        available: true,
      },
    ],
  },
};
