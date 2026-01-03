'use client';

import useMutation from 'swr/mutation';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useSWRConfig } from 'swr';
import React from 'react';
import { modalMethods } from 'utils';

const DeleteFormContext = React.createContext<{
  value: string | null;
  openModal: (formId: string) => void;
  closeModal: () => void;
}>({
  value: null,
  openModal: () => {},
  closeModal: () => {},
});

export function useDeleteFormContext() {
  return React.useContext(DeleteFormContext);
}

export function DeleteFormContextProvider(props: React.PropsWithChildren) {
  const [value, setValue] = React.useState<string | null>(null);

  const openModal = (value: string) => {
    setValue(value);
    openDeleteFormModal();
  };

  const closeModal = () => {
    setValue(null);
    closeDeleteFormModal();
  };

  return (
    <DeleteFormContext.Provider value={{ value, openModal, closeModal }}>
      <DeleteFormModal formId={value} />

      {props.children}
    </DeleteFormContext.Provider>
  );
}

function DeleteFormModal(props: { formId: string | null }) {
  const { isLoading, deleteForm } = useDeleteForm(props.formId);

  return (
    <dialog id={modalName} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Delete Form</h3>
        <p className="py-4">
          Are you sure you want to delete this form? This action cannot be
          undone.
        </p>

        <div className="modal-action">
          <button className="btn">
            <span onClick={closeDeleteFormModal}>Cancel</span>
          </button>
          <button className="btn btn-error" disabled={!props.formId}>
            <span onClick={deleteForm}>
              {isLoading ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : (
                'Delete'
              )}
            </span>
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

function useDeleteForm(formId: string | null) {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const mutation = useMutation(
    `/api/proxy/form/${formId}`,
    async (url) => {
      const res = await fetch(url, { method: 'DELETE' });

      if (!res.ok) {
        throw new Error('Could not delete form');
      }
    },
    {
      onError: () => {
        toast.error('Error deleting form');
      },

      onSuccess: () => {
        router.replace('/dashboard/forms');
        router.refresh();
        mutate('/api/proxy/form');

        toast.success('Form deleted successfully');

        closeDeleteFormModal();
      },
    },
  );

  return {
    isLoading: mutation.isMutating,
    deleteForm: () => mutation.trigger(),
  };
}

const modalName = 'delete-form-modal';
export const {
  closeModal: closeDeleteFormModal,
  showModal: openDeleteFormModal,
} = modalMethods(modalName);
