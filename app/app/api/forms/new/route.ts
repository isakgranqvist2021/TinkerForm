import { created, internalServerError, unauthorized } from 'app/api/utils';
import { SectionTable } from 'db/query/section';
import { auth0 } from 'lib/auth0';
import { formSchema } from 'models/form';
import { createForm } from 'services/api/forms.server';

export async function POST(req: Request) {
  try {
    const session = await auth0.getSession();
    if (!session?.user.email) {
      return unauthorized();
    }

    const body = await req.json();
    const form = formSchema.parse(body);

    const res = await createForm(form);
    if (!res) {
      return internalServerError();
    }

    await SectionTable.insertMany(form.sections, res.id);

    return created(res);
  } catch (err) {
    return internalServerError();
  }
}
