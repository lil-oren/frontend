import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IWishlistItem } from '@/interface/wishlist';
import { Utils } from '@/utils';
import styles from './WishlistProductCard.module.scss';
import { Star } from 'lucide-react';
import HeartWishlistButton from '../HeartWishlistButton/HeartWishlistButton';
import FallbackImage from '@/components/FallbackImage/FallbackImage';

interface WishlistProductCardProps {
  item: IWishlistItem;
  current_page: number;
}

const WishlistProductCard = ({
  item,
  current_page,
}: WishlistProductCardProps) => {
  return (
    <div className={styles.product}>
      <div className={styles.product_feed}>
        <div className={`${styles.product_wrapper}`}>
          <div className={styles.master_product_card}>
            <div className={styles.container_card}>
              <div className={styles.container}>
                <div className={styles.image}>
                  <HeartWishlistButton
                    wishlist_id={item.id}
                    is_in_wishlist={true}
                    product_code={item.product_code}
                    current_page={current_page}
                    is_in_product_detail={false}
                  />
                  <Link href={`/products/${item.product_code}`}>
                    <div className={`img_container block w-[100%]`}></div>
                    <FallbackImage
                      src={item.thumbnail_url}
                      width={500}
                      height={500}
                      alt={'image'}
                      className={`w-[200] h-[200]`}
                    />
                  </Link>
                </div>
                <div className={`${styles.content}`}>
                  <Link
                    href={`/products/${item.product_code}`}
                    className={`${styles.info_content}`}
                  >
                    <div className={`${styles.product_name}`}>
                      {item.product_name}
                    </div>
                    <div>
                      <div>
                        <div className={`${styles.product_price}`}>
                          {Utils.convertPrice(
                            item.discount_price !== 0
                              ? item.discount_price
                              : item.base_price,
                          )}
                        </div>
                        {item.discount !== 0 && (
                          <div className={`${styles.slash_price}`}>
                            <div className={`${styles.label_slash_price}`}>
                              {Utils.convertPrice(item.base_price)}
                            </div>
                            <div className={`${styles.badge_slash_price}`}>
                              {`${item.discount!}%`}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`${styles.shop}`}>
                      <div className={`${styles.shop_wrapper}`}>
                        <div className={`${styles.shop_and_location}`}>
                          <span className={`${styles.shop_loc}`}>
                            {item.district_name}
                          </span>
                          <span className={`${styles.shop_name}`}>
                            {item.shop_name}
                          </span>
                        </div>
                      </div>
                      {/* <div
                        className={`${styles.shop_rating_average_and_label}`}
                      >
                        <Star
                          size={15}
                          fill={'#FFDF00'}
                          className={'text-[#FFDF00] flex-shrink mr-[2px]'}
                        />
                        <span className={`${styles.shop_rating_average}`}>
                          {product.rating}
                        </span>
                        <span className={`${styles.separator}`}></span>
                        <span className={`${styles.shop_label}`}>
                          {product.total_sold}+ terjual
                        </span>
                      </div> */}
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

export default WishlistProductCard;
