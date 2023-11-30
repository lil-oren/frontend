import { X } from 'lucide-react';
import React, { ReactNode } from 'react';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  position?: string;
}

const Modal = ({ isVisible, onClose, children, position }: ModalProps) => {
  if (!isVisible) return null;

  const handleCloseModal = (e: any) => {
    if (e.target.id === 'wrapper') {
      onClose();
    }
  };
  return (
    <div
      className={`modal fade fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center z-50 left-0 top-0 gap-4 bg-background shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500
      inset-x-0 bottom-0  data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom ${
        position ? 'justify-center hidden lg:flex' : 'justify-end'
      }`}
      id="wrapper"
      onClick={(e) => handleCloseModal(e)}
      onKeyDown={(e) => handleCloseModal(e)}
    >
      <div className="flex justify-end w-full pr-2 md:w-[50vw]">
        <X size={30} onClick={() => onClose()} className="text-white" />
      </div>
      {children}
      <div className="modal-dialog bg-white p-2 rounded-t-lg w-[100vw] md:w-[50vw] flex flex-col justify-center h-fit overflow-x-hidden overflow-y-auto bottom-0 absolute translate-y-[50px] opacity-0 transition-all duration-300 ease-in-out"></div>
    </div>
  );
};

export default Modal;
