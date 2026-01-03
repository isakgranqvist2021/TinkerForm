'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnswerFormContent } from 'components/answer-form';
import { useAnswerForm } from 'hooks/use-answer-form';
import {
  ConstructedSchema,
  constructSchema,
  getConstructedSchemaDefaultValues,
} from 'models/answer-form';
import { Section } from 'models/form';
import { FormProvider, useForm } from 'react-hook-form';

import { type FormDto } from 'services/api/forms';
import { ResponseDto } from 'services/api/response';

interface AnswerFormProps {
  sections: Section[];
  response: ResponseDto;
  form: FormDto;
}

export function AnswerForm(props: AnswerFormProps) {
  const form = useForm<ConstructedSchema>({
    resolver: zodResolver(constructSchema(props.sections)),
    defaultValues: getConstructedSchemaDefaultValues(props.sections),
  });

  const answerForm = useAnswerForm({
    formId: props.form.id,
    responseId: props.response.id,
    isCompleted: Boolean(props.response.completedAt),
  });

  const handleSubmit = form.handleSubmit((data) => answerForm.trigger(data));

  return (
    <form onSubmit={handleSubmit} data-testid="answer-form">
      <FormProvider {...form}>
        <AnswerFormContent
          coverImage={props.form.coverImage}
          title={props.form.title}
          description={props.form.description}
          location={props.form.description}
          disabled={form.formState.isSubmitting}
          sections={props.sections}
          hasResponded={
            props.response.completedAt !== null || answerForm.hasResponded
          }
        />
      </FormProvider>
    </form>
  );
}
