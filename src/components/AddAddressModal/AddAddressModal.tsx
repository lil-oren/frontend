import React, { Dispatch } from 'react';
import Modal from '@/components/Modal/Modal';
import AddAddressForm from '@/components/AddAddressForm/AddAddressForm';

interface AddAddressModalProps {
  isVisible: boolean;
  onClose: () => void;
  setShowModal: Dispatch<React.SetStateAction<boolean>>;
}

const AddAddressModal = ({
  isVisible,
  onClose,
  setShowModal,
}: AddAddressModalProps) => {
  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      title="Add Address"
      position="center"
    >
      <div className="bg-white md:w-[50vw] rounded-xl p-3 relative">
        <div className="modal_header addresss__header px-4 mt-[10px] text-[18px] font-normal">
          <p className="modal_heading">
            <div className="header_title">
              <span>Add Address</span>
            </div>
          </p>
        </div>
        <div className="modal_body px-4">
          <div className="addresses__body">
            <div className="body__desc text-[14px] mb-[15px] text-muted-foreground">
              <span>Kamu bisa pilih alamat yang sudah kamu simpan.</span>
            </div>
          </div>
        </div>
        <AddAddressForm setShowAddAddressModal={setShowModal} />
      </div>
    </Modal>
  );
};
export default AddAddressModal;
