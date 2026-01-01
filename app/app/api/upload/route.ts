import { NextRequest } from 'next/server';
import { badRequest, internalServerError, ok, unauthorized } from '../utils';
import { auth0 } from 'lib/auth0';
import { uploadSchema } from 'models/file';
import { uploadFile } from 'utils/utils.server';

export async function POST(req: NextRequest, ctx: RouteContext<'/api/upload'>) {
  try {
    const session = await auth0.getSession();
    if (!session?.user.email) {
      return unauthorized();
    }
    const formData = await req.formData();

    const result = uploadSchema.safeParse({
      file: formData.get('file'),
      url: formData.get('url'),
    });
    if (result.error) {
      return badRequest();
    }

    let url: string | null = null;
    if (result.data.file) {
      console.log('Uploading', result.data.file);
      url = await uploadFile(result.data.file);
    }

    return ok({ url });
  } catch (err) {
    console.log(err);
    return internalServerError();
  }
}
