import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '../ui/label';

interface SkeletonSelectProps {
  label: string;
}

const SkeletonSelect = ({ label }: SkeletonSelectProps) => {
  return (
    <>
      <Label className="font-light w-full md:text-base">
        {label}
        <span className="text-primary">{' *'}</span>
      </Label>
      <Skeleton className="h-10 w-full" />
    </>
  );
};

export default SkeletonSelect;
