import { MultipleChoiceOption, SectionType } from 'models/form';

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
