import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const SellerCategoriesFilter = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  return (
    <Button
      size={'customBlank'}
      variant={'outline'}
      className="p-1.5 lg:w-full"
      onClick={() => setIsCategoryOpen(true)}
    >
      By Category
    </Button>
  );
};

export default SellerCategoriesFilter;
