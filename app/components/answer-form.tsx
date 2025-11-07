'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Section } from 'models/form';
import { FormProvider, useForm } from 'react-hook-form';
import {
  ControlledBooleanInput,
  ControlledFileInput,
  ControlledInput,
  ControlledRangeInput,
  ControlledSelect,
  ControlledTextarea,
} from './inputs';
import {
  ConstructedSchema,
  constructSchema,
  getConstructedSchemaDefaultValues,
} from 'models/answer-form';
import { toast } from 'sonner';
import React from 'react';
import { type FormDto } from 'services/api/forms.server';
import { ResponseDto } from 'services/api/response.server';

interface AnswerFormProps {
  sections: Section[];
  response: ResponseDto;
  form: FormDto;
}

export function AnswerForm(props: AnswerFormProps) {
  const formRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="w-[760px] mx-auto max-w-full gap-8 flex-col flex">
      <div>
        <div className="flex justify-between">
          <div className="mb-4">
            <h1 className="m-0 mb-2 text-xl font-bold">{props.form.title}</h1>

            <div className="flex gap-2 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>

              <p>{props.form.location}</p>
            </div>
          </div>

          {!props.response.completedAt && (
            <button
              onClick={() =>
                formRef.current?.scrollIntoView({
                  behavior: 'smooth',
                })
              }
              className="btn btn-primary"
            >
              Apply Now
            </button>
          )}
        </div>

        <p
          className="m-0 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: props.form.description }}
        ></p>
      </div>

      <div ref={formRef}>
        <AnswerFormContent
          responseId={props.response.id}
          sections={props.sections}
          formId={props.form.id}
          isCompleted={props.response.completedAt !== null}
        />
      </div>
    </div>
  );
}

interface AnswerFormContentProps {
  sections: Section[];
  formId: string;
  responseId: string;
  isCompleted: boolean;
}

export function AnswerFormContent(props: AnswerFormContentProps) {
  const form = useForm<ConstructedSchema>({
    resolver: zodResolver(constructSchema(props.sections)),
    defaultValues: getConstructedSchemaDefaultValues(props.sections),
  });

  const [hasResponded, setHasResponded] = React.useState(props.isCompleted);

  if (hasResponded) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-24 text-green-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>

        <p className="font-medium">Thank you for your response!</p>
      </div>
    );
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        const value = data[key as keyof typeof data];
        if (value instanceof File || typeof value === 'string') {
          formData.append(key, value);
        } else {
          formData.append(key, JSON.stringify(value));
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

      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } catch (error) {
      toast.error("Couldn't save form. Please try again.");
    }
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-12">
        {props.sections
          .sort((a, b) => a.index - b.index)
          .map((section) => {
            switch (section.type) {
              case 'text':
                if (section.max > 200) {
                  return (
                    <ControlledTextarea
                      name={section.id}
                      label={section.title}
                      placeholder="Your answer"
                      description={section.description}
                      key={section.id}
                      disabled={form.formState.isSubmitting}
                      minLength={section.min}
                      maxLength={section.max}
                    />
                  );
                }

                return (
                  <ControlledInput
                    name={section.id}
                    label={section.title}
                    placeholder="Your answer"
                    description={section.description}
                    key={section.id}
                    disabled={form.formState.isSubmitting}
                    minLength={section.min}
                    maxLength={section.max}
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

              case 'range':
                return (
                  <ControlledRangeInput
                    name={section.id}
                    label={section.title}
                    description={section.description}
                    key={section.id}
                    disabled={form.formState.isSubmitting}
                    min={section.min}
                    max={section.max}
                  />
                );

              case 'boolean':
                return (
                  <ControlledBooleanInput
                    name={section.id}
                    label={section.title}
                    description={section.description}
                    key={section.id}
                    disabled={form.formState.isSubmitting}
                  />
                );

              case 'multiple-choice':
                return (
                  <ControlledSelect
                    name={section.id}
                    label={section.title}
                    description={section.description}
                    key={section.id}
                    disabled={form.formState.isSubmitting}
                    options={section.options.map((option) => ({
                      value: option.text,
                      label: option.text,
                    }))}
                  />
                );
            }
          })}

        <button
          className="btn btn-primary w-fit mt-4 ml-auto block flex gap-2"
          disabled={form.formState.isSubmitting}
        >
          Send
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </button>
      </form>
    </FormProvider>
  );
}
