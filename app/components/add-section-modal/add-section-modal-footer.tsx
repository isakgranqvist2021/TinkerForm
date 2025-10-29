import { closeModal } from './add-section-modal';

export function AddSectionModalFooter() {
  return (
    <div className="modal-action">
      <button type="button" className="btn" onClick={closeModal}>
        Close
      </button>

      <button type="submit" className="btn btn-primary">
        Save
      </button>
    </div>
  );
}
