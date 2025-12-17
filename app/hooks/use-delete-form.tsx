'use client';

import useMutation from 'swr/mutation';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function DeleteFormModal(props: { formId: string }) {
  const { isLoading, deleteForm } = useDeleteForm(props.formId);

  return (
    <dialog id={DELETE_FORM_MODAL_NAME} className="modal">
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
          <button className="btn btn-error">
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

function useDeleteForm(formId: string) {
  const router = useRouter();

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

export const DELETE_FORM_MODAL_NAME = 'delete-form-modal';

export const closeDeleteFormModal = () =>
  // @ts-expect-error
  document.getElementById(DELETE_FORM_MODAL_NAME).close();

export const openDeleteFormModal = () =>
  // @ts-expect-error
  document.getElementById(DELETE_FORM_MODAL_NAME).showModal();
