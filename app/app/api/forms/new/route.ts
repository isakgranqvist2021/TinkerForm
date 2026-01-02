import { created, internalServerError, unauthorized } from 'app/api/utils';
import { auth0 } from 'lib/auth0';
import { formSchema } from 'models/form';
import { createForm } from 'services/api/forms';
import { createSections } from 'services/api/section';
import { parseFormFormData } from 'utils';

export async function POST(req: Request) {
  try {
    const session = await auth0.getSession();
    if (!session?.user.email) {
      return unauthorized();
    }

    const formData = await req.formData();
    const form = formSchema.parse(parseFormFormData(formData));

    const formDto = await createForm(form, session);

    if (!formDto) {
      throw new Error('Failed to create form');
    }

    await createSections(form.sections, formDto.id, session);

    return created(formDto);
  } catch (err) {
    console.log(err);
    return internalServerError();
  }
}
