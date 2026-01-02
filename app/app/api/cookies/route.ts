import { cookies } from 'next/headers';
import { internalServerError, ok } from '../utils';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    cookieStore.set('accept-cookies', 'true', { path: '/' });

    return ok();
  } catch (err) {
    console.error(err);
    return internalServerError();
  }
}
