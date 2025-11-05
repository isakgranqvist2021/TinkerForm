import { internalServerError, ok } from '../utils';
import { cookies } from 'next/headers';
import { updateThemeSchema } from 'models/theme';

export async function POST(req: Request, ctx: RouteContext<'/api/theme'>) {
  try {
    const body = await req.json();
    const form = updateThemeSchema.parse(body);

    const cookieStore = await cookies();
    cookieStore.set('theme', form.theme, { path: '/' });

    return ok();
  } catch (err) {
    return internalServerError();
  }
}
