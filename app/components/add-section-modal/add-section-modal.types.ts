export const sectionTypes = [
  'email',
  'number',
  'text',
  'image',
  'multiple-choice',
  'file',
] as const;

interface BaseSection {
  id: string;
  index: number;
  type: (typeof sectionTypes)[number];
  title: string;
  description?: string;
}

interface EmailSection extends BaseSection {
  type: 'email';
  placeholder?: string;
  required: boolean;
}

interface NumberSection extends BaseSection {
  type: 'number';
  placeholder?: string;
  required: boolean;
  min?: number;
  max?: number;
}

interface TextSection extends BaseSection {
  type: 'text';
  placeholder?: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
}

interface ImageSection extends BaseSection {
  type: 'image';
  required: boolean;
}

interface MultipleChoiceSection extends BaseSection {
  type: 'multiple-choice';
  options: string[];
  required: boolean;
}

interface FileSection extends BaseSection {
  type: 'file';
  required: boolean;
  maxFileSizeMB?: number;
  allowedFileTypes?: string[];
}

export type Section =
  | EmailSection
  | NumberSection
  | TextSection
  | ImageSection
  | MultipleChoiceSection
  | FileSection;
