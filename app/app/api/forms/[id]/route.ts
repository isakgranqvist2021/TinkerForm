import {
  forbidden,
  internalServerError,
  ok,
  unauthorized,
} from 'app/api/utils';
import { SectionTable } from 'db/query/section';
import { auth0 } from 'lib/auth0';
import { formSchema } from 'models/form';
import { deleteFormById, updateForm } from 'services/api/forms';

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

    const body = await req.json();
    const form = formSchema.parse(body);

    await updateForm(id, form);
    await SectionTable.upsertMany(id, form.sections);

    return ok();
  } catch (err) {
    return internalServerError();
  }
}

export async function DELETE(
  req: Request,
  ctx: RouteContext<'/api/forms/[id]'>,
) {
  try {
    const { id } = await ctx.params;

    await deleteFormById(id);

    return ok();
  } catch (err) {
    return internalServerError();
  }
}
