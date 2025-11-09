import { internalServerError, ok, unauthorized } from 'app/api/utils';
import { deleteSubscription, getSubscription } from 'services/api/subscription';
import { stripe } from 'services/payment';

export async function PATCH(
  req: Request,
  ctx: RouteContext<'/api/subscription'>,
) {
  try {
    const subscription = await getSubscription();
    if (!subscription) {
      return unauthorized();
    }

    const deleted = await deleteSubscription();
    if (!deleted) {
      return internalServerError();
    }

    await stripe.subscriptions.cancel(subscription.subscriptionId);

    return ok();
  } catch (err) {
    return internalServerError();
  }
}
