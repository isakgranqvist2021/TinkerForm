import { sectionMapper } from 'db/mapper';
import { AnswersTable } from 'db/query/answer';
import { FormTable } from 'db/query/form';
import { ResponseTable } from 'db/query/response';
import { SectionTable } from 'db/query/section';

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

    const form = await FormTable.findById(id);
    if (!form) {
      return new Response(
        JSON.stringify({ statusCode: 404, message: 'Form not found' }),
        { status: 404 },
      );
    }

    const body = await req.json();
    const response = await ResponseTable.findById(body.responseId);
    if (!response || response.fk_form_id !== form.id) {
      return new Response(
        JSON.stringify({ statusCode: 404, message: 'Response not found' }),
        { status: 404 },
      );
    }

    const sections = await SectionTable.listByFormId(id);
    const mappedSections = sections.map(sectionMapper);
    const schema = constructSchema(mappedSections);

    const parsedBody = schema.parse(body.answers);
    const entries = Object.entries(parsedBody);

    await AnswersTable.insertMany(id, response.id, entries);
    await ResponseTable.updateCompletedAt(response.id);

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
