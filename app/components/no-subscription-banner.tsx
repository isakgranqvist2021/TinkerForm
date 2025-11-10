import Link from 'next/link';
import { getSubscription } from 'services/api/subscription';

export async function NoSubscriptionBanner() {
  const subscription = await getSubscription();

  if (subscription?.packageId) {
    return null;
  }

  return (
    <div className="alert alert-warning mt-4 justify-center mx-4">
      You do not have an active subscription. Please choose a plan to get
      started.
      <Link
        href="/dashboard/account/billing"
        className="btn btn-neutral btn-sm"
      >
        Choose a Plan
      </Link>
    </div>
  );
}
