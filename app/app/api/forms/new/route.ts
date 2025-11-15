import { put } from '@vercel/blob';
import { created, internalServerError, unauthorized } from 'app/api/utils';
import { auth0 } from 'lib/auth0';
import { formSchema } from 'models/form';
import { createForm, CreateFormDto } from 'services/api/forms';
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
    const createFormDto: CreateFormDto = { ...form, coverImage: '' };
    const { url } = await put(
      `files/${form.coverImage.name}`,
      form.coverImage,
      { access: 'public', addRandomSuffix: true },
    );
    createFormDto.coverImage = url;

    const res = await createForm(createFormDto);
    if (!res) {
      throw new Error('Failed to create form');
    }

    await createSections(form.sections, res.id);

    return created(res);
  } catch (err) {
    console.log(err);
    return internalServerError();
  }
}
