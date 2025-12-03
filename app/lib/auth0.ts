import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { requireEnv } from 'config';

// Initialize the Auth0 client
export const auth0 = new Auth0Client({
  // Options are loaded from environment variables by default
  // Ensure necessary environment variables are properly set
  domain: requireEnv('AUTH0_DOMAIN'),
  clientId: requireEnv('AUTH0_CLIENT_ID'),
  clientSecret: requireEnv('AUTH0_CLIENT_SECRET'),
  appBaseUrl: requireEnv('APP_BASE_URL'),
  secret: requireEnv('AUTH0_SECRET'),

  authorizationParameters: {
    // In v4, the AUTH0_SCOPE and AUTH0_AUDIENCE environment variables for API authorized applications are no longer automatically picked up by the SDK.
    // Instead, we need to provide the values explicitly.
    scope: requireEnv('AUTH0_SCOPE'),
    audience: requireEnv('AUTH0_AUDIENCE'),
  },

  enableAccessTokenEndpoint: true,
  signInReturnToPath: '/dashboard/forms',
});
