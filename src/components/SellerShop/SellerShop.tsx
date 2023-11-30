import React from 'react';
import ButtonWithIcon from '@/components/ButtonWithIcon/ButtonWithIcon';

const SellerShop = () => {
  return (
    <div
      className={`flex flex-col w-full lg:w-[400px] justify-center items-center p-3 gap-3`}
    >
      <p className={'text-muted-foreground text-center'}>
        {
          "Monitor incoming orders and check your shop's progress regularly in one place."
        }
      </p>
      <ButtonWithIcon variant={'default'} href={'/seller/portal'}>
        {'Check my shop'}
      </ButtonWithIcon>
    </div>
  );
};

export default SellerShop;
