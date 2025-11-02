'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Section } from 'models/form';
import { FormProvider, useForm } from 'react-hook-form';
import { ControlledFileInput, ControlledInput } from './inputs';
import {
  ConstructedSchema,
  constructSchema,
  getAnswerSchema,
  getConstructedSchemaDefaultValues,
} from 'models/answer-form';
import { toast } from 'sonner';
import React from 'react';

interface AnswerFormProps {
  sections: Section[];
  formId: string;
  responseId: string;
  isCompleted: boolean;
}
export function AnswerForm(props: AnswerFormProps) {
  const form = useForm<ConstructedSchema>({
    resolver: zodResolver(constructSchema(props.sections)),
    defaultValues: getConstructedSchemaDefaultValues(props.sections),
  });

  const [hasResponded, setHasResponded] = React.useState(props.isCompleted);

  if (hasResponded) {
    return (
      <p className="text-green-600 font-medium">Thank you for your response!</p>
    );
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        const value = data[key as keyof typeof data];
        if (value) {
          formData.append(key, value);
        }
      }

      const res = await fetch(`/api/form/${props.formId}/${props.responseId}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to save form');
      }

      setHasResponded(true);
    } catch (error) {
      toast.error("Couldn't save form. Please try again.");
    }
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit}>
        {props.sections
          .sort((a, b) => a.index - b.index)
          .map((section) => {
            switch (section.type) {
              case 'text':
                return (
                  <ControlledInput
                    name={section.id}
                    label={section.title}
                    placeholder="Your answer"
                    description={section.description}
                    key={section.id}
                    disabled={form.formState.isSubmitting}
                  />
                );

              case 'link':
                return (
                  <ControlledInput
                    name={section.id}
                    label={section.title}
                    placeholder="Your answer"
                    description={section.description}
                    key={section.id}
                    disabled={form.formState.isSubmitting}
                  />
                );

              case 'email':
                return (
                  <ControlledInput
                    name={section.id}
                    label={section.title}
                    type="email"
                    placeholder="Your answer"
                    description={section.description}
                    key={section.id}
                    disabled={form.formState.isSubmitting}
                  />
                );

              case 'phone':
                return (
                  <ControlledInput
                    name={section.id}
                    label={section.title}
                    type="tel"
                    placeholder="Your answer"
                    description={section.description}
                    key={section.id}
                    disabled={form.formState.isSubmitting}
                  />
                );

              case 'file':
                return (
                  <ControlledFileInput
                    name={section.id}
                    label={section.title}
                    description={section.description}
                    key={section.id}
                    disabled={form.formState.isSubmitting}
                  />
                );
            }
          })}

        <button
          className="btn btn-primary w-fit mt-4"
          disabled={form.formState.isSubmitting}
        >
          Send
        </button>
      </form>
    </FormProvider>
  );
}
