import { zodResolver } from '@hookform/resolvers/zod';
import {
  ConstructedSchema,
  constructSchema,
  getConstructedSchemaDefaultValues,
} from 'models/answer-form';
import { Form } from 'models/form';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { AnswerFormContent } from './answer-form';
import React from 'react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { modalMethods } from 'utils';

export function PreviewFormModal() {
  const formContext = useFormContext<Form>();
  const [hasResponded, setHasResponded] = React.useState(false);

  const [sections, location, title, description, coverImage] =
    formContext.watch([
      'sections',
      'location',
      'title',
      'description',
      'coverImage',
    ]);

  const form = useForm<ConstructedSchema>({
    resolver: zodResolver(constructSchema(sections)),
    defaultValues: getConstructedSchemaDefaultValues(sections),
  });

  const handleSubmit = form.handleSubmit(() => {
    setHasResponded(true);
  });

  return (
    <dialog
      onClose={() => {
        window.setTimeout(() => {
          form.reset();
          setHasResponded(false);
        }, 250);
      }}
      id={modalName}
      className="modal"
    >
      <div className="modal-box p-0 fixed max-w-full w-full h-full top-0 left-0 rounded-none">
        <button
          className="btn btn-sm btn-circle btn-ghost fixed right-2 top-2"
          onClick={closePreviewFormModal}
        >
          <XCircleIcon className="size-6" />
        </button>

        <form
          onSubmit={handleSubmit}
          data-testid="answer-form"
          className="bg-base-200"
        >
          <FormProvider {...form}>
            <AnswerFormContent
              coverImage={coverImage}
              title={title}
              description={description}
              location={location}
              disabled={form.formState.isSubmitting}
              sections={sections}
              hasResponded={hasResponded}
            />
          </FormProvider>
        </form>
      </div>
    </dialog>
  );
}

const modalName = 'preview-form-modal';
export const {
  showModal: openPreviewFormModal,
  closeModal: closePreviewFormModal,
} = modalMethods(modalName);
