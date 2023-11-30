import React from 'react';
import { ThreeDots } from 'react-loader-spinner';
import 'react-toastify/dist/ReactToastify.css';

type DotsLoadingProps = {
  size?: number;
};

const DotsLoading = ({ size }: DotsLoadingProps) => {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <ThreeDots
        height={size ?? '80'}
        width={size ? size - 10 : '70'}
        radius="9"
        color="#F97316"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
};

export default DotsLoading;
