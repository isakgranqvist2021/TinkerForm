import React from 'react';
import {
  booleanSectionSchema,
  emailSectionSchema,
  fileSectionSchema,
  linkSectionSchema,
  multipleChoiceOptionSchema,
  MultipleChoiceSection,
  multipleChoiceSectionSchema,
  phoneSectionSchema,
  rangeSectionSchema,
  Section,
  SectionType,
  textSectionSchema,
} from 'models/form';
import {
  FieldValues,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ControlledCheckbox,
  ControlledInput,
  ControlledTextarea,
} from 'components/inputs';
import {
  closeAddSectionModal,
  SectionFormModalProps,
  useSectionFormContext,
} from './section-form-modal';
import z from 'zod';

interface FormSectionProps extends SectionFormModalProps {
  defaultValues: FieldValues;
  schema: z.ZodObject<any>;

  titlePlaceholder: string;
  descriptionPlaceholder: string;
}

export function Forms(props: SectionFormModalProps) {
  const addSectionContext = useSectionFormContext();

  switch (addSectionContext.defaultValues.type) {
    case 'text':
      return (
        <SectionForm
          defaultValues={addSectionContext.defaultValues}
          onSubmit={props.onSubmit}
          schema={textSectionSchema}
          titlePlaceholder="Ex: What is your favorite programming language?"
          descriptionPlaceholder="Ex: Please provide a detailed answer explaining why you like this language."
        />
      );

    case 'link':
      return (
        <SectionForm
          defaultValues={addSectionContext.defaultValues}
          onSubmit={props.onSubmit}
          schema={linkSectionSchema}
          titlePlaceholder="Ex: What is your portfolio link?"
          descriptionPlaceholder="Ex: Please provide the URL to your online portfolio."
        />
      );

    case 'email':
      return (
        <SectionForm
          defaultValues={addSectionContext.defaultValues}
          onSubmit={props.onSubmit}
          schema={emailSectionSchema}
          titlePlaceholder="Ex: What is your email address?"
          descriptionPlaceholder="Ex: Please provide a valid email address."
        />
      );

    case 'phone':
      return (
        <SectionForm
          defaultValues={addSectionContext.defaultValues}
          onSubmit={props.onSubmit}
          schema={phoneSectionSchema}
          titlePlaceholder="Ex: What is your phone number?"
          descriptionPlaceholder="Ex: Please provide your contact phone number."
        />
      );

    case 'file':
      return (
        <SectionForm
          defaultValues={addSectionContext.defaultValues}
          onSubmit={props.onSubmit}
          schema={fileSectionSchema}
          titlePlaceholder="Ex: Please upload your resume."
          descriptionPlaceholder="Ex: Upload a PDF or Word document of your resume."
        />
      );

    case 'boolean':
      return (
        <SectionForm
          defaultValues={addSectionContext.defaultValues}
          onSubmit={props.onSubmit}
          schema={booleanSectionSchema}
          titlePlaceholder="Ex: Do you agree to the terms and conditions?"
          descriptionPlaceholder="Ex: Please confirm your agreement by selecting yes or no."
        />
      );

    case 'range':
      return (
        <SectionForm
          defaultValues={addSectionContext.defaultValues}
          onSubmit={props.onSubmit}
          schema={rangeSectionSchema}
          titlePlaceholder="Ex: On a scale of 1 to 10, how would you rate your proficiency in JavaScript?"
          descriptionPlaceholder="Ex: Please provide a number between 1 and 10 to indicate your skill level."
        />
      );

    case 'multiple-choice':
      return (
        <SectionForm
          defaultValues={addSectionContext.defaultValues}
          onSubmit={props.onSubmit}
          schema={multipleChoiceSectionSchema}
          titlePlaceholder="Ex: What is your preferred development environment?"
          descriptionPlaceholder="Ex: Choose one of the following options."
        />
      );
  }
}

function SectionForm(props: FormSectionProps) {
  const form = useForm({
    resolver: zodResolver(props.schema),
    defaultValues: props.defaultValues,
  });

  React.useEffect(() => {
    form.reset(props.defaultValues);
  }, [props.defaultValues, form]);

  const handleSubmit = form.handleSubmit((data) => {
    props.onSubmit(data as Section);
    form.reset(props.defaultValues);
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit}>
        <ControlledInput
          name="title"
          label="Section Title"
          placeholder={props.titlePlaceholder}
        />
        <ControlledTextarea
          name="description"
          label="Describe your section"
          placeholder={props.descriptionPlaceholder}
        />

        <ExtraFields type={props.defaultValues.type as SectionType} />

        <ControlledCheckbox
          name="required"
          label="This question must be answered"
        />

        <SectionFormModalFooter />
      </form>
    </FormProvider>
  );
}

interface ExtraFieldsProps {
  type: SectionType;
}
function ExtraFields(props: ExtraFieldsProps) {
  switch (props.type) {
    case 'boolean':
    case 'email':
    case 'file':
    case 'link':
    case 'phone':
      return null;

    case 'range':
    case 'text':
      return (
        <div className="flex gap-4">
          <ControlledInput name="min" label="Minimum value" type="number" />
          <ControlledInput name="max" label="Maximum value" type="number" />
        </div>
      );

    case 'multiple-choice':
      return <MultipleChoiceOptionsForm />;
  }
}

function MultipleChoiceOptionsForm() {
  const formContext = useFormContext<MultipleChoiceSection>();
  const fieldArray = useFieldArray<MultipleChoiceSection>({
    name: 'options',
  });

  const form = useForm({
    resolver: zodResolver(multipleChoiceOptionSchema),
    defaultValues: {
      text: '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    fieldArray.append({ text: data.text });

    form.setFocus('text');
    form.reset();
  });

  const error = formContext.formState.errors.options?.message;

  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend">Options</legend>

      <ul className="list bg-base-100 rounded-box shadow-md">
        {fieldArray.fields.map((option, index) => (
          <li className="list-row flex justify-between" key={index}>
            <div>
              <div>
                {index + 1}. {option.text}
              </div>
              <div className="text-xs uppercase font-semibold opacity-60">
                Remaining Reason
              </div>
            </div>
            <button
              className="btn btn-square btn-ghost"
              onClick={() => fieldArray.remove(index)}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-[1.2em]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </li>
        ))}

        <li className="list-row">
          <label className="input join-item">
            <input placeholder="Option" {...form.register('text')} />
          </label>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-neutral btn-circle"
          >
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
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        </li>
      </ul>

      {error && <p className="text-error">{error}</p>}
    </fieldset>
  );
}

function SectionFormModalFooter() {
  return (
    <div className="modal-action">
      <button type="button" className="btn" onClick={closeAddSectionModal}>
        Close
      </button>

      <button type="submit" className="btn btn-primary">
        Save
      </button>
    </div>
  );
}
