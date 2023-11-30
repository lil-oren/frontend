import React, { ReactElement, useState, useEffect } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import SellerLayout from '@/components/SellerLayout/SellerLayout';
import CheckboxCourier from '@/components/CheckboxCourier/CheckboxCourier';
import CONSTANTS from '@/constants/constants';
import DotsLoading from '@/components/DotsLoading/DotsLoading';
import {
  IMerchantCourier,
  IPutCourier,
  TypePutCourier,
} from '@/interface/merchantCourier';
import styles from './SellerSettingsShipment.module.scss';

const SellerSettingsShipment = () => {
  const [merchantCourier, setMerchantCourier] = useState<IMerchantCourier[]>(
    [],
  );
  const [sellerCourier, setSellerCourier] = useState<IPutCourier>({
    '1': false,
    '2': false,
    '3': false,
  });
  const [currentCourier, setCurrentCourier] = useState<string[]>([]);
  const [loadingFetchCourier, setLoadingFetchCourier] =
    useState<boolean>(false);
  const getListCourier = async () => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: `${CONSTANTS.BASEURL}/merchant/courier`,
      });
      if (response.status === 200) {
        const data: IMerchantCourier[] = response.data.data;
        const updatedCurrentCourier: string[] = [];
        const updatedSellerCourier = { ...sellerCourier };
        data.forEach((courier) => {
          if (courier.is_available) {
            const baseId: TypePutCourier =
              courier.id % 3 === 0
                ? '3'
                : ((courier.id % 3).toString() as TypePutCourier);
            updatedCurrentCourier.push(baseId);
            updatedSellerCourier[baseId] = true;
          }
        });
        setSellerCourier(updatedSellerCourier);
        setCurrentCourier(updatedCurrentCourier);
        setMerchantCourier(response.data.data);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoadingFetchCourier(true);
    getListCourier();
    setLoadingFetchCourier(false);
  }, []);

  return (
    <div className={`${styles.sellerSettingsShipment}`}>
      <div className={`page-shipping-editor ${styles.page_shipping_editor}`}>
        <section className={`${styles.section_courier_editor}`}>
          {loadingFetchCourier ? (
            <div className="w-full h-[calc(100vh-30vh)]">
              <DotsLoading />
            </div>
          ) : (
            <CheckboxCourier
              merchantCourier={merchantCourier}
              currentCourier={currentCourier}
              setCurrentCourier={setCurrentCourier}
              sellerCourier={sellerCourier}
              setSellerCourier={setSellerCourier}
              getListCourier={getListCourier}
            />
          )}
        </section>
      </div>
    </div>
  );
};

SellerSettingsShipment.getLayout = function getLayout(page: ReactElement) {
  return <SellerLayout header="xeana">{page}</SellerLayout>;
};

export default SellerSettingsShipment;
