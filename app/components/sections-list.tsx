'use client';

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  closestCenter,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  booleanSectionSchema,
  emailSectionSchema,
  fileSectionSchema,
  Form,
  linkSectionSchema,
  multipleChoiceOptionSchema,
  MultipleChoiceSection,
  multipleChoiceSectionSchema,
  phoneSectionSchema,
  rangeSectionSchema,
  Section,
  SectionType,
  sectionTypes,
  textSectionSchema,
} from 'models/form';
import {
  FieldValues,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { EmptyState } from './empty-state';
import countries from 'config/countries.json';
import { cn } from 'utils';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ControlledCheckbox,
  ControlledInput,
  ControlledTextarea,
} from './inputs';
import z from 'zod';

type FormMode = 'edit' | 'add';
const SectionFormContext = React.createContext<{
  defaultValues: Section;
  setDefaultValues: (defaultValues: Section) => void;

  mode: FormMode;
  setMode: React.Dispatch<React.SetStateAction<FormMode>>;
}>({
  defaultValues: getSectionDefaultValues('text'),
  setDefaultValues: (defaultValues: Section) => {},

  mode: 'add',
  setMode: () => {},
});

export function SectionFormProvider(props: React.PropsWithChildren) {
  const [mode, setMode] = React.useState<FormMode>('add');
  const [defaultValues, setDefaultValues] = React.useState<Section>(
    getSectionDefaultValues('text'),
  );

  return (
    <SectionFormContext.Provider
      value={{
        defaultValues,
        setDefaultValues,
        mode,
        setMode,
      }}
    >
      {props.children}
    </SectionFormContext.Provider>
  );
}

