import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Utils } from '@/utils';
import { ISellerProduct } from '@/interface/sellerPage';
import styles from './SellerProductCard.module.scss';
import FallbackImage from '../FallbackImage/FallbackImage';

interface SellerProductCardProps {
  product: ISellerProduct;
  shop_name: string;
}

const SellerProductCard = ({ product, shop_name }: SellerProductCardProps) => {
  return (
    <div className={styles.product}>
      <div className={styles.product_feed}>
        <div className={`${styles.product_wrapper}`}>
          <div className={styles.master_product_card}>
            <div className={styles.container_card}>
              <div className={styles.container}>
                <div className={styles.image}>
                  <Link href={`/products/${product.product_code}`}>
                    <div className={`img_container block w-[100%]`}></div>
                    <FallbackImage
                      src={product.thumbnail_url}
                      width={500}
                      height={500}
                      alt={'image'}
                      className={`w-[200] h-[200]`}
                    />
                  </Link>
                </div>
                <div className={`${styles.content}`}>
                  <Link
                    href={`/products/${product.product_code}`}
                    className={`${styles.info_content}`}
                  >
                    <div className={`${styles.product_name}`}>
                      {product.product_name}
                    </div>
                    <div>
                      <div>
                        <div className={`${styles.product_price}`}>
                          {Utils.convertPrice(
                            product.discount_price !== 0
                              ? product.discount_price
                              : product.base_price,
                          )}
                        </div>
                        {product.discount !== 0 && (
                          <div className={`${styles.slash_price}`}>
                            <div className={`${styles.label_slash_price}`}>
                              {Utils.convertPrice(product.base_price)}
                            </div>
                            <div className={`${styles.badge_slash_price}`}>
                              {`${product.discount!}%`}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`${styles.shop}`}>
                      <div className={`${styles.shop_wrapper}`}>
                        <div className={`${styles.shop_and_location}`}>
                          <span className={`${styles.shop_loc}`}>
                            {product.district_name}
                          </span>
                          <span className={`${styles.shop_name}`}>
                            {shop_name}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`${styles.shop_rating_average_and_label}`}
                      >
                        {product.rating !== 0 && (
                          <>
                            <Star
                              size={15}
                              fill={'#FFDF00'}
                              className={'text-[#FFDF00] flex-shrink mr-[2px]'}
                            />
                            <span className={`${styles.shop_rating_average}`}>
                              {product.rating}
                            </span>
                            <span className={`${styles.separator}`}></span>
                          </>
                        )}
                        {product.count_purchased !== 0 && (
                          <span className={`${styles.shop_label}`}>
                            {product.count_purchased} sold
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProductCard;
