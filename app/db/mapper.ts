import { SelectedAnswer, SelectedResponse, SelectedSection } from './schema';
import { Section, SectionType } from 'models/form';

export function sectionMapper(section: SelectedSection): Section {
  const type = section.type as SectionType;

  switch (type) {
    case 'text':
    case 'range':
      return {
        type,
        description: section.description,
        id: section.id,
        index: section.index,
        required: Boolean(section.required),
        title: section.title,
        min: section.min ?? 0,
        max: section.max ?? 0,
      };

    case 'email':
    case 'link':
    case 'phone':
    case 'file':
    case 'boolean':
      return {
        type,
        description: section.description,
        id: section.id,
        index: section.index,
        required: Boolean(section.required),
        title: section.title,
      };

    default:
      throw new Error(`Unknown section type: ${type}`);
  }
}

function answerMapper(args: {
  answer: SelectedAnswer;
  section: SelectedSection | null;
}) {
  return {
    answer: {
      id: args.answer.id,
      answer:
        args.answer.answer_text ??
        args.answer.answer_number ??
        args.answer.answer_boolean ??
        args.answer.answer_file ??
        null,
      createdAt: args.answer.created_at,
    },
    section: {
      id: args.section!.id,
      title: args.section!.title,
      type: args.section!.type as SectionType,
      description: args.section!.description,
      index: args.section!.index,
      required: args.section!.required!,
    },
  };
}

export function responseMapper(
  response: SelectedResponse,
  answers: {
    answer: SelectedAnswer;
    section: SelectedSection | null;
  }[],
) {
  return {
    response: {
      id: response.id,
      completedAt: response.completed_at,
      createdAt: response.created_at,
    },
    items: answers.map(answerMapper),
  };
}
