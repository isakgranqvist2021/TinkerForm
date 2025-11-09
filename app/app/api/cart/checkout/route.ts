import { requireEnv } from 'config';
import { PackageId, packages } from 'config/packages';
import { auth0 } from 'lib/auth0';
import { createSubscriptionSchema } from 'models/subscribe';
import { createCheckoutSession } from 'services/payment';
import Stripe from 'stripe';

function getStripeCheckoutParams(
  id: PackageId,
  options: { email?: string; url?: string },
) {
  const pkg = packages.find((pkg) => pkg.id === id);
  if (!pkg) {
    throw new Error('Invalid package ID');
  }

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    submit_type: 'subscribe',
    payment_method_types: ['card'],
    customer_email: options.email,
    line_items: [
      {
        price_data: {
          currency: 'EUR',
          unit_amount: pkg.price,
          recurring: {
            interval: 'month',
            interval_count: 1,
          },
          product_data: { name: pkg.name },
        },
        quantity: 1,
      },
    ],
    success_url: `${options.url}/payment/accepted?checkoutSessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: `${options.url}/payment/rejected`,
    metadata: { id },
  };

  return params;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const parsedData = createSubscriptionSchema.parse(data);

    const session = await auth0.getSession();

    const checkoutSessionParams = getStripeCheckoutParams(parsedData.id, {
      email: session?.user.email,
      url: req.headers.get('origin') || requireEnv('APP_BASE_URL'),
    });

    const checkoutSession = await createCheckoutSession(checkoutSessionParams);

    return Response.json({ sessionId: checkoutSession.id });
  } catch (err) {
    console.error('Error during checkout:', err);

    return new Response(
      JSON.stringify({
        statusCode: 500,
        message: err instanceof Error ? err.message : 'Internal server error',
      }),
      { status: 500 },
    );
  }
}
