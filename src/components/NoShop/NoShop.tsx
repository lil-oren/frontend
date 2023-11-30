import React from 'react';
import ButtonWithIcon from '@/components/ButtonWithIcon/ButtonWithIcon';

const NoShop = () => {
  return (
    <div
      className={`flex flex-col lg:w-[300px] justify-center items-center p-3 gap-3`}
    >
      <p className={'text-muted-foreground'}>{"You don't have a shop yet."}</p>
      <ButtonWithIcon variant={'default'} href={'/seller/onboarding'}>
        {'Open a free shop'}
      </ButtonWithIcon>
    </div>
  );
};

export default NoShop;
