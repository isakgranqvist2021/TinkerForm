import { internalServerError, ok, unauthorized } from 'app/api/utils';
import { auth0 } from 'lib/auth0';
import { deleteSubscription, getSubscription } from 'services/api/subscription';
import { stripe } from 'services/payment';

export async function PATCH(
  req: Request,
  ctx: RouteContext<'/api/subscription'>,
) {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return unauthorized();
    }

    const subscription = await getSubscription(session);
    if (!subscription) {
      return unauthorized();
    }

    const deleted = await deleteSubscription(session);
    if (!deleted) {
      throw new Error('Failed to delete subscription');
    }

    await stripe.subscriptions.cancel(subscription.subscriptionId);

    return ok();
  } catch (err) {
    console.error(err);
    return internalServerError();
  }
}
