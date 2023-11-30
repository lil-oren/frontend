import React, { ReactNode } from 'react';
import Link from 'next/link';
import styles from './SellerOnboardingLayout.module.scss';

interface SellerOnboardingLayoutProps {
  children: ReactNode;
  component: ReactNode;
}

const SellerOnboardingLayout = ({
  children,
  component,
}: SellerOnboardingLayoutProps) => {
  return (
    <>
      <div className="hidden lg:block">
        <div className={`${styles.navigation}`}>
          <div className={styles.navigationContent}>
            <Link href={'/'} className={styles.logo}>
              LilOren
            </Link>
            <div className={styles.searchInput}></div>
          </div>
        </div>
      </div>
      {component}
      <div className="flex justify-center items-center flex-col">
        <main className="lg:w-[75w] w-full">{children}</main>
      </div>
    </>
  );
};

export default SellerOnboardingLayout;
