export interface AnswerDto {
  id: string;
  createdAt: string;
  updatedAt: string;

  fkFormId: string;
  fkResponseId: string;
  fkSectionId: string | null;

  answerText: string | null;
  answerNumber: number | null;
  answerBoolean: boolean | null;
  answerFile: string | null;
}
