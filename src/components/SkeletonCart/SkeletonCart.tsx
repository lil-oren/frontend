import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const SkeletonCart = () => {
  return (
    <div className="w-full flex flex-col border-[1px] p-5 my-3 mx-3">
      <div className=" flex flex-row">
        <Skeleton className="h-[75px] w-[75px]" />
        <div className="flex flex-col ml-4">
          <Skeleton className="h-4 w-[100px] mb-2" />
          <Skeleton className="h-4 w-[120px] mb-2" />
          <Skeleton className="h-5 w-[100px]" />
        </div>
      </div>
      <div className="space-y-8 w-full flex justify-end">
        <div className="flex flex-row items-center">
          <Skeleton className="h-8 w-[100px] ml-5" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCart;
