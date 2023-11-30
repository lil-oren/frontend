import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FallbackImage from '@/components/FallbackImage/FallbackImage';
import styles from './HomeCategoryItem.module.scss';

interface HomeCategoryItemProps {
  image: string;
  title: string;
  href: string;
}

const HomeCategoryItem = ({ image, title, href }: HomeCategoryItemProps) => {
  return (
    <Link
      href={href}
      className="flex justify-center items-center flex-col gap-5 rounded-lg shadow-xl p-3 border-[1px] border-gray-100 aspect-square w-28 sm:w-32 lg:hover:-translate-y-1 duration-300"
    >
      <FallbackImage
        alt={title}
        width={200}
        height={200}
        style={{ objectFit: 'cover' }}
        src={image}
        className={styles.lilOren__home__category__item__img}
      />
      <p className={styles.lilOren__home__category__item__title}>{title}</p>
    </Link>
  );
};

export default HomeCategoryItem;