export function SectionsList() {
  const sectionFormContext = React.useContext(SectionFormContext);
  const formContext = useFormContext<Form>();
  const fieldArray = useFieldArray<Form, 'sections'>({
    name: 'sections',
  });

  const sections = fieldArray.fields;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sections.findIndex((item) => item.id === active.id);
      const newIndex = sections.findIndex((item) => item.id === over?.id);

      fieldArray.move(oldIndex, newIndex);
    }
  };

  const handleSubmit = (section: Section) => {
    if (sectionFormContext.mode === 'add') {
      fieldArray.append({
        ...section,
        id: crypto.randomUUID(),
        index: fieldArray.fields.length,
      });
    } else {
      const index = fieldArray.fields.findIndex(
        (s) => s.id === sectionFormContext.defaultValues.id,
      );
      fieldArray.update(index, section);
    }

    closeAddSectionModal();
  };

  const openAddSectionModalAndSetValues = () => {
    if (formContext.formState.isSubmitting) return;

    openAddSectionModal();
    sectionFormContext.setMode('add');
    sectionFormContext.setDefaultValues(getSectionDefaultValues('text'));
  };

  return (
    <React.Fragment>
      <SectionFormModal onSubmit={handleSubmit} />

      <div>
        <div className="mb-4">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <div>
                <h3 className="text-lg font-bold">2. Sections</h3>
                <p>Add sections to your form that the user can fill out.</p>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {exampleSections.map((exampleSection) => {
                  return (
                    <div
                      key={exampleSection.id}
                      className="tooltip"
                      data-tip={exampleSection.description}
                    >
                      <div
                        className="badge badge-primary hover:badge-outline cursor-pointer"
                        onClick={() => {
                          if (formContext.formState.isSubmitting) return;

                          fieldArray.append({
                            ...exampleSection,
                            id: crypto.randomUUID(),
                            index: fieldArray.fields.length,
                          });
                        }}
                      >
                        {exampleSection.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {sections.length > 0 && (
              <div className="tooltip" data-tip="Add Section">
                <button
                  disabled={formContext.formState.isSubmitting}
                  className="btn btn-circle btn-accent"
                  onClick={openAddSectionModalAndSetValues}
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
              </div>
            )}
          </div>

          {formContext.formState.errors.sections && (
            <p className="text-sm text-error mt-2">
              {formContext.formState.errors.sections.message}
            </p>
          )}
        </div>

        {sections.length > 0 ? (
          <div className="flex-grow">
            <ul className="list bg-base-100 rounded-box shadow-md">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sections}
                  strategy={verticalListSortingStrategy}
                >
                  {sections.map((section, index) => (
                    <ListItem
                      key={section.id}
                      section={section}
                      index={index}
                      onDelete={() => {
                        fieldArray.remove(index);
                      }}
                      onDuplicate={() =>
                        fieldArray.append({
                          ...section,
                          title: 'Copy of ' + section.title,
                          id: crypto.randomUUID(),
                          index: fieldArray.fields.length,
                        })
                      }
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </ul>
          </div>
        ) : (
          <EmptyState
            title="No sections added yet"
            subtitle="Add sections to your form to start collecting information."
            cta={
              <button
                className="btn btn-outline"
                onClick={openAddSectionModalAndSetValues}
              >
                Add Section
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
            }
          />
        )}
      </div>
    </React.Fragment>
  );
}

interface ListItemProps {
  section: Section;
  index: number;
  onDelete: () => void;
  onDuplicate: () => void;
}
function ListItem(props: ListItemProps) {
  const sectionFormContext = React.useContext(SectionFormContext);
  const formContext = useFormContext<Form>();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      className="list-row justify-between flex"
      ref={setNodeRef}
      style={style}
      {...attributes}
      aria-describedby="Draggable"
    >
      <div>
        <div>
          {props.index + 1}. {props.section.title}
          <span className="ml-1 text-secondary">
            ({props.section.required ? 'Required' : 'Optional'})
          </span>
        </div>
        <div className="text-xs uppercase font-semibold opacity-60">
          {props.section.description}
        </div>
      </div>

      <div className="flex">
        <div className="tooltip" data-tip="Move">
          <button
            disabled={formContext.formState.isSubmitting}
            className={cn('btn btn-square btn-ghost', {
              'cursor-grab': isDragging,
            })}
            {...listeners}
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
                d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
              />
            </svg>
          </button>
        </div>

        <div className="tooltip" data-tip="Duplicate">
          <button
            disabled={formContext.formState.isSubmitting}
            className="btn btn-square btn-ghost"
            onClick={props.onDuplicate}
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
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
              />
            </svg>
          </button>
        </div>
        <div className="tooltip" data-tip="Edit">
          <button
            disabled={formContext.formState.isSubmitting}
            className="btn btn-square btn-ghost"
            onClick={() => {
              sectionFormContext.setDefaultValues(props.section);
              sectionFormContext.setMode('edit');
              openAddSectionModal();
            }}
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
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>
        </div>

        <div className="tooltip" data-tip="Delete">
          <button
            disabled={formContext.formState.isSubmitting}
            className="btn btn-square btn-ghost"
            onClick={props.onDelete}
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
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}

const exampleSections: Section[] = [
  {
    id: crypto.randomUUID(),
    type: 'text',
    index: 0,
    description: 'Please enter your legal name.',
    title: 'Your name',
    required: true,
    min: 1,
    max: 100,
  },
  {
    id: crypto.randomUUID(),
    type: 'email',
    index: 1,
    description: 'Please enter your personal email address.',
    title: 'Your email',
    required: true,
  },
  {
    id: crypto.randomUUID(),
    type: 'phone',
    index: 2,
    description: 'Please enter your phone number.',
    title: 'Your phone number',
    required: false,
  },
  {
    id: crypto.randomUUID(),
    type: 'link',
    index: 3,
    description: 'Please enter the link to your LinkedIn profile.',
    title: 'LinkedIn profile',
    required: true,
  },
  {
    id: crypto.randomUUID(),
    type: 'file',
    index: 4,
    description: 'Please upload your resume/CV.',
    title: 'Resume/CV',
    required: true,
    acceptedFileTypes: null,
  },
  {
    id: crypto.randomUUID(),
    type: 'text',
    index: 5,
    min: 50,
    max: 1000,
    required: false,
    title: 'Cover letter',
    description:
      'Please provide a brief cover letter explaining your interest in this position.',
  },
  {
    id: crypto.randomUUID(),
    type: 'multiple-choice',
    index: 6,
    description: 'When would you be available to start?',
    title: 'Start date',
    required: true,
    options: [
      { text: 'Immediately' },
      { text: 'Within 2 weeks' },
      { text: 'Within a month' },
      { text: 'More than a month' },
    ],
  },
  {
    id: crypto.randomUUID(),
    type: 'boolean',
    index: 7,
    description:
      'Are you legally authorized to work in the country where this job is located?',
    title: 'Work authorization',
    required: true,
  },
  {
    id: crypto.randomUUID(),
    type: 'multiple-choice',
    index: 8,
    description: 'Select your country of residence.',
    title: 'Country of Residence',
    required: true,
    options: countries.map((country) => ({
      text: `${country.emoji} ${country.name}`,
    })),
  },
];

interface SectionFormModalProps {
  onSubmit: (data: Section) => void;
}

function SectionFormModal(props: SectionFormModalProps) {
  const addSectionContext = React.useContext(SectionFormContext);

  return (
    <dialog id={modalName} className="modal">
      <div className="modal-box flex flex-col w-8/12 max-w-7xl">
        <h3 className="font-bold text-lg">
          {addSectionContext.mode === 'add'
            ? 'Add new section'
            : 'Edit section'}
        </h3>

        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">Section type</legend>

          <select
            value={addSectionContext.defaultValues.type}
            className="select w-full"
            onChange={(e) =>
              addSectionContext.setDefaultValues(
                getSectionDefaultValues(e.target.value as SectionType),
              )
            }
          >
            <option disabled={true}>Section type</option>
            {sectionTypes.map((type) => (
              <option key={type} value={type}>
                {formatType(type)}
              </option>
            ))}
          </select>

          <p className="label">
            When someone fills out your form, the answer they provide will be in
            this format.
          </p>
        </fieldset>

        <Forms onSubmit={props.onSubmit} />
      </div>
    </dialog>
  );
}

interface FormSectionProps extends SectionFormModalProps {
  defaultValues: FieldValues;
  schema: z.ZodObject<any>;

  titlePlaceholder: string;
  descriptionPlaceholder: string;
}

function Forms(props: SectionFormModalProps) {
  const addSectionContext = React.useContext(SectionFormContext);

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

function formatType(type: SectionType) {
  switch (type) {
    case 'boolean':
      return 'True / False';

    case 'multiple-choice':
      return 'Multiple Choice';

    case 'email':
      return 'Email';

    case 'file':
      return 'File';

    case 'link':
      return 'Link';

    case 'phone':
      return 'Phone Number';

    case 'range':
      return 'Range (Number)';

    case 'text':
      return 'Text';
  }
}

function getSectionDefaultValues(type: SectionType): Section {
  switch (type) {
    case 'text':
    case 'range':
      return {
        id: '',
        index: 0,
        description: '',
        required: false,
        title: '',
        type,
        min: 0,
        max: 0,
      };

    case 'boolean':
    case 'email':
    case 'link':
    case 'phone':
      return {
        id: '',
        index: 0,
        description: '',
        required: false,
        title: '',
        type,
      };

    case 'file':
      return {
        id: '',
        index: 0,
        description: '',
        required: false,
        title: '',
        type,
        acceptedFileTypes: null,
      };

    case 'multiple-choice':
      return {
        id: '',
        index: 0,
        description: '',
        required: false,
        title: '',
        type,
        options: [],
      };
  }
}

const modalName = 'add-section-modal';

const closeAddSectionModal = () =>
  // @ts-expect-error
  document.getElementById(modalName).close();

const openAddSectionModal = () =>
  // @ts-expect-error
  document.getElementById(modalName).showModal();
