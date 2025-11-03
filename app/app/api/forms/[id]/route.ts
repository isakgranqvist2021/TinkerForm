import {
  forbidden,
  internalServerError,
  ok,
  unauthorized,
} from 'app/api/utils';
import { FormTable } from 'db/query/form';
import { SectionTable } from 'db/query/section';
import { auth0 } from 'lib/auth0';
import { formSchema } from 'models/form';

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

    const canContinue = await FormTable.isOwner(id, session.user.email);
    if (!canContinue) {
      return forbidden();
    }

    await FormTable.updateById(id, form);
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

    const session = await auth0.getSession();
    if (!session?.user.email) {
      return unauthorized();
    }

    const canContinue = await FormTable.isOwner(id, session.user.email);
    if (!canContinue) {
      return forbidden();
    }

    await FormTable.deleteById(id);

    return ok();
  } catch (err) {
    return internalServerError();
  }
}
