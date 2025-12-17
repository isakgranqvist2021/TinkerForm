import { toast } from 'sonner';

export function useClipboard(value: string) {
  return async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard.');
    }
  };
}
