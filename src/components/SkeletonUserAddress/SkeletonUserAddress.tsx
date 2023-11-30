import React from 'react';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';

const SkeletonUserAddress = () => {
  return (
    <div className="w-full border-[1px] rounded-xl p-5 my-3 mx-3">
      <div className="space-y-2">
        <Skeleton className="h-2 w-[50px]" />
        <Skeleton className="h-2 w-[100px]" />
        <Skeleton className="h-2 w-[200px]" />
      </div>
      <div className="space-y-8">
        <Skeleton className="h-8 w-[250px] mt-4" />
      </div>
    </div>
  );
};

export default SkeletonUserAddress;
