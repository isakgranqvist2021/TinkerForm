import { internalServerError, ok, unauthorized } from 'app/api/utils';
import { auth0 } from 'lib/auth0';
import { getAnswersByResponseId, getResponseById } from 'services/api/response';

export async function GET(
  req: Request,
  ctx: RouteContext<'/api/response/[id]'>,
) {
  try {
    const { id } = await ctx.params;

    const session = await auth0.getSession();
    if (!session?.user.email) {
      return unauthorized();
    }

    const response = await getResponseById(id);
    const answers = await getAnswersByResponseId(id);

    return ok({ response, answers });
  } catch (err) {
    return internalServerError();
  }
}
