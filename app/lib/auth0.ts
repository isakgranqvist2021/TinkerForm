import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { requireEnv } from 'config';

const appBaseUrl = requireEnv('APP_BASE_URL');
const domain = requireEnv('AUTH0_DOMAIN');
const clientId = requireEnv('AUTH0_CLIENT_ID');
const clientSecret = requireEnv('AUTH0_CLIENT_SECRET');
const secret = requireEnv('AUTH0_SECRET');
const scope = requireEnv('AUTH0_SCOPE');
const audience = requireEnv('AUTH0_AUDIENCE');

export const auth0 = new Auth0Client({
  domain,
  clientId,
  clientSecret,
  appBaseUrl,
  secret,

  signInReturnToPath: `${appBaseUrl}/dashboard/forms`,

  authorizationParameters: {
    scope,
    audience,
  },
});
