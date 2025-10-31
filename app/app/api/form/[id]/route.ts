import { sectionMapper } from 'db/mapper';
import { findFormById, insertAnswers, listSectionsByFormId } from 'db/query';
import { getSession } from 'lib/auth0';
import { constructSchema } from 'models/answer-form';

export async function POST(req: Request, ctx: RouteContext<'/api/form/[id]'>) {
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

    const form = await findFormById(id);
    if (!form) {
      return new Response(
        JSON.stringify({ statusCode: 404, message: 'Form not found' }),
        { status: 404 },
      );
    }

    const body = await req.json();

    const sections = await listSectionsByFormId(id);
    const mappedSections = sections.map(sectionMapper);
    const schema = constructSchema(mappedSections);

    const parsedBody = schema.parse(body);
    const entries = Object.entries(parsedBody);

    const responseId = crypto.randomUUID();

    await insertAnswers(id, responseId, entries);

    return new Response('', { status: 201 });
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
