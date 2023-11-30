import React, { Dispatch, useState } from 'react';
import { ToastContent } from 'react-toastify';
import AsyncButton from '@/components/AsyncButton/AsyncButton';
import Modal from '@/components/Modal/Modal';
import { InputWithLabel } from '@/components/InputWithLabel/InputWithLabel';
import { IOrderData } from '@/interface/sellerOrder';
import { Button } from '@/components/ui/button';
import { SellerOrderClient } from '@/service/sellerOrder/SellerOrderClient';
import { Utils } from '@/utils';
import { useSeller } from '@/store/seller/useSeller';

interface SellerOrderDeliveryFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  order_data: IOrderData;
  setShowEstDays: Dispatch<React.SetStateAction<boolean>>;
}

const SellerOrderDeliveryFormModal = ({
  isVisible,
  order_data,
  onClose,
  setShowEstDays,
}: SellerOrderDeliveryFormModalProps) => {
  const [deliveryEstDays, setDeliveryEstDays] = useState<string>('1');
  const [isDeliveryEstDaysValid, setIsDeliveryEstDaysValid] =
    useState<boolean>(true);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const setSellerChangeStatus = useSeller.use.setSellerChangeStatus();

  const validateData = (pattern: RegExp): boolean => {
    const dataRegex = pattern;
    if (!dataRegex.test(deliveryEstDays.toString())) {
      setIsDeliveryEstDaysValid(false);
      return false;
    }
    setIsDeliveryEstDaysValid(true);
    return true;
  };

  const handleSubmitToDelivery = async (e: React.SyntheticEvent) => {
    setLoadingSubmit(true);
    e.preventDefault();
    const response = await SellerOrderClient.putOrderStatusToDeliver(
      {
        est_days: parseInt(deliveryEstDays),
      },
      order_data.id,
    );
    setTimeout(() => {
      setLoadingSubmit(false);
      if (response?.error) {
        Utils.notify(
          'Failed process delivery' as ToastContent,
          'error',
          'light',
        );
      } else {
        Utils.notify(
          'Success process order to delivery' as ToastContent,
          'success',
          'colored',
        );
      }
      setShowEstDays(false);
      setSellerChangeStatus('DELIVER');
    }, 200);
  };

  return (
    <Modal
      title="Delivery Estimate Days"
      isVisible={isVisible}
      onClose={onClose}
      position="center"
    >
      <div className="bg-white w-[100vw] md:w-[50vw] rounded-xl p-3 h-[20vh] relative">
        <form onSubmit={handleSubmitToDelivery} className="flex flex-col gap-4">
          <InputWithLabel
            type="number"
            label={'Estimated Delivery (1/2/3 days)'}
            id="delivery-est-days"
            labelStyling="font-light"
            value={deliveryEstDays}
            min={1}
            max={3}
            onChange={(e) => setDeliveryEstDays(e.target.value)}
            isValid={isDeliveryEstDaysValid}
            onBlur={() => validateData(/^[1-3]{1}$/)}
            onKeyDown={(e) =>
              ['ArrowUp', 'ArrowDown', 'e', 'E', '+', '-', '.'].includes(
                e.key,
              ) && e.preventDefault()
            }
            validation="Input only number 1 / 2 / 3"
            required
          />
          {deliveryEstDays && (
            <div className="absolute top-[40px] md:top-[52px] right-6 bg-white">
              <p className="text-muted-foreground">
                {parseInt(deliveryEstDays) > 1 ? 'Days' : 'Day'}
              </p>
            </div>
          )}
          <div className="w-full flex justify-end pt-3 absolute bottom-4 right-4">
            {loadingSubmit ? (
              <AsyncButton isLoading={loadingSubmit}>{'Loading'}</AsyncButton>
            ) : (
              <Button
                type="submit"
                disabled={
                  deliveryEstDays === '' ||
                  deliveryEstDays.length > 1 ||
                  parseInt(deliveryEstDays) > 3 ||
                  parseInt(deliveryEstDays) < 1
                }
                className="h-[30px] lg:h-[40px]"
              >
                {'Submit'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default SellerOrderDeliveryFormModal;
