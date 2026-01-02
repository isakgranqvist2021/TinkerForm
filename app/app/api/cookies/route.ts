import { cookies } from 'next/headers';
import { internalServerError, ok } from '../utils';
import { ACCEPT_COOKIES_KEY } from 'constants/cookies';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set(ACCEPT_COOKIES_KEY, 'true', { path: '/' });

    return ok();
  } catch (err) {
    console.error(err);
    return internalServerError();
  }
}
