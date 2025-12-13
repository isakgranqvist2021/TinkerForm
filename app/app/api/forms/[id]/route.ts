import { del } from '@vercel/blob';
import { internalServerError, ok, unauthorized } from 'app/api/utils';
import { auth0 } from 'lib/auth0';
import { formSchema } from 'models/form';
import { getFormById, updateForm, UpdateFormDto } from 'services/api/forms';
import { parseFormFormData } from 'utils';
import { uploadFile } from 'utils/utils.server';

export async function PATCH(
  req: Request,
  ctx: RouteContext<'/api/forms/[id]'>,
) {
  try {
    const { id } = await ctx.params;

    const session = await auth0.getSession();
    if (!session?.user.email) {
      return unauthorized();
    }

    const currentForm = await getFormById(id);
    if (currentForm?.coverImage) {
      await del(currentForm?.coverImage);
    }

    const formData = await req.formData();
    const form = formSchema.parse(parseFormFormData(formData));

    const updateFormDto: UpdateFormDto = { ...form, coverImage: '' };
    const url = await uploadFile(form.coverImage);
    updateFormDto.coverImage = url;

    await updateForm(id, updateFormDto, session);

    return ok();
  } catch (err) {
    console.error(err);
    return internalServerError();
  }
}
