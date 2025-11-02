import { put } from '@vercel/blob';
import {
  badRequest,
  internalServerError,
  notFound,
  ok,
  unauthorized,
} from 'app/api/utils';
import { sectionMapper } from 'db/mapper';
import { AnswersTable } from 'db/query/answer';
import { FormTable } from 'db/query/form';
import { ResponseTable } from 'db/query/response';
import { SectionTable } from 'db/query/section';
import { InsertSection } from 'db/schema';

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
      return unauthorized();
    }

    const form = await FormTable.findById(id);
    if (!form) {
      return notFound();
    }

    const response = await ResponseTable.findById(responseId);
    if (!response || response.fk_form_id !== form.id) {
      return notFound();
    }

    if (response.completed_at) {
      return badRequest('Response already completed');
    }

    const sections = await SectionTable.listByFormId(id);

    const formData = await req.formData();
    const answers = await mapAnswers(formData);

    const entries = validateAnswers(answers, sections);

    await AnswersTable.insertMany(id, response.id, entries);
    await ResponseTable.updateCompletedAt(response.id);

    return ok();
  } catch (err) {
    return internalServerError();
  }
}

async function mapAnswers(formData: FormData) {
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

  return answers;
}

function validateAnswers(
  answers: Record<string, string>,
  sections: InsertSection[],
) {
  const mappedSections = sections.map(sectionMapper);
  const schema = constructSchema(mappedSections);

  const parsedBody = schema.parse(answers);

  return Object.entries(parsedBody);
}
