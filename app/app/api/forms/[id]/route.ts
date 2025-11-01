import { FormTable } from 'db/query/form';
import { SectionTable } from 'db/query/section';
import { getSession } from 'lib/auth0';
import { formSchema } from 'models/form';

export async function PATCH(
  req: Request,
  ctx: RouteContext<'/api/forms/[id]'>,
) {
  try {
    const { id } = await ctx.params;

    const session = await getSession();
    if (!session.user.email) {
      return new Response(
        JSON.stringify({
          statusCode: 401,
          message: 'Unauthorized',
        }),
        { status: 401 },
      );
    }

    const body = await req.json();
    const form = formSchema.parse(body);

    const canContinue = await FormTable.isFormOwner(id, session.user.email);
    if (!canContinue) {
      return new Response(
        JSON.stringify({ statusCode: 403, message: 'Forbidden' }),
        { status: 403 },
      );
    }

    await FormTable.updateFormById(id, form);
    await SectionTable.upsertSections(id, form.sections);

    return new Response('', { status: 200 });
  } catch (err) {
    console.log(err);

    return new Response(
      JSON.stringify({
        statusCode: 500,
        message: err instanceof Error ? err.message : 'Internal server error',
      }),
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  ctx: RouteContext<'/api/forms/[id]'>,
) {
  try {
    const { id } = await ctx.params;

    const session = await getSession();
    if (!session.user.email) {
      return new Response(
        JSON.stringify({
          statusCode: 401,
          message: 'Unauthorized',
        }),
        { status: 401 },
      );
    }

    const canContinue = await FormTable.isFormOwner(id, session.user.email);
    if (!canContinue) {
      return new Response(
        JSON.stringify({ statusCode: 403, message: 'Forbidden' }),
        { status: 403 },
      );
    }

    await FormTable.deleteFormById(id);

    return new Response('', { status: 200 });
  } catch (err) {
    console.log(err);

    return new Response(
      JSON.stringify({
        statusCode: 500,
        message: err instanceof Error ? err.message : 'Internal server error',
      }),
      { status: 500 },
    );
  }
}
