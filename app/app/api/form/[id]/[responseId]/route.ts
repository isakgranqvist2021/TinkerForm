import { put } from '@vercel/blob';
import { badRequest, internalServerError, notFound, ok } from 'app/api/utils';
import { sectionMapper } from 'db/mapper';
import { ResponseTable } from 'db/query/response';
import { SectionTable } from 'db/query/section';
import { SelectedSection } from 'db/schema';
import { constructSchema } from 'models/answer-form.server';
import { SectionType } from 'models/form';
import { CreateAnswerDto, createAnswers } from 'services/api/answer';
import { getFormById } from 'services/api/forms';
import { getResponseById } from 'services/api/response';

export async function POST(
  req: Request,
  ctx: RouteContext<'/api/form/[id]/[responseId]'>,
) {
  try {
    const { id, responseId } = await ctx.params;

    const form = await getFormById(id);
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

    await createAnswers(values);
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
): Promise<CreateAnswerDto[] | null> {
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

    const insertAnswers: CreateAnswerDto[] = [];
    const parsed = schema.parse(formDataObj);

    for (const key in parsed) {
      const section = sections[key];
      const type = section.type as SectionType;

      const insertAnswer: CreateAnswerDto = {
        answerBoolean: null,
        answerFile: null,
        answerNumber: null,
        answerText: null,
        fkFormId: formId,
        fkSectionId: section.id,
        fkResponseId: responseId,
      };

      switch (type) {
        case 'text':
        case 'email':
        case 'link':
        case 'phone':
        case 'multiple-choice':
          insertAnswer.answerText = parsed[key] as string;
          break;

        case 'boolean':
          insertAnswer.answerBoolean = parsed[key] as boolean;
          break;

        case 'range':
          insertAnswer.answerNumber = parsed[key] as number;
          break;

        case 'file':
          insertAnswer.answerFile = parsed[key] as string;
          break;
      }

      insertAnswers.push(insertAnswer);
    }

    return insertAnswers;
  } catch (err) {
    return null;
  }
}
