import React from 'react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black opacity-30"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-500">{message}</p>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={onConfirm}
              size="sm"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal; 