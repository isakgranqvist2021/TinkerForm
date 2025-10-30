import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useDeleteForm(formId: string) {
  const router = useRouter();

  return async () => {
    const res = await fetch(`/api/forms/${formId}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      toast.error('Error deleting form');
      return;
    }

    router.replace('/dashboard/forms');
    toast.success('Form deleted successfully');
  };
}
