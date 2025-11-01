import { responseMapper } from 'db/mapper';
import { AnswersTable } from 'db/query/answer';
import { ResponseTable } from 'db/query/response';
import { getSession } from 'lib/auth0';

export async function GET(
  req: Request,
  ctx: RouteContext<'/api/response/[id]'>,
) {
  try {
    const { id } = await ctx.params;

    const session = await getSession();
    if (!session.user.email) {
      return new Response(
        JSON.stringify({
          statusCode: 403,
          message: 'Forbidden',
        }),
        { status: 403 },
      );
    }

    const response = await ResponseTable.findById(id);
    const answers = await AnswersTable.findByResponseId(id);

    return Response.json(responseMapper(response, answers));
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({
        statusCode: 500,
        message: err instanceof Error ? err.message : 'Internal server error',
      }),
      { status: 500 },
    );
  }
}
