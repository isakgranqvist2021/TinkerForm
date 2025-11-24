'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ContactFormModel, contactFormSchema } from 'models/contact-form';
import { FormProvider, useForm } from 'react-hook-form';
import { ControlledInput, ControlledTextarea } from 'components/inputs';
import { PageTitle } from 'components/page-title';
import useMutation from 'swr/mutation';
import { toast } from 'sonner';

export function ContactForm() {
  const { trigger, isMutating } = useMutation(
    '/api/contact',
    async (url, { arg }: { arg: ContactFormModel }) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      });

      return res.ok;
    },
  );

  const form = useForm<ContactFormModel>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    if (isMutating) return;

    const success = await trigger(data);
    if (!success) {
      toast.error('Failed to send message. Please try again later.');
      return;
    }

    form.reset();
    toast.success('Message sent successfully!');
  });

  return (
    <FormProvider {...form}>
      <form className="max-w-xl mx-auto py-4 lg:py-12" onSubmit={handleSubmit}>
        <PageTitle className="mb-4">Contact Us</PageTitle>

        <ControlledInput name="name" label="Name" required />
        <ControlledInput name="email" label="Email" type="email" required />
        <ControlledTextarea name="message" label="Message" required />

        <button
          className="btn btn-primary mt-4"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          Send Message
        </button>
      </form>
    </FormProvider>
  );
}
