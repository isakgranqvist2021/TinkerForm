import { auth0 } from 'lib/auth0';

export async function getAccessToken() {
  const { token } = await auth0.getAccessToken();

  return { token };
}
