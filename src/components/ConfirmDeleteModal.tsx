import { createPortal } from 'react-dom';

interface ConfirmDeleteModalProps {
  nodeName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal = ({ nodeName, onConfirm, onCancel }: ConfirmDeleteModalProps) => {
  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 id="dialog-title" className="text-lg font-bold mb-4">
          Confirm Deletion
        </h2>
        <p>
          Are you sure you want to delete <strong>{nodeName}</strong>? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmDeleteModal;
