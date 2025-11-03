import { created, internalServerError, unauthorized } from 'app/api/utils';
import { FormTable } from 'db/query/form';
import { SectionTable } from 'db/query/section';
import { auth0 } from 'lib/auth0';
import { formSchema } from 'models/form';

export async function POST(req: Request) {
  try {
    const session = await auth0.getSession();
    if (!session?.user.email) {
      return unauthorized();
    }

    const body = await req.json();
    const form = formSchema.parse(body);

    const res = await FormTable.insertOne(form, session.user.email);
    await SectionTable.insertMany(form, res[0].id);

    return created(res[0]);
  } catch (err) {
    return internalServerError();
  }
}
