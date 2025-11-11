import { env } from 'config';
import { MultipleChoiceOption, Section, SectionType } from 'models/form';
import { getAccessToken } from './access-token';

export interface SectionDto {
  id: string;
  createdAt: string;
  updatedAt: string;

  fkFormId: string;

  type: SectionType;
  title: string;
  index: number;
  description: string;
  required: boolean;
  min: number | null;
  max: number | null;

  options: MultipleChoiceOption[] | null;
}

export interface CreateSectionDto {
  fkFormId: string;

  type: SectionType;
  title: string;
  index: number;
  description: string;
  required: boolean;
  min: number | null;
  max: number | null;
  options: MultipleChoiceOption[] | null;
}

export async function getSectionsByFormId(
  formId: string,
): Promise<SectionDto[]> {
  try {
    const res = await fetch(`${env.API_URL}/section/form/${formId}`);

    const data = (await res.json()) as SectionDto[];

    return data.map(sectionDtoMapper);
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function createSections(
  sections: Section[],
  formId: string,
): Promise<SectionDto[]> {
  const values = sections.map((section): CreateSectionDto => {
    switch (section.type) {
      case 'email':
      case 'file':
      case 'link':
      case 'phone':
      case 'boolean':
        return {
          fkFormId: formId,
          type: section.type,
          title: section.title,
          index: section.index,
          description: section.description,
          required: section.required,
          min: null,
          max: null,
          options: null,
        };

      case 'range':
      case 'text':
        return {
          fkFormId: formId,
          type: section.type,
          title: section.title,
          index: section.index,
          description: section.description,
          required: section.required,
          min: section.min,
          max: section.max,
          options: null,
        };

      case 'multiple-choice':
        return {
          fkFormId: formId,
          type: section.type,
          title: section.title,
          index: section.index,
          description: section.description,
          required: section.required,
          options: section.options,
          min: null,
          max: null,
        };
    }
  });

  try {
    const { token } = await getAccessToken();

    const res = await fetch(`${env.API_URL}/section`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    return data.map(sectionDtoMapper);
  } catch (err) {
    console.error(err);
    return [];
  }
}

function sectionDtoMapper(section: SectionDto): SectionDto {
  if (section.type === 'multiple-choice' && section.options) {
    section.options = (
      typeof section.options === 'string'
        ? JSON.parse(section.options as unknown as string)
        : section.options
    ) as MultipleChoiceOption[];
  }

  return section;
}

export function sectionMapper(section: SectionDto): Section {
  const type = section.type;

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

    case 'multiple-choice':
      return {
        type,
        description: section.description,
        id: section.id,
        index: section.index,
        required: Boolean(section.required),
        title: section.title,
        options: section.options ?? [],
      };

    default:
      throw new Error(`Unknown section type: ${section.type}`);
  }
}
