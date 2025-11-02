import { put } from '@vercel/blob';
import { sectionMapper } from 'db/mapper';
import { AnswersTable } from 'db/query/answer';
import { FormTable } from 'db/query/form';
import { ResponseTable } from 'db/query/response';
import { SectionTable } from 'db/query/section';

import { getSession } from 'lib/auth0';
import { constructSchema } from 'models/answer-form.server';

export async function POST(
  req: Request,
  ctx: RouteContext<'/api/form/[id]/[responseId]'>,
) {
  try {
    const { id, responseId } = await ctx.params;

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

    const response = await ResponseTable.findById(responseId);
    if (!response || response.fk_form_id !== form.id) {
      return new Response(
        JSON.stringify({ statusCode: 404, message: 'Response not found' }),
        { status: 404 },
      );
    }

    if (response.completed_at) {
      return new Response(
        JSON.stringify({
          statusCode: 400,
          message: 'Response already completed',
        }),
        { status: 400 },
      );
    }

    const formData = await req.formData();
    const answers: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        answers[key] = value;
        continue;
      }

      if (value instanceof File) {
        const { url } = await put(`files/${value.name}`, value, {
          access: 'public',
          addRandomSuffix: true,
        });

        answers[key] = url;
      }
    }

    const sections = await SectionTable.listByFormId(id);
    const mappedSections = sections.map(sectionMapper);
    const schema = constructSchema(mappedSections);
    const parsedBody = schema.parse(answers);
    const entries = Object.entries(parsedBody);

    await AnswersTable.insertMany(id, response.id, entries);
    await ResponseTable.updateCompletedAt(response.id);

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
