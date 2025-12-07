import { env } from 'config';
import { auth0 } from 'lib/auth0';
import { NextRequest } from 'next/server';

export const GET = proxy;
export const DELETE = proxy;
export const POST = proxy;

/**
 * Handles incoming requests to the proxy endpoint and forwards them to the .NET backend.
 * * @param req The NextRequest object representing the incoming request.
 * @param ctx The context object containing route parameters.
 * @returns A Next.js Response object with the proxied response.
 */
async function proxy(
  req: NextRequest,
  ctx: RouteContext<'/api/proxy/[...slug]'>,
) {
  const params = await ctx.params;

  const path = params.slug.join('/');
  const targetUrl = `${env.API_URL}/${path}${req.nextUrl.search}`;

  try {
    const session = await auth0.getSession();

    if (session) {
      req.headers.set(
        'Authorization',
        `Bearer ${session.tokenSet.accessToken}`,
      );
    }

    const fetchOptions: RequestInit = {
      method: req.method,
      body: req.body,
      headers: req.headers,
      cache: req.cache,
      next: { revalidate: 0 },

      // @ts-expect-error
      duplex: 'half',
    };

    const backendResponse = await fetch(targetUrl, fetchOptions);

    return new Response(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: backendResponse.headers,
    });
  } catch (error) {
    console.error('Proxy Error:', error);

    return new Response(
      JSON.stringify({
        message: 'Proxy failed to connect to the backend.',
        error: (error as Error).message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
