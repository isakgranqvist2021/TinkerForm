import { internalServerError, ok, unauthorized } from 'app/api/utils';
import { responseMapper } from 'db/mapper';
import { AnswersTable } from 'db/query/answer';
import { ResponseTable } from 'db/query/response';
import { auth0 } from 'lib/auth0';

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

    const response = await ResponseTable.findById(id);
    const answers = await AnswersTable.findByResponseId(id);

    return ok(responseMapper(response, answers));
  } catch (err) {
    return internalServerError();
  }
}
