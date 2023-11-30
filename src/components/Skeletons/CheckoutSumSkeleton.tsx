import React from 'react';
import { Skeleton } from '../ui/skeleton';

const CheckoutSumSkeleton = () => {
  return (
    <>
      <div className="w-full py-2 flex flex-col gap-1 border-b-2 border-gray-300">
        <Skeleton className="h-3 w-32 rounded bg-gray-500" />
        <Skeleton className="h-3 w-32 rounded bg-gray-500" />
        <Skeleton className="h-3 w-32 rounded bg-gray-500" />
      </div>
      <div className="flex items-center justify-between py-2">
        <Skeleton className="h-8 w-full rounded bg-gray-900" />
      </div>
      <Skeleton className="h-3 w-32 rounded bg-gray-900" />
      <div className="flex items-center gap-1 mt-1">
        <Skeleton className="h-3 w-44 rounded bg-gray-900" />
      </div>
      <Skeleton className="bg-primary h-8 w-full mt-3" />
    </>
  );
};

export default CheckoutSumSkeleton;
