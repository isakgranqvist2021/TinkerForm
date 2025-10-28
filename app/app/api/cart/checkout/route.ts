import { products } from 'data/products';
import { getSession } from 'lib/auth0';
import { createCheckoutSession } from 'services/payment';
import Stripe from 'stripe';
import type { Cart } from 'types/cart';

function getStripeCheckoutParams(
  cart: Cart,
  options: { email?: string; url?: string },
) {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const metadata: Stripe.Metadata = {};

  cart.items.forEach((item) => {
    const product = products.find((product) => product.id === item.id);
    if (!product) return;

    lineItems.push({
      price_data: {
        currency: 'EUR',
        unit_amount: product.price,
        product_data: { name: product.name },
      },
      quantity: item.quantity,
    });

    metadata[product.id] = product.id;
  });

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    submit_type: 'pay',
    payment_method_types: ['card'],
    customer_email: options.email,
    line_items: lineItems,
    success_url: `${options.url}/payment/accepted?checkoutSessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: `${options.url}/payment/rejected`,
    metadata,
  };

  return params;
}

export async function POST(req: Request) {
  try {
    const cart: Cart = await req.json();

    const session = await getSession();

    const checkoutSessionParams = getStripeCheckoutParams(cart, {
      email: session?.user.email,
      url: req.headers.get('origin') || 'http://localhost:3000',
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
