import { internalServerError, unauthorized } from 'app/api/utils';
import { auth0 } from 'lib/auth0';
import { getAnswersByFormId, getFormById } from 'services/api/forms';
import { formatExportFormData } from 'utils';

export async function GET(
  req: Request,
  ctx: RouteContext<'/api/forms/[id]/export'>,
) {
  try {
    const { id } = await ctx.params;

    const session = await auth0.getSession();
    if (!session?.user.email) {
      return unauthorized();
    }

    const form = await getFormById(id);
    if (!form || form.email !== session.user.email) {
      return unauthorized();
    }

    const responses = await getAnswersByFormId(id);
    if (!responses) {
      return internalServerError();
    }

    const csvData = formatExportFormData(responses);

    return new Response(csvData, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${form.id}.csv"`,
      },
    });
  } catch (err) {
    return internalServerError();
  }
}
