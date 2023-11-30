import { ITopCategory } from '@/store/home/useHome';
import React from 'react';
import HomeCategoryItem from '../HomeCategoryItem/HomeCategoryItem';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import styles from './HomeCategoryList.module.scss';

type Props = {
  categories: ITopCategory[];
};

const HomeCategoryList: React.FC<Props> = ({ categories }) => {
  return (
    <div className={styles.brand__grid}>
      <div className={styles.brand_grid_header}>
        <p className="text-primary text-[14px] px-[10px] md:text-[16px]">
          CATEGORY
        </p>
      </div>
      <ScrollArea className="max-w-full">
        <div className="flex space-x-5 p-2">
          {categories.map((category) => {
            const params = new URLSearchParams();
            params.set('category1', category.top_category_id.toString());
            params.set('category', category.child_category_id.toString());
            return (
              <HomeCategoryItem
                key={`key:${category.category_name}`}
                image={category.image_url}
                title={category.category_name}
                href={`/search?${params.toString()}`}
              />
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default HomeCategoryList;
