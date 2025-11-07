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
import { ResponseTable } from 'db/query/response';
import { SectionTable } from 'db/query/section';
import { InsertAnswer, SelectedSection } from 'db/schema';
import { constructSchema } from 'models/answer-form.server';
import { SectionType } from 'models/form';
import { getSlimFormById } from 'services/api/forms.server';
import { getResponseById } from 'services/api/response.server';

export async function POST(
  req: Request,
  ctx: RouteContext<'/api/form/[id]/[responseId]'>,
) {
  try {
    const { id, responseId } = await ctx.params;

    const form = await getSlimFormById(id);
    if (!form) {
      return notFound();
    }

    const response = await getResponseById(responseId);
    if (!response || response.fkFormId !== form.id) {
      return notFound();
    }

    if (response.completedAt) {
      return badRequest('Response already completed');
    }

    const sections = await SectionTable.listByFormId(id);

    const formData = await req.formData();
    const values = await validateAnswers(
      form.id,
      response.id,
      formData,
      sections.reduce(
        (acc, section) => {
          acc[section.id] = section;
          return acc;
        },
        {} as Record<string, SelectedSection>,
      ),
    );
    if (!values) {
      return badRequest('Invalid answers');
    }

    await AnswersTable.insertMany(values);
    await ResponseTable.updateCompletedAt(response.id);

    return ok();
  } catch (err) {
    return internalServerError();
  }
}

async function validateAnswers(
  formId: string,
  responseId: string,
  formData: FormData,
  sections: Record<string, SelectedSection>,
): Promise<InsertAnswer[] | null> {
  try {
    const formDataObj: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      const type = sections[key].type as SectionType;

      switch (type) {
        case 'text':
        case 'link':
        case 'email':
        case 'phone':
          formDataObj[key] = value;
          break;

        case 'boolean':
          formDataObj[key] = value === 'true';
          break;

        case 'range':
          formDataObj[key] = Number(value);
          break;

        case 'file':
          const fileValue: File = value as File;
          const { url } = await put(`files/${fileValue.name}`, fileValue, {
            access: 'public',
            addRandomSuffix: true,
          });
          formDataObj[key] = url;
          break;

        case 'multiple-choice':
          formDataObj[key] = value;
          break;
      }
    }

    const mappedSections = Object.values(sections).map(sectionMapper);
    const schema = constructSchema(mappedSections);

    const insertAnswers: InsertAnswer[] = [];
    const parsed = schema.parse(formDataObj);

    for (const key in parsed) {
      const section = sections[key];
      const type = section.type as SectionType;

      const insertAnswer: InsertAnswer = {
        answer_boolean: null,
        answer_file: null,
        answer_number: null,
        answer_text: null,
        fk_form_id: formId,
        fk_section_id: section.id,
        fk_response_id: responseId,
      };

      switch (type) {
        case 'text':
        case 'email':
        case 'link':
        case 'phone':
        case 'multiple-choice':
          insertAnswer.answer_text = parsed[key] as string;
          break;

        case 'boolean':
          insertAnswer.answer_boolean = parsed[key] as boolean;
          break;

        case 'range':
          insertAnswer.answer_number = parsed[key] as number;
          break;

        case 'file':
          insertAnswer.answer_file = parsed[key] as string;
          break;
      }

      insertAnswers.push(insertAnswer);
    }

    return insertAnswers;
  } catch (err) {
    return null;
  }
}
