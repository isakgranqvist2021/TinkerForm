import { openModal } from './add-section-modal';
import { useAddSectionContext } from './add-section-modal.context';
import { getSectionDefaultValues } from './add-section-modal.utils';

export function AddSectionButton(props: React.ComponentProps<'button'>) {
  const addSectionContext = useAddSectionContext();

  return (
    <button
      className="btn w-fit"
      onClick={() => {
        openModal();
        addSectionContext.setMode('add');
        addSectionContext.setDefaultValues(getSectionDefaultValues('text'));
      }}
      {...props}
    >
      Add section
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
  );
}
