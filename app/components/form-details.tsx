import React from 'react';
import { ControlledInput, ControlledTextarea } from './inputs';
import { useFormState } from 'react-hook-form';

const placeholders = [
  {
    title: 'Sales Representative',
    description:
      "We're looking for a skilled sales representative to join our team and help drive revenue growth through effective client engagement and relationship management.",
  },
  {
    title: 'Customer Support Specialist',
    description:
      'Seeking a dedicated customer support specialist to provide exceptional service and resolve client issues efficiently, ensuring high customer satisfaction.',
  },
  {
    title: 'Marketing Coordinator',
    description:
      'Hiring a creative marketing coordinator to assist in the development and execution of marketing campaigns, social media management, and event planning.',
  },
  {
    title: 'Software Engineer',
    description:
      'Looking for a talented software engineer to design, develop, and maintain high-quality software solutions that meet user needs and business goals.',
  },
  {
    title: 'Product Manager',
    description:
      'Seeking an experienced product manager to lead cross-functional teams in the development and launch of innovative products that drive business success.',
  },
];

export function FormDetails() {
  const formState = useFormState();

  const randomPlaceholder = React.useMemo(() => {
    const randomIndex = Math.floor(Math.random() * placeholders.length);
    return placeholders[randomIndex];
  }, []);

  return (
    <div>
      <div className="mb-2">
        <h3 className="text-lg font-bold">1. Form Details</h3>
        <p>Describe your form so users know what to expect.</p>
      </div>

      <ControlledInput
        name="title"
        label="Title"
        disabled={formState.isSubmitting}
        placeholder={randomPlaceholder.title}
      />
      <ControlledTextarea
        name="description"
        label="Description"
        disabled={formState.isSubmitting}
        placeholder={randomPlaceholder.description}
      />
    </div>
  );
}
